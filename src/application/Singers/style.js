import styled from "styled-components";
import style from "../../assets/global-style";
//字母和分类滚动栏的外包裹
export const NavContainer = styled.div`
  box-sizing: border-box;
  position: fixed;
  top: 95px;
  width: 100%;
  padding: 5px;
  overflow: hidden;
`;
//列表外包裹，如果播放列表长度不为零则设置列表距离底部60px，给播放器腾地儿
export const ListContainer = styled.div`
  position: fixed;
  top: 160px;
  left: 0;
  bottom: ${(props) => (props.play > 0 ? "60px" : 0)};
  overflow: hidden;
  width: 100%;
`;
//列表组件
export const List = styled.div`
  display: flex;
  margin: auto;
  flex-direction: column;
  overflow: hidden;
  /* .title {
    margin: 10px 0 10px 10px;
    color: ${style["font-color-desc"]};
    font-size: ${style["font-size-s"]};
  } */
`;
//列表项
export const ListItem = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  margin: 0 5px;
  padding: 5px 0;
  align-items: center;
  border-bottom: 1px solid ${style["border-color"]};
  .img_wrapper {
    margin-right: 20px;
    img {
      border-radius: 3px;
      width: 50px;
      height: 50px;
    }
  }
  .name {
    font-size: ${style["font-size-m"]};
    color: ${style["font-color-desc"]};
    font-weight: 500;
  }
`;
