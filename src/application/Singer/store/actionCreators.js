import {
  CHANGE_SONGS_OF_ARTIST,
  CHANGE_ARTIST,
  CHANGE_ENTER_LOADING,
} from "./constants";
import { fromJS } from "immutable";
import { getSingerInfoRequest } from "./../../../api/request";
//改变歌手
const changeArtist = (data) => ({
  type: CHANGE_ARTIST,
  data: fromJS(data),
});
//改变歌曲
const changeSongs = (data) => ({
  type: CHANGE_SONGS_OF_ARTIST,
  data: fromJS(data),
});
//改变加载状态
export const changeEnterLoading = (data) => ({
  type: CHANGE_ENTER_LOADING,
  data,
});
//异步获取歌手信息
export const getSingerInfo = (id) => {
  return (dispatch) => {
    //根据id获得歌手的歌单数据
    getSingerInfoRequest(id).then((data) => {
      //改变歌手数据
      dispatch(changeArtist(data.artist));
      //改变热门歌单数据
      dispatch(changeSongs(data.hotSongs));
      //关闭加载状态
      dispatch(changeEnterLoading(false));
    });
  };
};
