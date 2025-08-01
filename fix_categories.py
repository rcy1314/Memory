#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
修复图片分类的脚本
"""

import requests
import json
from bs4 import BeautifulSoup
from typing import Dict, List

# API配置
API_BASE_URL = "http://localhost:9999/api/v1"
JWT_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6ImFkbWluIiwiZXhwIjoxNzU0NjgxMzQ4fQ.V880AnRsd20Gv-uTtU17dTPGbLXrNwRpbq9lqP5xplo"

class CategoryFixer:
    def __init__(self, api_base_url: str, jwt_token: str):
        self.api_base_url = api_base_url
        self.headers = {
            "Content-Type": "application/json",
            "authorization": f"Bearer {jwt_token}"
        }
        self.session = requests.Session()
        self.session.headers.update(self.headers)
    
    def get_categories(self) -> Dict[str, int]:
        """获取现有分类映射"""
        try:
            response = self.session.get(f"{self.api_base_url}/admin/category/list")
            if response.status_code == 200:
                result = response.json()
                if result.get('code') == 200:
                    categories = result.get('data', [])
                    return {cat['alias'].lower(): cat['id'] for cat in categories}
        except Exception as e:
            print(f"获取分类失败: {e}")
        return {}
    
    def create_missing_categories(self):
        """创建缺失的分类"""
        # 需要创建的分类映射
        needed_categories = {
            'scene': {'name': '城市风光', 'alias': 'scene', 'desc': '城市风光分类'},
            'food': {'name': '美食记录', 'alias': 'food', 'desc': '美食记录分类'},
            'night': {'name': '夜景摄影', 'alias': 'night', 'desc': '夜景摄影分类'},
            'me': {'name': '个人写真', 'alias': 'me', 'desc': '个人写真分类'}
        }
        
        existing_categories = self.get_categories()
        created_count = 0
        
        for alias, category_data in needed_categories.items():
            if alias not in existing_categories:
                try:
                    response = self.session.post(
                        f"{self.api_base_url}/admin/category/create",
                        json={
                            'name': category_data['name'],
                            'alias': category_data['alias'],
                            'desc': category_data['desc'],
                            'order': 10,
                            'parent_id': 0
                        }
                    )
                    print(f"创建分类请求状态码: {response.status_code}")
                    print(f"创建分类响应: {response.text[:200]}")
                    if response.status_code == 200:
                        result = response.json()
                        if result.get('code') == 200:
                            print(f"创建分类成功: {category_data['name']} ({alias})")
                            created_count += 1
                        else:
                            print(f"创建分类失败: {result.get('msg')}")
                except Exception as e:
                    print(f"创建分类异常: {e}")
        
        print(f"共创建了 {created_count} 个新分类")
        return self.get_categories()  # 返回更新后的分类映射
    
    def parse_html_for_mapping(self, html_file_path: str) -> Dict[str, str]:
        """解析HTML文件，建立图片标题到分类的映射"""
        title_to_category = {}
        
        try:
            with open(html_file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            soup = BeautifulSoup(content, 'html.parser')
            grid_items = soup.find_all('div', class_='grid-item')
            
            for item in grid_items:
                # 获取分类
                classes = item.get('class', [])
                category_alias = None
                for cls in classes:
                    if cls != 'grid-item':
                        category_alias = cls.lower()
                        break
                
                # 获取标题
                title_div = item.find('div', class_='title')
                title = title_div.get_text(strip=True) if title_div else ''
                
                if title and category_alias:
                    title_to_category[title] = category_alias
            
            print(f"从HTML文件解析出 {len(title_to_category)} 个图片标题-分类映射")
            return title_to_category
            
        except Exception as e:
            print(f"解析HTML文件失败: {e}")
            return {}
    
    def get_blogs(self) -> List[Dict]:
        """获取所有博客"""
        try:
            response = self.session.post(f"{self.api_base_url}/admin/blog/list", json={
                "page": 1,
                "page_size": 1000,
                "title": "",
                "category_id": None,
                "location": "",
                "order": "-created_at"
            })
            if response.status_code == 200:
                result = response.json()
                if result.get('code') == 200:
                    data = result.get('data', {})
                    if isinstance(data, list):
                        return data
                    elif isinstance(data, dict):
                        return data.get('items', [])
        except Exception as e:
            print(f"获取博客列表失败: {e}")
        return []
    
    def get_blog_detail(self, blog_id: int) -> Dict:
        """获取博客详细信息"""
        try:
            response = self.session.get(f"{self.api_base_url}/admin/blog/get?blog_id={blog_id}")
            if response.status_code == 200:
                result = response.json()
                if result.get('code') == 200:
                    return result.get('data', {})
        except Exception as e:
            print(f"获取博客详情失败: {e}")
        return {}
    
    def update_blog_category(self, blog_id: int, category_ids: List[int]) -> bool:
        """更新博客分类"""
        try:
            # 先获取博客详细信息
            blog_detail = self.get_blog_detail(blog_id)
            if not blog_detail:
                print(f"无法获取博客 {blog_id} 的详细信息")
                return False
            
            # 构建完整的更新数据，保留原有图片
            images = blog_detail.get('images', [])
            if not images:
                print(f"博客 {blog_id} 没有图片，跳过更新")
                return False
                
            # 转换图片格式
            image_updates = []
            for img in images:
                image_updates.append({
                    'id': img['id'],
                    'image_url': img['image_url'],
                    'title': img.get('title', ''),
                    'desc': img.get('desc', ''),
                    'location': img.get('location', ''),
                    'is_hidden': img.get('is_hidden', False),
                    'metadata': img.get('metadata', ''),
                    'order': img.get('order', 0),
                    'time': img.get('time')
                })
            
            update_data = {
                'id': blog_id,
                'title': blog_detail.get('title', ''),
                'time': blog_detail.get('time', ''),
                'desc': blog_detail.get('desc', ''),
                'location': blog_detail.get('location', ''),
                'is_hidden': blog_detail.get('is_hidden', False),
                'remark': blog_detail.get('remark', {}),
                'images': image_updates,
                'category_ids': category_ids
            }
            
            response = self.session.post(
                f"{self.api_base_url}/admin/blog/update",
                json=update_data
            )
            if response.status_code == 200:
                result = response.json()
                if result.get('code') == 200:
                    return True
                else:
                    print(f"更新博客分类API错误: {result.get('msg')}")
            else:
                print(f"更新博客分类HTTP错误: {response.status_code} - {response.text[:100]}")
        except Exception as e:
            print(f"更新博客分类异常: {e}")
        return False
    
    def fix_categories(self, html_file_path: str):
        """修复分类"""
        print("=== 开始修复分类 ===")
        
        # 1. 创建缺失的分类
        print("\n1. 创建缺失的分类...")
        category_mapping = self.create_missing_categories()
        print(f"当前分类映射: {category_mapping}")
        
        # 2. 解析HTML文件获取正确的分类映射
        print("\n2. 解析HTML文件...")
        title_to_category = self.parse_html_for_mapping(html_file_path)
        
        # 3. 获取所有博客
        print("\n3. 获取博客列表...")
        blogs = self.get_blogs()
        print(f"找到 {len(blogs)} 个博客")
        
        # 4. 修复分类
        print("\n4. 开始修复分类...")
        fixed_count = 0
        failed_count = 0
        
        for blog in blogs:
            title = blog['title']
            blog_id = blog['id']
            
            # 查找正确的分类
            if title in title_to_category:
                correct_category_alias = title_to_category[title]
                
                if correct_category_alias in category_mapping:
                    correct_category_id = category_mapping[correct_category_alias]
                    
                    # 更新博客分类
                    if self.update_blog_category(blog_id, [correct_category_id]):
                        print(f"✓ 修复成功: '{title}' -> {correct_category_alias}")
                        fixed_count += 1
                    else:
                        print(f"✗ 修复失败: '{title}'")
                        failed_count += 1
                else:
                    print(f"⚠ 未找到分类映射: '{title}' -> {correct_category_alias}")
                    failed_count += 1
            else:
                print(f"⚠ 未找到标题映射: '{title}'")
                failed_count += 1
        
        print(f"\n=== 修复完成 ===")
        print(f"成功修复: {fixed_count} 个")
        print(f"修复失败: {failed_count} 个")

def main():
    fixer = CategoryFixer(API_BASE_URL, JWT_TOKEN)
    fixer.fix_categories('te.html')

if __name__ == "__main__":
    main()