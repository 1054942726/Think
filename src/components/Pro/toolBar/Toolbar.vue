<template>
  <div class="toolBar">
    <div class="back" @click="back">
      <i class="iconfont icon-left"></i>
    </div>
    <ul class="wordTool">
      <li
        v-for="item in toolList"
        :key="item.title"
        :title="item.title"
        :class="item.class"
        @click="item.event"
      >
        <i :class="['iconfont',item.icon ]"></i>
        <span>{{item.title}}</span>
        <ul v-if="item.children">
          <li v-for="child in item.children" :key="child.id" @click="child.event">
            {{child.title?child.title:null}}
            <i v-if="child.icon" :class="['iconfont',child.icon]"></i>
          </li>
        </ul>
      </li>
    </ul>
    <ul class="editorTool">
      <li title="分屏模式" @click="changeModel('break')">
        <i
          class="iconfont icon-icon-test"
          :style="activeIcon==='break'?{color:'#ff2b43'}:{color:'#4f4f4f'}"
        ></i>
        <span>分屏</span>
      </li>
      <li title="预览模式" @click="changeModel('right')">
        <i
          class="iconfont icon-eye"
          :style="activeIcon==='right'?{color:'#ff2b43'}:{color:'#4f4f4f'}"
        ></i>
        <span>预览</span>
      </li>
      <li @click="changeModel('left')">
        <i
          class="iconfont icon-edit-square"
          :style="activeIcon==='left'?{color:'#ff2b43'}:{color:'#4f4f4f'}"
        ></i>
        <span>编辑</span>
      </li>
      <li class="theme">
        <i class="iconfont icon-zhuti"></i>
        <span>主题</span>
        <ul>
          <li @click="$bus.$emit('theme','default')">default</li>
          <li @click="$bus.$emit('theme','monokai')">monokai</li>
          <li @click="$bus.$emit('theme','dark')">dark</li>
        </ul>
      </li>
      <li @click="changeTG">
        <i class="iconfont icon-pause" :style="tgActive?{color:'#ff2b43'}:{color:'#4f4f4f'}"></i>
        <span>同步滚动</span>
      </li>
      <li @click="changeDebounce">
        <i class="iconfont icon-thunderbolt" :style="deActive?{color:'#ff2b43'}:{color:'#4f4f4f'}"></i>
        <span>性能模式</span>
      </li>
    </ul>
    <div class="textTile">
      <input type="text" placeholder="请输入文章标题" v-model="title" />
      <button>保存文章</button>
    </div>
    <ul class="last">
      <li @click="changeCatalog">
        <i class="iconfont icon-book" :style="caActive?{color:'#ff2b43'}:{color:'#4f4f4f'}"></i>
        <span>目录</span>
      </li>
      <li @click="changeHelp">
        <i
          class="iconfont icon-question-circle"
          :style="heActive?{color:'#ff2b43'}:{color:'#4f4f4f'}"
        ></i>
        <span>帮助</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  mounted() {
    this.getEditor();
    this.getLastPos();
    this.setTitle();
  },
  //textTitle：文章标题
  props: { activeIcon: String, textTitle: String },
  data() {
    return {
      CodeMirrorEditor: null, //codeMirror实例
      lastPos: null, //光标最后所在位置
      isFocus: false, //是否聚焦
      deActive: false, //高亮性能模式按钮
      caActive: false, //高亮目录按钮
      heActive: false, //高亮帮助按钮
      tgActive: true, //同步滚动按钮高亮
      title: "", //文章标题
      toolList: [
        {
          event: () => {
            this.insertDouble("**");
          },
          title: "加粗",
          icon: "icon-bold",
          class: "",
          children: undefined
        },
        {
          event: () => {
            this.insertDouble("*");
          },
          title: "斜体",
          icon: "icon-italic",
          class: "",
          children: undefined
        },
        {
          event: () => {
            return;
          },
          title: "标题",
          icon: "icon-biaotizhengwenqiehuan",
          class: "title",
          children: [
            {
              id: "title-1",
              event: () => {
                this.insertTitle(1);
              },
              title: "H1",
              icon: undefined
            },
            {
              id: "title-2",
              event: () => {
                this.insertTitle(2);
              },
              title: "H2",
              icon: undefined
            },
            {
              id: "title-3",
              event: () => {
                this.insertTitle(3);
              },
              title: "H3",
              icon: undefined
            }
          ]
        },
        {
          event: () => {
            this.insertDouble("~~");
          },
          title: "删除线",
          icon: "icon-strikethrough",
          class: "",
          children: undefined
        },
        {
          event: () => {
            this.insertInt("-  ");
          },
          title: "无序",
          icon: "icon-unorderedlist",
          class: "",
          children: undefined
        },
        {
          event: () => {
            this.insertInt("1. ");
          },
          title: "有序",
          icon: "icon-orderedlist",
          class: "",
          children: undefined
        },
        {
          event: () => {
            return;
          },
          title: "待办",
          icon: "icon-calendar-check",
          class: "todo",
          children: [
            {
              id: "todo-1",
              event: () => {
                this.insertInt("- [x] ");
              },
              title: undefined,
              icon: "icon-check-square"
            },
            {
              id: "todo-2",
              event: () => {
                this.insertInt("- [ ] ");
              },
              title: undefined,
              icon: "icon-border"
            }
          ]
        },
        {
          event: () => {
            this.insertInt(">  ");
          },
          title: "引用",
          icon: "icon-yinyong",
          class: "",
          children: undefined
        },
        {
          event: this.insertCode,
          title: "代码块",
          icon: "icon-code",
          class: "",
          children: undefined
        },
        {
          event: this.insertImage,
          title: "图片",
          icon: "icon-image",
          class: "",
          children: undefined
        },
        {
          event: this.insertTable,
          title: "表格",
          icon: "icon-table",
          class: "",
          children: undefined
        },
        {
          event: this.insertLink,
          title: "超链接",
          icon: "icon-link",
          class: "",
          children: undefined
        },
        {
          event: this.insertLine,
          title: "分割线",
          icon: "icon-dash",
          class: "",
          children: undefined
        }
      ]
    };
  },
  methods: {
    back() {
      //返回
      this.$router.go(-1);
      return;
    },
    setTitle() {
      //如果父元素传来初始标题
      //设置文章标题
      this.title = this.textTitle;
    },
    getEditor() {
      //从Left得到编辑器
      this.$bus.$on("getEditor", data => {
        this.CodeMirrorEditor = data;
      });
    },
    getLastPos() {
      //从Left得到光标位置和是否聚焦
      this.$bus.$on("getLastPos", data => {
        this.lastPos = data.lastPos;
        this.isFocus = data.isFocus;
      });
    },
    //插入文本，使用工具栏的快捷键时，插入相应的markdown语句符号
    insertContent(str) {
      this.CodeMirrorEditor.replaceSelection(str);
    },
    // 设置焦点,插入相应的markdown语句符号后设置焦点
    setCursor(line = 0, ch = 0) {
      const { CodeMirrorEditor: editor } = this;
      editor.setCursor(line, ch);
      editor.focus();
    },
    //粗体、斜体、删除线
    insertDouble(tag) {
      if (!this.isFocus) {
        return;
      }
      const { CodeMirrorEditor: editor, lastPos = {} } = this;
      const { line = 0, ch = 0 } = lastPos;
      if (editor != null) {
        const selection = editor.getSelection(); //选中的文本
        if (selection) {
          this.insertContent(tag + selection + tag);
          this.setCursor(line, ch + selection.length + tag.length);
        } else {
          this.insertContent(tag + tag);
          this.setCursor(line, ch + tag.length);
        }
      }
    },
    //引用、无序列表、有序列表、未完成列表、已完成列表
    insertInt(tag) {
      if (!this.isFocus) {
        return;
      }
      const { CodeMirrorEditor: editor, lastPos = {} } = this;
      const { line = 0, ch = 0 } = lastPos;
      if (editor != null) {
        const selection = editor.getSelection();
        if (selection) {
          this.insertContent(tag + selection + "\n\n");
          this.setCursor(line, ch + selection.length + tag.length);
        } else {
          this.insertContent(tag);
          this.setCursor(line, ch + tag.length);
        }
      }
    },
    // 插入code
    insertCode() {
      if (!this.isFocus) {
        return;
      }
      const { CodeMirrorEditor: editor, lastPos = {} } = this;
      const { line = 0, ch = 0 } = lastPos;
      if (editor != null) {
        const selection = editor.getSelection();
        if (selection) {
          this.insertContent("```javascript\n" + selection + "\n```");
        } else {
          this.insertContent("```javascript\n\n```");
          this.setCursor(line + 1, 0);
        }
      }
    },
    // 插入分割线
    insertLine() {
      if (!this.isFocus) {
        return;
      }
      const { CodeMirrorEditor: editor, lastPos = {} } = this;
      const { line = 0, ch = 0 } = lastPos;
      if (editor != null) {
        if (editor.isClean()) {
          this.insertContent("----\n");
          this.setCursor(line + 1, 0);
        } else {
          this.insertContent("\n----\n");
          this.setCursor(line + 2, 0);
        }
      }
    },
    // 插入链接
    insertLink() {
      if (!this.isFocus) {
        return;
      }
      this.insertContent("\n[link](href)");
    },
    // 插入图片
    insertImage() {
      if (!this.isFocus) {
        return;
      }
      this.insertContent("\n![image](imgUrl)");
    },
    // 插入表格
    insertTable() {
      if (!this.isFocus) {
        return;
      }
      const { CodeMirrorEditor: editor, lastPos = {} } = this;
      const { line = 0, ch = 0 } = lastPos;
      this.insertContent(
        "\ntitle | title \n---|---\nvalue | value\nvalue | value\n\n"
      );
      this.setCursor(line + 1, 0);
    },
    // 插入标题
    insertTitle(level) {
      if (!this.isFocus) {
        return;
      }
      const titles = {
        1: "#  ",
        2: "##  ",
        3: "###  ",
        4: "####  ",
        5: "#####  ",
        6: "######  "
      };
      const { CodeMirrorEditor: editor, lastPos = {} } = this;
      const { line = 0, ch = 0 } = lastPos;
      if (editor != null) {
        const selection = editor.getSelection();
        if (selection) {
          this.insertContent(titles[level] + selection + "\n");
          this.setCursor(line, titles[level].length + selection.length);
        } else {
          const title = titles[level];
          this.insertContent(title);
          this.setCursor(line, ch + title.length);
        }
      }
    },

    changeModel(model) {
      //改变模式，分屏，预览，编辑
      this.$emit("model", model); //在Pro被监听
    },
    changeDebounce() {
      //设置性能模式，改变按钮高亮
      this.$bus.$emit("debounce");
      this.deActive = !this.deActive;
    },
    changeCatalog() {
      //设置目录，改变按钮高亮
      this.$emit("catalog");
      this.caActive = !this.caActive;
      this.heActive = false;
    },
    changeHelp() {
      this.$emit("help");
      this.heActive = !this.heActive;
      this.caActive = false;
    },
    changeTG() {
      //设置同步滚动，改变按钮高亮
      this.$emit("changeTG");
      this.tgActive = !this.tgActive;
    }
  },
  watch: {
    textTitle() {
      this.setTitle();
    }
  }
};
</script>

