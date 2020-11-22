<template>
  <div class="todo">
    <!-- 工具栏 -->
    <div class="tool">
      <!-- 左侧工具栏 -->
      <div class="toolContainer">
        <div class="date">{{datemat}}</div>
        <div class="button">
          <button class="left" @click="changePage('left')">
            <i class="iconfont icon-left" :class="{'active':istoday}"></i>
          </button>
          <button @click="changePage('right')">
            <i class="iconfont icon-right" :class="{'active':istoday}"></i>
          </button>
        </div>
        <div class="home" @click="goHome">
          <i class="iconfont icon-home" :class="{'today':istoday}"></i>
        </div>
        <div class="delete" @click="todoDelete=!todoDelete">
          <i class="iconfont icon-delete" :class="{'today':istoday}" v-show="!todoDelete"></i>
          <i class="iconfont icon-delete-fill" :class="{'today':istoday}" v-show="todoDelete"></i>
        </div>
        <div class="down" @click="$emit('downToDo')">
          <i class="iconfont icon-down-circle" :class="{'today':istoday}"></i>
        </div>
      </div>
      <!-- 右侧状态栏 -->
      <div class="stateContainer">
        <div class="sss">
          <i class="iconfont icon-yuanxing"></i>
          <span>{{alength}}</span>
        </div>
        <div class="ss">
          <i class="iconfont icon-yuanxing"></i>
          <span>{{blength}}</span>
        </div>
        <div class="s">
          <i class="iconfont icon-yuanxing"></i>
          <span>{{clength}}</span>
        </div>
        <div class="ok">
          <i class="iconfont icon-frown" v-show="iconBQ==='c'"></i>
          <i class="iconfont icon-meh" v-show="iconBQ==='b'"></i>
          <i class="iconfont icon-smile" v-show="iconBQ==='a'"></i>
          <span>{{oklength}}</span>
        </div>
      </div>
    </div>
    <!-- 输入框 -->
    <div class="input">
      <input type="text" placeholder="添加任务" ref="todoInput" v-model="todoText" />
      <!-- 右侧工具栏 -->
      <div class="box">
        <i
          class="iconfont icon-yuanxing box-a"
          :class="{'box-after-a':todoRank==='a'}"
          @click="todoRank='a'"
        ></i>
        <i
          class="iconfont icon-yuanxing box-b"
          :class="{'box-after-b':todoRank==='b'}"
          @click="todoRank='b'"
        ></i>
        <i
          class="iconfont icon-yuanxing box-c"
          :class="{'box-after-c':todoRank==='c'}"
          @click="todoRank='c'"
        ></i>
        <i class="iconfont icon-plus" @click="addWord"></i>
      </div>
    </div>
    <!-- 5页的容器 -->
    <ul class="list" :style="{marginLeft:marginLeft,transition: `${gd?'all 0.6s':'none'}`}">
      <!-- 每一页主体 -->
      <li class="item" v-for="day in todolistDate" :key="day.id">
        <!-- 左侧未完成区域 -->
        <div class="left">
          <dl
            v-for="(items,index) in day.unfulfil"
            :key="index"
            :class="{'dl-a':items.rank==='a','dl-b':items.rank==='b','dl-c':items.rank==='c'}"
          >
            <transition-group>
              <dd v-for="(item,index) in items.data" :key="item">
                <i class="iconfont icon-yuanxing" @click="Done(day,items,index,'left')"></i>
                <p>{{item}}</p>
              </dd>
            </transition-group>
          </dl>
        </div>
        <div class="right">
          <dl
            v-for="(items,index) in day.fulfil"
            :key="index"
            :class="{'dl-a':items.rank==='a','dl-b':items.rank==='b','dl-c':items.rank==='c'}"
          >
            <transition-group>
              <dd v-for="(item,index) in items.data" :key="item">
                <i class="iconfont icon-tick" @click="Done(day,items,index,'right')"></i>
                <p>{{item}}</p>
              </dd>
            </transition-group>
          </dl>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import moment from "moment";
