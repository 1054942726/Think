<template>
  <div>
    <div class="mindId" ref="raphaelContainer"></div>
    <textarea
      type="text"
      class="textInput"
      v-model="attrText"
      v-show="inputShow"
      :style="{top:inputTop,left:inputLeft,width:inputWidth,height:inputHeight}"
    />
  </div>
</template>

<script>
import Raphael from "raphael";
export default {
  data() {
    return {
      paper: null, //raphael实例
      raphaelDom: null, //raphael容器
      dragging: false,
      mousePos: { x: 0, y: 0 },
      inputShow: false, //编辑器是否显示
      inputTop: 0, //文本域的位置
      inputLeft: 0,
      inputWidth: 0, //文本域的宽高
      inputHeight: 0,
      attrText: "",
      textNode: null, //当前编辑的节点的textId
      rectNode: null, //当前编辑的节点的rectId
      nodeId: 1, //节点id
      borderColor: "", //节点边框颜色
      cildrenId: null
    };
  },
  mounted() {
    this.initRaphael();

    //阻止右键菜单
    document.oncontextmenu = function(event) {
      event.preventDefault();
    };

    //创建根节点
    this.createRootNode();

    this.raphaelDom.addEventListener("mousedown", e => {
      let textNode = this.paper.getById(this.textNode); //得到text
      let rectNode = this.paper.getById(this.rectNode); //得到rect
      if (this.textNode) {
        //编辑器相关
        if (this.attrText != textNode.attr("text")) {
          //要修改文本时才进入
          textNode.attr({ text: this.attrText }); //重新设置文本
          rectNode.attr({
            //重新设置rect的位置和宽高
            x: textNode.getBBox().x - 20,
            y: textNode.getBBox().y - 15,
            width: textNode.getBBox().width + 40,
            height: textNode.getBBox().height + 30
          });
        }
        this.inputShow = false;
      }
      this.rectNode = null; //点击其它地方时,未选中rect
    });

    //新建节点时应该是往父节点的cildren数组中添加一个节点对象，之后再用渲染函数迭代渲染
    //在设置子节点位置之前判断子节点是否大于等于二，然后attr改变当前级的所有节点的位置，在此基础上计算子节点的位置
    window.addEventListener("keydown", e => {
      if (this.rectNode && e.keyCode === 13) {
        this.renderNodePosition();
      }
    });

    //调用拖拽缩放
    let viewportHandle = this.Viewport(this.raphaelDom, this.paper);
    viewportHandle.setViewportDrag();
  },
  methods: {
    //初始化Raphael
    initRaphael() {
      this.raphaelDom = this.$refs.raphaelContainer;
      this.paper = Raphael(this.raphaelDom);
    },
    //创建根节点
    createRootNode() {
      this.createNode({
        textX: "48vw",
        textY: "47vh",
        word: "中心主题",
        grade: 1,
        textAnchor: "middle",
        direction: "root"
      });
    },
    //拖拽和缩放
    Viewport(aCanvasDom, aPaper) {
      let thes = this;
      var canvasDom = aCanvasDom;
      var paper = aPaper;
      var scale = 1.0; //规模默认为1.0
      var canvasWidth = canvasDom.clientWidth || 400; //视窗宽度
      var canvasHeight = canvasDom.clientHeight || 400; //视窗高度
      var viewBox = {
        x: 0,
        y: 0,
        width: canvasWidth,
        height: canvasHeight
      };

      var dragging = false;
      var lastX = 0;
      var lastY = 0;
      var dX, dY, realScale;

      function _setViewport(x, y, aScale) {
        scale = aScale;
        var realScale = 1.0 / scale;
        if (scale > 5) {
          scale = 5;
        }
        //设置视野最小规模
        if (scale < 0.2) {
          scale = 0.2;
        }

        //设置视野对象
        viewBox.x = x;
        viewBox.y = y;
        viewBox.width = canvasWidth * realScale;
        viewBox.height = canvasHeight * realScale;

        //设置视野
        paper.setViewBox(viewBox.x, viewBox.y, viewBox.width, viewBox.height);
      }

      function mousedownHandle(event) {
        realScale = 1.0 / scale;

        lastX = event.layerX;
        lastY = event.layerY;
        dragging = true;
      }

      function mousemoveHandle(event) {
        if (dragging) {
          dX = -(event.layerX - lastX) * realScale;
          dY = -(event.layerY - lastY) * realScale;

          viewBox.x += dX;
          viewBox.y += dY;

          _setViewport(viewBox.x, viewBox.y, scale);

          lastX = event.layerX;
          lastY = event.layerY;
        }
      }

      function mouseupHandle(event) {
        if (dragging) {
          dragging = false;
        }
      }

      function zoom(e) {
        e = e || window.event;
        if (e.wheelDelta) {
          //判断浏览器IE，谷歌滑轮事件
          if (e.wheelDelta > 0) {
            //当滑轮向上滚动时
            scale = scale + 0.05;
          }
          if (e.wheelDelta < 0) {
            //当滑轮向下滚动时
            scale = scale - 0.05;
          }
        } else if (e.detail) {
          //Firefox滑轮事件
          if (e.detail > 0) {
            //当滑轮向下滚动时
            scale = scale - 0.05;
          }
          if (e.detail < 0) {
            //当滑轮向上滚动时
            scale = scale + 0.05;
          }
        }
        _setViewport(viewBox.x, viewBox.y, scale);
      }

      /**
       * 画布视野移动设置
       */
      function setViewportDrag() {
        //添加画布的鼠标点击事件
        canvasDom.addEventListener("mousedown", function(event) {
          if (event.target.nodeName !== "svg" || event.button != 2) {
            return;
          }
          mousedownHandle(event);
        });

        //添加画布的鼠标移动事件
        canvasDom.addEventListener("mousemove", function(event) {
          if (event.target.nodeName !== "svg") {
            return;
          }
          mousemoveHandle(event);
          /*
                if(dragging){
                dX = -(event.layerX - lastX) * realScale;
                dY = -(event.layerY - lastY) * realScale;

                viewBox.x += dX;
                viewBox.y += dY;

                _setViewport(viewBox.x, viewBox.y, scale);

                lastX = event.layerX;
                lastY = event.layerY;
                }*/
        });

        //添加画布的鼠标释放事件
        canvasDom.addEventListener("mouseup", function(event) {
          if (event.target.nodeName !== "svg" || event.button != 2) {
            return;
          }
          mouseupHandle(event);
          /*
                if(dragging){
                dragging = false;
                }*/
        });

        canvasDom.addEventListener("mousewheel", e => {
          if (e.altKey) {
            zoom();
          }
        });
        canvasDom.addEventListener("DOMMouseScroll", e => {
          if (e.altKey) {
            zoom();
          }
        });
      }

      return {
        isDragging: function() {
          return dragging;
        },
        setViewportDrag: setViewportDrag,
        getViewbox: function() {
          return viewBox;
        },
        mousedownHandle: mousedownHandle,
        mouseupHandle: mouseupHandle,
        mousemoveHandle: mousemoveHandle
      };
    },
    //创建节点
    createNode(nodeConfig) {
      let {
        textX,
        textY,
        word,
        grade,
        textAnchor,
        direction,
        parent
      } = nodeConfig; //配置对象，x,y,文本内容,等级,文本对齐方式,节点左右方向
      //创建text
      let text = this.paper.text(textX, textY, word);
      text.id = this.nodeId + "text";
      this.cildrenId = text.id;
      text.data({
        cildren: [],
        grade: grade,
        setList: [],
        direction: direction,
        parent: parent
      });
      //创建rect
      let rect = this.paper.rect();
      if (grade === 1) {
        text.attr({
          "font-size": "20px",
          "font-weight": "600",
          fill: "#fff",
          "text-anchor": textAnchor
        });
        rect.attr({
          x: text.getBBox().x - 20,
          y: text.getBBox().y - 15,
          width: text.getBBox().width + 40,
          height: text.getBBox().height + 30,
          r: 8,
          fill: "#73c9e5",
          stroke: "#b8e5f8",
          "stroke-width": 3
        });
      } else {
        if (grade === 2) {
          text.attr({
            "font-size": "18px",
            "font-weight": "400",
            fill: "#000",
            "text-anchor": textAnchor
          });
          rect.attr({
            x: text.getBBox().x - 17.5,
            y: text.getBBox().y - 12.5,
            width: text.getBBox().width + 35,
            height: text.getBBox().height + 25,
            r: 6,
            fill: "#fff",
            stroke: "#1BD5D2",
            "stroke-width": 3
          });
        } else {
          text.attr({
            "font-size": "16px",
            "font-weight": "200",
            fill: "#000",
            "text-anchor": textAnchor
          });
          rect.attr({
            x: text.getBBox().x - 15,
            y: text.getBBox().y - 10,
            width: text.getBBox().width + 30,
            height: text.getBBox().height + 20,
            r: 6,
            fill: "#fff",
            stroke: "#9B83F8",
            "stroke-width": 2
          });
        }

        //在父节点中添加set集合
        let id = parseInt(this.rectNode) + "text";
        let textNode = this.paper.getById(id); //得到text
        let raphaelSet = this.paper.set();
        raphaelSet.push(text, rect);
        textNode.data("setList").push(raphaelSet);
        //在父节点对应的cildren中添加textId
        // let cildrenList = textNode.data("cildren");
        // cildrenList[cildrenList.length - 1].id = this.nodeId + "text";
        // text.data({ parent: textNode.id });
      }
      rect.toBack(); //层级
      rect.id = this.nodeId + "rect";

      //节点事件
      text.dblclick(e => {
        let positionObjct = e.target.getBoundingClientRect();
        this.textNode = text.id;
        this.rectNode = rect.id;
        this.inputShow = true;
        this.inputTop = positionObjct.y - 2 + "px";
        this.inputLeft = positionObjct.x - 2 + "px";
        this.inputWidth = text.getBBox().width + "px";
        this.inputHeight = text.getBBox().height + "px";
        this.attrText = text.attr("text");
      });

      text.mousedown(e => {
        e.stopPropagation();
        this.rectNode = rect.id;
        console.log(rect.id);
      });

      rect.mousedown(e => {
        e.stopPropagation();
        this.rectNode = rect.id;
      });

      this.nodeId++;
    },
    //添加节点，设置起始位置
    renderNodePosition() {
      let id = parseInt(this.rectNode) + "text";
      let textNode = this.paper.getById(id); //得到text
      let textNodeX = textNode.getBBox().x, //父节点x,y坐标
        textNodeY = textNode.getBBox().y;
      //在父节点的cildren中添加子节点对象
      textNode.data("cildren").push({
        word: "二级标题",
        grade: 2,
        parent: textNode
      });
      this.createNode(
        textNode.data("cildren")[textNode.data("cildren").length - 1]
      );
      //计算子节点的位置
      let cildrenLength = textNode.data("cildren").length, //子节点个数
        cildrenHeight = 45 + 25, //子节点高度
        allCildrenHeight = cildrenLength * cildrenHeight; //子节点集合高度
      let setList = textNode.data("setList");
      let cildrenList = textNode.data("cildren");
      console.log(setList);
      if (textNode.data("grade") === 1) {
        for (let i = 0; i < cildrenLength; i++) {
          let text = setList[i][0];
          let rect = setList[i][1];
          if (!(i % 2)) {
            console.log("height ", this.getNodeListHeight(textNode));
            let y =
              textNodeY -
              this.getNodeListHeight(textNode) / 2 / 2 +
              (cildrenHeight * i) / 2 +
              45;
            let x = textNodeX - 110;
            this.setNodeAttr(text, rect, y, x, 2);

            text.data({ textAnchor: "end" });
            text.data({ direction: "left" });
            text.data({ initPosition: { y: y, x: x } });
          } else {
            let y =
              textNodeY -
              this.getNodeListHeight(textNode) / 2 / 2 +
              (cildrenHeight * (i - 1)) / 2 +
              45;
            let x = textNodeX + textNode.getBBox().width + 110;
            this.setNodeAttr(text, rect, y, x, 2);

            text.data({ textAnchor: "start" });
            text.data({ direction: "right" });
            text.data({ initPosition: { y: y, x: x } });
          }
          text.data({ grade: 2 });
          text.data({ word: "2级标题" });
          text.data({ id: this.cildrenId });
        }
      } else {
        for (let i = 0; i < cildrenLength; i++) {
          let text = setList[i][0];
          let rect = setList[i][1];
          //遍历子节点计算每个子节点的y坐标
          let grade = parseInt(textNode.data("grade")) + 1;

          if (textNode.data("direction") === "left") {
            let y =
              textNodeY -
              this.getNodeListHeight(textNode) / 2 +
              cildrenHeight * i +
              45;
            let x = textNodeX - 110;
            this.setNodeAttr(text, rect, y, x, grade);

            text.data({ textAnchor: "end" });
            text.data({ direction: "left" });
            text.data({ initPosition: { y: y, x: x } });
          } else if (textNode.data("direction") === "right") {
            let y =
              textNodeY -
              this.getNodeListHeight(textNode) / 2 +
              cildrenHeight * i +
              45;
            let x = textNodeX + textNode.getBBox().width + 110;
            this.setNodeAttr(text, rect, y, x, grade);

            text.data({ textAnchor: "start" });
            text.data({ direction: "right" });
            text.data({ initPosition: { y: y, x: x } });
          }
          text.data({ grade: grade });
          text.data({ word: grade + "级标题" });
          text.data({ id: this.cildrenId });
        }
        this.nodeRepaint();
      }
      // this.nodeRepaint();
    },
    //text节点的文本，x,y,rext节点大小，位置,样式
    setNodeAttr(text, rect, Y, X, grade) {
      text.attr({
        y: Y
      });
      if (X) {
        text.attr({ x: X });
      }
      if (!grade) {
        grade = text.data("grade");
      }
      if (grade === 1) {
        text.attr({
          "font-size": "20px",
          text: grade + "级标题"
        });
        rect.attr({
          x: text.getBBox().x - 20,
          y: text.getBBox().y - 15,
          width: text.getBBox().width + 40,
          height: text.getBBox().height + 30,
          r: 8,
          fill: "#73c9e5",
          stroke: "#b8e5f8",
          "stroke-width": 3
        });
      } else if (grade === 2) {
        text.attr({
          "font-size": "18px",
          text: grade + "级标题"
        });
        rect.attr({
          x: text.getBBox().x - 17.5,
          y: text.getBBox().y - 12.5,
          width: text.getBBox().width + 35,
          height: text.getBBox().height + 25,
          r: 6,
          fill: "#fff",
          stroke: "#1BD5D2",
          "stroke-width": 3
        });
      } else {
        text.attr({
          "font-size": "16px",
          text: grade + "级标题"
        });
        rect.attr({
          x: text.getBBox().x - 15,
          y: text.getBBox().y - 10,
          width: text.getBBox().width + 30,
          height: text.getBBox().height + 20,
          r: 6,
          fill: "#fff",
          stroke: "#9B83F8",
          "stroke-width": 2
        });
      }
    },
    //递归和循环setList设置子节点属性
    forNode(setList, changeY) {
      for (let i = 0; i < setList.length; i++) {
        let text = setList[i][0];
        let rect = setList[i][1];
        this.setNodeAttr(
          text,
          rect,
          text.data("initPosition").y + changeY,
          null,
          text.data("grade")
        );
        if (text.data("setList")) {
          this.forNode(text.data("setList"), changeY);
        }
      }
    },
    getNodeListHeight(node) {
      let setList = node.data("setList");
      let height = 0;
      for (let i = 0; i < setList.length; i++) {
        let text = setList[i][0];
        if (text.data("setList")[0]) {
          height += this.getNodeListHeight(text);
        } else {
          height += 70;
        }
      }
      return height;
    },
    //添加子节点时重新设置位置，给节点添加子节点后在该节点身上设置一个height属性，值wei
    nodeRepaint() {
      let id = parseInt(this.rectNode) + "text";
      let textNode = this.paper.getById(id); //得到选中的text

      let cildrenList = textNode.data("cildren"); //当前选中的text的子节点数组
      let parentNode = textNode.data("parent");
      console.log("parentNode", parentNode);
      let setList = parentNode.data("setList");
      let nowId = textNode.id;
      let nowIndex = null; //找到当前节点在set集合的索引
      setList.forEach((set, index) => {
        if (set[0].id === nowId) {
          nowIndex = index;
        }
      });

      for (let i = 0; i < setList.length; i++) {
        let text = setList[i][0];
        let rect = setList[i][1];
        let textPosition = text.getBBox();
        let oldY = text.getBBox().y;
        let textCildrenList = text.data("cildren");
        console.log("initY", text.data("initY"));
        let newTopY =
          text.data("initPosition").y - (cildrenList.length * 70) / 2; //节点改变的距离要算上当前选中的节点的子节点集合的高度，也要算上当前级的其它节点的子节点的高度
        let newBottomY =
          text.data("initPosition").y + (cildrenList.length * 70) / 2;
        let parentChangeY;
        if (parentNode.data("grade") == 1) {
          //处理二级节点对应的奇偶数为的位置
          console.log("newBottomY", newBottomY);
          console.log("newTopY", newTopY);
          if (nowIndex % 2 != 0) {
            if (i % 2 != 0 && i < nowIndex) {
              this.setNodeAttr(
                text,
                rect,
                newTopY < oldY ? newTopY : oldY,
                0,
                text.data("grade")
              );
              parentChangeY = -((cildrenList.length * 70) / 2);
              if (text.data("setList")) {
                console.log("o");
                this.forNode(text.data("setList"), parentChangeY);
              }
            } else if (i % 2 != 0 && i > nowIndex) {
              this.setNodeAttr(
                text,
                rect,
                newBottomY > oldY ? newBottomY : oldY,
                0,
                text.data("grade")
              );
              parentChangeY = (cildrenList.length * 70) / 2;
              if (text.data("setList")) {
                console.log("j");
                this.forNode(text.data("setList"), parentChangeY);
              }
            }
          }
          if (nowIndex % 2 == 0) {
            if (i % 2 == 0 && i < nowIndex) {
              this.setNodeAttr(
                text,
                rect,
                newTopY < oldY ? newTopY : oldY,
                0,
                text.data("grade")
              );
              parentChangeY = -((cildrenList.length * 70) / 2);
              if (text.data("setList")) {
                console.log("o");
                this.forNode(text.data("setList"), parentChangeY);
              }
            } else if (i % 2 == 0 && i > nowIndex) {
              this.setNodeAttr(
                text,
                rect,
                newBottomY > oldY ? newBottomY : oldY,
                0,
                text.data("grade")
              );
              parentChangeY = (cildrenList.length * 70) / 2;
              if (text.data("setList")) {
                console.log("o");
                this.forNode(text.data("setList"), parentChangeY);
              }
            }
          }
        } else {
          if (i < nowIndex) {
            this.setNodeAttr(
              text,
              rect,
              newTopY < oldY ? newTopY : oldY,
              0,
              text.data("grade")
            );
            parentChangeY = -((cildrenList.length * 70) / 2);
            if (text.data("setList")) {
              this.forNode(text.data("setList"), parentChangeY);
            }
          } else if (i > nowIndex) {
            this.setNodeAttr(
              text,
              rect,
              newBottomY > oldY ? newBottomY : oldY,
              0,
              text.data("grade")
            );
            parentChangeY = (cildrenList.length * 70) / 2;
            if (text.data("setList")) {
              this.forNode(text.data("setList"), parentChangeY);
            }
          }
        }
      }
    }, //函数节流
    throttle(callback, time) {
      let timer;
      if (timer) {
        return;
      }
      timer = setTimeout(() => {
        callback();
        timer = null;
      }, time);
    }
  },
  computed: {},
  watch: {
    rectNode(newNode, oldNode) {
      //监听rectNode，设置选中和未选中的样式
      if (oldNode) {
        let rectOldNode = this.paper.getById(oldNode);
        if (this.borderColor != "") {
          rectOldNode.attr({ stroke: this.borderColor });
        }
      }
      if (newNode) {
        let rectNewNode = this.paper.getById(newNode);
        this.borderColor = rectNewNode.attr("stroke");
        rectNewNode.attr({ stroke: "#3fb6da" });
      }
    }
  }
};
</script>

<style lang="less" scoped>
.mindId {
  width: 100vw;
  height: 100vh;
}

.textInput {
  position: absolute;
  //   min-width: 80px;
  //   min-height: 20px;
  font-size: 14px;
  font-family: -apple-system, SF UI Text, Arial, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, WenQuanYi Micro Hei, sans-serif;
  border: 1px solid #dddddd;
  outline: none;
  border-radius: 3px;
}
</style>