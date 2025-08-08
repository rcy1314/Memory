from datetime import datetime, timedelta
import time
import boto3
from fastapi import APIRouter, File, UploadFile, Request, Form
from pydantic import BaseModel
import urllib
import os
from pathlib import Path
from urllib.parse import urlparse
from PIL import Image, ExifTags
import io
from typing import Optional

from app.controllers.user import UserController, user_controller
from app.core.ctx import CTX_USER_ID
from app.core.dependency import DependAuth
from app.core.storage import S3FileStorage
from app.models.admin import User
from app.schemas.base import Fail, Success
from app.schemas.login import *
from app.schemas.user import UpdatePassword, UserUpdate
from app.utils import settings
from app.utils.jwt import create_access_token
from app.utils.password import get_password_hash, verify_password
from app.controllers.setting import setting_controller

base_router = APIRouter()


def process_image(image_file, compress_option: str = "none", output_format: str = "webp"):
    """
    处理图片：压缩和格式转换
    compress_option: "80", "60", "lossless", "none"
    output_format: "webp", "original"
    """
    try:
        # 打开图片
        image = Image.open(image_file)
        
        # 保留EXIF数据
        exif_dict = {}
        if hasattr(image, '_getexif') and image._getexif() is not None:
            exif_dict = image._getexif()
        
        # 如果选择保持原格式且不压缩，直接返回
        if compress_option == "none" and output_format == "original":
            image_file.seek(0)
            return image_file.read(), image.format.lower()
        
        # 转换为RGB模式（WebP需要）
        if image.mode in ('RGBA', 'LA', 'P'):
            # 保持透明度
            if output_format == "webp":
                pass  # WebP支持透明度
            else:
                # 其他格式转换为RGB
                background = Image.new('RGB', image.size, (255, 255, 255))
                if image.mode == 'P':
                    image = image.convert('RGBA')
                background.paste(image, mask=image.split()[-1] if image.mode == 'RGBA' else None)
                image = background
        elif image.mode != 'RGB' and output_format != "webp":
            image = image.convert('RGB')
        
        # 设置压缩参数
        save_kwargs = {}
        if output_format == "webp":
            if compress_option == "lossless":
                save_kwargs = {'lossless': True, 'quality': 100}
            elif compress_option == "80":
                save_kwargs = {'quality': 80}
            elif compress_option == "60":
                save_kwargs = {'quality': 60}
            else:
                save_kwargs = {'quality': 95}
            
            # 保存EXIF数据到WebP
            if exif_dict:
                save_kwargs['exif'] = image.info.get('exif', b'')
        else:
            # 保持原格式
            original_format = image.format or 'JPEG'
            if compress_option == "80":
                save_kwargs = {'quality': 80, 'optimize': True}
            elif compress_option == "60":
                save_kwargs = {'quality': 60, 'optimize': True}
            elif compress_option == "lossless":
                save_kwargs = {'quality': 100}
            else:
                save_kwargs = {'quality': 95}
            
            # 保存EXIF数据
            if exif_dict and original_format.upper() in ['JPEG', 'JPG']:
                save_kwargs['exif'] = image.info.get('exif', b'')
            
            output_format = original_format.lower()
        
        # 保存处理后的图片
        output_buffer = io.BytesIO()
        image.save(output_buffer, format=output_format.upper(), **save_kwargs)
        output_buffer.seek(0)
        
        return output_buffer.getvalue(), output_format
        
    except Exception as e:
        # 如果处理失败，返回原图片
        image_file.seek(0)
        original_format = Image.open(image_file).format or 'JPEG'
        image_file.seek(0)
        return image_file.read(), original_format.lower()


@base_router.get("/user/info", summary="查看用户信息", dependencies=[DependAuth])
async def get_userinfo():
    user_id = CTX_USER_ID.get()
    user_obj = await user_controller.get(id=user_id)
    data = await user_obj.to_dict(exclude_fields=["password"])
    return Success(data=data)


@base_router.post(
    "/user/update_password", summary="更新用户密码", dependencies=[DependAuth]
)
async def update_user_password(req_in: UpdatePassword):
    user_controller = UserController()
    user = await user_controller.get(req_in.id)
    verified = verify_password(req_in.old_password, user.password)
    if not verified:
        return Fail(msg="旧密码验证错误！")
    user.password = get_password_hash(req_in.new_password)
    await user.save()
    return Success(msg="修改成功")


@base_router.post("/user/update", summary="更新用户")
async def update_user(
    user_in: UserUpdate,
):
    user_controller = UserController()
    await user_controller.update(obj_in=user_in)
    return Success(msg="Updated Successfully")


