<template>
  <div class="todolist">
    <div class="contaner" :style="{marginTop:marginTop}">
      <!-- todolist区 -->
      <ToDoList @downToDo="down" />
      <!-- 便签区 -->
      <Note @downNote="down" />
    </div>
  </div>
</template>

<script>
import moment from "moment";
import axios from "axios";
import Note from "./note.vue";
import ToDoList from "./todolist.vue";
export default {
  components: {
    Note,
    ToDoList
  },
  data() {
    return {
      marginTop: 0,
      keydown: false
    };
  },
  mounted() {
    this.addEvent();
  },
  methods: {
    down() {
      //上下翻页
      this.keydown = true;
      this.marginTop === 0
        ? (this.marginTop = "calc(0px - (100vh - 59px))")
        : (this.marginTop = 0);
      addEventListener("transitionend", () => {
        this.keydown = false;
      });
    },
    addEvent() {
      //注册键盘事件
      const thes = this;
      window.addEventListener("keydown", e => {
        if (![32, 38, 40, 37, 39].includes(e.keyCode) || thes.keydown) {
          //阻止其它按键触发事件和同时触发多次事件
          return;
        }
        if (e.keyCode === 38 || e.keyCode === 40) {
          thes.down();
          return;
        }
      });
    }
  }
};
</script>

<style lang="less">
@import url("http://at.alicdn.com/t/font_1973725_0hofvwd6neca.css");
.todolist {
  box-sizing: border-box;
  width: 100%;
  height: calc(100vh - 59px);
  overflow: hidden;
  color: #4f4f4f;

  ul,
  li,
  dl,
  dt,
  dd {
    padding: 0;
    margin: 0;
    list-style-type: none;
  }
  button {
    border: none;
    outline: none;
    background: none;
    margin: 0;
    padding: 0;
  }
  .contaner {
    transition: all 0.5s;
  }
}
</style>