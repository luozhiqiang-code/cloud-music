import styled from "styled-components";
import style from "../../assets/global-style";
//包裹整个页面的容器，方便csstransition控制
export const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: ${(props) => (props.play > 0 ? "60px" : 0)};
  width: 100%;
  z-index: 100;
  overflow: hidden;
  background: #f2f3f4;
  transform-origin: right bottom;
  &.fly-appear {
    transform: rotateZ(30deg) translate3d(100%, 0, 0);
  }
  &.fly-appear-active {
    transition: transform 0.3s;
    transform: rotateZ(0deg) translate3d(0, 0, 0);
  }
  &.fly-appear-done {
    transform: rotateZ(0deg) translate3d(0, 0, 0);
  }
  &.fly-exit {
    transform: rotateZ(0deg) translate3d(0, 0, 0);
  }
  &.fly-exit-active {
    transition: transform 0.3s;
    transform: rotateZ(30deg) translate3d(100%, 0, 0);
  }
`;
//歌手图片
export const ImgWrapper = styled.div`
  position: relative;
  width: 100%;
  //只用padding来设置内容高度，padding是相对于自身宽度的，height相对于父元素高度
  height: 0;
  padding-top: 75%;
  /* transform-origin: top; */
  background: url(${(props) => props.bgUrl});
  background-size: cover;
  z-index: 50;
  /* 灰色阴影，衬托白色文字 */
  .filter {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(7, 17, 27, 0.3);
  }
`;
//收藏按钮
export const CollectButton = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
  box-sizing: border-box;
  width: 120px;
  height: 40px;
  margin-top: -55px;
  z-index: 50;
  background: ${style["theme-color"]};
  color: ${style["font-color-light"]};
  border-radius: 20px;
  /* 文字左右居中 */
  text-align: center;
  font-size: 0;
  line-height: 40px;
  .iconfont {
    display: inline-block;
    margin-right: 10px;
    font-size: 14px;
  }
  .text {
    display: inline-block;
    font-size: 14px;
    letter-spacing: 5px;
  }
`;
//歌单外包裹
export const SongListWrapper = styled.div`
  position: absolute;
  z-index: 50;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;

  /* 此处的div其实是scroll容器，设置溢出可见，就实现了滚动效果 */
  > div {
    /* position: absolute;
    left: 0;
    width: 100%; */
    overflow: visible;
  }
`;
//白色背景遮罩,直接给滚动容器种的内容添加白色背景更方便，这里采取这种方式
// export const BgLayer = styled.div`
//   position: absolute;
//   top: 0;
//   bottom: 0;
//   width: 100%;
//   background: white;
//   border-radius: 10px;
//   z-index: 50;
// `;
