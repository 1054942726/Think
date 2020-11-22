<template>
  <div class="note">
    <!-- 导航栏 -->
    <div class="note-nav">
      <h1 class="title">便签</h1>
      <div class="up" @click="$emit('downNote')">
        <i class="iconfont icon-up-circle"></i>
      </div>
    </div>
    <!-- 主区域 -->
    <div class="note-container">
      <!-- 编辑器区域 -->
      <div class="input-container" v-show="noteInput">
        <textarea v-model="noteText"></textarea>
        <i class="iconfont icon-tick" @click="addNote"></i>
        <i class="iconfont icon-delete" @click="deleteNote" v-show="noteModle==='change'"></i>
      </div>
      <!-- 列表区域 -->
      <div class="list">
        <ul ref="ul1">
          <li class="addNote">
            <i class="iconfont icon-plus-circle" @click="noteInput=true;noteModle='add'"></i>
          </li>
          <li
            v-for="(item,index) in noteData[0]"
            :key="item.id"
            @click="changeNoteText({item:item,index:0,num:index})"
          >{{item.value}}</li>
        </ul>
        <ul ref="ul2">
          <li
            v-for="(item,index) in noteData[1]"
            :key="item.id"
            @click="changeNoteText({item:item,index:1,num:index})"
          >{{item.value}}</li>
        </ul>
        <ul ref="ul3">
          <li
            v-for="(item,index) in noteData[2]"
            :key="item.id"
            @click="changeNoteText({item:item,index:2,num:index})"
          >{{item.value}}</li>
        </ul>
        <ul ref="ul4">
          <li
            v-for="(item,index) in noteData[3]"
            :key="item.id"
            @click="changeNoteText({item:item,index:3,num:index})"
          >{{item.value}}</li>
        </ul>
        <ul ref="ul5">
          <li
            v-for="(item,index) in noteData[4]"
            :key="item.id"
            @click="changeNoteText({item:item,index:4,num:index})"
          >{{item.value}}</li>
        </ul>
        <ul ref="ul6">
          <li
            v-for="(item,index) in noteData[5]"
            :key="item.id"
            @click="changeNoteText({item:item,index:5,num:index})"
          >{{item.value}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      noteInput: false, //编辑器是否显示
      noteData: [[], [], [], [], [], []], //便签渲染列表
      datalist: [], //便签数据
      noteText: "", //便签文本
      item: {}, //选中的标签对象
      index: 0, //选中的标签对象的一层索引
      num: 0, //选中的标签对象的二层索引
      noteModle: "add"
    };
  },
  mounted() {
    this.getNoteData();
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
    getNoteData() {
      //ajax请求数据
      this.datalist = [
        {
          id: 1,
          value: "模拟数据模拟数据模拟数据模拟数据模拟数据模拟数据模拟数据"
        },
        { id: 2, value: "模拟数据" },
        {
          id: 3,
          value:
            "模拟数据模拟数据模拟数据模拟数据模拟数据模拟数据模拟数据模拟数据模拟数据模拟数据"
        },
        { id: 4, value: "模拟数据模拟数据模拟数据" },
        { id: 5, value: "模拟数据模拟数据模拟数据模拟数据" },
        {
          id: 6,
          value:
            "模拟数据模拟数据模拟数据模拟数据模拟数据模拟数据模拟数据模拟数据模拟数据模拟数据模拟数据模拟数据模拟数据"
        },
        { id: 7, value: "模拟数据模拟数据模拟数据模拟数据" },
        {
          id: 8,
          value:
            "模拟数据模拟数据模拟数据模拟数据模拟数据模拟数据模拟数据模拟数据模拟数据"
        },
        { id: 9, value: "模拟数据模拟数据" },
        { id: 10, value: "模拟数据模拟数据模拟数据模拟数据" },
        {
          id: 11,
          value:
            "模拟数据模拟数据模拟数据模拟数据模拟数据模拟数据模拟数据模拟数据模拟数据模拟数据模拟数据"
        },
        { id: 12, value: "模拟数据模拟数据" },
        { id: 13, value: "模拟数据模拟数据模拟数据模拟数据模拟数据模拟数据" },
        { id: 14, value: "模拟数据模拟数据模拟数据" }
      ];
      let thes = this;
      function getHeightList() {
        return [
          thes.$refs.ul1.offsetHeight,
          thes.$refs.ul2.offsetHeight,
          thes.$refs.ul3.offsetHeight,
          thes.$refs.ul4.offsetHeight,
          thes.$refs.ul5.offsetHeight,
          thes.$refs.ul6.offsetHeight
        ];
      }
      let ulHeightLsit;
      let minheight;
      let minIndex;
      for (let i = 0; i < this.datalist.length; i++) {
        setTimeout(() => {
          ulHeightLsit = getHeightList();
          minheight = Math.min(...ulHeightLsit);
          minIndex = ulHeightLsit.indexOf(minheight);
          this.noteData[minIndex].push(this.datalist[i]);
        });
      }
    },
    addNote() {
      //添加便签
      if (this.noteText === "" || this.noteText === " ") {
        this.noteInput = false;
        return;
      }
      this.noteInput = false;
      if (this.noteModle === "change") {
        this.item.value = this.noteText;
        this.noteText = "";
      } else {
        let thes = this;
        let ulHeightLsit;
        let minheight;
        let minIndex;
        function getHeightList() {
          return [
            thes.$refs.ul1.offsetHeight,
            thes.$refs.ul2.offsetHeight,
            thes.$refs.ul3.offsetHeight,
            thes.$refs.ul4.offsetHeight,
            thes.$refs.ul5.offsetHeight,
            thes.$refs.ul6.offsetHeight
          ];
        }
        ulHeightLsit = getHeightList();
        minheight = Math.min(...ulHeightLsit);
        minIndex = ulHeightLsit.indexOf(minheight);
        this.noteData[minIndex].push({ value: this.noteText });
        this.noteText = "";
      }

      //还要发送数据给后端进行保存更新
    },
    changeNoteText(data) {
      this.noteModle = "change";
      this.noteInput = true;
      this.item = data.item;
      this.index = data.index;
      this.num = data.num;
      this.noteText = data.item.value;
    },
    deleteNote() {
      this.noteModle = "add";
      this.noteInput = false;
      this.noteData[this.index].splice(this.num, 1);
      this.noteText = "";
      //将改变的数据交给后端，然后再重新从后端读取数据，再重新排列
      //this.getNoteData();
    }
  }
};
</script>

