<template>
  <div class="r-container" ref="rCode">
    <div class="code-content" ref="codeContent" v-html="hStr"></div>
  </div>
</template>

<script>
import marked from "../assets/marked"; //markdown格式的字符串转化为对应的标签
import hljs from "../assets/highlight.js"; //高亮代码块

import "../assets/highlight.js/styles/gruvbox-light.css"; //高亮的主题

export default {
  props: { RightTop: Number }, //RightTop：滚动条滑块距离顶部的距离
  data() {
    return {
      mStr: "", //markedown字符串
      hStr: "", //mared转化后的元素字符串
      hCodeList: [], //code元素数组
      timer: null, //函数防抖时储存的计时器
      isde: false //性能模式,是否启用函数防抖
      // RscrollHeight: null,
    };
  },
  mounted() {
    this.initMark();
    this.getMstr();
    this.defaultRander();
    this.setDebounce();
  },
  methods: {
    getMstr() {
      //接收Left传过来的mStr
      this.$bus.$on("getMstr", data => {
        this.mStr = data;
      });
    },

    initMark() {
      //初始化marked配置
      const renderer = new marked.Renderer();
      renderer.heading = (text, level) => {
        //给h标签加目录跳转的id
        //这里要把id里的字符串中间的空格去掉，不然id会有bug，相应的，要把对应a标签的href值去掉中间的空格
        return `<h${level} id=${text.replace(
          /\s*/g,
          ""
        )}>${text}</h${level}>\n`;
      };
      //设置marked配置
      marked.setOptions({
        renderer,
        gfm: true,
        tables: true,
        breaks: true,
        pedantic: false,
        sanitize: false,
        smartLists: true
      });
    },
    //与下一函数配合，防止页面上的code元素还没渲染完，就获取code元素数组，导致怪异渲染
    async markeding() {
      this.hStr = marked(this.mStr); //将markdown字符串转化为标签
      this.$bus.$emit("getHstr", this.hStr); //将markdown转换后的元素字符串传给目录组件
      return;
    },
    //默认渲染
    async defaultRander() {
      await this.markeding();
      this.randenHtml();
    },
    //防抖渲染
    debounceRander() {
      this.debounce(() => {
        this.defaultRander();
      }, 1000);
    },
    //获取code元素数组，进行代码块高亮
    randenHtml() {
      this.hCodeList = this.$refs.codeContent.querySelectorAll("pre code");
      this.hCodeList.forEach(code => {
        hljs.highlightBlock(code);
      });
    },
    //函数防抖
    debounce(callback, time) {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        callback();
        this.timer = null;
      }, time);
    },
    setDebounce() {
      //由工具栏触发
      //是否启用函数防抖，在监听器判断是用普通渲染还是防抖渲染
      this.$bus.$on("debounce", () => {
        this.isde = !this.isde;
      });
    }
  },
  watch: {
    mStr() {
      this.isde ? this.debounceRander() : this.defaultRander();
    }
  }
};
</script>

<style lang='less'>
.r-container {
  font-family: "Helvetica Neue", Arial, "Hiragino Sans GB", "STHeiti",
    "Microsoft YaHei", "WenQuanYi Micro Hei", SimSun, Song, sans-serif;
  font-size: 15px;
  width: 40vw;
  height: calc(100vh - 55px);
  overflow: auto;
  box-sizing: border-box;
  padding: 14px 20px;
  color: #4f4f4f;
  flex-grow: 1;
  background-color: #fff;

  /*修改滚动条样式*/
  /* 滚动条整体部分 */
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
  /* 横竖两条滚动条的交汇处 */
  /* &::-webkit-scrollbar-corner {
} */
  .code-content {
    max-width: 900px;
    margin: auto;
  }
  h1 {
    font-size: 28px;
  }
  h2 {
    font-size: 24px;
  }
  h3 {
    font-size: 20px;
  }
  h4 {
    font-size: 18px;
  }
  h5 {
    font-size: 16px;
  }
  h6 {
    font-size: 15px;
  }
  p {
    margin-bottom: 16px;
    padding: 0;
    line-height: 1.6;
    letter-spacing: 1.1px;
  }
  kbd {
    font-family: code;
    font-size: 13px;
    padding: 2px 8px;
    border: 1px solid rgba(63, 63, 63, 0.25);
    box-shadow: 0 1px 0 rgba(63, 63, 63, 0.25);
    background-color: #fff;
    color: #333;
    border-radius: 4px;
    display: inline-block;
    margin: 0 2px;
    white-space: nowrap;
  }
  code {
    font-family: Consolas;
    font-size: 15px;
    color: #c7254e;
    background-color: #f9f2f4;
    border-radius: 2px;
    padding: 0 5px;
    line-height: 1.6;
  }
  a {
    color: #4ea1db;
    text-decoration: none;
    overflow-wrap: break-word;
  }
  a:hover {
    color: #c7254e;
  }
  blockquote {
    display: block;
    padding: 0 16px;
    margin: 0 0 24px;
    border-left: 8px solid #dddfe4;
    background: #eef0f4;
    overflow: auto;
    word-break: break-word !important;
  }
  table {
    border-collapse: collapse;
    display: table;
    width: 100%;
    text-align: center;
    margin-bottom: 24px;
  }
  table tr {
    border: 0;
    border-top: 1px solid #ddd;
    background-color: #fff;
  }
  table tr th {
    font-weight: 700;
    background-color: #eff3f5;
  }
  table tr td,
  table tr th {
    font-size: 14px;
    color: #4f4f4f;
    line-height: 22px;
    border: 1px solid #ddd;
    padding: 8px;
    word-break: normal !important;
    vertical-align: middle;
  }
  img {
    width: 100%;
    height: 100%;
  }
  .hljs {
    background-color: #f5f5f5;
    color: #4f4f4f;
    padding: 15px 10px;
  }
  li {
    line-height: 1.6;
  }
  .hljs-tag {
    font-weight: normal;
  }
  .language-mermaid {
    display: block;
    color: #4f4f4f;
    padding: 15px 10px;
    background-color: #f6f6f6;
  }
  .file h1 {
    font-size: 15px;
  }
}
</style>