@base_router.post("/access_token", summary="获取token")
async def login_access_token(credentials: CredentialsSchema):
    user: User = await user_controller.authenticate(credentials)
    await user_controller.update_last_login(user.id)
    access_token_expires = timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
    expire = datetime.utcnow() + access_token_expires

    data = JWTOut(
        access_token=create_access_token(
            data=JWTPayload(
                user_id=user.id,
                username=user.username,
                exp=expire,
            )
        ),
        username=user.username,
    )
    return Success(data=data.model_dump())


@base_router.post("/upload", summary="上传图片", dependencies=[DependAuth])
async def upload(
    request: Request, 
    file: UploadFile = File(),
    compress_option: Optional[str] = Form("none"),  # "80", "60", "lossless", "none"
    output_format: Optional[str] = Form("original")  # "webp", "original"
):
    storage_setting = (await setting_controller.get(id=1)).storage
    enableStorage = storage_setting.get("enable_storage", True)
    max_size = storage_setting.get("max_size", 32) or 32
    storage_type = storage_setting.get("storage_type", "local")

    if file.size > max_size * 1024 * 1024:
        return Fail(
            msg=f"图片大小：{file.size / 1024 / 1024:.2f}MB，超过大小限制：{max_size}MB"
        )

    if not enableStorage:
        return Fail(msg="已禁止上传图片")
    
    # 处理图片压缩和格式转换
    try:
        processed_image_data, final_format = process_image(file.file, compress_option, output_format)
        
        # 更新文件名扩展名
        original_name = os.path.splitext(file.filename)[0]
        if output_format == "webp":
            new_filename = f"{original_name}.webp"
        else:
            # 保持原扩展名或使用处理后的格式
            original_ext = os.path.splitext(file.filename)[1]
            if original_ext:
                new_filename = file.filename
            else:
                new_filename = f"{original_name}.{final_format}"
        
        # 创建新的文件对象
        processed_file = io.BytesIO(processed_image_data)
        processed_file.seek(0)
        
    except Exception as e:
        return Fail(msg=f"图片处理失败：{str(e)}")

    t = time.localtime()
    
    if storage_type == "local":
        # 本地存储逻辑
        import shutil
        from pathlib import Path
        
        local_path = storage_setting.get("local_path", "images")
        
        # 创建基于时间的目录结构
        year_month = f"{t.tm_year}/{str(t.tm_mon).zfill(2)}"
        upload_dir = Path(local_path) / year_month
        upload_dir.mkdir(parents=True, exist_ok=True)
        
        # 生成文件名
        timestamp = str(int(time.time()))
        filename = f"{timestamp}_{new_filename}"
        file_path = upload_dir / filename
        
        try:
            # 保存处理后的文件到本地
            with open(file_path, "wb") as buffer:
                buffer.write(processed_image_data)
            
            # 获取URL前缀设置
            local_prefix = storage_setting.get("local_prefix", "")
            
            # 如果没有设置前缀，使用程序运行地址作为默认前缀
            if not local_prefix:
                base_url = str(request.base_url).rstrip('/')
                file_url = f"{base_url}/{local_path}/{year_month}/{filename}"
            else:
                # 使用自定义前缀组成完整URL
                file_url = f"{local_prefix.rstrip('/')}/{local_path}/{year_month}/{filename}"
            
            return Success(data=file_url, msg="Upload Success")
            
        except Exception as e:
            return Fail(msg=f"本地上传失败：{str(e)}")
    
    else:
        # 云端存储逻辑
        path_template = storage_setting.get("path", "")
        access_key = storage_setting.get("access_id", None)
        secret_key = storage_setting.get("secret_key", None)
        bucket_name = storage_setting.get("bucket", None)
        endpoint_url = storage_setting.get("endpoint", None)
        region = storage_setting.get("region", None)
        final_path = (
            path_template.replace("{year}", str(t.tm_year))
            .replace("{month}", str(t.tm_mon).zfill(2))
            .replace("{day}", str(t.tm_mday).zfill(2))
            .replace("{timestamp}", str(int(time.time())))
            .replace("{filename}", new_filename)
        )
        if not access_key or not secret_key or not bucket_name or not endpoint_url:
            return Fail(msg="请在存储设置中完善相关参数")
        try:
            storage = S3FileStorage(
                {
                    "access_key_id": access_key,
                    "secret_access_key": secret_key,
                    "bucket_name": bucket_name,
                    "endpoint_url": endpoint_url,
                    "region_name": region,
                }
            )
            # 创建临时文件对象用于上传
            temp_file = io.BytesIO(processed_image_data)
            temp_file.name = new_filename
            await storage.save_file(temp_file, final_path)
        except Exception as e:
            return Fail(msg=f"云端上传失败：{str(e)}")

        prefix = storage_setting.get("prefix", "")
        file_url = prefix.rstrip("/") + "/" + final_path.lstrip("/")
        return Success(data=file_url, msg="Upload Success")


