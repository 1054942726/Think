<template>
  <div class="container">
    <div class="headeArea">
      <Mheader />
    </div>
    <div class="bodyArea">
      <div class="asideArea">
        <Maside />
      </div>
      <div class="mainArea">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import Mheader from "@/components/header/index.vue";
import Maside from "@/components/aside/index.vue";
export default {
  components: {
    Mheader,
    Maside
  }
};
</script>

<style lang="less">
body {
  background-color: #f0f9fb;
  -moz-user-select: none; /*火狐baidu*/
  -webkit-user-select: none; /*webkit浏览zhi器dao*/
  -ms-user-select: none; /*IE10*/
  user-select: none;
}
.container {
  .headeArea {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    border-bottom: 8px solid rgba(0, 0, 0, 0);
    z-index: 100;
  }

  .bodyArea {
    width: 100%;
    margin-top: 50px;
    display: flex;
    justify-content: space-between;
    flex-wrap: nowrap;
    height: calc(100vh - 58px);
    overflow: auto;
    .asideArea {
      position: fixed;
      top: 50px;
      left: 150px;
      width: 180px;
      height: calc(100vh - 59px);
    }

    .mainArea {
      box-sizing: border-box;
      width: calc(100vw - 488px);
      margin-left: 338px;
    }
  }
}
</style>