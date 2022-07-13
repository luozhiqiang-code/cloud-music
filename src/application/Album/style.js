import styled from "styled-components";
import style from "../../assets/global-style";
//使用csstransition，会分两段过程添加多个类，一段是进入动画（true=>false）一段是离开动画（false=>ture)
//两段如果对称则中间的属性相同，不对称则各自设置，
//并且切记将transition有关的属性全部设置在active中
export const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  background: ${style["background-color"]};
  //过度的开始位置，设置后从右下开始
  transform-origin: right bottom;
  /* 开始时容器在右边的位置并且旋转了三十度 */
  &.fly-appear {
    transform: rotateZ(30deg) translate3d(100%, 0, 0);
  }
  /* 当激活时，容器旋转归位（设置transform属性的位置） */
  &.fly-appear-active {
    transform: rotateZ(0deg) translate3d(0, 0, 0);
    transition: transform 0.3s;
  }
  /* 动画结束时想让容器呈现的常态 */
  &.fly-appear-done {
    transform: rotateZ(0deg) translate3d(0, 0, 0);
  }
  /* 离开的动画开始时的状态，（此处进入和离开对称）沿用常态 */
  &.fly-exit {
    transform: rotateZ(0deg) translate3d(0, 0, 0);
  }
  //容器离开结束时的状态，（设置transform属性的位置）
  &.fly-exit-active {
    transition: transform 0.3s;
    transform: rotateZ(30deg) translate3d(100%, 0, 0);
  }
`;
//顶部歌单描述面板
export const TopDesc = styled.div`
  /* background-size: 100%; */
  padding: 5px 20px;
  padding-bottom: 50px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: 275px;
  position: relative;
  //歌单描述面板的背景
  .background {
    z-index: -1;
    background: url(${(props) => props.background}) no-repeat;
    background-position: 0 0;
    background-size: 100% 100%;
    position: absolute;
    /* 背景大于100%,因为模糊后会有白边 */
    width: 110%;
    height: 110%;
    //模糊滤镜
    filter: blur(15px);
    //添加一层灰色背板，衬托白色文字
    .filter {
      position: absolute;
      z-index: 10;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.5);
    }
  }
  /* 大图片外包裹 */
  .img_wrapper {
    width: 120px;
    height: 120px;
    position: relative;
    /* 同样灰色背景衬托白色文字 */
    .decorate {
      position: absolute;
      top: 0;
      width: 100%;
      height: 35px;
      border-radius: 3px;
      background: linear-gradient(hsla(0, 0%, 43%, 0.4), hsla(0, 0%, 100%, 0));
    }
    /* 播放次数 */
    .play_count {
      position: absolute;
      right: 2px;
      top: 2px;
      font-size: ${style["font-size-s"]};
      line-height: 15px;
      color: ${style["font-color-light"]};
      .play {
        vertical-align: top;
      }
    }
    //大图片
    img {
      width: 120px;
      height: 120px;
      border-radius: 3px;
    }
  }
  //歌单描述详情
  .desc_wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 120px;
    padding: 0 10px;
    /* 歌单标题 */
    .title {
      max-height: 70px;
      color: ${style["font-color-light"]};
      font-weight: 700;
      line-height: 1.5;
      font-size: ${style["font-size-l"]};
    }
    /* 发布者个人信息 */
    .person {
      display: flex;
      .avatar {
        width: 20px;
        height: 20px;
        margin-right: 5px;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .name {
        line-height: 20px;
        font-size: ${style["font-size-m"]};
        color: ${style["font-color-desc-v2"]};
      }
    }
  }
`;
//歌单菜单栏（评论，点赞，收藏，更多）
export const Menu = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 0 30px 20px 30px;
  margin: -100px 0 0 0;
  > div {
    display: flex;
    flex-direction: column;
    line-height: 20px;
    text-align: center;
    font-size: ${style["font-size-s"]};
    color: ${style["font-color-light"]};
    z-index: 1000;
    font-weight: 500;
    .iconfont {
      font-size: 25px;
    }
  }
`;
//歌单列表
export const SongList = styled.div`
  border-radius: 10px;
  opacity: 0.98;
  background: ${style["highlight-background-color"]};
  //歌单第一行，描述各种信息
  .first_line {
    box-sizing: border-box;
    padding: 10px 0;
    margin-left: 10px;
    position: relative;
    justify-content: space-between;
    border-bottom: 1px solid ${style["border-color"]};

    .play_all {
      display: inline-block;
      line-height: 24px;
      color: ${style["font-color-desc"]};
      .iconfont {
        font-size: 26px;
        margin-right: 10px;
        vertical-align: top;
      }
      .sum {
        font-size: ${style["font-size-s"]};
        color: ${style["font-color-desc-v2"]};
      }
      > span {
        vertical-align: top;
      }
    }
    //添加按钮
    /* .isCollected, */
    .add_list {
      display: flex;
      align-items: center;
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      width: 130px;
      line-height: 34px;
      background: ${style["theme-color"]};
      color: ${style["font-color-light"]};
      font-size: 0;
      border-radius: 10px;
      vertical-align: top;
      .iconfont {
        vertical-align: top;
        font-size: 20px;
        margin: 0 5px 0 10px;
      }
      span {
        font-size: 14px;
        line-height: 34px;
      }
    }
    /* .isCollected {
      display: flex;
      background: ${style["background-color"]};
      color: ${style["font-color-desc"]};
    } */
  }
`;
//歌单项
export const SongItem = styled.ul`
  > li {
    display: flex;
    height: 60px;
    align-items: center;
    .index {
      flex-basis: 60px;
      width: 60px;
      height: 60px;
      line-height: 60px;
      text-align: center;
    }
    .info {
      box-sizing: border-box;
      flex: 1;
      display: flex;
      height: 100%;
      padding: 5px 0;
      flex-direction: column;
      justify-content: space-around;
      border-bottom: 1px solid ${style["border-color"]};
      //文字溢出部分省略号代替
      ${style.noWrap()}
      >span {
        ${style.noWrap()}
      }
      > span:first-child {
        color: ${style["font-color-desc"]};
      }
      > span:last-child {
        font-size: ${style["font-size-s"]};
        color: #bba8a8;
      }
    }
  }
`;
