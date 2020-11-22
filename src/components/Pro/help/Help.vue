<template>
  <div class="help">
    <h2>markdown语法</h2>
    <div>
      <span class="bold">加粗</span> :
      <span class="bold">**B**</span>
    </div>
    <div>
      <span class="bold">斜体</span> :
      <span style="font-style:italic">*I*</span>
    </div>
    <div>
      <span class="bold">标题</span> :
      <span style="font-weight:bolder;font-size:19px"># H1</span> 、
      <span class="bold">## H2</span> 、
      <span style="font-size:14px">### H3</span>
    </div>
    <div>
      <span class="bold">删除线</span> :
      ~~
      <span style="text-decoration: line-through">SSS</span>
      ~~
    </div>
    <div>
      <span class="bold">引用</span> :
      > 引用文本
    </div>
    <div>
      <span class="bold">超链接</span> :
      [link](href)
    </div>
    <div>
      <span class="bold">图片</span> :
      ![image](imgUrl)
    </div>
    <div>
      <span class="bold">删除线</span> :
      ----
    </div>
    <div>
      <span class="bold">列表</span> :
      <ul>
        <li>- 项目</li>
        <li style="padding-left:8px">* 项目</li>
        <li style="padding-left:16px">+ 项目</li>
      </ul>
      <ul>
        <li>1. 项目1</li>
        <li>2. 项目2</li>
        <li>3. 项目3</li>
      </ul>
      <ul>
        <li>- [ ] 计划任务</li>
        <li>- [x] 完成任务</li>
      </ul>
    </div>
    <div>
      <span class="bold">代码块</span>
      <ul>
        <li>```javascript</li>
        <li style="padding:10px"></li>
        <li>```</li>
      </ul>
    </div>
    <div>
      <span class="bold">表格</span>
      <ul>
        <li>title | title</li>
        <li>---|---</li>
        <li>value | value</li>
        <li>value | value</li>
      </ul>
      <ul>
        <li>| col1 | col2 | col3 |</li>
        <li>|:-------|:------:| -------:|</li>
        <li>|文本居左| 文本居中 | 文本居右 |</li>
      </ul>
    </div>
    <div>
      <span class="bold">分屏模式</span> :
      左屏为编辑区，右屏为显示区
    </div>
    <div>
      <span class="bold">预览模式</span> :
      全屏显示区
    </div>
    <div>
      <span class="bold">编辑模式</span> :
      全屏编辑区
    </div>
    <div>
      <span class="bold">主题</span> :
      更换编辑器主题
    </div>
    <div>
      <span class="bold">同步滚动</span> :
      左屏和右屏同步滚动
    </div>
    <div>
      <span class="bold">性能模式</span> :
      当文本过多，编辑器出现卡顿时开启，关闭同步渲染，以获得更好的操作体验
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  mounted() {},
  methods: {}
};
</script>

<style lang='less'>
.help {
  box-sizing: border-box;
  font-family: "Helvetica Neue", Arial, "Hiragino Sans GB", "STHeiti",
    "Microsoft YaHei", "WenQuanYi Micro Hei", SimSun, Song, sans-serif;
  width: 20vw;
  height: calc(100vh - 55px);
  border-left: 1px solid #ddd;
  background-color: #f5f6f7;
  overflow: auto;
  padding-left: 20px;
  color: #4f4f4f;

  h2 {
    font-size: 22px;
  }
  div {
    padding: 5px 0;
  }
  li {
    list-style-type: none;
  }
  .bold {
    font-weight: bold;
  }
  &::-webkit-scrollbar {
    width: 7px;
    height: 10px;
  }
  /* 滚动条的轨道 */
  &::-webkit-scrollbar-track {
    /* background: rgb(239, 239, 239); */
    border-radius: 2px;
  }
  /* 滚动条里面的小方块 */
  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #bbb;
  }
}
</style>