import { fromJS } from "immutable";
import React from "react";
import { getRankListRequest } from "../../../api/request";

//constants
export const CHANGE_RANK_LIST = "home/rank/CHANGE_RANK_LIST";
export const CHANGE_LOADING = "home/rank/CHANG_LOADIN";

//actionCreator
//更改排行列表
const changeRankList = (data) => ({
  type: CHANGE_RANK_LIST,
  data: fromJS(data),
});
//redux-thunk异步获取排行列表数据
export const getRankList = () => {
  return (dispatch) => {
    getRankListRequest().then((res) => {
      //通过ajax获取数据，
      const list = res && res.list;
      //更改排行列表数据
      dispatch(changeRankList(list));
      //关闭加载动画
      dispatch(changeLoading(false));
    });
  };
};
//修改加载动画状态
const changeLoading = (data) => ({
  type: CHANGE_LOADING,
  data: fromJS(data),
});

//reducer
const defaultState = fromJS({
  rankList: [],
  loading: true,
});

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case CHANGE_RANK_LIST:
      return state.set("rankList", action.data);
    case CHANGE_LOADING:
      return state.set("loading", action.data);
    default:
      return state;
  }
};

export { reducer };
