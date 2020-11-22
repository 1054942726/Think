<template>
  <div class="container">
    <div class="bookContainer" v-show="componentShow=='book'">
      <header>
        <div class="date">{{ datemat }}</div>
        <button @click="addDiary">
          <i class="iconfont icon-plus-circle" title="添加日记"></i>
        </button>
      </header>
      <div class="bookshelf" @mouseenter="mouseEnter" @mouseleave="leftShow=false;rightShow=false;">
        <i class="left iconfont icon-left-circle" @click="leftMove" v-show="leftShow"></i>
        <i class="right iconfont icon-right-circle" @click="rightMove" v-show="rightShow"></i>
        <ul class="main" ref="ul" :style="{left:ulLeft+'px'}">
          <li v-for="(item,index) in diaryList" :key="item.id">
            <Book
              :title="item.title"
              :content="item.content"
              :img="item.img"
              :button="item.button"
              :word="word"
              :index="index"
              @changeComponent="changeComponent"
              @deleteDiary="deleteDiary($event)"
              @changeImg="changeImg($event)"
            />
          </li>
        </ul>
      </div>
    </div>

    <transition>
      <div class="editorContainer" v-show="componentShow=='edit'">
        <Editor @changeComponent="changeComponent($event)" />
      </div>
    </transition>
  </div>
</template>

<script>
import moment from "moment";
import Book from "./book.vue";
import Editor from "@/components/wEditor/index.vue";
export default {
  components: {
    Book,
    Editor
  },

  data() {
    return {
      date: null, //moment日期对象
      ulLeft: 0, //ul的left值
      ulWidth: 0, //，ul的宽度，每次添加日记本都要重新获并赋值
      leftShow: false,
      rightShow: false,
      componentShow: "book",
      word: false,
      diaryList: [
        {
          id: 1,
          title: "日记本标题",
          content: "这是一段励志的话",
          img: "diary",
          button: "写日记"
        }
      ]
    };
  },
  mounted() {
    this.ulWidth = this.$refs.ul.offsetWidth;
    this.$refs.ul.addEventListener("transitionend", event => {
      if (event.target.tagName != "UL") {
        return;
      }
      this.buttonIsShow();
    });
    this.initTime();
    this.getData();
  },
  methods: {
    initTime() {
      //初始化moment
      moment.locale("zh-cn");
      this.date = moment();
    },
    getData() {
      //向后端发送请求得到diaryList的数据
      // if (this.diaryList.length == 0) {
      //   this.diaryList.push({
      //     id: 1,
      //     title: "日记本标题",
      //     content: "这是一段励志的话",
      //     img: "diary",
      //     button: "新建日记"
      //   });
      // }
    },
    buttonIsShow() {
      if (this.ulLeft == 0) {
        this.leftShow = false;
        this.rightShow = true;
      } else if (this.ulLeft == -this.ulWidth + 1048) {
        this.leftShow = true;
        this.rightShow = false;
      }
      if (this.ulLeft < 0) {
        this.leftShow = true;
      }
      if (this.ulLeft > -this.ulWidth + 1048) {
        this.rightShow = true;
      }
      if (this.diaryList.length == 1) {
        this.rightShow = false;
      }
    },
    leftMove() {
      if (this.ulLeft == 0 || this.diaryList.length == 0) {
        return;
      }
      this.ulLeft += 1008;
    },
    rightMove() {
      if (this.ulLeft == -this.ulWidth + 1048 || this.diaryList.length == 0) {
        return;
      }
      // this.leftShow = true;
      this.ulLeft -= 1008;
    },
    mouseEnter() {
      if (this.diaryList.length == 0 || this.diaryList.length == 1) {
        return;
      }
      if (this.ulLeft == 0) {
        this.leftShow = false;
        this.rightShow = true;
      } else if (this.ulLeft == -this.ulWidth + 1048) {
        this.leftShow = true;
        this.rightShow = false;
      } else {
        this.leftShow = true;
        this.rightShow = true;
      }
    },
    changeComponent(e) {
      if (e == "book") {
        this.word = true;
        setTimeout(() => {
          if (this.componentShow == "book") {
            this.componentShow = "edit";
          } else {
            this.componentShow = "book";
          }
        }, 400);
      } else {
        this.word = false;
        if (this.componentShow == "book") {
          this.componentShow = "edit";
        } else {
          this.componentShow = "book";
        }
      }
    },
    addDiary() {
      //添加日记本
      this.diaryList.push({
        id: Math.random(),
        title: "日记本标题",
        content: "这是一段励志的话",
        img: "diary",
        button: "写日记"
      });
      setTimeout(() => {
        this.ulWidth = this.$refs.ul.offsetWidth;
        this.ulLeft = -this.ulWidth + 1048;
      });
      console.log(this.diaryList);
    },
    deleteDiary(e) {
      if (this.diaryList.length == 1) {
        return;
      }
      console.log(e);
      //e是index
      this.diaryList.splice(e, 1);
      setTimeout(() => {
        this.ulWidth = this.$refs.ul.offsetWidth;
        if (this.diaryList.length == 1) {
          this.rightShow = false;
        }
        if (e != 0) {
          this.ulLeft = -(e - 1) * 1008; //往前走
        } else {
          this.ulLeft = 0;
        }
      });
    },
    changeImg(e) {
      if (this.diaryList[e].img == "diary") {
        this.diaryList[e].img = "xzz";
      } else {
        this.diaryList[e].img = "diary";
      }
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
ul,
li {
  padding: 0px;
  margin: 0px;
  list-style-type: none;
}
.container {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  background-color: #dfecd5;

  .bookContainer {
    width: 100%;
    height: calc(100% - 45px);

    header {
      box-sizing: border-box;
      width: 100%;
      height: 45px;
      border-bottom: 1px solid #96c24e;
      // box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.5);
      // margin-bottom: 80px;
      line-height: 45px;
      padding: 0 10px;
      color: #333;
      display: flex;

      button {
        border: none;
        outline: none;
        background-color: rgba(0, 0, 0, 0);

        i {
          font-size: 20px;
          cursor: pointer;
          vertical-align: sub;
        }
      }
    }

    .bookshelf {
      box-sizing: border-box;
      padding: 20px;
      width: 1048px;
      height: 100%;
      padding-top: 80px;
      text-align: center;
      overflow: hidden;
      position: relative;
      background-color: #dfecd5;
      // background-image: url("../../assets/img/sz1.jpg");
      background-repeat: no-repeat;
      background-size: cover;

      .left,
      .right {
        font-size: 50px;
        position: absolute;
        top: 270px;
        cursor: pointer;
        z-index: 10;
        color: #333;
      }

      .left {
        left: 40px;
      }

      .right {
        right: 40px;
      }

      .main {
        box-sizing: border-box;
        padding: 20px;
        padding-top: 100px;
        display: flex;
        justify-content: space-around;
        position: absolute;
        top: 0;
        transition: all 0.5s;
        // left: 0;

        li {
          box-sizing: border-box;
          width: 1008px;
          padding: 0 50px;
          display: flex;
          justify-content: space-around;
          transform-style: preserve-3d;
          perspective: 2000px;
        }
      }
    }
  }

  .editorContainer {
    width: 100%;
    height: calc(100% - 45px);
  }

  .v-enter {
    opacity: 0;
    transform: scale(0.99);
  }
  .v-enter-active {
    transition: all 0.5s;
  }
  .v-enter-to {
    opacity: 1;
    transform: scale(1);
    // transform: translateX(0px);
  }
}
</style>