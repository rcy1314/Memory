import re
import requests
from typing import Dict, Optional, Tuple
from urllib.parse import urlparse, parse_qs
import json


class VideoParser:
    """视频链接解析器，支持bilibili和youtube"""
    
    @staticmethod
    def parse_video_url(url: str) -> Dict[str, Optional[str]]:
        """解析视频URL，返回视频信息"""
        result = {
            "video_type": "direct",
            "video_id": None,
            "title": None,
            "cover_url": None,
            "duration": None,
            "desc": None
        }
        
        if not url:
            return result
            
        # 检测bilibili链接
        if "bilibili.com" in url or "b23.tv" in url:
            return VideoParser._parse_bilibili(url)
        
        # 检测youtube链接
        elif "youtube.com" in url or "youtu.be" in url:
            return VideoParser._parse_youtube(url)
        
        # 直链视频
        else:
            result["video_type"] = "direct"
            return result
    
    @staticmethod
    def _parse_bilibili(url: str) -> Dict[str, Optional[str]]:
        """解析bilibili视频链接"""
        result = {
            "video_type": "bilibili",
            "video_id": None,
            "title": None,
            "cover_url": None,
            "duration": None,
            "desc": None
        }
        
        try:
            print(f"开始解析Bilibili链接: {url}")
            # 提取BV号或av号
            bv_match = re.search(r'BV[a-zA-Z0-9]+', url)
            av_match = re.search(r'av(\d+)', url)
            
            print(f"BV匹配结果: {bv_match.group() if bv_match else None}")
            print(f"AV匹配结果: {av_match.group(1) if av_match else None}")
            
            if bv_match:
                video_id = bv_match.group()
                result["video_id"] = video_id
                print(f"提取到BV号: {video_id}")
                
                # 获取视频信息
                api_url = f"https://api.bilibili.com/x/web-interface/view?bvid={video_id}"
                print(f"请求API: {api_url}")
                headers = {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Referer': 'https://www.bilibili.com/'
                }
                response = requests.get(api_url, headers=headers, timeout=10)
                print(f"API响应状态码: {response.status_code}")
                
                if response.status_code == 200:
                    data = response.json()
                    print(f"API响应数据: {data}")
                    if data.get("code") == 0:
                        video_data = data.get("data", {})
                        result["title"] = video_data.get("title")
                        cover_url = video_data.get("pic")
                        if cover_url and cover_url.startswith("http://"):
                            cover_url = cover_url.replace("http://", "https://")
                        result["cover_url"] = cover_url
                        result["duration"] = video_data.get("duration")
                        result["desc"] = video_data.get("desc")
                        print(f"解析成功，视频标题: {result['title']}")
                    else:
                        print(f"Bilibili API返回错误: {data.get('message', '未知错误')}")
                        
            elif av_match:
                av_id = av_match.group(1)
                result["video_id"] = f"av{av_id}"
                
                # 获取视频信息
                api_url = f"https://api.bilibili.com/x/web-interface/view?aid={av_id}"
                headers = {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Referer': 'https://www.bilibili.com/'
                }
                response = requests.get(api_url, headers=headers, timeout=10)
                
                if response.status_code == 200:
                    data = response.json()
                    if data.get("code") == 0:
                        video_data = data.get("data", {})
                        result["title"] = video_data.get("title")
                        cover_url = video_data.get("pic")
                        if cover_url and cover_url.startswith("http://"):
                            cover_url = cover_url.replace("http://", "https://")
                        result["cover_url"] = cover_url
                        result["duration"] = video_data.get("duration")
                        result["desc"] = video_data.get("desc")
                        
        except Exception as e:
            print(f"解析bilibili视频失败: {e}")
            
        return result
    
    @staticmethod
    def _parse_youtube(url: str) -> Dict[str, Optional[str]]:
        """解析youtube视频链接"""
        result = {
            "video_type": "youtube",
            "video_id": None,
            "title": None,
            "cover_url": None,
            "duration": None,
            "desc": None
        }
        
        try:
            # 提取视频ID
            video_id = None
            
            # youtube.com/watch?v=VIDEO_ID
            if "youtube.com/watch" in url:
                parsed = urlparse(url)
                video_id = parse_qs(parsed.query).get('v', [None])[0]
            
            # youtu.be/VIDEO_ID
            elif "youtu.be/" in url:
                video_id = url.split("youtu.be/")[1].split("?")[0]
            
            if video_id:
                result["video_id"] = video_id
                result["cover_url"] = f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg"
                
                # 尝试通过网页抓取获取视频标题
                try:
                    headers = {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                    }
                    response = requests.get(f"https://www.youtube.com/watch?v={video_id}", headers=headers, timeout=10)
                    if response.status_code == 200:
                        # 从HTML中提取标题
                        title_match = re.search(r'<title>([^<]+)</title>', response.text)
                        if title_match:
                            title = title_match.group(1)
                            # 移除YouTube后缀
                            title = title.replace(' - YouTube', '').strip()
                            result["title"] = title
                            print(f"成功获取YouTube视频标题: {title}")
                        
                        # 尝试从meta标签获取描述
                        desc_match = re.search(r'<meta name="description" content="([^"]+)"', response.text)
                        if desc_match:
                            result["desc"] = desc_match.group(1)
                            
                except Exception as e:
                    print(f"获取YouTube视频信息失败: {e}")
                
        except Exception as e:
            print(f"解析youtube视频失败: {e}")
            
        return result


video_parser = VideoParser()