<template>
  <div class="header">
    <div class="headLeft">
      <h1 class="logo">
        <span>think</span>
      </h1>
      <div class="callBack">
        <button class="back">
          <i class="iconfont icon-left"></i>
        </button>
        <button class="go">
          <i class="iconfont icon-right"></i>
        </button>
      </div>
      <div class="search">
        <input type="text" />
        <button>
          <i class="iconfont icon-fangdajing"></i>
        </button>
      </div>
    </div>
    <div class="headRight">
      <div class="userImg">
        <div class="img">
          <img src="../../assets/img/userimg-test.jpg" alt="用户头像" />
        </div>
        <span class="name">Dio撒麻</span>
        <i class="iconfont icon-down"></i>
      </div>
      <div class="nuws">
        <i class="iconfont icon-bell"></i>
      </div>
      <div class="lock">
        <i class="iconfont icon-lock"></i>
      </div>
      <div class="signIn">
        <i class="iconfont icon-carryout"></i>
      </div>
      <div class="set">
        <i
          class="iconfont icon-setting"
          @click="setMenuShow=!setMenuShow"
          :class="{'active-set':setMenuShow}"
        ></i>
        <ul v-show="setMenuShow">
          <li class="setItem">主题颜色</li>
          <li class="setItem">笔记本名称</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      setMenuShow: false
    };
  },
  mounted() {
    window.addEventListener("click", e => {
      let className = e.target.className;
      if (!className != "setItem" && !className.includes("icon-setting")) {
        this.setMenuShow = false;
      }
    });
  }
};
</script>

<style lang="less">
@import url("http://at.alicdn.com/t/font_1973725_u6ajf7tfi1r.css");
.header {
  box-sizing: border-box;
  width: 100%;
  height: 43px;
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
  background: #fff;

  button {
    border: none;
    outline: none;
    background: none;
    margin: 0;
    padding: 0;
  }

  .headLeft {
    width: 400px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: nowrap;
    margin-left: 150px;

    .logo {
      width: 86px;
      height: 26px;

      background-image: url("../../assets/img/thinkLog.png");
      background-size: cover;

      span {
        display: none;
      }
    }

    .callBack {
      margin-left: 30px;
      .back,
      .go {
        margin: 8px;

        i {
          color: #73c9e5;
          cursor: pointer;

          &:hover {
            color: #ff2b43;
          }
        }
      }
    }

    .search {
      margin: 0;
      position: relative;

      input {
        width: 160px;
        height: 13px;
        padding: 3px 10px;
        padding-right: 26px;
        font-size: 13px;
        color: #4f4f4f;
        border: 1px solid #73c9e5;
        outline: none;
        border-radius: 16px;
        background-color: #f0f9fb;
      }
      button {
        position: absolute;
        right: 5px;
        padding: 4px;
        cursor: pointer;

        i {
          color: #73c9e5;
          font-size: 15px;

          &:hover {
            color: #ff2b43;
          }
        }
      }
    }
  }

  .headRight {
    width: 290px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: nowrap;
    margin-right: 150px;

    i {
      font-size: 20px;
      color: #73c9e5;
      cursor: pointer;

      &:hover {
        color: #ff2b43;
      }
    }

    .userImg {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: nowrap;

      .img {
        width: 30px;
        height: 30px;
        margin-right: 13px;
        border-radius: 50%;
        overflow: hidden;

        img {
          width: 100%;
        }
      }

      .name {
        font-size: 13px;
        color: #4f4f4f;
      }

      i {
        font-size: 13px;
        padding: 3px 5px;
        padding-left: 10px;

        &:hover {
          color: #ff2b43;
        }
      }
    }

    .set {
      position: relative;
      .active-set {
        color: #ff2b43;
      }
      ul,
      li {
        padding: 0;
        margin: 0;
        list-style-type: none;
      }
      ul {
        position: absolute;
        top: 30px;
        left: 0;
        background-color: #fff;
        border: 1px solid #73c9e5;
        border-radius: 4px;
        width: 90px;
        li {
          font-size: 12px;
          padding: 5px;
          cursor: pointer;
          &:hover {
            background-color: #fff2f4;
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
          border-bottom: 10px solid #73c9e5;
          top: -17px;
          left: 3px;
        }
        &::after {
          border-bottom: 10px solid #fff;
          top: -16px;
          left: 3px;
        }
      }
    }
  }
}
</style>