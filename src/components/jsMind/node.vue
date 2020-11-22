<template>
  <div
    :class="['node',{active:config.isActive},{rank1:config.rank==1},{rank2:config.rank==2},{rank3:config.rank>2}]"
    :contenteditable="editable"
    :style="[{top:config.top,left:config.left,'z-index':config.zIndex}]"
    @click="$emit('setSelect',index);"
    @dblclick="editText($event)"
    @blur="editBlur($event)"
    @input="changeText($event)"
  >{{config.index}}</div>
</template>

<script>
export default {
  props: { config: Object },
  data() {
    return {
      editable: "false", //是否在编辑文本
      center: {}, //中心节点的位置对象
      oldText: this.config.text,
      newText: this.config.text,
      index: this.config.index
    };
  },
  mounted() {
    // console.log("moutend", this.$el.offsetHeight);
    if (this.config.rank === 1) {
      //得到根节点的数字位置
      this.config.left = this.$el.getBoundingClientRect().left + "px";
      this.config.top = this.$el.getBoundingClientRect().top + "px";
      this.center.left = document.documentElement.clientWidth / 2;
      this.center.top = document.documentElement.clientHeight / 2;
    }
    this.config.height = this.$el.getBoundingClientRect().height;
    this.config.width = this.$el.getBoundingClientRect().width;
  },
  methods: {
    setPosition(e) {
      if (this.config.rank === 1) {
        if (this.newText != this.oldText) {
          //   this.config.left = this.center.left - e.target.offsetWidth / 2 + "px";
          //   this.config.top = this.center.top - e.target.offsetHeight / 2 + "px";
        }
      }
      if (this.newText != this.oldText) {
        //   this.config.height = this.$el.getBoundingClientRect().height;
        this.config.width = this.$el.getBoundingClientRect().width;
      }

      this.$emit("repaintNode", this.config.index);
    },
    editText() {
      this.editable = "true";
      this.$emit("inEdit"); //编辑时按回车不添加节点
      //处理双击全选
      setTimeout(() => {
        if (document.selection) {
          var range = document.body.createTextRange();
          range.moveToElementText(this.$el);
          range.select();
        } else if (window.getSelection) {
          var range = document.createRange();
          range.selectNodeContents(this.$el);
          window.getSelection().removeAllRanges();
          window.getSelection().addRange(range);
        }
      });
    },
    editBlur(e) {
      this.setPosition(e);
      this.editable = "false";
      this.$emit("inEdit");
      this.config.text = this.$el.innerText;
    },
    changeText(e) {
      this.newText = this.$el.innerText;
    }
  },
  watch: {
    newText(newVal, oldVal) {
      this.newText = newVal;
      this.oldText = oldVal;
    }
  }
};
</script>

<style lang="less" scoped>
.node {
  position: absolute;

  outline: none;
  -moz-user-select: none; /*火狐*/
  -webkit-user-select: none; /*webkit浏览器*/
  -ms-user-select: none; /*IE10*/
  -khtml-user-select: none; /*早期浏览器*/
  user-select: none;
}
.rank1 {
  font-size: 20px;
  font-weight: 600;
  color: #73c9e5;
  border: 3px solid #73c9e5;
  border-radius: 8px;
  padding: 10px 15px;
  background-color: #fff;
}
.rank2 {
  font-size: 18px;
  font-weight: 400;
  color: #73c9e5;
  border: 2px solid #73c9e5;
  border-radius: 6px;
  padding: 7px 12px;
  background-color: #fff;
}
.rank3 {
  font-size: 16px;
  font-weight: normal;
  color: #73c9e5;
  border: 1px solid #73c9e5;
  border-radius: 4px;
  padding: 4px 8px;
  background-color: #fff;
}
.active {
  border-color: #22a2c3;
}
</style>