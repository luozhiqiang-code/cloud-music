import styled from "styled-components";
import style from "../../assets/global-style";

// Props 中的 globalRank 和 tracks.length 均代表是否为全球榜
//榜单列表容器
export const Container = styled.div`
  position: fixed;
  top: 90px;
  bottom: ${(props) => (props.play > 0 ? "60px" : 0)};
  width: 100%;
  .offical,
  .global {
    margin: 10px 5px;
    padding-top: 15px;
    font-weight: 700;
    font-size: ${style["font-size-m"]};
    color: ${style["font-color-desc"]};
  }
`;
//榜单列表,根据传入的globalRank，给官方榜单普通布局，global榜单flex布局
export const List = styled.ul`
  margin-top: 10px;
  padding: 0 5px;
  display: ${(props) => (props.globalRank ? "flex" : "")};
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  background: ${style["background-color"]};
  /* 此处给列表的插入最后一个空白子元素，宽度为32%视口宽度 */
  &::after {
    content: "";
    display: block;
    width: 32vw;
  }
`;
//列表项，如果传入的tracks长度不为0则渲染的是官方榜单的列表项。
//此列表项中有歌曲的信息，所以在列表项内部再设置flex横向布局
//这里传值判断的好处是补改变全球榜单的内部布局，如果不考虑这么多可以直接设置所有列表项为flex
//传值还可以更改更多的信息，使得官方榜展示不一样
export const ListItem = styled.li`
  display: ${(props) => (props.tracks.length ? "flex" : "")};
  /* display: flex; */
  padding: 3px 0;
  border-bottom: 1px solid ${style["border-color"]};
  .img_wrapper {
    width: ${(props) => (props.tracks.length ? "27vw" : "32vw")};
    height: ${(props) => (props.tracks.length ? "27vw" : "32vw")};
    border-radius: 3px;
    position: relative;
    /* 由于更新频率的文字是白色，为了避免白色图片覆盖文字，添加一层灰色渐变作为文字背景阴影 */
    .decorate {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 35px;
      border-radius: 3px;
      background: linear-gradient(hsla(0, 0%, 100%, 0), hsla(0, 0%, 43%, 0.4));
    }
    img {
      width: 100%;
      height: 100%;
      border-radius: 3px;
    }
    .update_frequecy {
      position: absolute;
      left: 7px;
      bottom: 7px;
      font-size: ${style["font-size-ss"]};
      color: ${style["font-color-light"]};
    }
  }
`;
//榜单的前几名歌曲列表
export const SongList = styled.ul`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 10px 10px;
  > li {
    font-size: ${style["font-size-s"]};
    color: grey;
  }
`;