class PresignRequest(BaseModel):
    filename: str
    size: int
    type: str


@base_router.post(
    "/presign", summary="获取图片上传预签名URL", dependencies=[DependAuth]
)
async def get_presigned_url(payload: PresignRequest):
    storage_setting = (await setting_controller.get(id=1)).storage
    enableStorage = storage_setting.get("enable_storage", True)
    max_size = storage_setting.get("max_size", 32)
    max_size = max_size if max_size else 32
    storage_type = storage_setting.get("storage_type", "local")

    if not enableStorage:
        return Fail(msg="已禁止上传图片")
    
    if storage_type == "local":
        return Fail(msg="本地存储不支持预签名URL，请使用直接上传接口")

    if payload.size > max_size * 1024 * 1024:
        return Fail(
            msg=f"图片大小：{payload.size / 1024 / 1024:.2f}MB，超过限制 {max_size}MB"
        )

    access_key = storage_setting.get("access_id")
    secret_key = storage_setting.get("secret_key")
    bucket_name = storage_setting.get("bucket")
    path_template = storage_setting.get("path", "")
    endpoint_url = storage_setting.get("endpoint")
    region = storage_setting.get("region", "us-east-1")

    if not all([access_key, secret_key, bucket_name, endpoint_url]):
        return Fail(msg="请在存储设置中完善相关参数")

    s3 = boto3.client(
        "s3",
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key,
        endpoint_url=endpoint_url,
        region_name=region,
    )

    t = time.localtime()
    final_key = (
        path_template.replace("{year}", str(t.tm_year))
        .replace("{month}", str(t.tm_mon).zfill(2))
        .replace("{day}", str(t.tm_mday).zfill(2))
        .replace("{timestamp}", str(int(time.time())))
        .replace("{filename}", payload.filename)
    )

    try:
        presigned_url = s3.generate_presigned_url(
            ClientMethod="put_object",
            Params={
                "Bucket": bucket_name,
                "Key": final_key,
                "ContentType": payload.type,
            },
            ExpiresIn=600,
        )
    except Exception as e:
        return Fail(msg=f"生成预签名URL失败: {str(e)}")

    file_url = urllib.parse.urljoin(storage_setting.get("prefix", ""), final_key)

    return Success(
        data={
            "upload_url": presigned_url,
            "file_url": file_url,
            "key": final_key,
            "content_type": payload.type,
        },
        msg="预签名URL生成成功",
    )


class DeleteLocalImageRequest(BaseModel):
    image_url: str


@base_router.post("/delete-local-image", summary="删除本地图片文件", dependencies=[DependAuth])
async def delete_local_image(payload: DeleteLocalImageRequest):
    """删除本地存储的图片文件"""
    try:
        # 获取存储设置
        storage_setting = (await setting_controller.get(id=1)).storage
        storage_type = storage_setting.get("storage_type", "local")
        
        # 只有本地存储才需要删除文件
        if storage_type != "local":
            return Success(msg="非本地存储，无需删除文件")
        
        local_path = storage_setting.get("local_path", "images")
        local_prefix = storage_setting.get("local_prefix", "")
        
        # 解析图片URL获取文件路径
        parsed_url = urlparse(payload.image_url)
        url_path = parsed_url.path
        
        # 提取相对路径
        if url_path.startswith(f"/{local_path}/"):
            relative_path = url_path[1:]  # 去掉开头的 /
        else:
            # 尝试从URL路径中提取文件路径
            path_parts = url_path.strip('/').split('/')
            if local_path in path_parts:
                local_path_index = path_parts.index(local_path)
                relative_path = '/'.join(path_parts[local_path_index:])
            else:
                return Fail(msg="无法解析图片路径")
        
        # 构建完整的本地文件路径
        file_path = Path(relative_path)
        
        # 删除文件
        if file_path.exists():
            file_path.unlink()
            return Success(msg=f"文件删除成功: {file_path}")
        else:
            return Fail(msg=f"文件不存在: {file_path}")
            
    except Exception as e:
        return Fail(msg=f"删除文件时出错: {str(e)}")
