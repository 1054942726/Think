<template>
  <div class="note">
    <!--工具栏 -->
    <div class="tool">
      <ul class="class">
        <li :class="{'class-active':page==='all'}" @click="changePage('all')">全部(3)</li>
        <li :class="{'class-active':page==='collection'}" @click="changePage('collection')">收藏(1)</li>
        <li :class="{'class-active':page==='delete'}" @click="changePage('delete')">回收站(2)</li>
      </ul>
      <div class="toolArea">
        <div class="filter">
          <div>
            年
            <i class="iconfont icon-down"></i>
          </div>
          <div>
            月
            <i class="iconfont icon-down"></i>
          </div>
        </div>
        <div class="search">
          <input placeholder="请输入关键词" type="text" />
          <button>搜索</button>
        </div>
      </div>
    </div>
    <!-- 内容区 -->
    <ul v-if="dataList!=false">
      <transition-group>
        <li v-for="(item,index) in dataList" :key="item.time">
          <router-link :to="`/edit/${item.title}`" tag="h2" title="编辑">{{item.title}}</router-link>
          <div class="menu">
            <i
              class="iconfont icon-edit-square"
              @click="$emit('menuShow',index)"
              :class="{'active-i':item.menuShow}"
            ></i>
            <transition name="sonMenu">
              <ul v-show="item.menuShow">
                <router-link :to="`/edit/${item.title}`" tag="li">编辑</router-link>
                <li @click="$emit('movePosition',{index,type:'top'})">置顶</li>
                <li @click="$emit('movePosition',{index,type:'up'})">上移</li>
                <li @click="$emit('movePosition',{index,type:'down'})">下移</li>
              </ul>
            </transition>
          </div>
          <div class="state">
            <span>{{item.time}}</span>
            <div class="button">
              <span class="see" @click="toSee(item)">查看</span>
              <span @click="$emit('deleteItem',index)">删除</span>
            </div>
          </div>
        </li>
      </transition-group>
    </ul>
  </div>
</template>
<script>
export default {
  props: ["noteDataList"],
  data() {
    return {
      dataList: this.noteDataList,
      page: "all" //all：全部，collection：收藏，delete：回收站
    };
  },
  mounted() {},
  methods: {
    toSee(item) {
      //切换到查看页面
      this.$router.push(`/edit/${item.title}`);
      //用于判断是查看还是编辑
      this.$store.commit("changeSee");
    },
    changePage(type) {
      if (type === "all") {
        this.page = "all";
        //发送ajax请求，请求想应数据
        this.$emit("getData", "all");
      } else if (type === "collection") {
        this.page = "collection";
        //发送ajax请求，请求想应数据
        this.$emit("getData", "collection");
      } else if (type === "delete") {
        this.page = "delete";
        //发送ajax请求，请求想应数据
        this.$emit("getData", "delete");
      }
    }
  },
  watch: {
    noteDataList() {
      this.dataList = this.noteDataList;
    }
  }
};
</script>

<style lang="less" scoped>
.note {
  box-sizing: border-box;
  min-height: calc(100vh - 59px);
  background-color: #fff;
  ul,
  li {
    box-sizing: border-box;
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
  .tool {
    margin: 0 20px;
    padding-top: 13px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ddd;
    .class {
      display: flex;
      justify-content: space-between;
      align-items: center;
      li {
        border: none;
        margin: 0;
        margin-right: 15px;
        padding: 13px 0;
        font-size: 14px;
        font-weight: bold;
        color: #999;
        cursor: pointer;
        border-bottom: 2px solid rgba(0, 0, 0, 0);
      }
      .class-active {
        color: #4d4d4d;
        border-bottom: 2px solid #ff2b43;
      }
    }
    .toolArea {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .filter {
        display: flex;
        justify-content: space-between;
        align-items: center;

        div {
          padding: 4px 15px;
          border: 1px solid #ddd;
          margin-right: 10px;
          border-radius: 4px;
          cursor: pointer;
          padding: 4px 15px;
          color: #999;
          font-size: 14px;
          border: 1px solid #ddd;
          margin-right: 10px;
          border-radius: 4px;
          cursor: pointer;
        }
        i {
          margin-left: 8px;
          color: #999;
          font-size: 14px;
        }
      }
      .search {
        display: flex;
        justify-content: space-between;
        align-items: center;
        input,
        button {
          border: none;
          outline: none;
        }
        input {
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 4px 10px;
          margin: 0 10px;
          font-size: 13px;
        }
        button {
          border: 1px solid #73c9e5;
          color: #73c9e5;
          border-radius: 4px;
          padding: 3px 10px;
          font-size: 12px;
          cursor: pointer;
          background: none;
        }
      }
    }
  }
  ul {
    background-color: #fff;
    li {
      background-color: #fff;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      padding: 15px 0;
      margin: 0 20px;
      border-bottom: 1px solid #ddd;
      &:hover {
        .menu {
          i {
            display: inline;
          }
        }
      }
      h2 {
        display: inline;
        margin: 0;
        font-size: 18px;
        font-weight: normal;
        color: #4d4d4d;
        cursor: pointer;
        &:hover {
          color: #ff2b43;
        }
      }

      .menu {
        position: relative;
        padding-left: 5px;
        // &:hover {
        //   ul {
        //     display: flex;
        //   }
        // }
        i {
          display: none;
          color: #73c9e5;
          cursor: pointer;
          font-size: 18px;
          padding: 5px;
          &:hover {
            color: #ff2b43;
          }
        }
        .active-i {
          display: inline;
        }
        ul {
          display: flex;
          position: absolute;
          top: -4px;
          left: -144px;
          width: 140px;
          background: #fff;
          z-index: 1;
          border: 1px solid #ddd;
          border-radius: 4px;
          li {
            font-size: 12px;
            color: #73c9e5;
            margin: 0;
            padding: 5px;
            border: none;
            &:hover {
              cursor: pointer;
              background-color: #fff2f4;
              color: #ff2b43;
            }
          }
          &::before,
          &::after {
            display: block;
            content: "";
            width: 0;
            height: 0;
            border: 7px solid rgba(0, 0, 0, 0);
            position: absolute;
          }
          &::before {
            border-left: 10px solid #ddd;
            top: 6px;
            right: -17px;
          }
          &::after {
            border-left: 10px solid #fff;
            top: 6px;
            right: -16px;
          }
        }

        .sonMenu-enter,
        .sonMenu-leave-to {
          opacity: 0;
          transform: translateX(25px);
        }
        .sonMenu-enter-active,
        .sonMenu-leave-active {
          transition: all 0.3s;
        }
        .sonMenu-enter-to,
        .sonMenu-leave {
          opacity: 1;
          transform: translateY(0px);
        }
      }
      .state {
        width: 100%;
        padding-top: 8px;
        display: flex;
        justify-content: space-between;
        span {
          color: #999;
          font-size: 12px;
        }
        .button {
          span {
            color: #73c9e5;
            padding: 0 5px;
            cursor: pointer;
            &:hover {
              color: #ff2b43;
            }
          }
          .see {
            border-right: 1px solid #ddd;
          }
        }
      }
    }

    // .v-enter,
    // .v-leave-to {
    //   opacity: 0;
    //   transform: translateY(80px);
    // }
    // .v-enter-active,
    // .v-leave-active {
    //   transition: all 0.3s;
    // }
    // .v-enter-to,
    // .v-leave {
    //   opacity: 1;
    //   transform: translateY(0px);
    // }
    .v-move {
      transition: transform 0.3s;
    }
  }
}
</style>