<template>
  <div class="pro-content">
    <ToolBar
      @model="changeModel"
      @catalog="showCatalog"
      @help="showHelp"
      @changeTG="isTG=!isTG"
      :activeIcon="activeIcon"
      :textTitle="textTitle"
    />
    <Left :random="random" v-show="leftShow" ref="left" :initMStr="mStr" />
    <Right v-show="rightShow" ref="right" :RightTop="RightTop" />
    <Catalog v-show="catalogShow" />
    <Help v-show="helpShow" />
  </div>
</template>

<script>
import Right from "@/components/Pro/m-right/Right.vue";
import Left from "@/components/Pro/m-left/Left.vue";
import Catalog from "@/components/Pro/catalog/Catalog.vue";
import ToolBar from "@/components/Pro/toolBar/Toolbar.vue";
import Help from "@/components/Pro/help/Help.vue";
import axios from "axios";
import { mapState } from "vuex";
export default {
  components: {
    Right,
    Left,
    Catalog,
    ToolBar,
    Help
  },
  mounted() {
    this.getMove(); //判断鼠标在哪个区域

    this.$refs.left.CodeMirrorEditor.on("scroll", () => {
      if (this.isTG) {
        this.getScroll();
      }
    });

    this.$refs.right.$refs.rCode.addEventListener("scroll", () => {
      if (this.isTG) {
        this.getScroll();
      }
    });

    this.getData();
  },
  data() {
    return {
      mStr: "",
      textTitle: "",
      timer: null,
      RightTop: null, //显示区滚动条滑块距顶部距离
      leftShow: true, //编辑器是否显示
      rightShow: true, //预览区是否显示
      catalogShow: false, //目录是否显示
      helpShow: false, //帮助区是否显示
      random: null, //切换到预览模式后重新赋值value
      activeIcon: "break", //模式图标高亮
      rightMove: false, //鼠标是否在显示区
      leftMove: false, //鼠标是否在编辑区
      isTG: true //是否同步滚动
    };
  },
  methods: {
    getScroll() {
      //设置同步滚动
      //left滚动条距顶距离/left滚动条总高=right滚动条距顶距离/right滚动条总高
      const LeftArea = this.$refs.left.CodeMirrorEditor.display.scroller;
      const RightArea = this.$refs.right.$refs.rCode;
      if (this.leftMove) {
        let RightTop =
          (LeftArea.scrollTop * RightArea.scrollHeight) / LeftArea.scrollHeight;
        RightArea.scrollTop = RightTop;
      }
      if (this.rightMove) {
        let LeftTop =
          (RightArea.scrollTop * LeftArea.scrollHeight) /
          RightArea.scrollHeight;
        LeftArea.scrollTop = LeftTop;
      }
    },
    //判断鼠标在左右哪个区域
    getMove() {
      const RightArea = this.$refs.right.$refs.rCode;
      const LeftArea = this.$refs.left.$refs.lCode;
      //进入显示区触发
      RightArea.addEventListener("mouseenter", () => {
        this.rightMove = true;
        this.leftMove = false;
      });
      //进入编辑区触发
      LeftArea.addEventListener("mouseenter", () => {
        this.rightMove = false;
        this.leftMove = true;
      });
    },
    //接收从toolbar传来的model，'left'编辑模式，'right'预览模式，'break'分屏
    changeModel(model) {
      if (model === "left") {
        this.rightShow = false;
        this.leftShow = true;
        this.activeIcon = "left";
        this.random = "left";
      } else if (model === "right") {
        this.leftShow = false;
        this.rightShow = true;
        this.activeIcon = "right";
      } else if (model == "break") {
        this.leftShow = true;
        this.rightShow = true;
        this.activeIcon = "break";
        this.random = "break";
      }
    },
    //是否显示目录
    showCatalog() {
      this.helpShow = false;
      this.catalogShow = !this.catalogShow;
      if (this.catalogShow) {
        //为了每次点击目录都让Left的监听器触发，所以点击一次换一个值
        this.random = "catalog";
      } else {
        this.random = "catalog1";
      }
    },
    //是否显示帮助
    showHelp() {
      this.catalogShow = false;
      this.helpShow = !this.helpShow;
      if (this.helpShow) {
        this.random = "help";
      } else {
        this.random = "help1";
      }
    },
    getData() {
      //通过动态id获取数据,并传递给left进行页面渲染
      const id = this.$route.params.editId;
      if (this.isSee) {
        this.leftShow = false;
        this.$store.commit("changeSee");
      }
      axios.get(`/${id}.json`).then(res => {
        this.mStr = res.data.data;
        this.textTitle = res.data.title;
      });
    }
  },
  computed: {
    ...mapState(["isSee"])
  },
  watch: {}
};
</script>

<style lang="less">
@import url("./index.less");
</style>>
