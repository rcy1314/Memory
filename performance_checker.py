#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
图片加载性能检查程序
用于验证懒加载、滚动性能和图片加载优化效果
"""

import time
import requests
import json
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
import statistics

class PerformanceChecker:
    def __init__(self, base_url="http://localhost:9999"):
        self.base_url = base_url
        self.driver = None
        self.results = {
            "api_performance": {},
            "page_load_performance": {},
            "scroll_performance": {},
            "image_load_performance": {},
            "overall_score": 0
        }
    
    def setup_driver(self):
        """设置Chrome驱动"""
        chrome_options = Options()
        chrome_options.add_argument('--headless')  # 无头模式
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument('--window-size=1920,1080')
        
        try:
            self.driver = webdriver.Chrome(options=chrome_options)
            print("✅ Chrome驱动初始化成功")
        except Exception as e:
            print(f"❌ Chrome驱动初始化失败: {e}")
            print("请确保已安装Chrome浏览器和ChromeDriver")
            return False
        return True
    
    def check_api_performance(self):
        """检查API性能"""
        print("\n🔍 检查API性能...")
        
        api_tests = [
            {
                "name": "博客列表API",
                "url": f"{self.base_url}/api/v1/visitor/blog/list?page=1&page_size=20",
                "expected_time": 500  # 期望响应时间(ms)
            },
            {
                "name": "分类列表API",
                "url": f"{self.base_url}/api/v1/visitor/category/list",
                "expected_time": 300
            }
        ]
        
        for test in api_tests:
            try:
                start_time = time.time()
                response = requests.get(test["url"], timeout=10)
                end_time = time.time()
                
                response_time = (end_time - start_time) * 1000
                
                if response.status_code == 200:
                    status = "✅ 通过" if response_time < test["expected_time"] else "⚠️ 较慢"
                    print(f"  {test['name']}: {response_time:.2f}ms {status}")
                    
                    self.results["api_performance"][test["name"]] = {
                        "response_time": response_time,
                        "status_code": response.status_code,
                        "passed": response_time < test["expected_time"]
                    }
                else:
                    print(f"  {test['name']}: HTTP {response.status_code} ❌ 失败")
                    self.results["api_performance"][test["name"]] = {
                        "response_time": response_time,
                        "status_code": response.status_code,
                        "passed": False
                    }
                    
            except Exception as e:
                print(f"  {test['name']}: 请求失败 - {e}")
                self.results["api_performance"][test["name"]] = {
                    "error": str(e),
                    "passed": False
                }
    
    def check_page_load_performance(self):
        """检查页面加载性能"""
        print("\n🔍 检查页面加载性能...")
        
        if not self.driver:
            print("❌ 浏览器驱动未初始化")
            return
        
        try:
            start_time = time.time()
            self.driver.get(self.base_url)
            
            # 等待页面基本元素加载
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.ID, "blog-main"))
            )
            
            end_time = time.time()
            load_time = (end_time - start_time) * 1000
            
            # 检查页面性能指标
            performance_data = self.driver.execute_script("""
                return {
                    domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
                    loadComplete: performance.timing.loadEventEnd - performance.timing.navigationStart,
                    firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime || 0,
                    firstContentfulPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint')?.startTime || 0
                };
            """)
            
            print(f"  页面加载时间: {load_time:.2f}ms")
            print(f"  DOM内容加载: {performance_data['domContentLoaded']:.2f}ms")
            print(f"  首次绘制: {performance_data['firstPaint']:.2f}ms")
            print(f"  首次内容绘制: {performance_data['firstContentfulPaint']:.2f}ms")
            
            self.results["page_load_performance"] = {
                "total_load_time": load_time,
                "dom_content_loaded": performance_data['domContentLoaded'],
                "first_paint": performance_data['firstPaint'],
                "first_contentful_paint": performance_data['firstContentfulPaint'],
                "passed": load_time < 3000  # 3秒内加载完成
            }
            
        except TimeoutException:
            print("❌ 页面加载超时")
            self.results["page_load_performance"] = {"error": "页面加载超时", "passed": False}
        except Exception as e:
            print(f"❌ 页面加载检查失败: {e}")
            self.results["page_load_performance"] = {"error": str(e), "passed": False}
    
    def check_scroll_performance(self):
        """检查滚动性能"""
        print("\n🔍 检查滚动性能...")
        
        if not self.driver:
            print("❌ 浏览器驱动未初始化")
            return
        
        try:
            # 等待图片容器加载
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.CLASS_NAME, "thumb"))
            )
            
            # 测试滚动性能
            scroll_times = []
            for i in range(5):
                start_time = time.time()
                
                # 滚动到页面底部
                self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                time.sleep(0.5)
                
                # 滚动回顶部
                self.driver.execute_script("window.scrollTo(0, 0);")
                time.sleep(0.5)
                
                end_time = time.time()
                scroll_times.append((end_time - start_time) * 1000)
            
            avg_scroll_time = statistics.mean(scroll_times)
            print(f"  平均滚动时间: {avg_scroll_time:.2f}ms")
            print(f"  滚动时间范围: {min(scroll_times):.2f}ms - {max(scroll_times):.2f}ms")
            
            self.results["scroll_performance"] = {
                "average_scroll_time": avg_scroll_time,
                "min_scroll_time": min(scroll_times),
                "max_scroll_time": max(scroll_times),
                "passed": avg_scroll_time < 1000  # 1秒内完成滚动
            }
            
        except Exception as e:
            print(f"❌ 滚动性能检查失败: {e}")
            self.results["scroll_performance"] = {"error": str(e), "passed": False}
    
    def check_image_load_performance(self):
        """检查图片加载性能"""
        print("\n🔍 检查图片加载性能...")
        
        if not self.driver:
            print("❌ 浏览器驱动未初始化")
            return
        
        try:
            # 等待图片元素加载
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.CLASS_NAME, "thumb-image"))
            )
            
            # 统计图片加载情况
            images = self.driver.find_elements(By.CLASS_NAME, "thumb-image")
            total_images = len(images)
            
            # 等待一段时间让懒加载生效
            time.sleep(2)
            
            # 检查已加载的图片数量
            loaded_images = self.driver.execute_script("""
                const images = document.querySelectorAll('.thumb-image');
                let loadedCount = 0;
                images.forEach(img => {
                    if (img.complete && img.naturalHeight !== 0) {
                        loadedCount++;
                    }
                });
                return loadedCount;
            """)
            
            # 滚动页面触发更多图片加载
            self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(3)
            
            # 再次检查加载情况
            final_loaded_images = self.driver.execute_script("""
                const images = document.querySelectorAll('.thumb-image');
                let loadedCount = 0;
                images.forEach(img => {
                    if (img.complete && img.naturalHeight !== 0) {
                        loadedCount++;
                    }
                });
                return loadedCount;
            """)
            
            load_rate = (final_loaded_images / total_images) * 100 if total_images > 0 else 0
            
            print(f"  总图片数: {total_images}")
            print(f"  初始加载: {loaded_images}")
            print(f"  最终加载: {final_loaded_images}")
            print(f"  加载率: {load_rate:.1f}%")
            
            self.results["image_load_performance"] = {
                "total_images": total_images,
                "initial_loaded": loaded_images,
                "final_loaded": final_loaded_images,
                "load_rate": load_rate,
                "passed": load_rate > 80  # 80%以上的图片成功加载
            }
            
        except Exception as e:
            print(f"❌ 图片加载性能检查失败: {e}")
            self.results["image_load_performance"] = {"error": str(e), "passed": False}
    
    def calculate_overall_score(self):
        """计算总体性能评分"""
        scores = []
        
        # API性能评分
        api_passed = sum(1 for test in self.results["api_performance"].values() 
                        if test.get("passed", False))
        api_total = len(self.results["api_performance"])
        if api_total > 0:
            scores.append((api_passed / api_total) * 100)
        
        # 页面加载性能评分
        if self.results["page_load_performance"].get("passed", False):
            scores.append(100)
        else:
            scores.append(0)
        
        # 滚动性能评分
        if self.results["scroll_performance"].get("passed", False):
            scores.append(100)
        else:
            scores.append(0)
        
        # 图片加载性能评分
        if "load_rate" in self.results["image_load_performance"]:
            scores.append(self.results["image_load_performance"]["load_rate"])
        else:
            scores.append(0)
        
        overall_score = statistics.mean(scores) if scores else 0
        self.results["overall_score"] = overall_score
        
        return overall_score
    
    def run_all_checks(self):
        """运行所有性能检查"""
        print("🚀 开始性能检查...")
        print(f"目标URL: {self.base_url}")
        
        # API性能检查
        self.check_api_performance()
        
        # 设置浏览器驱动
        if self.setup_driver():
            # 页面加载性能检查
            self.check_page_load_performance()
            
            # 滚动性能检查
            self.check_scroll_performance()
            
            # 图片加载性能检查
            self.check_image_load_performance()
            
            # 关闭浏览器
            self.driver.quit()
        
        # 计算总体评分
        overall_score = self.calculate_overall_score()
        
        # 输出结果
        self.print_summary(overall_score)
        
        # 保存结果到文件
        self.save_results()
    
    def print_summary(self, overall_score):
        """打印检查结果摘要"""
        print("\n" + "="*50)
        print("📊 性能检查结果摘要")
        print("="*50)
        
        if overall_score >= 90:
            status = "🟢 优秀"
        elif overall_score >= 70:
            status = "🟡 良好"
        elif overall_score >= 50:
            status = "🟠 一般"
        else:
            status = "🔴 需要优化"
        
        print(f"总体评分: {overall_score:.1f}/100 {status}")
        print()
        
        # 详细结果
        for category, data in self.results.items():
            if category == "overall_score":
                continue
            
            print(f"{category.replace('_', ' ').title()}:")
            if isinstance(data, dict) and data:
                for key, value in data.items():
                    if isinstance(value, dict):
                        passed = "✅" if value.get("passed", False) else "❌"
                        print(f"  {key}: {passed}")
                    else:
                        print(f"  {key}: {value}")
            print()
    
    def save_results(self):
        """保存结果到JSON文件"""
        timestamp = time.strftime("%Y%m%d_%H%M%S")
        filename = f"performance_report_{timestamp}.json"
        
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(self.results, f, ensure_ascii=False, indent=2)
            print(f"📄 详细报告已保存到: {filename}")
        except Exception as e:
            print(f"❌ 保存报告失败: {e}")

def main():
    """主函数"""
    checker = PerformanceChecker()
    checker.run_all_checks()

if __name__ == "__main__":
    main()