<template>
  <div
    class="mindId"
    ref="raphaelContainer"
    :style="{height:this.containerHeight,width:this.containerWidth}"
  >
    <Node
      v-for="node in newNodeList"
      :key="node.id"
      :config="node"
      @setSelect="setSelect($event)"
      @inEdit="inEdit"
      @repaintNode="reapintRoot();"
    />
  </div>
</template>

<script>
import Raphael from "raphael";
import Node from "./node.vue";
export default {
  components: { Node },
  data() {
    return {
      nodeList: [
        {
          id: "0node",
          index: 0,
          rank: 1,
          text: "一级标题",
          top: "calc(50% - 25.2px)",
          left: "calc(50% - 57px)",
          width: 0,
          height: 0,
          direction: "",
          subNode: { left: [], right: [] },
          parentNode: null,
          isActive: false,
          zIndex: 0,
          height: 52.4 //节点高度=该节点的所有子节点的高度之和加上节点间间隙之和
        }
      ],
      paper: null, //raphael实例
      selectIndex: null, //当前选中的节点的index，当选中了节点时按下键盘才能添加节点
      selectPIndex: null,
      editText: false, //当前是否在编辑文本
      subDirection: "left",
      zIndex: 1,
      up: false, //当有节点的top小于52.4时，根节点向下移动一个位置
      edge: false,
      containerHeight: "100vh",
      containerWidth: "100vw"
    };
  },
  mounted() {
    this.containerHeight = this.$refs.raphaelContainer.offsetHeight + "px";
    this.containerWidth = this.$refs.raphaelContainer.offsetWidth + "px";
    this.initRaphael();
    console.log(this.paper);
    window.addEventListener("keydown", e => {
      if (this.selectIndex !== null && e.keyCode === 13 && !this.editText) {
        this.addNode();
      }
      if (this.selectIndex !== null && e.keyCode === 8 && !this.editText) {
        if (this.selectIndex != 0) {
          let parentNode = this.nodeList[
            this.nodeList[this.selectIndex].parentNode
          ]; //选中节点的父节点
          console.log(parentNode);
          let subList = parentNode.subNode; //选中节点的父节点的子节点列表
          let thisIndex = subList.indexOf(this.selectIndex); //选中的节点在父节点的子节点列表中的索引
          console.log("thisIndex", thisIndex);
          subList.splice(thisIndex, 1);
          this.nodeList[this.selectIndex].path.remove(); //删除当前节点的线
          this.nodeList.splice(this.selectIndex, 1, "");
          console.log(this.nodeList);
          //   setTimeout(() => {
          this.reapintParentD(this.selectPIndex);
          this.reapintRoot();
          //   });
        }
      }
      console.log(e.keyCode);
    });
    window.addEventListener("mousedown", e => {
      if (this.selectIndex !== null && this.nodeList[this.selectIndex] !== "") {
        this.nodeList[this.selectIndex].isActive = false;
      }
      this.selectIndex = null;
    });
  },
  methods: {
    //初始化Raphael
    initRaphael() {
      this.raphaelDom = this.$refs.raphaelContainer;
      this.paper = Raphael(this.raphaelDom);
    },
    setSelect(index) {
      this.nodeList[index].isActive = true; //被选中的节点边框高亮
      this.nodeList[index].zIndex = ++this.zIndex; //被选中的节点层级最高
      this.selectIndex = index;
      this.selectPIndex = this.nodeList[index].parentNode;
    },
    inEdit() {
      this.editText = !this.editText;
    },
    addNode() {
      let parentNode = this.nodeList[this.selectIndex]; //当前选中节点
      let newNode = {
        id: parseFloat(this.nodeList.length - 1) + 1 + "node",
        index: this.nodeList.length,
        rank: 2,
        text: "一级标题",
        top: "",
        left: "",
        width: 0,
        height: 52.4,
        direction: "",
        subNode: [],
        parentNode: this.selectIndex,
        isActive: false,
        zIndex: 0,
        height: 52.4
      };
      this.nodeList.push(newNode); //添加节点对象至渲染数组中
      //在父节点的subNode中添加该节点对象的索引，添加根节点的子节点时要分左右两个数组
      if (parentNode.rank == 1) {
        if (this.subDirection == "left") {
          parentNode.subNode.left.push(this.nodeList.length - 1);
          parentNode.direction = "left";
          this.nodeList[this.nodeList.length - 1].direction = "left";
          this.subDirection = "right";
        } else {
          parentNode.subNode.right.push(this.nodeList.length - 1);
          parentNode.direction = "right";
          this.nodeList[this.nodeList.length - 1].direction = "right";
          this.subDirection = "left";
        }
      } else {
        this.nodeList[this.nodeList.length - 1].direction =
          parentNode.direction;
        parentNode.subNode.push(this.nodeList.length - 1);
      }
      //   setTimeout(() => {
      this.repaintNode(this.selectIndex); //每次添加新节点，重新渲染新节点的父节点的所有子节点
      this.reapintParent(this.selectIndex); //每次添加子节点就撑开父节点及其同级节点
      //   });

      console.log(this.nodeList);
    },
    repaintNode(parentIndex, edit) {
      //传入一个节点，重新渲染该节点的子节点的内容，然后递归该节点子节点
      let parentNode = this.nodeList[parentIndex]; //父节点对象
      let subList;
      if (parentNode.rank == 1) {
        if (parentNode.direction == "left") {
          subList = parentNode.subNode.left;
        } else {
          subList = parentNode.subNode.right;
        }
      } else {
        subList = parentNode.subNode;
      }
      if (edit) {
        subList = parentNode.subNode[edit];
        parentNode.direction = edit;
      }
      //循环计算子节点的位置
      subList.forEach((sub, index) => {
        //计算横坐标位置
        if (parentNode.direction == "left") {
          if (this.nodeList[sub].width == "") {
            //没有得到宽度时先设置为初始宽度
            this.nodeList[sub].left =
              parseFloat(parentNode.left) - 48.32 - 100 + "px";
          } else {
            this.nodeList[sub].left =
              parseFloat(parentNode.left) -
              this.nodeList[sub].width -
              100 +
              "px";
          }
        } else {
          this.nodeList[sub].left =
            parseFloat(parentNode.left) + parentNode.width + 100 + "px";
        }

        //计算纵坐标位置
        if (this.nodeList[sub].data) {
          console.log("1rank");
          if (this.selectIndex != parentIndex) {
            this.nodeList[sub].top =
              parseFloat(parentNode.top) - this.nodeList[sub].data + "px";
          } else {
            if (this.selectIndex < sub || this.selectIndex == 0) {
              this.nodeList[sub].top =
                parseFloat(parentNode.top) -
                this.nodeList[sub].data -
                52.4 -
                25 +
                "px";
            } else {
              this.nodeList[sub].top =
                parseFloat(parentNode.top) +
                this.nodeList[sub].data +
                52.4 +
                25 +
                "px";
            }
          }
          this.nodeList[sub].data =
            parseFloat(parentNode.top) - parseFloat(this.nodeList[sub].top);
        } else if (this.nodeList[subList[index - 1]]) {
          console.log("2rank");
          this.nodeList[sub].top =
            parseFloat(this.nodeList[subList[index - 1]].top) +
            parseFloat(this.nodeList[subList[index - 1]].subNode.length / 2) *
              52.4 +
            parseFloat(
              (this.nodeList[subList[index - 1]].subNode.length - 1) / 2
            ) *
              25 +
            52.4 +
            37.5 +
            "px";
        } else {
          console.log("3rank");
          this.nodeList[sub].top =
            parseFloat(parentNode.top) -
            (subList.length * 52.4 + (subList.length - 1) * 25) / 2 +
            index * (52.4 + 25) +
            25 +
            "px";
        }
        //判断是否有节点top小于0
        if (parseFloat(this.nodeList[sub].top) < 52.4) {
          console.log("uptrue");
          this.up = true;
        }
        if (parseFloat(this.nodeList[sub].left) < 52.4) {
          this.edge = true;
        }
        //修改画布大小
        if (
          parseFloat(this.nodeList[sub].top) > parseFloat(this.containerHeight)
        ) {
          this.containerHeight =
            parseFloat(this.nodeList[sub].top) + 52.4 + 25 + "px";

          this.paper.setSize(
            this.paper.width,
            parseFloat(this.nodeList[sub].top) + 52.4 + 25 + "px"
          );
        }
        if (
          parseFloat(this.nodeList[sub].left) > parseFloat(this.containerWidth)
        ) {
          this.containerWidth =
            parseFloat(this.nodeList[sub].left) + 200 + "px";
          this.paper.setSize(
            parseFloat(this.nodeList[sub].left) + 200 + "px",
            this.paper.height
          );
        }
        //设置连线
        this.setPath(parentNode, this.nodeList[sub]);
        //递归
        if (this.nodeList[sub].subNode[0]) {
          this.repaintNode(sub);
        }
      });
    },
    reapintParent(parentIndex) {
      //传入一个节点，撑开该节点的同级节点，然后递归该节点父节点
      //子节点位置全部计算好位置后撑开父节点同级节点
      let parentNode = this.nodeList[parentIndex]; //父节点对象
      let subList = parentNode.subNode;
      if (parentNode.rank != 1) {
        //根节点没有父节点
        let grandpaNode = this.nodeList[parentNode.parentNode]; //父节点的父节点
        let parentList; //父节点同级节点列表
        if (grandpaNode.rank == 1) {
          //根节点需要额外判断
          if (parentNode.direction == "left") {
            parentList = grandpaNode.subNode.left;
          } else {
            parentList = grandpaNode.subNode.right;
          }
        } else {
          parentList = grandpaNode.subNode;
        }
        let thisIndex = parentList.indexOf(parentIndex);
        console.log(parentList);
        parentList.forEach((node, index) => {
          //父节点以上的节点减一半子节点集合高，以下的加上一半子节点集合高度
          if (this.nodeList[this.selectIndex].subNode.length <= 1) {
            return;
          }
          if (index < thisIndex) {
            this.nodeList[node].top =
              parseFloat(this.nodeList[node].top) - 38.65 + "px";
            this.nodeList[node].data =
              parseFloat(grandpaNode.top) - parseFloat(this.nodeList[node].top);
            this.repaintNode(node);
          } else if (index > thisIndex) {
            this.nodeList[node].top =
              parseFloat(this.nodeList[node].top) + 38.65 + "px";
            this.nodeList[node].data =
              parseFloat(grandpaNode.top) - parseFloat(this.nodeList[node].top);
            this.repaintNode(node);
          } else {
            this.nodeList[node].data =
              parseFloat(grandpaNode.top) - parseFloat(this.nodeList[node].top);
          }
          this.setPath(grandpaNode, this.nodeList[node]);

          //判断是否有节点top小于0
          if (parseFloat(this.nodeList[node].top) < 52.4) {
            this.up = true;
          }
          if (parseFloat(this.nodeList[node].left) < 52.4) {
            this.edge = true;
          }
          //修改画布大小
          if (
            parseFloat(this.nodeList[node].top) >
            parseFloat(this.containerHeight)
          ) {
            this.containerHeight =
              parseFloat(this.nodeList[node].top) + 52.4 + 25 + "px";

            this.paper.setSize(
              this.paper.width,
              parseFloat(this.nodeList[node].top) + 52.4 + 25 + "px"
            );
          }
          if (
            parseFloat(this.nodeList[node].left) >
            parseFloat(this.containerWidth)
          ) {
            this.containerWidth =
              parseFloat(this.nodeList[node].left) + 200 + "px";
            this.paper.setSize(
              parseFloat(this.nodeList[node].left) + 200 + "px",
              this.paper.height
            );
          }
        });
        //设置连线
        if (parentNode.parentNode) {
          this.reapintParent(parentNode.parentNode);
        }
      }
    },
    reapintParentD(parentIndex) {
      //传入一个节点，撑开该节点的同级节点，然后递归该节点父节点
      //子节点位置全部计算好位置后撑开父节点同级节点
      let parentNode = this.nodeList[parentIndex]; //父节点对象
      console.log("parentNode", parentNode);
      let subList = parentNode.subNode;
      if (parentNode.rank != 1) {
        //根节点没有父节点
        let grandpaNode = this.nodeList[parentNode.parentNode]; //父节点的父节点
        let parentList; //父节点同级节点列表
        if (grandpaNode.rank == 1) {
          //根节点需要额外判断
          if (parentNode.direction == "left") {
            parentList = grandpaNode.subNode.left;
          } else {
            parentList = grandpaNode.subNode.right;
          }
        } else {
          console.log("grandpaNode", grandpaNode);
          parentList = grandpaNode.subNode;
        }
        let thisIndex = parentList.indexOf(parentIndex);
        console.log(parentList);
        parentList.forEach((node, index) => {
          // 父节点以上的节点减一半子节点集合高，以下的加上一半子节点集合高度
          //   if (parentNode.subNode.length < 1) {
          //     return;
          //   }
          if (index < thisIndex) {
            if (this.nodeList[this.selectPIndex].subNode.length >= 1) {
              this.nodeList[node].top =
                parseFloat(this.nodeList[node].top) + 38.65 + "px";
              this.nodeList[node].data =
                parseFloat(grandpaNode.top) -
                parseFloat(this.nodeList[node].top);
              this.repaintNode(node);
            }

            if (this.subNum(this.nodeList[node])) {
              console.log("gogogogo");
              this.nodeList[node].data = null;
            }
          } else if (index > thisIndex) {
            if (this.nodeList[this.selectPIndex].subNode.length >= 1) {
              this.nodeList[node].top =
                parseFloat(this.nodeList[node].top) - 38.65 + "px";
              this.nodeList[node].data =
                parseFloat(grandpaNode.top) -
                parseFloat(this.nodeList[node].top);
              this.repaintNode(node);
            }
            if (this.subNum(this.nodeList[node])) {
              this.nodeList[node].data = null;
            }
          } else {
            if (this.nodeList[this.selectPIndex].subNode.length >= 1) {
              this.nodeList[node].data =
                parseFloat(grandpaNode.top) -
                parseFloat(this.nodeList[node].top);
            }
            if (this.subNum(this.nodeList[node])) {
              this.nodeList[node].data = null;
            }
          }
          this.setPath(grandpaNode, this.nodeList[node]);

          //判断是否有节点top小于0
          if (parseFloat(this.nodeList[node].top) < 52.4) {
            this.up = true;
          }
          if (parseFloat(this.nodeList[node].left) < 52.4) {
            this.edge = true;
          }
          //修改画布大小
          if (
            parseFloat(this.nodeList[node].top) >
            parseFloat(this.containerHeight)
          ) {
            this.containerHeight =
              parseFloat(this.nodeList[node].top) + 52.4 + 25 + "px";

            this.paper.setSize(
              this.paper.width,
              parseFloat(this.nodeList[node].top) + 52.4 + 25 + "px"
            );
          }
          if (
            parseFloat(this.nodeList[node].left) >
            parseFloat(this.containerWidth)
          ) {
            this.containerWidth =
              parseFloat(this.nodeList[node].left) + 200 + "px";
            this.paper.setSize(
              parseFloat(this.nodeList[node].left) + 200 + "px",
              this.paper.height
            );
          }
        });
        if (parentNode.parentNode) {
          this.reapintParentD(parentNode.parentNode);
        }
      }
    },
    reapintRoot() {
      this.repaintNode(0, "left");
      this.repaintNode(0, "right");
    },
    subNum(node) {
      //传入一个子节点，判断其及其同级节点的子节点的数量是否为0
      let parentNode = this.nodeList[node.parentNode];
      console.log("subNumParentNode", parentNode);
      let nodeList;
      if (parentNode.rank == 1) {
        if (parentNode.direction == "left") {
          nodeList = parentNode.subNode.left;
        } else {
          nodeList = parentNode.subNode.right;
        }
      } else {
        nodeList = parentNode.subNode;
      }

      let num = true;
      nodeList.forEach(node => {
        if (this.nodeList[node].subNode.length >= 1) {
          num = false;
          return;
        }
      });
      return num;
    },
    setPath(parentNode, subNode) {
      //父节点和子节点
      if (!subNode.path) {
        subNode.path = this.paper
          .path(
            `M${parseFloat(parentNode.left) +
              parentNode.width / 2},${parseFloat(parentNode.top) +
              parentNode.height / 2}L${parseFloat(subNode.left) +
              subNode.width / 2},${parseFloat(subNode.top) +
              subNode.height / 2}`
          )
          .attr({ stroke: "#22a2c3", "stroke-width": 2 });
      } else {
        subNode.path.attr({
          path: `M${parseFloat(parentNode.left) +
            parentNode.width / 2},${parseFloat(parentNode.top) +
            parentNode.height / 2}L${parseFloat(subNode.left) +
            subNode.width / 2},${parseFloat(subNode.top) + subNode.height / 2}`
        });
      }
    }
  },
  computed: {
    newNodeList() {
      console.log(this.nodeList.filter(item => item != ""));
      return this.nodeList.filter(item => item != "");
    }
  },
  watch: {
    up(newUp, oldUp) {
      console.log(oldUp, newUp);
      if (newUp) {
        this.nodeList[0].top =
          parseFloat(this.nodeList[0].top) + 52.4 + 25 + "px";
        // setTimeout(() => {
        this.reapintRoot();
        // });
        this.up = false;
      }
    },
    edge(newEdge, oldEdge) {
      console.log(oldEdge, newEdge);
      if (newEdge) {
        this.nodeList[0].left =
          parseFloat(this.nodeList[0].left) + 52.4 + 100 + "px";
        // setTimeout(() => {
        this.reapintRoot();
        // });
        this.edge = false;
      }
    },
    nodeList() {
      this.nodeList.filter(item => item != "");
    }
  }
};
</script>

<style lang="less" scoped>
.mindId {
  width: 100vw;
  height: 100vh;
}
</style>