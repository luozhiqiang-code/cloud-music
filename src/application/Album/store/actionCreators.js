import * as actionTypes from "./constants";
import { getAlbumDetailRequest } from "../../../api/request";
import { fromJS } from "immutable";
//更改歌单
const changeCurrentAlbum = (data) => ({
  type: actionTypes.CHANGE_CURRENT_ALBUM,
  data: fromJS(data),
});
//更改加载状态
export const changeEnterLoading = (data) => ({
  type: actionTypes.CHANGE_ENTER_LOADING,
  data,
});
//异步获取歌单数据
export const getAlbumList = (id) => {
  return (dispatch) => {
    getAlbumDetailRequest(id)
      .then((res) => {
        let data = res.playlist;
        //更改歌单
        dispatch(changeCurrentAlbum(data));
        //关闭加载状态
        dispatch(changeEnterLoading(false));
      })
      .catch((err) => {
        console.log("获取album数据失败", err);
      });
  };
};
