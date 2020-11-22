<template>
  <div
    class="container"
    :class="{left:data.direction=='left'}"
    :style="[{top:data.top,left:data.left,height:data.height,width:data.width}]"
    ref="container"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: { data: Object },
  updated() {
    this.$nextTick(() => {
      //得到并更新container高度
      if (this.$el.clientHeight != 0) {
        this.data.height = this.$el.clientHeight;
        this.data.width = this.$el.clientWidth;
      }
    });
  }
};
</script>

<style lang="less" scoped>
.container {
  position: absolute;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.left {
  justify-content: flex-end;
}
</style>