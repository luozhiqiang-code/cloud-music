import React, { useState, useImperativeHandle, forwardRef } from "react";
import styled from "styled-components";
import { CSSTransition } from "react-transition-group";
import style from "../../assets/global-style";

const ToastWrapper = styled.div`
  position: fixed;
  bottom: 0;
  z-index: 1000;
  width: 100%;
  height: 50px;
  &.drop-enter {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }
  &.drop-enter-active {
    opacity: 1;
    transition: all 0.3s;
    transform: translate3d(0, 0, 0);
  }
  /* &.drop-exit{
    对称的动画，这部分与enter-active相同，也可以不写，沿用enter-active的
  } */
  &.drop-exit-active {
    opacity: 0;
    transition: all 0.3s;
    transform: translate3d(0, 100%, 0);
  }
  .text {
    line-height: 50px;
    text-align: center;
    color: #fff;
    font-size: ${style["font-size-l"]};
  }
`;
//用于展示提示信息，比如切换播放模式时展示
const Toast = forwardRef((props, ref) => {
  const [show, setShow] = useState(false);
  const [timer, setTimer] = useState("");
  const { text } = props;
  //搭配组件的ref使用，给组件的引用返回一下对象或者变量。供父组件使用
  useImperativeHandle(ref, () => ({
    show() {
      if (timer) clearTimeout(timer);
      setShow(true);
      setTimer(
        setTimeout(() => {
          setShow(false);
        }, 3000)
      );
    },
  }));
  return (
    <CSSTransition in={show} timeout={300} classNames="drop" unmountOnExit>
      <ToastWrapper>
        <div className="text">{text}</div>
      </ToastWrapper>
    </CSSTransition>
  );
});

export default React.memo(Toast);
