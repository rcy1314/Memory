#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
检查图片分类情况的脚本
"""

import requests
import json
from collections import defaultdict

# API配置
API_BASE_URL = "http://localhost:9999/api/v1"
JWT_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6ImFkbWluIiwiZXhwIjoxNzU0NjgxMzQ4fQ.V880AnRsd20Gv-uTtU17dTPGbLXrNwRpbq9lqP5xplo"

class CategoryChecker:
    def __init__(self, api_base_url: str, jwt_token: str):
        self.api_base_url = api_base_url
        self.headers = {
            "Content-Type": "application/json",
            "authorization": f"Bearer {jwt_token}"
        }
        self.session = requests.Session()
        self.session.headers.update(self.headers)
    
    def get_categories(self):
        """获取所有分类"""
        try:
            response = self.session.get(f"{self.api_base_url}/admin/category/list")
            if response.status_code == 200:
                result = response.json()
                if result.get('code') == 200:
                    return result.get('data', [])
        except Exception as e:
            print(f"获取分类失败: {e}")
        return []
    
    def get_blogs(self):
        """获取所有博客/图片"""
        try:
            # 使用POST请求获取博客列表
            response = self.session.post(f"{self.api_base_url}/admin/blog/list", json={
                "page": 1,
                "page_size": 1000,  # 获取大量数据
                "title": "",
                "category_id": None,
                "location": "",
                "order": "-created_at"
            })
            print(f"获取博客列表 - 状态码: {response.status_code}")
            print(f"响应内容前200字符: {response.text[:200]}")
            if response.status_code == 200:
                result = response.json()
                if result.get('code') == 200:
                    data = result.get('data', {})
                    if isinstance(data, dict):
                        return data.get('items', [])
                    elif isinstance(data, list):
                        return data
                    else:
                        print(f"意外的数据格式: {type(data)}")
                        return []
        except Exception as e:
            print(f"获取博客列表失败: {e}")
        return []
    
    def analyze_categories(self):
        """分析分类情况"""
        print("=== 分类分析报告 ===")
        
        # 获取分类和博客数据
        categories = self.get_categories()
        blogs = self.get_blogs()
        
        print(f"\n总分类数: {len(categories)}")
        print(f"总图片数: {len(blogs)}")
        
        # 创建分类映射
        category_map = {}
        for category in categories:
            category_map[category['id']] = category
            print(f"- {category['name']} ({category['alias']}) - ID: {category['id']}")
        
        # 统计每个分类的图片数量
        category_counts = defaultdict(int)
        uncategorized_count = 0
        
        print("\n=== 图片分类统计 ===")
        for blog in blogs:
            blog_categories = blog.get('categories', [])
            if not blog_categories:
                uncategorized_count += 1
                print(f"未分类图片: {blog['title']}")
            else:
                # 处理categories可能是字典列表的情况
                for cat in blog_categories:
                    if isinstance(cat, dict):
                        cat_id = cat.get('id')
                        if cat_id:
                            category_counts[cat_id] += 1
                    else:
                        # 如果是直接的ID
                        category_counts[cat] += 1
        
        print(f"\n未分类图片数量: {uncategorized_count}")
        print("\n各分类图片数量:")
        for cat_id, count in category_counts.items():
            if cat_id in category_map:
                cat_info = category_map[cat_id]
                print(f"- {cat_info['name']} ({cat_info['alias']}): {count} 张图片")
            else:
                print(f"- 未知分类 ID {cat_id}: {count} 张图片")
        
        # 检查可能的分类错误
        print("\n=== 可能的分类问题 ===")
        
        # 检查是否有图片标题暗示不同分类
        life_keywords = ['生活', '日常', '摆件', '店', '台式', '修狗', '行驶']
        scene_keywords = ['青岛', '成都', '海边', '夕阳', '风光', '城市']
        food_keywords = ['面', '花', '牛排', 'pizza', '鸡', '旋风']
        night_keywords = ['夜', '凤起路', '庆春路', '火车站夜景', '指示牌']
        me_keywords = ['微笑', '傻', '憨', '深深', '一角', '多情']
        
        misclassified = []
        
        for blog in blogs:
            title = blog['title'].lower()
            blog_categories = blog.get('categories', [])
            
            # 检查是否应该在LIFE分类但不在
            if any(keyword in title for keyword in life_keywords):
                life_cat_id = None
                for cat_id, cat_info in category_map.items():
                    if cat_info['alias'].lower() == 'life':
                        life_cat_id = cat_id
                        break
                if life_cat_id and life_cat_id not in blog_categories:
                    misclassified.append(f"'{blog['title']}' 可能应该在 LIFE 分类")
            
            # 类似地检查其他分类...
            # 这里可以添加更多的检查逻辑
        
        if misclassified:
            for issue in misclassified[:10]:  # 只显示前10个
                print(f"- {issue}")
        else:
            print("未发现明显的分类错误")

def main():
    checker = CategoryChecker(API_BASE_URL, JWT_TOKEN)
    checker.analyze_categories()

if __name__ == "__main__":
    main()