<style lang='less' scoped>
@import url("http://at.alicdn.com/t/font_1973725_xeqock05o0g.css");
.toolBar {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  width: 100vw;
  height: 50px;
  border-bottom: 1px solid #ccc;
  font-family: "Helvetica Neue", Arial, "Hiragino Sans GB", "STHeiti",
    "Microsoft YaHei", "WenQuanYi Micro Hei", SimSun, Song, sans-serif;
  align-items: center;
  background-color: #fff;

  ul,
  li {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }

  > ul {
    width: 580px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &::before,
    &::after {
      content: "";
      display: block;
      height: 30px;
      border-left: 1px solid #ccc;
      margin: 15px;
    }

    > li {
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      text-align: center;
      cursor: pointer;
      padding: 8px 0;
      &:hover {
        background-color: #eee;
        > i {
          color: #73c9e5;
        }
      }
    }
  }

  li {
    i {
      width: 100%;
      font-size: 17px;
      color: #4f4f4f;
      margin-bottom: 3px;
    }
  }
  li span {
    font-size: 10px;
  }
  .icon-shipin {
    font-weight: bold;
  }

  .title,
  .todo,
  .theme {
    position: relative;

    ul {
      position: absolute;
      left: -2px;
      top: 50px;
      background-color: #fff;
      border: 1px solid #ccc;
      border-radius: 2px;
      display: none;
      z-index: 10;
      &::before,
      &::after {
        font-size: 0px;
        content: "";
        display: block;
        width: 0;
        height: 0;
        border: 8px solid rgba(0, 0, 0, 0);
        position: absolute;
      }
      &::before {
        border-bottom: 8px solid #ccc;
        top: -17px;
        left: 12px;
      }
      &::after {
        border-bottom: 8px solid #fff;
        top: -15px;
        left: 12px;
      }

      li {
        padding: 10px 10px;

        &:hover {
          background-color: #eee;
          color: #ff2b43;
          i {
            color: #ff2b43;
          }
        }
        i {
          font-size: 20px;
        }
      }
    }

    &:hover ul {
      display: block;
      box-shadow: 1px 1px 5px #bbb;
    }
  }

  .back {
    cursor: pointer;
    padding: 10px 0;
    color: #73c9e5;

    i {
      font-size: 22px;
      margin-left: 15px;
    }

    &:hover i {
      color: #ff2b43;
    }
  }

  .editorTool {
    width: 284px;

    &::before {
      // 去掉ul的边框
      display: none;
    }
  }

  .textTile {
    min-width: 380px;
    input {
      box-sizing: border-box;
      color: #4f4f4f;
      height: 28px;
      width: 280px;
      padding: 8px;
      font-size: 14px;
      outline: none;
      border: 1px solid #ccc;
      border-radius: 4px;
      background-color: #fafbfc;
    }
    button {
      box-sizing: border-box;
      height: 28px;
      padding: 0 16px;
      margin-left: 10px;
      font-size: 14px;
      color: #73c9e5;
      outline: none;
      border: 1px solid #73c9e5;
      border-radius: 4px;
      white-space: nowrap;
      background-color: #fff;
      cursor: pointer;
      vertical-align: bottom;

      &:hover {
        color: #ff2b43;
        border: 1px solid #ff2b43;
      }
    }
  }

  .last {
    width: 140px;
  }
}
</style>