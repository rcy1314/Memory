#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
批量上传旅2文件夹图片到Memory系统
创建新分类'旅2'，设置上传时间为2017年
"""

import os
import requests
import time
from pathlib import Path
import mimetypes
from datetime import datetime
import json

class Lv2ImageUploader:
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
    
    def create_category(self, category_name):
        """创建新分类"""
        category_data = {
            "name": category_name,
            "alias": category_name.lower(),  # 添加alias字段
            "desc": f"分类: {category_name}",
            "order": 1,
            "parent_id": 0
        }
        
        response = self.session.post(
            f"{self.base_url}/api/v1/admin/category/create",
            json=category_data
        )
        
        print(f"创建分类响应状态码: {response.status_code}")
        print(f"创建分类响应内容: {response.text[:200]}...")
        
        if response.status_code == 200:
            result = response.json()
            if result.get("code") == 200:
                data = result.get("data")
                if data and "id" in data:
                    category_id = data["id"]
                    self.categories[category_name] = category_id
                    print(f"创建分类成功: {category_name} (ID: {category_id})")
                    return category_id
                else:
                    print(f"创建分类响应数据格式错误: {data}")
                    return None
            else:
                print(f"创建分类失败: {result.get('msg', '未知错误')}")
                return None
        else:
            print(f"创建分类请求失败: {response.status_code}")
            return None
    
    def upload_image(self, file_path, custom_path="旅2"):
        """上传单个图片文件，使用自定义存储路径"""
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
                # 构造自定义文件名，使用旅2路径
                original_filename = os.path.basename(file_path)
                custom_filename = f"{custom_path}/{original_filename}"
                
                files = {'file': (custom_filename, f, mime_type)}
                
                response = self.session.post(
                    f"{self.base_url}/api/v1/admin/base/upload",
                    files=files
                )
                
                if response.status_code == 200:
                    result = response.json()
                    if result.get("code") == 200:
                        image_url = result["data"]
                        print(f"上传成功: {original_filename} -> {image_url}")
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
    
    def create_blog(self, title, image_url, category_id, desc="", location="旅2"):
        """创建博客条目，使用2017年时间"""
        # 使用2017年的时间
        blog_time = datetime(2017, 6, 15, 12, 0, 0)  # 2017年6月15日
        
        blog_data = {
            "title": title,
            "time": blog_time.isoformat(),
            "desc": desc,
            "location": location,
            "is_hidden": False,
            "remark": "{}",  # 修复：使用字符串类型，与原始脚本保持一致
            "images": [{
                "image_url": image_url,
                "title": title,
                "desc": desc,
                "time": blog_time.isoformat(),
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
    
    def process_lv2_directory(self, image_dir):
        """处理旅2目录"""
        image_dir = Path(image_dir)
        if not image_dir.exists():
            print(f"目录不存在: {image_dir}")
            return
        
        # 获取分类信息
        self.get_categories()
        
        # 检查或创建'旅2'分类
        category_name = "旅2"
        if category_name not in self.categories:
            print(f"分类 '{category_name}' 不存在，正在创建...")
            category_id = self.create_category(category_name)
            if not category_id:
                print(f"无法创建分类 '{category_name}'，退出")
                return
        else:
            category_id = self.categories[category_name]
            print(f"使用已存在的分类 '{category_name}' (ID: {category_id})")
        
        # 检查已存在的博客
        existing_titles = self.check_existing_blogs()
        
        # 获取目录下的所有图片文件
        image_files = []
        for ext in ['*.jpg', '*.jpeg', '*.png', '*.gif', '*.bmp', '*.tiff', '*.webp', '*.heic']:
            image_files.extend(image_dir.glob(ext))
            image_files.extend(image_dir.glob(ext.upper()))
        
        print(f"找到 {len(image_files)} 个图片文件")
        
        total_uploaded = 0
        total_skipped = 0
        
        for image_file in image_files:
            # 使用文件名（不含扩展名）作为标题，但限制长度不超过50字符
            title = image_file.stem
            if len(title) > 50:
                title = title[:47] + "..."  # 截断并添加省略号
            
            # 检查是否已存在
            if title in existing_titles:
                print(f"跳过已存在的图片: {title}")
                total_skipped += 1
                continue
            
            print(f"\n处理图片: {image_file.name}")
            
            # 上传图片，使用自定义路径
            image_url = self.upload_image(str(image_file), "旅2")
            if image_url:
                # 创建博客条目，使用文件名作为标题和描述
                desc = f"旅2队图片: {title}"
                if self.create_blog(title, image_url, category_id, desc=desc, location="旅2"):
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
    IMAGE_DIR = "/Library/Github/Memory/旅2"
    BASE_URL = "http://localhost:9999"
    USERNAME = "admin"
    
    # 尝试不同的密码
    passwords = ["admin", "123456", "password", ""]
    
    uploader = None
    for password in passwords:
        try:
            print(f"尝试密码: {password if password else '(空密码)'}")
            uploader = Lv2ImageUploader(BASE_URL, USERNAME, password)
            print(f"登录成功，使用密码: {password if password else '(空密码)'}")
            break
        except Exception as e:
            print(f"密码 '{password}' 登录失败: {str(e)}")
            continue
    
    if uploader:
        try:
            uploader.process_lv2_directory(IMAGE_DIR)
        except Exception as e:
            print(f"处理目录时出错: {str(e)}")
    else:
        print("所有密码都尝试失败，请检查用户名和密码")

if __name__ == "__main__":
    main()