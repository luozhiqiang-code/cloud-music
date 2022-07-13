import * as actionTypes from "./constants";
import { fromJS } from "immutable";

const defaultState = fromJS({
  bannerList: [], //轮播图数据
  recommendList: [], //推荐列表
  enterLoading: true, //入场动画
});

export default (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.CHANGE_BANNER: //改变轮播数据
      return state.set("bannerList", action.data);
    case actionTypes.CHANGE_RECOMMEND_LIST: //改变推荐列表
      return state.set("recommendList", action.data);
    case actionTypes.CHANGE_ENTER_LOADING: //改变入场动画播放状态
      return state.set("enterLoading", action.data);
    default:
      return state;
  }
};
