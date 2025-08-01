#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
批量上传本地图库到Memory系统
使用文件夹名作为分类，文件名作为标题
"""

import os
import requests
import time
from pathlib import Path
import mimetypes
from datetime import datetime
import json

class LocalImageUploader:
    def __init__(self, base_url="http://localhost:9999", username="admin", password="admin"):
        self.base_url = base_url
        self.session = requests.Session()
        self.token = None
        self.categories = {}
        self.login(username, password)
        
    def login(self, username, password):
        """登录获取token"""
        login_data = {
            "username": username,
            "password": password
        }
        
        try:
            response = self.session.post(
                f"{self.base_url}/api/v1/admin/base/access_token",
                json=login_data
            )
            
            print(f"登录响应状态码: {response.status_code}")
            print(f"登录响应内容: {response.text[:200]}...")
            
            if response.status_code == 200:
                result = response.json()
                if result.get("code") == 200:
                    self.token = result["data"]["access_token"]
                    self.session.headers.update({
                        "Authorization": f"Bearer {self.token}"
                    })
                    print("登录成功")
                else:
                    raise Exception(f"登录失败: {result.get('msg')}")
            else:
                raise Exception(f"登录请求失败: {response.status_code} - {response.text}")
        except requests.exceptions.RequestException as e:
            raise Exception(f"登录请求异常: {str(e)}")
        except json.JSONDecodeError as e:
            raise Exception(f"登录响应JSON解析失败: {str(e)} - 响应内容: {response.text}")
    
    def get_categories(self):
        """获取所有分类"""
        response = self.session.get(f"{self.base_url}/api/v1/admin/category/list")
        if response.status_code == 200:
            result = response.json()
            if result.get("code") == 200:
                for category in result["data"]:
                    self.categories[category["name"]] = category["id"]
                print(f"获取到 {len(self.categories)} 个分类: {list(self.categories.keys())}")
            else:
                print(f"获取分类失败: {result.get('msg')}")
        else:
            print(f"获取分类请求失败: {response.status_code}")
    
    def upload_image(self, file_path):
        """上传单个图片文件"""
        if not os.path.exists(file_path):
            print(f"文件不存在: {file_path}")
            return None
            
        # 检查文件类型
        mime_type, _ = mimetypes.guess_type(file_path)
        if not mime_type or not mime_type.startswith('image/'):
            print(f"跳过非图片文件: {file_path}")
            return None
            
        try:
            with open(file_path, 'rb') as f:
                files = {'file': (os.path.basename(file_path), f, mime_type)}
                
                response = self.session.post(
                    f"{self.base_url}/api/v1/admin/base/upload",
                    files=files
                )
                
                if response.status_code == 200:
                    result = response.json()
                    if result.get("code") == 200:
                        image_url = result["data"]
                        print(f"上传成功: {os.path.basename(file_path)} -> {image_url}")
                        return image_url
                    else:
                        print(f"上传失败: {result.get('msg')}")
                        return None
                else:
                    print(f"上传请求失败: {response.status_code}")
                    return None
                    
        except Exception as e:
            print(f"上传异常: {file_path} - {str(e)}")
            return None
    
    def create_blog(self, title, image_url, category_id, desc="", location=""):
        """创建博客条目"""
        current_time = datetime.now()
        blog_data = {
            "title": title,
            "time": current_time.isoformat(),
            "desc": desc,
            "location": location,
            "is_hidden": False,
            "remark": "{}",
            "images": [{
                "image_url": image_url,
                "title": title,
                "desc": desc,
                "time": current_time.isoformat(),
                "location": location,
                "is_hidden": False,
                "metadata": "",
                "order": 0
            }],
            "category_ids": [category_id]
        }
        
        response = self.session.post(
            f"{self.base_url}/api/v1/admin/blog/create",
            json=blog_data
        )
        
        if response.status_code == 200:
            result = response.json()
            if result.get("code") == 200:
                print(f"创建博客成功: {title}")
                return True
            else:
                print(f"创建博客失败: {result.get('msg', '未知错误')}")
                print(f"响应详情: {result}")
                return False
        else:
            print(f"创建博客请求失败: {response.status_code}")
            try:
                error_detail = response.json()
                print(f"错误详情: {error_detail}")
            except:
                print(f"响应内容: {response.text}")
            return False
    
    def check_existing_blogs(self):
        """检查已存在的博客，避免重复上传"""
        existing_titles = set()
        page = 1
        page_size = 100
        
        while True:
            response = self.session.post(
                f"{self.base_url}/api/v1/admin/blog/list",
                json={"page": page, "page_size": page_size}
            )
            
            if response.status_code == 200:
                result = response.json()
                if result.get("code") == 200:
                    data = result["data"]
                    # 检查数据结构
                    if isinstance(data, dict) and "items" in data:
                        blogs = data["items"]
                    elif isinstance(data, list):
                        blogs = data
                    else:
                        print(f"未知的数据结构: {type(data)}")
                        break
                        
                    if not blogs:
                        break
                        
                    for blog in blogs:
                        existing_titles.add(blog["title"])
                    
                    page += 1
                else:
                    print(f"获取博客列表失败: {result.get('msg')}")
                    break
            else:
                print(f"获取博客列表请求失败: {response.status_code}")
                break
        
        print(f"检查到 {len(existing_titles)} 个已存在的博客")
        return existing_titles
    
    def process_directory(self, image_dir):
        """处理图库目录"""
        image_dir = Path(image_dir)
        if not image_dir.exists():
            print(f"目录不存在: {image_dir}")
            return
        
        # 获取分类信息
        self.get_categories()
        
        # 检查已存在的博客
        existing_titles = self.check_existing_blogs()
        
        # 定义分类优先级（人间生活优先，军旅旧忆最后）
        category_priority = {
            "人间生活": 1,
            "个人写真": 2,
            "美食记录": 3,
            "夜景摄影": 4,
            "城市风光": 5,
            "军旅旧忆": 999  # 最后处理
        }
        
        # 收集所有分类目录
        category_dirs = []
        for item in image_dir.iterdir():
            if item.is_dir():
                category_dirs.append(item)
        
        # 按优先级排序
        category_dirs.sort(key=lambda x: category_priority.get(x.name, 500))
        
        total_uploaded = 0
        total_skipped = 0
        
        for category_dir in category_dirs:
            category_name = category_dir.name
            print(f"\n处理分类: {category_name}")
            
            # 检查分类是否存在
            if category_name not in self.categories:
                print(f"分类 '{category_name}' 不存在，跳过")
                continue
            
            category_id = self.categories[category_name]
            
            # 获取该分类下的所有图片文件
            image_files = []
            for ext in ['*.jpg', '*.jpeg', '*.png', '*.gif', '*.bmp', '*.tiff', '*.webp', '*.heic']:
                image_files.extend(category_dir.glob(ext))
                image_files.extend(category_dir.glob(ext.upper()))
            
            print(f"找到 {len(image_files)} 个图片文件")
            
            for image_file in image_files:
                # 使用文件名（不含扩展名）作为标题
                title = image_file.stem
                
                # 检查是否已存在
                if title in existing_titles:
                    print(f"跳过已存在的图片: {title}")
                    total_skipped += 1
                    continue
                
                print(f"\n处理图片: {image_file.name}")
                
                # 上传图片
                image_url = self.upload_image(str(image_file))
                if image_url:
                    # 创建博客条目，使用文件名作为标题和描述
                    desc = f"图片: {title}"
                    if self.create_blog(title, image_url, category_id, desc=desc, location=category_name):
                        total_uploaded += 1
                        existing_titles.add(title)  # 添加到已存在列表，避免重复
                    
                    # 添加延迟，避免API限制
                    time.sleep(0.5)
                else:
                    total_skipped += 1
        
        print(f"\n批量上传完成!")
        print(f"成功上传: {total_uploaded} 张")
        print(f"跳过: {total_skipped} 张")

def main():
    # 配置
    IMAGE_DIR = "/Library/Github/Memory/图库"
    BASE_URL = "http://localhost:9999"
    USERNAME = "admin"
    
    # 尝试不同的密码
    passwords = ["admin", "123456", "password", ""]
    
    uploader = None
    for password in passwords:
        try:
            print(f"尝试密码: {password if password else '(空密码)'}")
            uploader = LocalImageUploader(BASE_URL, USERNAME, password)
            print(f"登录成功，使用密码: {password if password else '(空密码)'}")
            break
        except Exception as e:
            print(f"密码 '{password}' 登录失败: {str(e)}")
            continue
    
    if uploader:
        try:
            uploader.process_directory(IMAGE_DIR)
        except Exception as e:
            print(f"处理目录时出错: {str(e)}")
    else:
        print("所有密码都尝试失败，请检查用户名和密码")

if __name__ == "__main__":
    main()