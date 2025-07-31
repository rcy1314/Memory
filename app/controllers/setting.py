from typing import Optional, Union, Dict, Any

from app.core.crud import CRUDBase
from app.models.admin import Setting
from app.schemas.setting import SettingCreate, SettingUpdate, SettingUpdateMeta, SettingUpdateGeneral, SettingUpdateContent, SettingUpdateStorage


class SettingController(CRUDBase[Setting, SettingCreate, SettingUpdate]):
    def __init__(self):
        super().__init__(model=Setting)

    async def create(self, obj_in: SettingCreate) -> Setting:
        obj = await super().create(obj_in.create_dict())
        return obj

    async def update(
        self, id: int, obj_in: Union[SettingUpdate, SettingUpdateMeta, SettingUpdateGeneral, SettingUpdateContent, SettingUpdateStorage, Dict[str, Any]]
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
        
        # 对于JSON字段（meta, general, content, storage），进行合并更新而不是直接替换
        for key, value in obj_dict.items():
            if key in ['meta', 'general', 'content', 'storage'] and value is not None:
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
