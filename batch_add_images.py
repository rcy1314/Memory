#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
批量添加图片到Memory项目
从te.html文件中提取分类和图片信息，并通过API添加到项目中
"""

import re
import requests
import json
from datetime import datetime
from typing import List, Dict, Set
from bs4 import BeautifulSoup

# API配置
API_BASE_URL = "http://localhost:9999/api/v1"
JWT_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6ImFkbWluIiwiZXhwIjoxNzU0NjgxMzQ4fQ.V880AnRsd20Gv-uTtU17dTPGbLXrNwRpbq9lqP5xplo"  # JWT Token

class MemoryBatchImporter:
    def __init__(self, api_base_url: str, jwt_token: str = ""):
        self.api_base_url = api_base_url
        self.jwt_token = jwt_token
        self.headers = {
            "Content-Type": "application/json",
            "authorization": f"Bearer {self.jwt_token}"
        }
        self.session = requests.Session()
        self.session.headers.update(self.headers)
        
    def parse_html_file(self, file_path: str) -> tuple[List[Dict], List[Dict]]:
        """解析HTML文件，提取分类和图片信息"""
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        soup = BeautifulSoup(content, 'html.parser')
        
        # 提取分类信息
        categories = self.extract_categories(soup)
        
        # 提取图片信息
        images = self.extract_images(soup)
        
        return categories, images
    
    def extract_categories(self, soup: BeautifulSoup) -> List[Dict]:
        """提取分类信息"""
        categories = []
        category_elements = soup.find_all('div', class_='categories-single')
        
        for element in category_elements:
            onclick_attr = element.get('onclick', '')
            if onclick_attr and 'changetab' in onclick_attr:
                # 提取分类别名
                match = re.search(r"changetab\('([^']+)'\)", onclick_attr)
                if match:
                    alias = match.group(1)
                    if alias != 'ALL':  # 跳过"全部"分类
                        name = element.get_text(strip=True)
                        categories.append({
                            'name': name,
                            'alias': alias.lower(),  # 转为小写
                            'desc': f'{name}分类',
                            'order': len(categories) + 1,
                            'parent_id': 0
                        })
        
        return categories
    
    def extract_images(self, soup: BeautifulSoup) -> List[Dict]:
        """提取图片信息"""
        images = []
        seen_urls = set()  # 用于去重
        
        grid_items = soup.find_all('div', class_='grid-item')
        
        for item in grid_items:
            # 获取分类
            classes = item.get('class', [])
            category_alias = None
            for cls in classes:
                if cls != 'grid-item':
                    category_alias = cls.lower()
                    break
            
            # 获取图片链接
            a_tag = item.find('a')
            if a_tag:
                image_url = a_tag.get('href', '')
                
                # 去重检查
                if image_url in seen_urls:
                    continue
                seen_urls.add(image_url)
                
                # 获取标题
                title_div = item.find('div', class_='title')
                title = title_div.get_text(strip=True) if title_div else ''
                
                if image_url and title:
                    images.append({
                        'image_url': image_url,
                        'title': title,
                        'desc': title,  # 使用标题作为描述
                        'category_alias': category_alias,
                        'time': datetime.now().isoformat(),
                        'is_hidden': False,
                        'order': len(images) + 1
                    })
        
        return images
    
    def create_category(self, category_data: Dict) -> bool:
        """创建分类"""
        try:
            response = self.session.post(
                f"{self.api_base_url}/admin/category/create",
                json=category_data
            )
            if response.status_code == 200:
                result = response.json()
                if result.get('code') == 200:
                    print(f"✓ 分类创建成功: {category_data['name']} ({category_data['alias']})")
                    return True
                else:
                    print(f"✗ 分类创建失败: {category_data['name']} - {result.get('msg', '未知错误')}")
            else:
                print(f"✗ 分类创建失败: {category_data['name']} - HTTP {response.status_code}")
        except Exception as e:
            print(f"✗ 分类创建异常: {category_data['name']} - {str(e)}")
        return False
    
    def get_categories(self) -> Dict[str, int]:
        """获取现有分类列表，返回别名到ID的映射"""
        try:
            response = self.session.get(f"{self.api_base_url}/admin/category/list")
            print(f"获取分类列表 - 状态码: {response.status_code}")
            print(f"响应内容前200字符: {response.text[:200]}")
            if response.status_code == 200:
                result = response.json()
                if result.get('code') == 200:
                    categories_map = {}
                    for category in result.get('data', []):
                        categories_map[category['alias']] = category['id']
                        # 处理子分类
                        for child in category.get('children', []):
                            categories_map[child['alias']] = child['id']
                    return categories_map
        except Exception as e:
            print(f"✗ 获取分类列表失败: {str(e)}")
        return {}
    
    def create_blog_with_image(self, image_data: Dict, category_id: int = None) -> bool:
        """创建包含图片的博客"""
        blog_data = {
            'title': image_data['title'],
            'time': image_data['time'],
            'desc': image_data.get('desc', ''),
            'location': '',
            'is_hidden': image_data.get('is_hidden', False),
            'images': [{
                'image_url': image_data['image_url'],
                'title': image_data['title'],
                'desc': image_data.get('desc', ''),
                'is_hidden': False,
                'order': image_data.get('order', 0)
            }],
            'category_ids': [category_id] if category_id else []
        }
        
        try:
            response = self.session.post(
                f"{self.api_base_url}/admin/blog/create",
                json=blog_data
            )
            print(f"添加图片 {image_data['title']} - 状态码: {response.status_code}")
            if response.status_code != 200:
                print(f"响应内容: {response.text[:200]}")
            if response.status_code == 200:
                result = response.json()
                if result.get('code') == 200:
                    print(f"✓ 图片添加成功: {image_data['title']}")
                    return True
                else:
                    print(f"✗ 图片添加失败: {image_data['title']} - {result.get('msg', '未知错误')}")
            else:
                print(f"✗ 图片添加失败: {image_data['title']} - HTTP {response.status_code}")
        except Exception as e:
            print(f"✗ 图片添加异常: {image_data['title']} - {str(e)}")
        return False
    
    def batch_import(self, html_file_path: str):
        """批量导入分类和图片"""
        print("开始解析HTML文件...")
        categories, images = self.parse_html_file(html_file_path)
        
        print(f"解析完成: 发现 {len(categories)} 个分类, {len(images)} 张图片")
        
        # 1. 先创建分类
        print("\n=== 开始创建分类 ===")
        for category in categories:
            self.create_category(category)
        
        # 2. 获取分类映射
        print("\n=== 获取分类映射 ===")
        category_map = self.get_categories()
        print(f"获取到 {len(category_map)} 个分类映射")
        
        # 3. 创建图片
        print("\n=== 开始添加图片 ===")
        success_count = 0
        for image in images:
            category_id = category_map.get(image.get('category_alias'))
            if self.create_blog_with_image(image, category_id):
                success_count += 1
        
        print(f"\n=== 导入完成 ===")
        print(f"成功添加 {success_count}/{len(images)} 张图片")

def main():
    # 配置
    html_file_path = "/Library/Github/Memory/te.html"
    api_base_url = "http://localhost:9999/api/v1"
    jwt_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6ImFkbWluIiwiZXhwIjoxNzU0NjgxMzQ4fQ.V880AnRsd20Gv-uTtU17dTPGbLXrNwRpbq9lqP5xplo"  # JWT Token
    
    print("提示: 如果遇到认证错误，请先登录系统创建API Token")
    print("或者尝试不使用认证（某些API可能不需要认证）")
    
    # 创建导入器
    importer = MemoryBatchImporter(api_base_url, jwt_token)
    
    # 执行批量导入
    importer.batch_import(html_file_path)

if __name__ == "__main__":
    main()