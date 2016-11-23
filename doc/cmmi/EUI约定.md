<ID> 需要对控件id做大驼峰法 例如 Btn0
<id> 原始控件id 例如 btn0

Component
_on<ID>Clicked 点击的动作

DataGroup (List, TabBar)
_on<ID>ItemClicked 条目点击的处理 (ItemInfo)=>void
_on<ID>SelectionChanged 选中已经变化 ()=>void
_on<ID>SelectionChanging 正在变化 (SelectionInfo)=>void
_<id>ItemRenderer 绑定条目的视图
_<id>RendererForData 指定该数据特殊使用的视图

