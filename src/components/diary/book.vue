<template>
  <div class="card" :class="{'open':word}">
    <div class="imgBox">
      <img v-if="img==='diary'" src="@/assets/img/diaryImg/diary.png" alt="日记封面" />
      <img v-else-if="img==='xzz'" src="@/assets/img/diaryImg/xzz.png" alt="日记封面" />
      <div class="bark"></div>
    </div>
    <div class="datalist">
      <h4 contenteditable="true">{{title}}</h4>
      <p contenteditable="true">{{content}}</p>
      <div class="buttonBox">
        <button @click="$emit('changeComponent','book')">{{button}}</button>
        <button @click="$emit('deleteDiary',index)">删除日记本</button>
        <button @click="$emit('changeImg',index)">换封面</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    content: String,
    img: String,
    word: Boolean,
    button: String,
    index: Number
  },
  data() {
    return {
      //   word: false
    };
  },
  mounted() {
    console.log(this.img);
  }
};
</script>

<style lang="less" scoped>
.card {
  width: 300px;
  height: 400px;
  position: relative;
  background-color: #e0e1dc;
  box-shadow: inset 180px 0px 22px rgba(0, 0, 0, 0.4),
    20px 0px 60px rgba(0, 0, 0, 0.5);
  transition: 0.7s;
  transform: rotateX(38deg);
  transform-style: preserve-3d;
  perspective: 2000px;

  &:hover {
    // transform: rotate(10deg) scale(1.2);
    transform: rotate(10deg) scale(1.2) translateX(100px) translateY(30px);
    box-shadow: inset 20px 0 50px rgba(0, 0, 0, 0.4),
      20px 0px 60px rgba(0, 0, 0, 0.5);
  }

  &::before {
    content: "";
    width: 100%;
    height: 15px;
    background-color: #bac1ba;
    position: absolute;
    bottom: 0px;
    left: 0px;
    transform: rotateX(90deg);
    transform-origin: bottom;
  }
  &::after {
    content: "";
    width: 15px;
    height: 100%;
    background-color: #bac1ba;
    position: absolute;
    top: 0px;
    right: -15px;
    transform: rotateY(90deg);
    transform-origin: left;
  }

  .imgBox {
    width: 100%;
    height: 100%;
    transition: all 0.7s;
    transform-origin: left;

    img {
      width: 100%;
    }
    .bark {
      width: 100%;
      height: 100%;
      background-color: #fff;
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0;
      transition: all 0.7s;
    }
  }

  &:hover .imgBox {
    transform: rotateY(-150deg);
  }

  &:hover .bark {
    opacity: 1;
    // box-shadow: inset 130px 55px 100px rgba(0, 0, 0, 0.4);
    box-shadow: inset 300px 20px 100px rgba(0, 0, 0, 0.4);
  }

  .datalist {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 8px;
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: -1;
    overflow: hidden;
  }
  .buttonBox {
    position: absolute;
    left: 0px;
    bottom: 0px;
    width: 100%;

    button {
      width: 60%;
      margin: auto;
      margin-bottom: 10px;
      border: none;
      outline: none;
      padding: 5px 0px;
      cursor: pointer;
      background-color: rgba(0, 0, 0, 0);

      &:hover {
        background-color: #12aa9c;
        color: #fff;
      }
    }
  }
}
.open:hover {
  transform: rotate(0deg) scale(1.7) translateX(145px) translateY(9px);
  opacity: 0;
}
</style>