import * as actionTypes from "./constants";
import { fromJS } from "immutable";
import {
  getBannerRequest,
  getRecommendListRequest,
} from "../../../api/request";
//改变轮播图数据
export const changeBannerList = (data) => ({
  type: actionTypes.CHANGE_BANNER,
  data: fromJS(data),
});
//改变推荐列表
export const changeRecommendList = (data) => ({
  type: actionTypes.CHANGE_RECOMMEND_LIST,
  data: fromJS(data),
});
//redux-thunk异步获取轮播图数据,获得数据后便派发请求修改
export const getBannerList = () => {
  return (dispath) => {
    getBannerRequest()
      .then((data) => {
        dispath(changeBannerList(data.banners));
      })
      .catch((err) => {
        console.log("轮播图数据传输失败", err);
      });
  };
};
//redux-thunk异步获取歌单列表，获取成功则派发修改请求
export const getRecommendList = () => {
  return (dispath) => {
    getRecommendListRequest()
      .then((data) => {
        //派发修改请求
        dispath(changeRecommendList(data.result));
        //关闭入场动画
        dispath(changeEnterLoading(false));
      })
      .catch((err) => {
        console.log("推荐歌单数据传输失败", err);
      });
  };
};
//修改入场动画状态
export const changeEnterLoading = (data) => ({
  type: actionTypes.CHANGE_ENTER_LOADING,
  data,
});
