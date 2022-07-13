import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import Scroll from "../scroll/index";
import { PropTypes } from "prop-types";
import style from "../../assets/global-style";
//列表组件内容flex默认横向布局，选中第一个元素设置弹性基准为auto使得其宽度为内容宽度不换行
const List = styled.div`
  display: flex;
  align-items: center;
  height: 30px;
  overflow: hidden;
  > span:first-of-type {
    display: block;
    flex: 0 0 auto;
    padding: 5px 0;
    margin-right: 5px;
    color: grey;
    font-size: ${style["font-size-m"]};
  }
`;
//列表项增长因子缩减因子为0，弹性基准为auto这样每个列表项宽度高度由内容决定
//选中后改变颜色和边框以及透明度
const ListItem = styled.span`
  flex: 0 0 auto;
  font-size: ${style["font-size-m"]};
  padding: 5px 8px;
  border-radius: 10px;
  &.selected {
    color: ${style["theme-color"]};
    border: 1px solid ${style["theme-color"]};
    opacity: 0.8;
  }
`;

function Horizen(props) {
  const { list, oldVal, title } = props;
  const { handleClick } = props;

  const Category = useRef(null);
  //滚动的原理是外部容器宽度固定内部内容的宽度要大于外部宽度，内部才可以滚动
  useEffect(() => {
    let categoryDOM = Category.current;
    //选中div包裹下的所有span元素，计算宽度
    let tagElems = categoryDOM.querySelectorAll("span");
    let totalWidth = 0;
    // querySelectorAll得到的是节点集合，类数组，转换为数组才有foreach。
    Array.from(tagElems).forEach((ele) => {
      totalWidth += ele.offsetWidth;
    });

    categoryDOM.style.width = `${totalWidth}px`;
  }, []);
  // 给该元素设置width:fit-content也可以实现,width默认是等于父元素宽度，fit-content设置为内容的宽度
  //但是这个属性兼容性不好，容易出问题，此处就只出现了部分分类选项

  return (
    <Scroll direction={"horizental"}>
      <div ref={Category}>
        <List>
          <span>{title}</span>
          {list.map((item) => {
            return (
              <ListItem
                key={item.key}
                className={`${oldVal === item.key ? "selected" : ""}`}
                onClick={() => handleClick(item.key)}
              >
                {item.name}
              </ListItem>
            );
          })}
        </List>
      </div>
    </Scroll>
  );
}

// 首先考虑接受的参数
//list 为接受的列表数据
//oldVal 为当前的 item 值
//title 为列表左边的标题
//handleClick 为点击不同的 item 执行的方法
Horizen.defaultProps = {
  list: [],
  oldVal: "1001",
  title: "",
  handClick: null,
};

Horizen.propTypes = {
  list: PropTypes.array,
  oldVal: PropTypes.string,
  title: PropTypes.string,
  handClick: PropTypes.func,
};

export default React.memo(Horizen);
