import styled, { keyframes } from "styled-components";
import style from "../../../assets/global-style";

const rotate = keyframes`
  0%{
    transform: rotate(0);
  }
  100%{
    transform: rotate(360deg);
  }
`;
//mini播放器外包裹
export const MiniPlayerContainer = styled.div`
  display: flex;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 1000;
  width: 100%;
  height: 60px;
  background: ${style["highlight-background-color"]};
  //实现从下往上出现的过渡，过渡属性设置在active中
  &.mini-enter {
    transform: translate3d(0, 100%, 0);
  }
  &.mini-enter-active {
    transform: translate3d(0, 0, 0);
    transition: transform 300ms;
  }
  &.mini-exit {
    transform: translate3d(0, 0, 0);
  }
  &.mini-exit-active {
    transform: translate3d(0, 100%, 0);
    transition: transform 300ms;
  }

  .icon {
    flex: 0 0 40px;
    width: 40px;
    height: 40px;
    padding: 0 10px 0 20px;
    .imgWrapper {
      width: 100%;
      height: 100%;
      img {
        border-radius: 50%;
        /* 图片状态为play,播放旋转动画 */
        &.play {
          animation: ${rotate} 10s infinite;
          &.pause {
            animation-play-state: paused;
          }
        }
      }
    }
  }
  /* 歌曲文本 */
  .text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    line-height: 20px;
    overflow: hidden;
    /* 歌曲名 */
    .name {
      margin-bottom: 2px;
      font-size: ${style["font-size-m"]};
      color: ${style["font-color-desc"]};
      ${style.noWrap()}
    }
    /* 歌手 */
    .desc {
      font-size: ${style["font-size-s"]};
      color: ${style["font-color-desc-v2"]};
      ${style.noWrap()}
    }
  }
  /* 播放控件 */
  .control {
    flex: 0 0 30px;
    padding: 0 10px;
    /* 播放菜单 */
    .iconfont,
    .icon-playlist {
      font-size: 35px;
      color: ${style["theme-color"]};
    }
    /* 播放标志按钮 */
    .icon-mini {
      font-size: 20px;
      position: absolute;
      text-align: center;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      /* &.icon-play {
        left: 9px;
      } */
    }
  }
`;
