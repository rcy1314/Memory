from typing import Optional, Union, Dict, Any, List

from app.core.crud import CRUDBase
from app.models.admin import Setting
from app.schemas.setting import SettingCreate, SettingUpdate, SettingUpdateMeta, SettingUpdateGeneral, SettingUpdateContent, SettingUpdateStorage, SettingUpdateDatabase


class SettingController(CRUDBase[Setting, SettingCreate, SettingUpdate]):
    def __init__(self):
        super().__init__(model=Setting)

    async def create(self, obj_in: SettingCreate) -> Setting:
        obj = await super().create(obj_in.create_dict())
        return obj

    async def get(
        self, id: int, prefetch_fields: Optional[List[Union[str, Any]]] = None
    ) -> Setting:
        try:
            query = self.model.get(id=id)
            if prefetch_fields:
                query = query.prefetch_related(*prefetch_fields)
            return await query
        except Exception as e:
            # 如果记录不存在，创建默认记录
            if id == 1:
                from app.models.admin import Setting
                default_setting = await Setting.create(
                    general={},
                    content={
                        "page_size": 24,
                        "thumbnail_suffix": "",
                        "detail_suffix": "",
                        "thumbnail_show_location": False,
                        "detail_show_location": False,
                        "thumbnail_show_time": True,
                        "thumbnail_time_format": "YYYY-MM-DD",
                        "detail_show_time": False,
                        "detail_time_format": ""
                    },
                    storage={},
                    meta={
                        "hero_images": [
                            {
                                "url": "/assets/Cover/1.jpg",
                                "title": "欢迎来到时光工作室",
                                "description": "记录生活中的美好瞬间"
                            },
                            {
                                "url": "/assets/Cover/2.jpg",
                                "title": "摄影作品集",
                                "description": "用镜头捕捉世界的精彩"
                            },
                            {
                                "url": "/assets/Cover/3.jpg",
                                "title": "摄影作品集",
                                "description": "用镜头捕捉世界的精彩"
                            },
                            {
                                "url": "/assets/20200212-e056a5f2914d6.gif",
                                "title": "创意无限",
                                "description": "探索视觉艺术的无限可能"
                            }
                        ],
                        "site_title": "时光工作室",
                        "site_desc": "记录生活中的美好瞬间"
                    }
                )
                return default_setting
            raise e

    async def update(
        self, id: int, obj_in: Union[SettingUpdate, SettingUpdateMeta, SettingUpdateGeneral, SettingUpdateContent, SettingUpdateStorage, SettingUpdateDatabase, Dict[str, Any]]
    ) -> Setting:
        print(f"[DEBUG] 接收到的obj_in类型: {type(obj_in)}")
        print(f"[DEBUG] 接收到的obj_in内容: {obj_in}")
        
        if isinstance(obj_in, Dict):
            obj_dict = obj_in
        else:
            # 使用update_dict方法来获取正确的更新数据
            obj_dict = obj_in.update_dict() if hasattr(obj_in, 'update_dict') else obj_in.model_dump(exclude_unset=True)
        
        print(f"[DEBUG] 处理后的obj_dict: {obj_dict}")
        
        obj = await self.get(id=id)
        print(f"[DEBUG] 更新前的obj.meta: {obj.meta}")
        
        # 对于JSON字段（meta, general, content, storage, database），进行合并更新而不是直接替换
        for key, value in obj_dict.items():
            if key in ['meta', 'general', 'content', 'storage', 'database'] and value is not None:
                # 获取当前字段值，如果为None则初始化为空字典
                current_value = getattr(obj, key) or {}
                # 合并新值到现有值中
                if isinstance(current_value, dict) and isinstance(value, dict):
                    merged_value = {**current_value, **value}
                    print(f"[DEBUG] 合并字段 {key}: {current_value} + {value} = {merged_value}")
                    setattr(obj, key, merged_value)
                else:
                    print(f"[DEBUG] 直接设置字段 {key} = {value}")
                    setattr(obj, key, value)
            else:
                print(f"[DEBUG] 设置字段 {key} = {value}")
                setattr(obj, key, value)
        
        print(f"[DEBUG] 更新后的obj.meta: {obj.meta}")
        await obj.save()
        print(f"[DEBUG] 保存后的obj.meta: {obj.meta}")
        return obj

setting_controller = SettingController()
