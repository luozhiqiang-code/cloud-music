import {
  getSingerListRequest,
  getHotSingerListRequest,
} from "../../../api/request";

import * as actionTypes from "./constants";
import { fromJS } from "immutable";

//更改歌手列表
export const changeSingerList = (data) => ({
  type: actionTypes.CHANGE_SINGER_LIST,
  data: fromJS(data),
});
//更改列表的页码
export const changePageCount = (data) => ({
  type: actionTypes.CHANGE_PAGE_COUNT,
  data: fromJS(data),
});

//进场loading
export const changeEnterLoading = (data) => ({
  type: actionTypes.CHANGE_ENTER_LOADING,
  data: fromJS(data),
});
//顶部下拉刷新loading
export const changePullUpLoading = (data) => ({
  type: actionTypes.CHANGE_PULLUP_LOADING,
  data: fromJS(data),
});
//滑动最底部loading
export const changePullDownLoadig = (data) => ({
  type: actionTypes.CHANGE_PULLDOWN_LOADING,
  data: fromJS(data),
});
//第一次加载热门歌手
export const getHotSingerList = () => {
  return (dispatch) => {
    getHotSingerListRequest(0)
      .then((res) => {
        //获取第一页热门歌手列表数据
        const data = res.artists;
        //更改歌手列表数据
        dispatch(changeSingerList(data));
        //关闭入场动画
        dispatch(changeEnterLoading(false));
        //关闭下拉刷新状态
        dispatch(changePullDownLoadig(false));
      })
      .catch((err) => {
        console.log("热门歌手数据获取失败", err);
        //关闭入场动画
        dispatch(changeEnterLoading(false));
        //关闭下拉刷新状态
        dispatch(changePullDownLoadig(false));
      });
  };
};

//加载更多热门歌手
export const refreshMoreHotSingerList = () => {
  return (dispatch, getState) => {
    //获得当前热门歌手列表的页码，然后可以获取下一页数据
    const pageCount = getState().getIn(["singers", "pageCount"]);
    //获取当前热门歌手列表的数据，用于合并新数据

    const singerList =
      getState().getIn(["singers", "singerList"])?.toJS() || [];

    getHotSingerListRequest(pageCount)
      .then((res) => {
        //展开新旧数据合并
        const data = [...singerList, ...res.artists];
        //更改歌手列表数据
        dispatch(changeSingerList(data));
        //关闭上拉加载状态
        dispatch(changePullUpLoading(false));
      })
      .catch((err) => {
        console.log("加载更多热门歌手失败", err);
        //关闭上拉加载状态
        dispatch(changePullUpLoading(false));
      });
  };
};
//第一次加载对应类别的歌手
export const getSingerList = (category, alpha) => {
  return (dispatch) => {
    getSingerListRequest(category, alpha, 0)
      .then((res) => {
        //获得分类的歌手列表
        const data = res.artists;
        //更改歌手列表
        dispatch(changeSingerList(data));
        //关闭入场动画
        dispatch(changeEnterLoading(false));
        //关闭下拉刷新状态
        dispatch(changePullDownLoadig(false));
      })
      .catch((err) => {
        console.log("歌手数据获取失败", err);
        //关闭入场动画
        dispatch(changeEnterLoading(false));
        //关闭下拉刷新状态
        dispatch(changePullDownLoadig(false));
      });
  };
};
//加载更多歌手
export const refreshMoreSingerList = (category, alpha) => {
  return (dispatch, getState) => {
    //获得当前列表页码和当前列表数据
    const pageCount = getState().getIn(["singers", "pageCount"]);
    const singerList = getState().getIn(["singers", "signerList"]);
    getSingerListRequest(category, alpha, pageCount)
      .then((res) => {
        //将新老数据展开合并
        const data = [...singerList, ...res.artists];
        //改变歌手列表数据
        dispatch(changeSingerList(data));
        //关闭上拉加载状态
        dispatch(changePullUpLoading(false));
      })
      .catch((err) => {
        console.log("歌手数据获取失败", err);
        //关闭上拉加载状态
        dispatch(changePullUpLoading(false));
      });
  };
};