<style lang="less" scoped>
.note {
  box-sizing: border-box;
  width: 100%;
  height: calc(100vh - 59px);
  background-color: #fff2f4;
  position: relative;

  .note-nav {
    box-sizing: border-box;
    width: 100%;
    height: 46px;
    padding-left: 10px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #888;

    .title {
      font-size: 20px;
      font-weight: normal;
      margin: 0 5px;
    }
    .up {
      i {
        font-size: 21px;
        vertical-align: middle;
        &:hover {
          cursor: pointer;
          color: #ff2b43;
        }
      }
    }
  }

  .note-container {
    box-sizing: border-box;
    width: 100%;
    height: calc(100% - 46px);

    .input-container {
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0px;
      left: 0px;
      background-color: rgba(0, 0, 0, 0.3);
      display: flex;
      justify-content: center;
      align-items: center;
      textarea {
        width: 65%;
        height: 60%;
        transform: translateY(-20px);
        outline: none;
        border: none;
        border-radius: 6px;
        font-family: "Helvetica Neue", Arial, "Hiragino Sans GB", "STHeiti",
          "Microsoft YaHei", "WenQuanYi Micro Hei", SimSun, Song, sans-serif;
        font-size: 16px;
      }
      i {
        position: absolute;
        top: 20px;
        right: 20px;
        font-size: 30px;
        color: #fff;
        cursor: pointer;
        &:hover {
          color: #ff2b43;
        }
      }
      .icon-delete {
        top: 20px;
        right: 60px;
      }
    }

    .list {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: space-around;
      align-items: end;
      overflow: auto;
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

      ul {
        box-sizing: border-box;
        width: 15%;
        li {
          box-sizing: border-box;
          width: 100%;
          // min-height: 100px;
          padding: 10px;
          margin-top: 15px;
          background-color: #fff;
          border-radius: 6px;
          box-shadow: 1px 1px 2px #bbb;
          cursor: pointer;
        }

        .addNote {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 200px;

          i {
            font-size: 40px;
            color: #888;
            &:hover {
              color: #ff2b43;
            }
          }
        }
      }
    }
  }
}
</style>