# 关于think
1. think是一款集todolist、笔记本、日记本等功能于一体的一款复合学习应用。可用于规划时间、记录笔记、撰写日记。
2. 该项目以vue2.x为框架，使用@vue/cli 4.x搭建，并使用vue-router处理路由，使用vuex处理跨模块的共享数据，使用less处理css样式。

# 关于todolist
1. 工具栏：左右切换日期按钮（或键盘左右键），回到当前日期按钮，删除模式按钮，切换便签按钮（或键盘下键），右侧为状态栏。
2. 输入框：添加代办事项时可以选择红橙蓝三个等级，默认为红色。选择了等级后下次再添加时，为上次选择的等级。
3. 列表区：左侧为代办事项，右侧为已完成事项，通过鼠标切换状态，可通过日期按钮切换不同日期的数据并进行修改。
4. 便签区：瀑布流布局，可用于记录临时事项。

# think笔记
1. think笔记分为学习、工作和生活三个项，每个项本分为全部、收藏和回收站三个分类。
2. 每个笔记通过动态路由动态向后端获取数据，鼠标移至笔记上时，出现编辑按钮，可以对笔记内容进行增删改查操作。
3. markdown编辑器：记录笔记需使用markdown语法（或者使用编辑器工具栏）。其中主要用到了codemirror，highlight,marked三个js库。
支持，加粗、斜体、标题、删除线、无序和有序列表、代办、引用、代码块、图片、表格、分割线等功能，并且对先选中文本再点击按钮和先点击按钮再输入文本两种方式进行了处理。
默认分为左右屏，支持实时渲染和同步滚动，也可切换全屏显示或全屏编辑模式。编辑区支持更换主题，显示区支持代码块高亮。目录自动生成，并且支持点击跳转，目录和帮助选项可按需开启。性能模式开启后，右屏显示渲染时会经过防抖处理，以获得更好的性能。

# think日记
1. 工具栏：添加日记本
2. 日记本：可更换封面和删除日记本，日记标题和副标题可修改。
3. 编辑器：依赖wangeditor编辑器插件，支持正常的文本操作功能。
4. 一些功能和样式尚未开发完成。

