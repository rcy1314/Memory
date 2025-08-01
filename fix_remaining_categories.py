#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
修复剩余未分类图片的脚本
"""

import requests
import json
from typing import Dict, List

# API配置
API_BASE_URL = "http://localhost:9999/api/v1"
JWT_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6ImFkbWluIiwiZXhwIjoxNzU0NjgxMzQ4fQ.V880AnRsd20Gv-uTtU17dTPGbLXrNwRpbq9lqP5xplo"

class RemainingCategoryFixer:
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
    
    def fix_remaining_categories(self):
        """修复剩余的未分类图片"""
        print("=== 修复剩余未分类图片 ===")
        
        # 获取分类映射
        category_mapping = self.get_categories()
        print(f"当前分类映射: {category_mapping}")
        
        # 获取所有博客
        blogs = self.get_blogs()
        
        # 手动映射剩余的图片到合适的分类
        # 这些都是原本SCENE分类的图片，我们将它们分配到"城市风光"分类
        scene_titles = [
            '青岛一见', '雾天成都', '海边夕阳', '青岛的海水', '清晨', '宝殿', 
            '角边', '成都宽窄巷子', '小吃街', '桥边一角', '面朝青岛', '海风吹拂', 
            '杭州面罩摆件', '荷花未开', '西溪湿地'
        ]
        
        city_category_id = category_mapping.get('city')  # 城市风光分类
        if not city_category_id:
            print("未找到城市风光分类")
            return
        
        fixed_count = 0
        failed_count = 0
        
        for blog in blogs:
            title = blog['title']
            blog_id = blog['id']
            blog_categories = blog.get('categories', [])
            
            # 检查是否是未分类的SCENE图片
            if title in scene_titles and not blog_categories:
                if self.update_blog_category(blog_id, [city_category_id]):
                    print(f"✓ 修复成功: '{title}' -> 城市风光")
                    fixed_count += 1
                else:
                    print(f"✗ 修复失败: '{title}'")
                    failed_count += 1
        
        print(f"\n=== 修复完成 ===")
        print(f"成功修复: {fixed_count} 个")
        print(f"修复失败: {failed_count} 个")

def main():
    fixer = RemainingCategoryFixer(API_BASE_URL, JWT_TOKEN)
    fixer.fix_remaining_categories()

if __name__ == "__main__":
    main()