<template>
  <div class="catalog">
    <dl>
      <dt>目录</dt>
      <dd v-for="(item,index) in fileList" :key="index">
        <a class="file" :href="'#'+item.url" v-html="item.type"></a>
      </dd>
    </dl>
  </div>
</template>
<script>
export default {
  data() {
    return {
      hStr: "", //元素字符串
      fileList: [] //目录列表
    };
  },
  mounted() {
    this.getCatalog();
  },
  methods: {
    getCatalog() {
      //接收Right传来的元素字符串
      this.$bus.$on("getHstr", data => {
        this.hStr = data;
      });
      //筛选出所有h标签字符串，生成数组
      const fileTypeList = this.hStr.split(/\n/).filter(tag => {
        return tag.includes(`<h`) && tag.includes("id");
      });
      //得到href值，'<h1 id="欢迎使用马克飞象">欢迎使用马克飞象</h1>'.split(/<[^>]+>/)=>["", "欢迎使用马克飞象", ""]
      const fileUrlList = fileTypeList.map(i =>
        i
          .split(/<[^>]+>/)
          .join("")
          .replace(/\s*/g, "")
      );
      this.fileList = [];
      for (let i = 0; i < fileTypeList.length; i++) {
        this.fileList.push({ url: fileUrlList[i], type: fileTypeList[i] });
      }
    }
  },
  watch: {
    hStr() {
      this.getCatalog();
    }
  }
};
</script>

<style lang='less'>
.catalog {
  box-sizing: border-box;
  font-family: "Helvetica Neue", Arial, "Hiragino Sans GB", "STHeiti",
    "Microsoft YaHei", "WenQuanYi Micro Hei", SimSun, Song, sans-serif;
  width: 20vw;
  height: calc(100vh - 55px);
  border-left: 1px solid #ddd;
  background-color: #f5f6f7;
  overflow: auto;

  a {
    text-decoration: none;
  }
  dl,
  dt,
  dd {
    padding: 0;
    margin: 0;
    list-style-type: none;
  }
  dt {
    font-size: 20px;
    font-weight: bold;
    color: #4f4f4f;
    margin: 12px auto;
    margin-left: 20px;
  }
  h1 {
    font-size: 18px;
    color: #4f4f4f;
    font-weight: normal;
    margin: 12px auto;
    margin-left: 20px;
  }
  h2 {
    font-size: 16px;
    font-weight: normal;
    color: #4f4f4f;
    margin: 8px auto;
    margin-left: 35px;
  }
  h3,
  h4,
  h5,
  h6 {
    font-size: 14px;
    font-weight: normal;
    color: #4f4f4f;
    margin: 5px auto;
    margin-left: 50px;
  }
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
}
</style>