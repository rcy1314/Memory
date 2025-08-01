#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
测试API连接和认证
"""

import requests
import json

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

def main():
    print("开始API连接测试...")
    
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
    if test_api_token_auth(api_token):
        print(f"\n=== 测试完成 ===")
        print(f"可以使用的API Token: {api_token}")
        print("请将此Token复制到batch_add_images.py中的api_token变量")
    else:
        print("\nAPI Token认证失败")

if __name__ == "__main__":
    main()