import axios from "axios";
export default {
  data() {
    return {
      date: null, //moment日期对象
      marginLeft: `calc(0px - (100vw - 488px)*2)`,
      page: 2, //页面显示第几页，计算margin-left时用page*宽度。
      todolistDate: [],
      gd: true, //是否启用过渡
      keydown: false, //键盘锁
      istoday: true, //是不是今天
      alength: 0, //a级未完成数量
      blength: 0, //b级未完成数量
      clength: 0, //c级未完成数量
      oklength: 0, //已完成数量
      iconBQ: "", //控制已完成数量表情
      todoText: "", //todolist文本
      todoRank: "", //文本等级
      oldRank: "", //上一次选择的等级
      focus: false, //是否聚焦
      todoDelete: false //删除模式是否开启
    };
  },
  created() {
    //请求todolist数据
    axios.get("/todolistData.json").then(res => {
      this.todolistDate = res.data.data;
    });
  },
  mounted() {
    this.initTime();
    this.addEvent();
    this.getToDay();
  },
  methods: {
    initTime() {
      //初始化moment
      moment.locale("zh-cn");
      this.date = moment();
    },
    addEvent() {
      //注册键盘事件
      const thes = this;
      window.addEventListener("keydown", e => {
        if (![32, 38, 40, 37, 39].includes(e.keyCode) || thes.keydown) {
          //阻止其它按键触发事件和同时触发多次事件
          return;
        }
        if (e.keyCode === 37) {
          //左翻页
          thes.changePage("left");
          return;
        }
        if (e.keyCode === 39) {
          //右翻页
          thes.changePage("right");
          return;
        }
      });
      //给input注册聚焦和失焦事件
      this.$refs.todoInput.addEventListener("focus", () => {
        this.focus = true;
        if (this.oldRank == "") {
          //取个默认值
          this.oldRank = "a";
        }
        this.todoRank = this.oldRank; //聚焦时获取上一个选择的等级；
      });
      this.$refs.todoInput.addEventListener("blur", () => {
        this.focus = false;
      });
    },
    getToDay() {
      //判断并得到切换到的日期是不是今天的日期
      this.date.format("YYYY-MM-DD dddd") === moment().format("YYYY-MM-DD dddd")
        ? (this.istoday = true)
        : (this.istoday = false);
    },
    setDatalist() {
      //模拟请求数据
      const thes = this;
      let day0 = moment(thes.date)
          .subtract(2, "d")
          .format("YYYY-MM-DD"),
        day1 = moment(thes.date)
          .subtract(1, "d")
          .format("YYYY-MM-DD"),
        day2 = moment(thes.date).format("YYYY-MM-DD"),
        day3 = moment(thes.date)
          .add(1, "d")
          .format("YYYY-MM-DD"),
        day4 = moment(thes.date)
          .add(2, "d")
          .format("YYYY-MM-DD");
      this.todolistDate = [
        {
          id: day0,
          fulfil: [
            { rank: "a", data: [day0] },
            { rank: "b", data: [day0] },
            { rank: "c", data: [day0] }
          ],
          unfulfil: [
            { rank: "a", data: [day0] },
            { rank: "b", data: [day0] },
            { rank: "c", data: [day0] }
          ]
        },
        {
          id: day1,
          fulfil: [
            { rank: "a", data: [day1] },
            { rank: "b", data: [day1] },
            { rank: "c", data: [day1] }
          ],
          unfulfil: [
            { rank: "a", data: [day1] },
            { rank: "b", data: [day1] },
            { rank: "c", data: [day1] }
          ]
        },
        {
          id: day2,
          fulfil: [
            { rank: "a", data: [day2] },
            { rank: "b", data: [day2] },
            { rank: "c", data: [day2] }
          ],
          unfulfil: [
            { rank: "a", data: [day2] },
            { rank: "b", data: [day2] },
            { rank: "c", data: [day2] }
          ]
        },
        {
          id: day3,
          fulfil: [
            { rank: "a", data: [day3] },
            { rank: "b", data: [day3] },
            { rank: "c", data: [day3] }
          ],
          unfulfil: [
            { rank: "a", data: [day3] },
            { rank: "b", data: [day3] },
            { rank: "c", data: [day3] }
          ]
        },
        {
          id: day4,
          fulfil: [
            { rank: "a", data: [day4] },
            { rank: "b", data: [day4] },
            { rank: "c", data: [day4] }
          ],
          unfulfil: [
            { rank: "a", data: [day4] },
            { rank: "b", data: [day4] },
            { rank: "c", data: [day4] }
          ]
        }
      ];
    },
    setMarginLeft() {
      //重新设置marginLeft的值
      this.marginLeft = `calc(0px - (100vw - 488px)*${this.page})`;
    },
    throttle(callback, time) {
      //函数节流
      let timer;
      if (timer) {
        return;
      }
      timer = setTimeout(() => {
        callback();
        timer = null;
      }, time);
    },
    changePage(dir) {
      this.throttle(() => {
        //函数节流，限制操作翻页的次数，不然就是有键盘锁，操作过快反而会导致键盘锁异常
        if (this.keydown) {
          return;
        }
        this.keydown = true;
        if (dir === "left") {
          this.page--;
          this.date = moment(this.date).subtract(1, "d"); //日期减一天
        } else {
          this.page++;
          this.date = moment(this.date).add(1, "d"); //日期加一天
        }
        this.setMarginLeft();
        this.getToDay(); //判断是不是今天
        addEventListener("transitionend", () => {
          this.keydown = false;
          if (this.page <= 0 || this.page >= 4) {
            this.setDatalist(); //获取并赋值新数据
            this.page = 2; //设置当前显示页，一共五页，从0开始
            this.gd = false; //关闭过渡
            this.setMarginLeft();
            setTimeout(() => {
              this.gd = true; //等设置好了位置后在恢复过渡效果
            }, 0);
          }
        });
        this.getNumber(); //获取状态栏数据
      }, 100);
    },
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
    getNumber() {
      //得到状态栏信息
      if (this.todolistDate[this.page]) {
        let data = this.todolistDate[this.page].unfulfil;
        let okData = this.todolistDate[this.page].fulfil;
        let oklength = 0;
        for (let i = 0; i < data.length; i++) {
          let rank = data[i].rank;
          let item = data[i].data;
          if (rank === "a") {
            this.alength = item.length;
          } else if (rank === "b") {
            this.blength = item.length;
          } else {
            this.clength = item.length;
          }
        }
        for (let j = 0; j < okData.length; j++) {
          oklength += okData[j].data.length;
        }
        this.oklength = oklength;
        let allLength =
          this.alength + this.blength + this.clength + this.oklength;
        if (this.oklength >= (allLength * 4) / 5) {
          this.iconBQ = "a";
        } else if (this.oklength >= allLength / 2) {
          this.iconBQ = "b";
        } else {
          this.iconBQ = "c";
        }
      }
    },
    goHome() {
      //回到今天的todolist
      // 请求今天的数据并重新赋值给todolistData
      axios.get("/todolistData.json").then(res => {
        this.todolistDate = res.data.data;
      });
      this.gd = true;
      this.date = moment(); //重新设置日期
      this.page = 2; //设置显示页数
      this.setMarginLeft(); //重新根据页数设置距离
      this.getToDay(); //判断显示的日期是不是今天的日期，以高亮图标
    },
    Done(day, items, index, type) {
      //操作todolist项目（切换和删除）
      let rank = items.rank; //记录等级
      let data = items.data; //数据数组
      let word = data.splice(index, 1); //截取选中项
      let list;
      if (this.todoDelete) {
        this.getNumber();
        return; //因为前面的word以截取选取的数据，所以不进行后面的重新赋值即为删除
      }
      if (type === "left") {
        //当前操作的是左边还是右边
        list = day.fulfil;
      } else {
        list = day.unfulfil;
      }
      for (let i = 0; i < list.length; i++) {
        //将截取出的项放入对应等级的列表
        if (list[i].rank === rank) {
          list[i].data.push(...word);
        }
      }
      this.getNumber();
      //这里还要提交新数据给后端
    },
    addWord() {
      //添加新任务
      if (this.todoText == "" || this.todoText === " ") {
        return;
      }
      let dataList = this.todolistDate[this.page].unfulfil; //当前页的数据
      for (let i = 0; i < dataList.length; i++) {
        if (this.todoRank === "a" && dataList[i].rank === "a") {
          dataList[i].data.push(this.todoText);
        } else if (this.todoRank === "b" && dataList[i].rank === "b") {
          dataList[i].data.push(this.todoText);
        } else if (this.todoRank === "c" && dataList[i].rank === "c") {
          dataList[i].data.push(this.todoText);
        }
      }
      this.getNumber();
      this.todoText = "";
      this.todoRank = ""; //让等级图标高亮消失
      //提交修改过后的数据给后端
    }
  },
  computed: {
    datemat() {
      let date = this.date;
      return moment(date).format("YYYY-MM-DD - dddd");
    }
  },
  watch: {
    todolistDate() {
      this.getNumber();
    },
    todoRank() {
      if (this.todoRank != "") {
        this.oldRank = this.todoRank;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.todo {
  //todolist区域
  box-sizing: border-box;
  width: 100%;
  height: calc(100vh - 59px);

  .tool {
    box-sizing: border-box;
    display: flex;
    height: 45px;
    padding: 0 10px;
    margin-bottom: 8px;
    width: 100%;
    font-size: 15px;
    background-color: #fff;

    .toolContainer {
      width: 50%;
      height: 100%;
      display: flex;
      align-items: center;

      .button {
        border: 1px solid #c9c9c9;
        border-radius: 4px;
        display: flex;
        align-items: center;
        margin-left: 20px;

        button {
          padding: 1px 5px;
          transition: all 0.3s;
          cursor: pointer;
          &:hover {
            background-color: #fff2f4;
          }

          i {
            font-size: 14px;
            color: #73c9e5;
            vertical-align: text-bottom;
          }
          .active {
            color: #ff2b43;
          }
        }
        .left {
          border-right: 1px solid #c9c9c9;
        }
      }

      .home,
      .down,
      .delete {
        margin-left: 10px;
        padding: 2px 3px;
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          background-color: #fff2f4;
        }

        .today {
          color: #ff2b43;
        }
        i {
          font-size: 20px;
          color: #73c9e5;
          vertical-align: text-bottom;
        }
      }
    }

    .stateContainer {
      width: 50%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      i {
        vertical-align: text-bottom;
      }
      .sss {
        margin: 0 10px;
        i {
          font-size: 22px;
          color: #f76333;
          margin-right: 5px;
        }
      }

      .ss {
        margin: 0 10px;
        i {
          font-size: 22px;
          color: #feae6a;
          margin-right: 5px;
        }
      }
      .s {
        margin: 0 10px;
        i {
          font-size: 22px;
          color: #3fb6da;
          margin-right: 5px;
        }
      }
      .ok {
        margin: 0 10px;
        i {
          font-size: 22px;
          color: #89c557;
          margin-right: 5px;
        }
      }
    }
  }

  .list {
    box-sizing: border-box;
    height: calc(100% - 96px);
    width: calc((100vw - 488px) * 5);
    display: flex;
    flex-wrap: nowrap;
    margin-left: calc(0px - (100vw - 488px));
    transition: all 0.6s;
    background-color: #fff;

    .item {
      box-sizing: border-box;
      width: calc(100vw - 488px);
      height: 100%;
      padding: 10px;
      display: flex;
      flex-wrap: nowrap;

      .left,
      .right {
        box-sizing: border-box;
        width: 50%;
        height: 100%;
        border-right: 1px solid #c9c9c9;
        padding-right: 10px;
        overflow-y: auto;
        overflow-x: hidden;

        // &::-webkit-scrollbar {
        //   display: none;
        // }

        &::-webkit-scrollbar {
          width: 5px;
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
        dl {
          margin-bottom: 15px;

          .v-enter,
          .v-leave-to {
            opacity: 0;
            transform: translateX(80px);
          }
          .v-enter-active,
          .v-leave-active {
            transition: all 0.5s;
          }
          .v-enter-to,
          .v-leave {
            opacity: 1;
            transform: translateX(0px);
          }

          dd {
            font-size: 16px;
            padding: 6px 0;
            padding-left: 5px;
            display: flex;
            align-items: center;
            border-bottom: 1px dashed #b8e5f8;
            position: relative;
            .icon-yuanxing,
            .icon-tick {
              height: 100%;
              font-size: 24px;
              vertical-align: middle;
              margin-right: 5px;
              cursor: pointer;
              position: relative;
              &::after {
                content: "";
                position: absolute;
                width: 80%;
                height: 75%;
                border-radius: 50%;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                transition: all 0.4s;
              }
            }
            .icon-tick {
              font-size: 23px;
            }
            p {
              margin: 0;
              padding: 0;
            }
          }
        }
        .dl-a {
          border-left: 2px solid #f87d55;
          border-radius: 2px;
          dd {
            &:hover {
              background-color: #ffede7;
            }
          }
          i {
            color: #f76333;
            &:hover {
              &::after {
                background-color: #f76333;
              }
            }
          }
        }
        .dl-b {
          border-left: 2px solid #febb82;
          border-radius: 2px;
          dd {
            &:hover {
              background-color: #ffefcb;
            }
          }
          i {
            color: #feae6a;
            &:hover {
              &::after {
                background-color: #feae6a;
              }
            }
          }
        }
        .dl-c {
          border-left: 2px solid #5fc2e0;
          border-radius: 2px;
          dd {
            &:hover {
              background-color: #d6f4fe;
            }
          }
          i {
            color: #3fb6da;
            &:hover {
              &::after {
                background-color: #3fb6da;
              }
            }
          }
        }
      }

      .right {
        border: none;
        padding-left: 8px;
        dl {
          padding-left: 1px;
          dd {
            padding-left: 7px;
          }
          i {
            &:hover {
              &::after {
                display: none;
              }
            }
          }
        }
        .dl-a {
          dd {
            &:hover {
              background-color: #efd;
            }
          }
          i {
            color: #89c557;
          }
        }
        .dl-b {
          dd {
            &:hover {
              background-color: #efd;
            }
          }
          i {
            color: #89c557;
          }
        }
        .dl-c {
          dd {
            &:hover {
              background-color: #efd;
            }
          }
          i {
            color: #89c557;
          }
        }
      }
    }
  }

  .input {
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    height: 43px;
    width: 100%;
    padding: 0 10px;
    background-color: #fff;
    position: relative;
    input {
      box-sizing: border-box;
      width: 100%;
      padding: 8px;
      padding-right: 120px;
      font-size: 16px;
      outline: none;
      border: none;
      border-left: 2px solid #73c9e5;
      border-radius: 3px;
      background-color: #f0f9fb;
    }

    .box {
      position: absolute;
      right: 15px;
      top: 15px;
      i {
        font-size: 20px;
        margin-right: 5px;
        position: relative;
        cursor: pointer;
        &::after {
          content: "";
          position: absolute;
          width: 80%;
          height: 80%;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          transition: all 0.4s;
        }
      }
      .box-a {
        color: #f76333;
        &:hover {
          &::after {
            background-color: #f76333;
          }
        }
      }
      .box-after-a {
        &::after {
          background-color: #f76333;
        }
      }
      .box-b {
        color: #feae6a;
        &:hover {
          &::after {
            background-color: #feae6a;
          }
        }
      }
      .box-after-b {
        &::after {
          background-color: #feae6a;
        }
      }
      .box-c {
        color: #3fb6da;
        &:hover {
          &::after {
            background-color: #3fb6da;
          }
        }
      }
      .box-after-c {
        &::after {
          background-color: #3fb6da;
        }
      }
      .icon-plus {
        font-size: 22px;

        &:hover {
          color: #ff2b43;
          cursor: pointer;
        }
      }
    }
  }
}
</style>