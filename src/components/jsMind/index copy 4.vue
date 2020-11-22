<template>
  <div
    class="mindId"
    ref="raphaelContainer"
    :style="{height:this.containerHeight,width:this.containerWidth}"
  >
    <Node
      :config="root"
      @setSelect="setSelect($event)"
      @inEdit="inEdit"
      @repaintNode="reapintRoot();"
    />
    <Container v-for="item in containerList" :key="item.id" :data="item">
      <Node
        v-for="node in item.nodeList"
        :key="node.id"
        :config="node"
        @setSelect="setSelect($event)"
        @inEdit="inEdit"
        @repaintNode="reapintRoot();"
      />
    </Container>
  </div>
</template>

<script>
import Raphael from "raphael";
import Node from "./node.vue";
import Container from "./container.vue";
export default {
  components: { Node, Container },
  data() {
    return {
      root: {
        id: "0node",
        index: "root",
        cIndex: "root",
        rank: 1,
        text: "一级标题",
        top: "calc(50% - 25.2px)",
        left: "calc(50% - 57px)",
        width: 0,
        height: 0,
        direction: "",
        subNode: [0, 1],
        parentNode: null,
        isActive: false,
        zIndex: 0,
        height: 52.4 //节点高度=该节点的所有子节点的高度之和加上节点间间隙之和
      },
      containerList: [
        {
          id: "0container",
          index: 0,
          width: "50px",
          height: "",
          top: "",
          left: "",
          direction: "left",
          parentNode: this.root,
          nodeList: [
            // {
            //   id: "1node",
            //   index: 0,
            //   cIndex: 0,
            //   rank: 2,
            //   text: "一级标题",
            //   width: 0,
            //   height: 0,
            //   direction: "",
            //   parentNode: 0,
            //   isActive: false,
            //   zIndex: 0,
            //   height: 52.4 //节点高度=该节点的所有子节点的高度之和加上节点间间隙之和
            // }
          ]
        },
        {
          id: "1container",
          index: 1,
          width: "50px",
          height: "",
          top: "",
          left: "",
          direction: "right",
          parentNode: this.root,
          nodeList: [
            // {
            //   id: "2node",
            //   index: 0,
            //   cIndex: 1,
            //   rank: 2,
            //   text: "一级标题",
            //   width: 0,
            //   height: 0,
            //   direction: "",
            //   parentNode: 1,
            //   isActive: false,
            //   zIndex: 0,
            //   height: 52.4 //节点高度=该节点的所有子节点的高度之和加上节点间间隙之和
            // }
          ]
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
    this.containerList[0].parentNode = this.root;
    this.containerList[1].parentNode = this.root;
    this.initRaphael();
    window.addEventListener("keydown", e => {
      if (this.selectIndex !== null && e.keyCode === 13 && !this.editText) {
        this.addNode();
      }
      //   if (this.selectIndex !== null && e.keyCode === 8 && !this.editText) {
      //     if (this.selectIndex != 0) {
      //       let parentNode = this.nodeList[
      //         this.nodeList[this.selectIndex].parentNode
      //       ]; //选中节点的父节点
      //       let subList = parentNode.subNode; //选中节点的父节点的子节点列表
      //       let thisIndex = subList.indexOf(this.selectIndex); //选中的节点在父节点的子节点列表中的索引
      //       subList.splice(thisIndex, 1);
      //       this.nodeList[this.selectIndex].path.remove(); //删除当前节点的线
      //       this.nodeList.splice(this.selectIndex, 1, "");
      //       console.log(this.nodeList);
      //       //   setTimeout(() => {
      //       //   this.reapintParentD(this.selectPIndex);
      //       this.reapintRoot();
      //       //   });
      //     }
      //   }
    });
    window.addEventListener("mousedown", e => {
      if (this.selectIndex) {
        let selectNode;
        if (this.selectIndex.index == "root") {
          selectNode = this.root;
        } else {
          selectNode = this.containerList[this.selectIndex.cIndex].nodeList[
            this.selectIndex.index
          ];
        }
        if (this.selectIndex !== null && selectNode !== "") {
          selectNode.isActive = false;
        }
        this.selectIndex = null;
      }
    });
  },
  methods: {
    //初始化Raphael
    initRaphael() {
      this.raphaelDom = this.$refs.raphaelContainer;
      this.paper = Raphael(this.raphaelDom);
    },
    setSelect(data) {
      //选中节点高亮，层级为最高
      if (data.index == "root") {
        this.root.isActive = true;
        this.root.zIndex = ++this.zIndex;
        this.root.selectPIndex = "isRoot";
      } else {
        this.containerList[data.cIndex].nodeList[data.index].isActive = true; //被选中的节点边框高亮
        this.containerList[data.cIndex].nodeList[data.index].zIndex = ++this
          .zIndex; //被选中的节点层级最高
        this.selectPIndex = this.containerList[data.cIndex].nodeList[
          data.index
        ].parentNode;
      }

      this.selectIndex = data;
    },
    inEdit() {
      this.editText = !this.editText;
    },
    addNode() {
      let selectNode;
      if (this.selectIndex.index == "root") {
        selectNode = this.root;
      } else {
        selectNode = this.containerList[this.selectIndex.cIndex].nodeList[
          this.selectIndex.index
        ];
      }

      let newNode = {
        id: "",
        index: "",
        cIndex: "",
        rank: 2,
        text: "一级标题",
        width: 0,
        height: 0,
        left: "",
        top: "",
        direction: "",
        subContainer: this.containerList.length,
        parentNode: selectNode,
        isActive: false,
        zIndex: 0,
        height: 52.4
      };
      let newContainer = {
        id: this.containerList.length + "container",
        index: this.containerList.length,
        width: "50px",
        height: "",
        top: "",
        left: "",
        direction: null,
        parentNode: null,
        nodeList: []
      };
      if (selectNode.rank == 1) {
        if (this.subDirection == "left") {
          //添加新节点相关属性
          newNode.direction = "left";
          newNode.id = "0c" + this.containerList[0].nodeList.length + "n";
          newNode.index = this.containerList[0].nodeList.length;
          newNode.cIndex = 0;
          //添加新节点后的容器的相关属性
          newContainer.direction = "left";

          selectNode.direction = "left";
          this.containerList[0].nodeList.push(newNode);
          newContainer.parentNode = this.containerList[newNode.cIndex].nodeList[
            newNode.index
          ];
          this.containerList.push(newContainer);
          this.subDirection = "right";
        } else {
          //选中节点为根节点且当前要往右边添加数据时
          newNode.direction = "right";
          newNode.id = "1c" + this.containerList[1].nodeList.length + "n";
          newNode.index = this.containerList[1].nodeList.length;
          newNode.cIndex = 1;
          //添加新节点后的容器的相关属性
          newContainer.direction = "right";
          selectNode.direction = "right";
          this.containerList[1].nodeList.push(newNode);
          newContainer.parentNode = this.containerList[newNode.cIndex].nodeList[
            newNode.index
          ];
          this.containerList.push(newContainer);
          this.subDirection = "left";
        }
      } else {
        newNode.index = this.containerList[
          selectNode.subContainer
        ].nodeList.length; //选中节点的容器的nodeList的长度

        newNode.id = selectNode.subContainer + "c" + newNode.index + "n";
        newNode.cIndex = selectNode.subContainer;
        newNode.direction = selectNode.direction;
        newContainer.direction = selectNode.direction;

        this.containerList[selectNode.subContainer].nodeList.push(newNode); //在选中节点的容器中添加新节点
        newContainer.parentNode = this.containerList[newNode.cIndex].nodeList[
          newNode.index
        ];
        this.containerList.push(newContainer);

        selectNode.height += 52.4 + 25;
      }

      console.log(this.containerList);
      this.repaintContainer();
    },

    repaintContainer() {
      //循环containerList计算container的top和left并赋值
      //循环计算子节点的位置
      this.containerList.forEach((container, index) => {
        //计算横坐标位置
        // console.log("pL", container.parentNode);
        if (container.direction == "left") {
          container.left =
            parseFloat(container.parentNode.left) -
            parseFloat(container.width) -
            60 +
            "px";
        } else {
          container.left =
            parseFloat(container.parentNode.left) +
            parseFloat(container.parentNode.width) +
            60 +
            "px";
        }

        container.top =
          parseFloat(container.parentNode.top) - container.height / 2 + "px";

        // //判断是否有节点top小于0
        // if (parseFloat(this.nodeList[sub].top) < 52.4) {
        //   this.up = true;
        // }
        // if (parseFloat(this.nodeList[sub].left) < 52.4) {
        //   this.edge = true;
        // }
        // //修改画布大小
        // if (
        //   parseFloat(this.nodeList[sub].top) > parseFloat(this.containerHeight)
        // ) {
        //   this.containerHeight =
        //     parseFloat(this.nodeList[sub].top) + 52.4 + 25 + "px";

        //   this.paper.setSize(
        //     this.paper.width,
        //     parseFloat(this.nodeList[sub].top) + 52.4 + 25 + "px"
        //   );
        // }
        // if (
        //   parseFloat(this.nodeList[sub].left) > parseFloat(this.containerWidth)
        // ) {
        //   this.containerWidth =
        //     parseFloat(this.nodeList[sub].left) + 200 + "px";
        //   this.paper.setSize(
        //     parseFloat(this.nodeList[sub].left) + 200 + "px",
        //     this.paper.height
        //   );
        // }
        // //设置连线
        // this.setPath(parentNode, this.nodeList[sub]);
        // //递归
        // if (this.nodeList[sub].subNode[0]) {
        //   this.repaintNode(sub);
        // }
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