<template>
  <div class="l-container" ref="lCode">
    <textarea class="form-control" ref="code"></textarea>
  </div>
</template>
<script>
import CodeMirror from "../assets/codemirror"; //引入codemirror和需要其支持高亮的语法包
import "./theme/codemirror.css";
import "../assets/codemirror/mode/markdown/markdown"; //需要高亮的语言

import "../assets/codemirror/addon/scroll/simplescrollbars.css"; //滚动条样式
import "../assets/codemirror/addon/scroll/simplescrollbars.js"; //滚动条行为

//主题，默认default
import "./theme/monokai.css";
import "./theme/dark.css";

export default {
  mounted() {
    // 创建和初始化编辑区
    this.initEditor();

    //内容改变时，更新mStr的值,得到光标位置
    this.CodeMirrorEditor.on("change", () => {
      this.mStr = this.CodeMirrorEditor.getValue();
      this.lastPos = this.CodeMirrorEditor.getCursor();
    });
    //聚焦时改变聚焦状态，得到光标的位置
    this.CodeMirrorEditor.on("focus", () => {
      this.lastPos = this.CodeMirrorEditor.getCursor();
      this.isFocus = true;
    });
    //当内容或光标改变时触发
    this.CodeMirrorEditor.on("cursorActivity", () => {
      this.lastPos = this.CodeMirrorEditor.getCursor();
    });
    //失焦改变聚焦状态
    this.CodeMirrorEditor.on("blur", () => {
      this.isFocus = false;
    });

    this.getEditor();
    this.getMstr();
    this.getLastPos();
    this.changeTheme();
    this.randValue();
    this.setInitMStr();
  },
  props: { random: String, initMStr: String }, //random:传递过来的是'break','left','catalog'
  data() {
    return {
      mStr: "",
      CodeMirrorEditor: null,
      lastPos: null, //光标最后所在位置
      isFocus: false, //是否聚焦
      theme: "monokai" //主题
    };
  },
  methods: {
    initEditor() {
      //初始化codemirror
      this.CodeMirrorEditor = CodeMirror.fromTextArea(this.$refs.code, {
        value: this.mStr,
        tabSize: 4,
        styleActiveLine: true,
        lineNumbers: false,
        lineWrapping: true,
        scrollbarStyle: "overlay",
        line: true,
        mode: "markdown",
        theme: this.theme,
        cursorHeight: 0.8,
        lineWiseCopyCut: true,
        autofocus: true //初始化时自动获取焦点
      });
    },
    getMstr() {
      //将mStr输送给Right
      this.$bus.$emit("getMstr", this.mStr);
    },
    getEditor() {
      //将codemirror实例传递给Toolbar
      this.$bus.$emit("getEditor", this.CodeMirrorEditor);
    },
    getLastPos() {
      //将codemirror的光标位置和是否聚焦传递给Toolbar
      this.$bus.$emit("getLastPos", {
        lastPos: this.lastPos,
        isFocus: this.isFocus
      });
    },
    changeTheme() {
      //接收Toolbar传递过来的主题，并进行设置
      this.$bus.$on("theme", theme => {
        this.theme = theme;
        this.CodeMirrorEditor.setOption("theme", theme);
      });
    },
    randValue() {
      //编辑模式时重新渲染value，因为尺寸变化，内容和光标在显示上会出现bug
      // this.CodeMirrorEditor.setValue(this.mStr);
      // this.CodeMirrorEditor.lineCount();//得到行数
      this.CodeMirrorEditor.setSize("100%", null);
    },
    setInitMStr() {
      //设置初始的mStr的值
      this.mStr = this.initMStr;
      this.CodeMirrorEditor.setValue(this.initMStr);
    }
  },
  watch: {
    mStr() {
      this.getMstr();
    },
    lastPos() {
      this.getLastPos();
    },
    random() {
      this.randValue();
    },
    initMStr() {
      this.setInitMStr();
    }
  }
};
</script>

<style lang="less">
@mainBgColor: #f5f6f7;
.l-container {
  width: 40vw;
  height: calc(100vh - 55px);
  flex-grow: 1;
  background-color: @mainBgColor;
  .CodeMirror {
    background-color: @mainBgColor;
  }
  .CodeMirror-sizer {
    max-width: 900px;
    margin: auto !important;
    overflow: hidden;
  }
}
</style>