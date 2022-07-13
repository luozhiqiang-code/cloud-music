import React, {
  useEffect,
  useImperativeHandle,
  useRef,
  forwardRef,
} from "react";
import styled from "styled-components";
import { prefixStyle } from "../../api/utils";
import style from "../../assets/global-style";
//音符的容器
const Container = styled.div`
  .icon_wrapper {
    z-index: 1000;
    position: fixed;
    margin-top: -10px;
    margin-left: -10px;
    color: ${style["theme-color"]};
    font-size: 14px;
    display: none;
    transition: transform 1s cubic-bezier(0.62, -0.1, 0.86, 0.57);
    transform: translate3d(0, 0, 0);
    > div {
      font-size: 25px;
    }
  }
`;
//整个组件的逻辑
/**
 * 1.定义一个容器，容器里面有十个div包裹着icon
 * 2.给每个div添加transitionend事件，将每个容器设置回到动画前的状态，
 * 2.当调用开始函数时，遍历十个div，选中没有进行动画的div，然后给该div添加定时器，20ms后修改div的运行状态和transform（向下移动）属性
 * 由于属性发送变化，会触发transition，
 *
 */
const MusicNote = forwardRef((props, ref) => {
  const iconsRef = useRef();

  const ICON_NUMBER = 10;

  const transform = prefixStyle("transform");
  //创建一个音符的包裹节点
  const createNode = (txt) => {
    const template = `<div class='icon_wrapper'>${txt}</div>`;
    let tempNode = document.createElement("div");
    tempNode.innerHTML = template;
    //返回的即<div class='icon_wrapper'>${txt}</div>
    //如果直接创建得设置各种属性，不方便
    return tempNode.firstChild;
  };
  //挂载后，初始化
  useEffect(() => {
    //生成十个音符节点
    for (let i = 0; i < ICON_NUMBER; i++) {
      let node = createNode(`<div class="iconfont">&#xe759;</div>`);
      iconsRef.current.appendChild(node);
    }
    //将十个音符节点转为数组
    let domArray = [].slice.call(iconsRef.current.children);
    //遍历音符节点
    domArray.forEach((item) => {
      //初始化每个节点的弹出音符状态
      item.running = false;
      //给每个节点添加过渡事件
      item.addEventListener(
        "transitionend",
        function () {
          this.style["display"] = "none";
          this.style[transform] = `translate3d(0, 0, 0)`;
          this.running = false;
          let icon = this.querySelector("div");
          icon.style[transform] = `translate3d(0, 0, 0)`;
        },
        false
      );
    });
    // eslint-disable-next-line
  }, []);

  const startAnimation = ({ x, y }) => {
    //开始弹射音符
    for (let i = 0; i < ICON_NUMBER; i++) {
      //获得音符节点数组
      let domArray = [].slice.call(iconsRef.current.children);
      let item = domArray[i];
      // 选择一个空闲的元素来开始动画
      if (item.running === false) {
        //父容器设置为fixed，用绝对定位
        item.style.left = x + "px";
        item.style.top = y + "px";
        item.style.display = "block";
        setTimeout(() => {
          item.running = true;
          item.style[transform] = `translate3d(0, 750px, 0)`;
          // let icon = item.querySelector("div");
          // icon.style[transform] = `translate3d(-40px, 0, 0)`;
        }, 20);
        break;
      }
    }
  };

  //外界调用的ref方法
  useImperativeHandle(ref, () => ({
    startAnimation,
  }));

  return (
    <Container ref={iconsRef}>
      {/* <div class="icon_wrapper">
        <div class="iconfont">&#xe759;</div>
      </div> */}
    </Container>
  );
});

export default React.memo(MusicNote);
