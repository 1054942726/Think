<template>
  <Note
    :noteDataList="noteDataList"
    @deleteItem="deleteItem"
    @movePosition="movePosition"
    @menuShow="menuShow"
    @getData="changeData"
  />
</template>

<script>
import Note from "./Note.vue";
import axios from "axios";
export default {
  components: {
    Note
  },
  data() {
    return {
      noteDataList: []
    };
  },
  methods: {
    getData(type = "") {
      //根据不同的id和page向后端请求不同的数据进行渲染
      const id = this.$route.params.noteId;
      let page = type; //是哪个页面
      axios.get(`/${id + page}.json`).then(res => {
        this.noteDataList = res.data.data;
      });
    },
    changeData(e) {
      //切换页面
      if (e === "all") {
        this.getData();
      } else if (e === "collection") {
        //模拟根据不同参数请求不同数据库的表
        this.getData("collection");
      } else if (e === "delete") {
        this.getData("delete");
      }
    },
    deleteItem(e) {
      //e为Note组件传递过来的要删除项的index
      this.noteDataList.splice(e, 1);
      //移入回收站
      //还要给后端发送实时数据
    },
    movePosition(e) {
      if (e.type === "up") {
        if (e.index != 0) {
          let data = this.noteDataList.splice(e.index, 1);
          this.noteDataList.splice(e.index - 1, 0, ...data);
        }
      } else if (e.type === "down") {
        if (e.index < this.noteDataList.length) {
          let data = this.noteDataList.splice(e.index, 1);
          this.noteDataList.splice(e.index + 1, 0, ...data);
        }
      } else if (e.type === "top") {
        let data = this.noteDataList.splice(e.index, 1);
        this.noteDataList.splice(0, 0, ...data);
      }
    },
    menuShow(e) {
      this.noteDataList[e].menuShow = !this.noteDataList[e].menuShow;
    }
  },
  watch: {
    $route: {
      handler() {
        this.getData();
      },
      immediate: true
    }
  }
};
</script>
