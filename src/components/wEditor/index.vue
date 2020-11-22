<template>
  <div class="container">
    <div id="editor"></div>
  </div>
</template>

<script>
import moment from "moment";
import E from "wangeditor";
export default {
  // props: { date: String },
  data() {
    return {};
  },
  mounted() {
    this.initTime();
    const editor = new E("#editor");

    const { $, BtnMenu, DropListMenu, PanelMenu, DropList, Panel, Tooltip } = E;
    const _this = this;
    class callBack extends BtnMenu {
      constructor(editor) {
        const $elem = E.$(
          `<div class="w-e-menu">
                <i class="iconfont icon-left" style="font-size:20px;font-weight:600"></i>
            </div>`
        );
        super($elem, editor);
      }
      // 菜单点击事件
      clickHandler() {
        _this.$emit("changeComponent", "edit");
        // console.log(editor.txt.html());
      }

      tryChangeActive() {}
    }

    editor.menus.extend("callBack", callBack);

    editor.config.height = window.innerHeight - 42 - 58;

    editor.config.menus = [
      "callBack",
      "head",
      "bold",
      "fontSize",
      "fontName",
      "italic",
      "underline",
      "strikeThrough",
      "lineHeight",
      "foreColor",
      "backColor",
      "link",
      "list",
      "justify",
      "quote",
      "emoticon",
      "image",
      "table",
      "splitLine",
      "undo",
      "redo"
    ];
    editor.config.focus = true;
    editor.create();
    console.log("date", this.date);
    editor.txt.html(
      `<p><span data-v-1f116c67=""><font data-v-1f116c67="" color="#f9963b">日期：⏰</font><font data-v-1f116c67="" color="#46acc8">${this.datemat}</font><font data-v-1f116c67="" color="#f9963b">&nbsp; &nbsp; &nbsp; &nbsp; 时间：🌙&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;天气：🌈&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;心情：😀&nbsp; &nbsp; &nbsp; &nbsp; 运动：🚴‍♂️&nbsp; &nbsp; &nbsp; &nbsp;&nbsp;</font></span></p><p><span data-v-1f116c67=""><font data-v-1f116c67="" color="#f9963b"></font></span></p><hr><p>&nbsp; &nbsp; 👌记录美好生活... ...<br></p>`
    );
  },
  methods: {
    initTime() {
      //初始化moment
      moment.locale("zh-cn");
      this.date = moment();
    }
  },
  computed: {
    datemat() {
      let date = this.date;
      return moment(date).format("YYYY-MM-DD - dddd");
    }
  }
};
</script>

<style lang="less" scoped>
@import url("http://at.alicdn.com/t/font_1973725_0hofvwd6neca.css");
.container {
  width: 100%;
  // display: flex;
  // justify-content: center;
  #editor {
    width: 100%;
  }
}
</style>