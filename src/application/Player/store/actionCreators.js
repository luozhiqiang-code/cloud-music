import {
  SET_CURRENT_SONG,
  SET_FULL_SCREEN,
  SET_PLAYING_STATE,
  SET_SEQUECE_PLAYLIST,
  SET_PLAYLIST,
  SET_PLAY_MODE,
  SET_CURRENT_INDEX,
  SET_SHOW_PLAYLIST,
  DELETE_SONG,
  INSERT_SONG,
} from "./constants";
import { fromJS } from "immutable";
import { getSongDetailRequest } from "../../../api/request";

//改变当前播放歌曲
export const changeCurrentSong = (data) => ({
  type: SET_CURRENT_SONG,
  data: fromJS(data),
});
//改变全屏模式
export const changeFullScreen = (data) => ({
  type: SET_FULL_SCREEN,
  data,
});
//改变播放状态
export const changePlayingState = (data) => ({
  type: SET_PLAYING_STATE,
  data,
});
//改变顺序播放列表
export const changeSequecePlayList = (data) => ({
  type: SET_SEQUECE_PLAYLIST,
  data: fromJS(data),
});
//改变播放列表
export const changePlayList = (data) => ({
  type: SET_PLAYLIST,
  data: fromJS(data),
});
//改变播放模式
export const changePlayMode = (data) => ({
  type: SET_PLAY_MODE,
  data,
});
//改变当前歌单下标
export const changeCurrentIndex = (data) => ({
  type: SET_CURRENT_INDEX,
  data,
});
//改变播放列表显示状态
export const changeShowPlayList = (data) => ({
  type: SET_SHOW_PLAYLIST,
  data,
});
//删除歌曲
export const deleteSong = (data) => ({
  type: DELETE_SONG,
  data,
});

export const insertSong = (data) => ({
  type: INSERT_SONG,
  data,
});

export const getSongDetail = (id) => {
  return (dispatch) => {
    getSongDetailRequest(id).then((data) => {
      let song = data.songs[0];
      console.log(song);
      dispatch(insertSong(song));
    });
  };
};
