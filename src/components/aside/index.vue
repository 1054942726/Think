<template>
  <div class="aside">
    <!-- 快捷新建 -->
    <div class="addWord">
      <i class="iconfont icon-plus"></i>
      <router-link :to="`/edit/add`" tag="span">新建笔记</router-link>
    </div>
    <!-- 菜单区域 -->
    <div class="menu">
      <ul>
        <router-link :to="{name:'todolist'}" tag="li">
          <i class="iconfont icon-calendar-check"></i>
          <span>ToDoList</span>
        </router-link>
        <li class="noteLi">
          <span class="noteSpan" @click="noteList=!noteList;">
            <i class="iconfont icon-read"></i>
            think笔记
            <i class="iconfont icon-down" v-show="!noteList"></i>
            <i class="iconfont icon-up" v-show="noteList"></i>
          </span>
          <transition name="submenu">
            <ul class="submenu" v-show="noteList">
              <router-link :to="'/note/learn'" tag="li">学习笔记</router-link>
              <router-link :to="'/note/work'" tag="li">工作笔记</router-link>
              <router-link :to="'/note/live'" tag="li">生活笔记</router-link>
            </ul>
          </transition>
        </li>
        <router-link :to="{name:'diary'}" tag="li">
          <i class="iconfont icon-book"></i>
          <span>think日记</span>
        </router-link>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      noteList: false
    };
  }
};
</script>

<style lang="less">
@import url("http://at.alicdn.com/t/font_1973725_0hofvwd6neca.css");
.aside {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding-top: 20px;
  background-color: #fff;

  .addWord {
    box-sizing: border-box;
    width: 150px;
    padding: 8px 10px;
    margin: auto;
    color: #73c9e5;
    border: 1px solid #73c9e5;
    border-radius: 26px;
    text-align: center;
    cursor: pointer;

    i {
      font-size: 20px;
      vertical-align: bottom;
      margin-right: 5px;
    }
  }

  ul,
  li {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }

  .menu {
    ul {
      width: 100%;
      li {
        position: relative;
        z-index: 1;
        padding: 10px 20px;
        margin: 10px 0;
        cursor: pointer;
        border-left: 1px solid rgba(0, 0, 0, 0);

        &::after {
          display: block;
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 0;
          height: 100%;
          background-color: #fff2f4;
          transition: all ease-in-out 0.3s;
          z-index: -1;
        }

        i {
          margin-right: 10px;
          color: #73c9e5;
        }
        .icon-down,
        .icon-up {
          color: #4b4b4b;
          font-size: 12px;
        }

        .submenu-enter,
        .submenu-leave-to {
          height: 0px;
        }
        .submenu-enter-active,
        .submenu-leave-active {
          transition: all 0.2s;
        }
        .submenu-enter-to,
        .submenu-leave {
          height: 132.4px;
        }
      }
      .noteLi {
        padding-left: 0;
        padding-right: 0;
        .noteSpan {
          display: inline-block;
          padding-left: 20px;
        }
        ul {
          overflow: hidden;
        }
        li {
          font-size: 15px;
          margin: 0;
          padding-left: 50px;
          &:first-child {
            margin-top: 10px;
          }
        }
      }
      .router-link-exact-active {
        color: #ff2b43;
        border-left: 2px solid #ff2b43;
        // background-color: #fff2f4;

        i {
          color: #ff2b43;
        }

        &::after {
          width: 100%;
        }
      }
    }
  }
}
</style>