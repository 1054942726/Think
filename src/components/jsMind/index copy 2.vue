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
      reapint: false,
      containerHeight: "100vh",
      containerWidth: "100vw",
      minTop: null,
      maxTop: null
    };
  },
  mounted() {
    this.containerHeight = this.$refs.raphaelContainer.offsetHeight + "px";
    this.containerWidth = this.$refs.raphaelContainer.offsetWidth + "px";
    this.initRaphael();
    window.addEventListener("keydown", e => {
      if (this.selectIndex !== null && e.keyCode === 13 && !this.editText) {
        this.addNode();
      }
      if (this.selectIndex !== null && e.keyCode === 8 && !this.editText) {
        if (this.selectIndex != 0) {
          let parentNode = this.nodeList[
            this.nodeList[this.selectIndex].parentNode
          ]; //选中节点的父节点
          let subList = parentNode.subNode; //选中节点的父节点的子节点列表
          let thisIndex = subList.indexOf(this.selectIndex); //选中的节点在父节点的子节点列表中的索引
          subList.splice(thisIndex, 1);
          this.nodeList[this.selectIndex].path.remove(); //删除当前节点的线
          this.nodeList.splice(this.selectIndex, 1, "");
          console.log(this.nodeList);
          //   setTimeout(() => {
          //   this.reapintParentD(this.selectPIndex);
          this.reapintRoot();
          //   });
        }
      }
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
        rank: parentNode.rank + 1,
        text: "一级标题",
        top: "",
        left: "",
        width: 0,
        height: 52.4,
        direction: "",
        subNode: [],
        parentNode: this.selectIndex,
        isActive: false,
        zIndex: 0
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
      this.getnodeHeight(this.nodeList[0]);
      //   setTimeout(() => {
      console.log(parentNode.subNode);
      //   this.repaintNode(this.selectIndex); //每次添加新节点，重新渲染新节点的父节点的所有子节点
      this.reapint = true;
      //   this.reapintParent(this.selectIndex); //每次添加子节点就撑开父节点及其同级节点
      //   });

      console.log(this.nodeList);
    },
    forEachNode(parentNode) {
      parentNode.height = 0;
      parentNode.subNode.forEach(node => {
        parentNode.height += this.nodeList[node].height;
        if (this.nodeList[node].subNode[0]) {
          this.forEachNode(this.forEachNode(node));
        }
      });
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
      //循环计算子节点集合高度

      let subAllHeight = 0;
      if (subList.length > 1) {
        subList.forEach((sub, index) => {
          subAllHeight += this.nodeList[sub].height;
        });
        subAllHeight += (subList.length - 1) * 25;
      } else {
        subAllHeight = 52.4;
      }

      //   if (parentNode.height < subAllHeight) {
      //   parentNode.height = subAllHeight;
      //   }
      //循环计算子节点的位置
      subList.forEach((sub, index) => {
        //计算横坐标位置
        if (parentNode.direction == "left") {
          if (this.nodeList[sub].width == "") {
            //没有得到宽度时先设置为初始宽度
            this.nodeList[sub].left =
              parseFloat(parentNode.left) - 48.32 - 60 + "px";
          } else {
            this.nodeList[sub].left =
              parseFloat(parentNode.left) -
              this.nodeList[sub].width -
              60 +
              "px";
          }
        } else {
          this.nodeList[sub].left =
            parseFloat(parentNode.left) + parentNode.width + 60 + "px";
        }

        //计算纵坐标位置
        if (index == 0) {
          //第一个
          this.nodeList[sub].top =
            parseFloat(parentNode.top) - subAllHeight / 2 + 27.1 + "px";
        }
        // else if (
        //   this.nodeList[sub].subNode[0] &&
        //   this.nodeList[subList[index - 1]].subNode[0]
        // ) {
        //   //自己和上一个都有子节点

        //   if (this.nodeList[sub].rank == 2) {
        //     this.nodeList[sub].top =
        //       parseFloat(this.nodeList[subList[index - 1]].top) +
        //       this.nodeList[subList[index - 1]].height / 2 +
        //       25 +
        //       this.nodeList[sub].height / 2 +
        //       "px";
        //   } else {
        //     this.nodeList[sub].top =
        //       parseFloat(this.nodeList[subList[index - 1]].top) +
        //       this.nodeList[subList[index - 1]].height / 4 +
        //       25 +
        //       this.nodeList[sub].height / 2 +
        //       "px";
        //   }
        // } else if (
        //   this.nodeList[subList[index - 1]].subNode[0] &&
        //   this.nodeList[sub].subNode.length == 0
        // ) {
        //   //上一个有子节点,自己没有
        //   if (this.nodeList[sub].rank == 2) {
        //     this.nodeList[sub].top =
        //       parseFloat(this.nodeList[subList[index - 1]].top) +
        //       this.nodeList[subList[index - 1]].height / 2 +
        //       25 +
        //       25 +
        //       "px";
        //   } else {
        //     this.nodeList[sub].top =
        //       parseFloat(this.nodeList[subList[index - 1]].top) +
        //       this.nodeList[subList[index - 1]].height / 4 +
        //       25 +
        //       25 +
        //       "px";
        //   }
        // } else if (
        //   this.nodeList[subList[index - 1]].subNode.length == 0 &&
        //   this.nodeList[sub].subNode[0]
        // ) {
        //   //上一个没有，自己有
        //   if (this.nodeList[sub].rank == 2) {
        //     this.nodeList[sub].top =
        //       parseFloat(this.nodeList[subList[index - 1]].top) +
        //       this.nodeList[subList[index - 1]].height +
        //       this.nodeList[sub].height / 2 +
        //       "px";
        //   } else {
        //     this.nodeList[sub].top =
        //       parseFloat(this.nodeList[subList[index - 1]].top) +
        //       this.nodeList[subList[index - 1]].height +
        //       this.nodeList[sub].height / 4 +
        //       "px";
        //   }
        // }
        // else if (this.nodeList[sub] != 2) {
        //   this.nodeList[sub].top =
        //     parseFloat(this.nodeList[subList[index - 1]].top) +
        //     this.nodeList[subList[index - 1]].height / 4 +
        //     this.nodeList[sub].height / 4 +
        //     25 +
        //     "px";
        // }
        else {
          this.nodeList[sub].top =
            parseFloat(this.nodeList[subList[index - 1]].top) +
            this.nodeList[subList[index - 1]].height / 2 +
            this.nodeList[sub].height / 2 +
            25 +
            "px";
        }

        //判断是否有节点top小于0
        if (parseFloat(this.nodeList[sub].top) < 52.4) {
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

        //循环计算子节点集合高度
        // let subAllHeight = 0;
        // let nodeList = parentNode.subNode;
        // if (nodeList.length > 1) {
        //   subAllHeight = nodeList.length * 52.4 + (nodeList.length - 1) * 25;
        // } else {
        //   subAllHeight = 52.4;
        // }
        parentList.forEach((node, index) => {
          //父节点以上的节点减一半子节点集合高，以下的加上一半子节点集合高度
          if (this.nodeList[this.selectIndex].subNode.length <= 1) {
            return;
          }
          this.nodeList[node].height = 0;
          this.nodeList[node].subNode.forEach(sub => {
            this.nodeList[node].height += this.nodeList[sub].height;
          });

          if (this.nodeList[node].height == 0) {
            this.nodeList[node].height = 52.4;
          } else {
            this.nodeList[node].height +=
              (this.nodeList[node].subNode.length - 1) * 25;
          }
          console.log("this.nodeList[node].height", this.nodeList[node].height);
          if (index < thisIndex) {
            this.nodeList[node].top =
              parseFloat(this.nodeList[node].top) -
              43.34 -
              this.nodeList[this.selectIndex].height / 2 +
              "px";
            this.repaintNode(node);
          } else if (index > thisIndex) {
            this.nodeList[node].top =
              parseFloat(this.nodeList[node].top) +
              this.nodeList[this.selectIndex].height / 2 +
              "px";
            this.repaintNode(node);
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
              52.4 / 2}L${parseFloat(subNode.left) +
              subNode.width / 2},${parseFloat(subNode.top) + 52.4 / 2}`
          )
          .attr({ stroke: "#22a2c3", "stroke-width": 2 });
      } else {
        subNode.path.attr({
          path: `M${parseFloat(parentNode.left) +
            parentNode.width / 2},${parseFloat(parentNode.top) +
            52.4 / 2}L${parseFloat(subNode.left) +
            subNode.width / 2},${parseFloat(subNode.top) + 52.4 / 2}`
        });
      }
    },
    getnodeHeight(node) {
      let nodeHeight = 0;
      let nodeList;

      if (node.rank == 1) {
        if (node.direction == "left") {
          nodeList = node.subNode.left;
        } else {
          nodeList = node.subNode.right;
        }
      } else {
        nodeList = node.subNode;
      }

      //   nodeList.forEach((sub, index) => {
      //     if (this.nodeList[sub].subNode.length == 0) {
      //       nodeHeight += this.nodeList[sub].height + 25;
      //     }
      //     if (this.nodeList[sub].subNode[0]) {
      //       nodeHeight += this.getnodeHeight(this.nodeList[sub]);
      //     }
      //   });
      nodeList.forEach((sub, index) => {
        nodeHeight += this.nodeList[sub].height + 25;

        if (this.nodeList[sub].subNode[0]) {
          this.getnodeHeight(this.nodeList[sub]);
        }
      });
      console.log(nodeHeight);
      node.height = nodeHeight;
      //   return nodeHeight;
    }
  },
  computed: {
    newNodeList() {
      return this.nodeList.filter(item => item != "");
    }
  },
  watch: {
    up(newUp, oldUp) {
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
      if (newEdge) {
        this.nodeList[0].left =
          parseFloat(this.nodeList[0].left) + 52.4 + 100 + "px";
        // setTimeout(() => {
        this.reapintRoot();
        // });
        this.edge = false;
      }
    },
    reapint(newRe, oldUp) {
      if (newRe) {
        this.reapintRoot();
        this.reapint = false;
      }
    },
    nodeList() {
      //   this.reapintRoot();
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