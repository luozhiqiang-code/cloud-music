import { fromJS } from "immutable";
import React, { createContext, useReducer } from "react";

//此处利用Context和useReducer来构造一个小型的redux
export const CategoryContext = createContext({});
//constants
export const CHANGE_CATEGORY = "singers/CHANGE_CATECORY";
export const CHANGE_ALPHA = "singers/CHANGE_ALPHA";
//reducer 纯函数
const reducer = (state, action) => {
  switch (action.type) {
    case CHANGE_CATEGORY:
      return state.set("category", action.data); //更改分类
    case CHANGE_ALPHA:
      return state.set("alpha", action.data); //更改字母
    default:
      return state;
  }
};

//Provider 组件
export default function (props) {
  //useReducer 的第二个参数中传入初始值
  const [data, dispatch] = useReducer(
    reducer,
    fromJS({
      category: "1001",
      alpha: "A",
    })
  );
  //该组件返回一个Context组件，给子组件传递模拟的redux数据（data）,和派发修改数据的dispatch
  return (
    <CategoryContext.Provider value={{ data, dispatch }}>
      {props.children}
    </CategoryContext.Provider>
  );
}
