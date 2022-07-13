import styled, { keyframes } from "styled-components";
import style from "../../../assets/global-style";
//旋转动画
const rotate = keyframes`
  0%{
    transform: rotate(0);
  }
  100%{
    transform: rotate(360deg);
  }
`;
//全屏播放器外包裹
export const NormalPlayerContainer = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 150;
  background: ${style["background-color"]};
  /* 背景图片的背板版滤镜 */
  .background {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    /* 模糊背板，降低透明度，模糊度效果即使背板在背后也能起作用 */
    opacity: 0.6;
    filter: blur(20px);
    /* 再增加灰色透明背板 */
    &.layer {
      background: ${style["font-color-desc"]};
      opacity: 0.3;
      /* 去掉模糊滤镜，使得背板空白消失 */
      filter: none;
    }
  }
  //enter-> enter-active -> exit-active -> exit
  //开头和末尾是过渡隐藏的时候
  //中间是过渡后的常态，也是设置过渡属性的地方

  &.normal-enter {
    .top {
      transform: translate3d(0, -100px, 0);
    }
    /* bottom从下往上跳出来，结束时在正常位置下发 */
    .bottom {
      transform: translate3d(0, 100px, 0);
    }
    /* 用css实现cd跳跃也行 */

    /* .cdWrapper {
      transform: translate3d(-182px, 620px, 0) scale(0.2);
    } */
  }
  &.normal-enter-active {
    /* .middle {
      overflow: visible;
    } */
    /* .cdWrapper, */
    .top,
    .bottom {
      transform: translate3d(0, 0, 0);
      transition: all 0.4s ease-in;
    }
  }
  &.normal-exit {
    /* .cdWrapper, */
    .top,
    .bottom {
      transform: translate3d(0, 0, 0);
      transition: all 0.4s ease-in;
    }
  }
  &.normal-exit-active {
    .top {
      transform: translate3d(0, -100px, 0);
    }
    /* bottom从下往上跳出来，结束时在正常位置下发 */
    .bottom {
      transform: translate3d(0, 100px, 0);
    }

    /* .middle { */
    /* overflow: visible; */
    /* .cdWrapper {
      transform: translate3d(-182px, 620px, 0) scale(0.2);
    } */
    /* } */
  }
`;

//顶部header显示歌曲名，歌手名
export const Top = styled.div`
  position: relative;
  margin-bottom: 25px;
  /* 返回icon的外包裹,可以扩大点击区域 */
  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 50;
    .iconfont {
      display: block;
      padding: 9px;
      font-size: 24px;
      color: ${style["font-color-desc"]};
      font-weight: bold;
    }
  }
  /* 歌曲名 */
  .title {
    width: 70%;
    margin: 0 auto;
    line-height: 40px;
    text-align: center;
    font-size: ${style["font-size-l"]};
    color: ${style["font-color-desc"]};
    ${style.noWrap()};
  }
  .subtitle {
    line-height: 20px;
    /* 文字左右居中对齐 */
    text-align: center;
    font-size: ${style["font-size-m"]};
    color: ${style["font-color-desc-v2"]};
    ${style.noWrap()};
  }
`;
//中间部分的外包裹
export const Middle = styled.div`
  position: fixed;
  width: 100%;
  top: 80px;
  bottom: 170px;
  white-space: nowrap;
  font-size: 0;
  overflow: hidden;
`;
// 中间的旋转cd的外包裹
export const CDWrapper = styled.div`
  position: absolute;
  margin: auto;
  top: 10%;
  left: 0;
  right: 0;
  width: 80%;
  box-sizing: border-box;
  /* 此时父容器的宽度和视口一致，所以要获得和宽度一致的高度可以用80vw */
  height: 80vw;
  //cd图片的内包裹
  .cd {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    /* 旋转的cd图片 */
    .image {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      border-radius: 50%;
      border: 10px solid rgba(255, 255, 255, 0.2);
    }
    /* 控制cd旋转的类 */
    .play {
      animation: ${rotate} 20s linear infinite;
      &.pause {
        /* 控制动画停止的属性 */
        animation-play-state: paused;
      }
    }
  }
  /* 下方的白色单行歌词 */
  .playing_lyric {
    margin-top: 20px;
    font-size: 14px;
    line-height: 20px;
    white-space: normal;
    text-align: center;
    color: rgba(255, 255, 255, 0.5);
  }
`;
//底部按钮以及进度条
export const Bottom = styled.div`
  position: absolute;
  bottom: 50px;
  width: 100%;
`;
// 进度条区域，包括进度条，以及播放时间
export const ProgressWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 80%;
  margin: 0px auto;
  padding: 10px 0;
  /*  */
  .time {
    color: ${style["font-color-desc"]};
    font-size: ${style["font-size-s"]};
    flex: 0 0 30px;
    line-height: 30px;
    width: 30px;
    /* 左侧时间左对齐 */
    &.time-l {
      text-align: left;
    }
    /* 右侧时间右对齐 */
    &.time-r {
      text-align: right;
    }
  }
  /* 剩下的空间全给进度条 */
  .progress-bar-wrapper {
    flex: 1;
  }
`;
// 播放操作区
export const Operators = styled.div`
  display: flex;
  align-items: center;
  .icon {
    flex: 1;
    /* text-align: center; 居中对其行内元素span，可以代替下方的各种i-left对齐*/
    color: ${style["font-color-desc"]};
    &.disable {
      color: ${style["theme-color-shadow"]};
    }
    .iconfont {
      text-align: center;
      font-weight: 400;
      font-size: 30px;
      /* 歌单图片有点像，调大一点 */

      &.songsList {
        font-size: 33px;
      }
    }
  }
  /* 按钮icon的容器是flex布局，各得一份，但是内部的图标不是不对齐的，让左右两侧的往中间靠拢 */
  .i-left {
    text-align: right;
  }
  .i-center {
    padding: 0 20px;
    text-align: center;
    .iconfont {
      font-size: 40px;
    }
  }
  .i-right {
    text-align: left;
  }
  /* .icon-favorite {
    color: ${style["theme-color"]};
  } */
`;

export const LyricContainer = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`;
export const LyricWrapper = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  box-sizing: border-box;
  text-align: center;
  p {
    line-height: 32px;
    color: rgba(255, 255, 255, 0.5);
    white-space: normal;
    font-size: ${style["font-size-l"]};
    &.current {
      color: #fff;
    }
    &.pure {
      position: relative;
      top: 30vh;
    }
  }
`;
