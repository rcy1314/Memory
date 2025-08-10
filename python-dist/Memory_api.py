#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Memory API 完整测试和管理工具
支持批量操作、WebDAV管理、文件监控等功能
"""

import requests
import json
import os
from pathlib import Path
from typing import List, Dict, Any

# API配置
API_BASE_URL = "http://localhost:9999/api/v1"

def test_visitor_api():
    """测试访客API（不需要认证）"""
    print("=== 测试访客API ===")
    
    # 测试获取分类列表
    try:
        response = requests.get(f"{API_BASE_URL}/visitor/category/list")
        print(f"分类列表API状态码: {response.status_code}")
        print(f"响应内容: {response.text[:200]}...")  # 显示前200个字符
        if response.status_code == 200:
            try:
                result = response.json()
                print(f"分类数量: {len(result.get('data', []))}")
                for category in result.get('data', [])[:3]:  # 只显示前3个
                    print(f"  - {category['name']} ({category['alias']})")
            except json.JSONDecodeError as je:
                print(f"JSON解析失败: {je}")
        else:
            print(f"错误: {response.text}")
    except Exception as e:
        print(f"访客API测试失败: {e}")

def test_admin_login():
    """测试管理员登录"""
    print("\n=== 测试管理员登录 ===")
    
    # 默认管理员账号
    login_data = {
        "username": "admin",
        "password": "123456"
    }
    
    try:
        response = requests.post(
            f"{API_BASE_URL}/admin/base/access_token",
            json=login_data,
            headers={"Content-Type": "application/json"}
        )
        print(f"登录API状态码: {response.status_code}")
        print(f"登录响应内容: {response.text[:200]}...")  # 显示前200个字符
        if response.status_code == 200:
            try:
                result = response.json()
                if result.get('code') == 200:
                    access_token = result['data']['access_token']
                    print(f"登录成功，获取到Token: {access_token[:20]}...")
                    return access_token
                else:
                    print(f"登录失败: {result.get('msg', '未知错误')}")
            except json.JSONDecodeError as je:
                print(f"登录响应JSON解析失败: {je}")
        else:
            print(f"登录错误: {response.text}")
    except Exception as e:
        print(f"登录测试失败: {e}")
    
    return None

def test_admin_api_with_jwt(jwt_token):
    """使用JWT Token测试管理员API"""
    print("\n=== 测试JWT认证的管理员API ===")
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {jwt_token}"
    }
    
    try:
        # 测试获取分类列表
        response = requests.get(
            f"{API_BASE_URL}/admin/category/list",
            headers=headers
        )
        print(f"管理员分类列表API状态码: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"管理员API访问成功")
            return True
        else:
            print(f"管理员API访问失败: {response.text}")
    except Exception as e:
        print(f"管理员API测试失败: {e}")
    
    return False

def create_api_token(jwt_token):
    """创建API Token"""
    print("\n=== 创建API Token ===")
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {jwt_token}"
    }
    
    token_data = {
        "name": "批量导入Token",
        "is_permanent": True,
        "remark": "用于批量导入图片的API Token"
    }
    
    try:
        response = requests.post(
            f"{API_BASE_URL}/admin/api-token/create",
            json=token_data,
            headers=headers
        )
        print(f"创建API Token状态码: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            if result.get('code') == 200:
                api_token = result['data']['token']
                print(f"API Token创建成功: {api_token}")
                return api_token
            else:
                print(f"API Token创建失败: {result.get('msg', '未知错误')}")
        else:
            print(f"API Token创建错误: {response.text}")
    except Exception as e:
        print(f"API Token创建失败: {e}")
    
    return None

def test_api_token_auth(api_token):
    """测试API Token认证"""
    print("\n=== 测试API Token认证 ===")
    
    headers = {
        "Content-Type": "application/json",
        "token": api_token
    }
    
    try:
        # 测试API Token认证
        response = requests.get(
            f"{API_BASE_URL}/admin/test-api-token/test",
            headers=headers
        )
        print(f"API Token测试状态码: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"API Token认证成功: {result.get('msg', '')}")
            return True
        else:
            print(f"API Token认证失败: {response.text}")
    except Exception as e:
        print(f"API Token测试失败: {e}")
    
    return False

def test_batch_operations(api_token):
    """测试批量操作API"""
    print("\n=== 测试批量操作API ===")
    
    headers = {
        "Content-Type": "application/json",
        "token": api_token
    }
    
    # 测试批量搜索
    try:
        response = requests.get(
            f"{API_BASE_URL}/batch/blogs/search?page=1&page_size=5",
            headers=headers
        )
        print(f"批量搜索API状态码: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"搜索到 {result.get('total', 0)} 个博客")
        else:
            print(f"批量搜索失败: {response.text}")
    except Exception as e:
        print(f"批量搜索测试失败: {e}")
    
    # 测试批量创建（示例数据）
    try:
        batch_data = {
            "blogs": [
                {
                    "title": "API测试博客1",
                    "desc": "通过API创建的测试博客",
                    "location": "API测试",
                    "time": "2024-01-01T12:00:00",
                    "is_hidden": False,
                    "categories": [],
                    "images": [],
                    "videos": []
                }
            ]
        }
        
        response = requests.post(
            f"{API_BASE_URL}/batch/blogs/create",
            json=batch_data,
            headers=headers
        )
        print(f"批量创建API状态码: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"批量创建成功: {result.get('msg', '')}")
            return result.get('data', [])
        else:
            print(f"批量创建失败: {response.text}")
    except Exception as e:
        print(f"批量创建测试失败: {e}")
    
    return []


def test_webdav_operations(api_token):
    """测试WebDAV操作API"""
    print("\n=== 测试WebDAV操作API ===")
    
    headers = {
        "Content-Type": "application/json",
        "token": api_token
    }
    
    # 测试列出目录
    try:
        response = requests.get(
            f"{API_BASE_URL}/webdav/list?path=.",
            headers=headers
        )
        print(f"目录列表API状态码: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            data = result.get('data', {})
            print(f"目录路径: {data.get('path', '')}")
            print(f"文件数量: {data.get('total_files', 0)}")
            print(f"目录数量: {data.get('total_directories', 0)}")
        else:
            print(f"目录列表失败: {response.text}")
    except Exception as e:
        print(f"目录列表测试失败: {e}")
    
    # 测试创建目录
    try:
        response = requests.post(
            f"{API_BASE_URL}/webdav/mkdir?path=api_test_dir",
            headers=headers
        )
        print(f"创建目录API状态码: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"创建目录成功: {result.get('msg', '')}")
        else:
            print(f"创建目录失败: {response.text}")
    except Exception as e:
        print(f"创建目录测试失败: {e}")
    
    # 测试开始文件监控
    try:
        response = requests.post(
            f"{API_BASE_URL}/webdav/watch/start?path=.",
            headers={"token": api_token}  # 需要管理员权限
        )
        print(f"开始监控API状态码: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"开始监控成功: {result.get('msg', '')}")
        else:
            print(f"开始监控失败: {response.text}")
    except Exception as e:
        print(f"开始监控测试失败: {e}")


def test_webhook_operations(api_token):
    """测试Webhook功能"""
    print("\n=== 测试Webhook功能 ===")
    
    headers = {
        "Content-Type": "application/json",
        "token": api_token
    }
    
    # 注册webhook
    webhook_config = {
        "name": "测试Webhook",
        "url": "https://httpbin.org/post",
        "events": ["blog.created", "image.uploaded"],
        "active": True,
        "retry_count": 3,
        "timeout": 30
    }
    
    try:
        response = requests.post(
            f"{API_BASE_URL}/webhook/register?webhook_id=test_webhook_001",
            json=webhook_config,
            headers=headers
        )
        print(f"注册Webhook状态码: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"注册Webhook成功: {result.get('msg', '')}")
        else:
            print(f"注册Webhook失败: {response.text}")
    except Exception as e:
        print(f"注册Webhook测试失败: {e}")
    
    # 获取webhook列表
    try:
        response = requests.get(
            f"{API_BASE_URL}/webhook/list",
            headers=headers
        )
        print(f"Webhook列表状态码: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"Webhook列表获取成功，数量: {len(result.get('data', []))}")
        else:
            print(f"获取Webhook列表失败: {response.text}")
    except Exception as e:
        print(f"获取Webhook列表测试失败: {e}")
    
    # 手动触发事件
    try:
        trigger_data = {
            "blog_id": "test_blog_123",
            "title": "测试博客",
            "action": "created"
        }
        response = requests.post(
            f"{API_BASE_URL}/webhook/trigger?event_type=blog.created",
            json=trigger_data,
            headers=headers
        )
        print(f"触发Webhook事件状态码: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"触发Webhook事件成功: {result.get('msg', '')}")
        else:
            print(f"触发Webhook事件失败: {response.text}")
    except Exception as e:
        print(f"触发Webhook事件测试失败: {e}")
    
    # 测试webhook
    try:
        response = requests.post(
            f"{API_BASE_URL}/webhook/test?webhook_id=test_webhook_001",
            headers=headers
        )
        print(f"测试Webhook状态码: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"测试Webhook成功: {result.get('msg', '')}")
        else:
            print(f"测试Webhook失败: {response.text}")
    except Exception as e:
        print(f"测试Webhook失败: {e}")
    
    # 获取投递记录
    try:
        response = requests.get(
            f"{API_BASE_URL}/webhook/deliveries?limit=10",
            headers=headers
        )
        print(f"Webhook投递记录状态码: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"获取投递记录成功，数量: {len(result.get('data', []))}")
        else:
            print(f"获取投递记录失败: {response.text}")
    except Exception as e:
        print(f"获取投递记录测试失败: {e}")
    
    # 注销webhook
    try:
        response = requests.delete(
            f"{API_BASE_URL}/webhook/unregister?webhook_id=test_webhook_001",
            headers=headers
        )
        print(f"注销Webhook状态码: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"注销Webhook成功: {result.get('msg', '')}")
        else:
            print(f"注销Webhook失败: {response.text}")
    except Exception as e:
        print(f"注销Webhook测试失败: {e}")


def test_enhanced_api_features(api_token):
    """测试增强的API功能"""
    print("\n=== 测试增强API功能 ===")
    
    # 测试批量操作
    created_blog_ids = test_batch_operations(api_token)
    
    # 测试WebDAV操作
    test_webdav_operations(api_token)
    
    # 测试Webhook功能
    test_webhook_operations(api_token)
    
    # 如果创建了测试博客，清理它们
    if created_blog_ids:
        print("\n=== 清理测试数据 ===")
        headers = {
            "Content-Type": "application/json",
            "token": api_token
        }
        
        try:
            cleanup_data = {"blog_ids": created_blog_ids}
            response = requests.delete(
                f"{API_BASE_URL}/batch/blogs/delete",
                json=cleanup_data,
                headers=headers
            )
            if response.status_code == 200:
                print("测试数据清理成功")
            else:
                print(f"测试数据清理失败: {response.text}")
        except Exception as e:
            print(f"清理测试数据失败: {e}")


def main():
    print("开始Memory API完整测试...")
    
    # 1. 测试访客API
    test_visitor_api()
    
    # 2. 测试管理员登录
    jwt_token = test_admin_login()
    if not jwt_token:
        print("\n无法获取JWT Token，请检查管理员账号密码")
        return
    
    # 3. 测试JWT认证的管理员API
    if not test_admin_api_with_jwt(jwt_token):
        print("\nJWT认证失败")
        return
    
    # 4. 创建API Token
    api_token = create_api_token(jwt_token)
    if not api_token:
        print("\n无法创建API Token")
        return
    
    # 5. 测试API Token认证
    if not test_api_token_auth(api_token):
        print("\nAPI Token认证失败")
        return
    
    # 6. 测试增强的API功能
    test_enhanced_api_features(api_token)
    
    print(f"\n=== Memory API测试完成 ===")
    print(f"可以使用的API Token: {api_token}")
    print("\n支持的API功能:")
    print("- 批量博客创建/更新/删除")
    print("- 批量图片/视频上传")
    print("- WebDAV文件管理")
    print("- 文件监控和变化通知")
    print("- 增强的搜索和过滤")
    print("- Webhook事件通知")
    print("\n请将API Token保存用于后续开发和集成")

if __name__ == "__main__":
    main()