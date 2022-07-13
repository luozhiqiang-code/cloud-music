import React, { useRef, useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  changePlayingState,
  changeShowPlayList,
  changeCurrentIndex,
  changeCurrentSong,
  changePlayList,
  changePlayMode,
  changeFullScreen,
} from "./store/actionCreators";
import MiniPlayer from "./miniPlayer";
import NormalPlayer from "./normalPlayer";
import { getSongUrl, isEmptyObject, shuffle, findIndex } from "../../api/utils";
import { playMode } from "../../api/config";
import Toast from "./../../baseUI/toast/index";
import PlayList from "./play-list";
import { getLyricRequest } from "../../api/request";
import Lyric from "../../api/lyric-parser";

function Player(props) {
  //目前播放时间
  const [currentTime, setCurrentTime] = useState(0);
  //歌曲总时长
  const [duration, setDuration] = useState(0);
  //歌曲播放进度
  let percent = isNaN(currentTime / duration) ? 0 : currentTime / duration;

  const [preSong, setPreSong] = useState({});
  //播放模式的文本
  const [modeText, setModeText] = useState("");
  // 歌曲准备播放状态，用来避免快速切换歌曲，缓存跟不上导致的错误
  const [songReady, setSongReady] = useState(true);
  //当前播放行的歌词字符串
  const [currentPlayingLyric, setPlayingLyric] = useState("");
  //当前歌词行数
  const currentLineNum = useRef(0);
  //歌词对象，用useRef来存储引用，如果用state会猛渲染
  const currentLyric = useRef();
  //音频元素audio的引用
  const audioRef = useRef();
  //删除提示框的引用
  const toastRef = useRef();

  const {
    playing,
    currentSong: immutableCurrentSong,
    currentIndex,
    playList: immutablePlayList,
    mode, //播放模式
    sequencePlayList: immutableSequencePlayList, //顺序列表
    fullScreen,
  } = props;

  const {
    togglePlayingDispatch,
    changeCurrentIndexDispatch,
    changeCurrentDispatch,
    changePlayListDispatch, //改变playList
    changeModeDispatch, //改变mode
    toggleFullScreenDispatch,
    togglePlayListDispatch,
  } = props;

  const playList = immutablePlayList.toJS();

  const sequencePlayList = immutableSequencePlayList.toJS();
  const currentSong = immutableCurrentSong.toJS();
  //
  useEffect(() => {
    //组件首次挂载的时候，数据为0 -1 undefined true
    //设置条件让组件首次挂载时不执行歌曲的相关任务，获得了数据更新时才执行
    if (
      !playList.length ||
      currentIndex === -1 ||
      !playList[currentIndex] ||
      playList[currentIndex].id === preSong.id ||
      !songReady //当歌曲未准备好事不要渲染
    ) {
      // console.log(
      //   playList.length,
      //   currentIndex,
      //   playList[currentIndex],
      //   // playList[currentIndex].id,
      //   songReady
      // );
      return;
    }
    //获得当前播放歌曲
    let current = playList[currentIndex];
    //设置上一曲（pre指针）
    setPreSong(current);
    //关闭歌曲准备状态
    setSongReady(false); // 把标志位置为 false, 表示现在新的资源没有缓冲完成，不能切歌
    //改变redux中的当前播放歌曲
    changeCurrentDispatch(current); //赋值currentSong
    //给audio标签添加src,异步加载资源
    audioRef.current.src = getSongUrl(current.id);
    //设置宏任务，当组件挂载后执行播放（用宏任务可以保证播放是各种数据已经初始化）
    setTimeout(() => {
      audioRef.current.play().then(
        () => {
          //当audio成功播放后，歌曲装备完毕，可以执行歌词的相关操作
          setSongReady(true);
        },
        (err) => {
          console.log(err, "播放出错，该歌曲为VIP专享");
          setSongReady(true);
        }
      );
    });
    //改变redux中的播放状态
    togglePlayingDispatch(true); //播放状态
    setCurrentTime(0); //从头开始播放
    setDuration((current.dt / 1000) | 0); //时长
    //获取歌词getLyric
    getLyric(current.id);
    setCurrentTime(0);
    //
    setDuration((current.dt / 1000) | 0);
  }, [currentIndex]);

  useEffect(() => {
    //组件挂载后，通过播放状态开控制播放与暂停
    playing ? audioRef.current.play() : audioRef.current.pause();
  }, [playing]);

  const handleLyric = ({ lineNum, txt }) => {
    if (!currentLyric.current) return;
    currentLineNum.current = lineNum;
    setPlayingLyric(txt);
  };
  //根据id获取歌词
  const getLyric = (id) => {
    let lyric = "";
    //如果当前有歌词正在播放，应该先暂停播放，否则一边获取新歌词一边播放会出错
    if (currentLyric.current) {
      currentLyric.current.stop();
    }
    getLyricRequest(id)
      .then((data) => {
        lyric = data.lrc.lyric;
        if (!lyric) {
          currentLyric.current = null;
          console.log("歌词获取失败，为空");
          return;
        }
        currentLyric.current = new Lyric(lyric, handleLyric);
        currentLyric.current.play();
        currentLineNum.current = 0;
        //这一步其实和play()重复了，可以不要
        // currentLyric.current.seek(0);
      })
      .catch(() => {
        //如果歌词获取失败则捕获并处理错误，让歌曲正常播放。否则歌曲会在初始化时因为歌词失败而失败
        songReady.current = true;
        audioRef.current.play();
      });
  };
  //播放按钮的回调
  const clickPlaying = (e, state) => {
    //阻止事件冒泡，否则点击miniPlayer会全屏
    e.stopPropagation();
    //更改播放状态
    togglePlayingDispatch(state);

    if (currentLyric.current) {
      //currentTime单位是s，要转换ms
      currentLyric.current.togglePlay(currentTime * 1000);
    }
  };
  //更新播放时间
  const updateTime = (e) => {
    setCurrentTime(e.target.currentTime);
  };
  //进度条改变的回调
  const onProgressChange = (curPercent) => {
    //当进度改变后要改变当前的播放时间以及歌词进度等
    const newTime = curPercent * duration;
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
    if (!playing) {
      togglePlayingDispatch(true);
    }
    if (currentLyric.current) {
      currentLyric.current.seek(newTime * 1000);
    }
  };
  //一首歌循环
  const handleLoop = () => {
    audioRef.current.currentTime = 0;
    changePlayingState(true);
    audioRef.current.play();
  };
  //上一曲
  const handlePrev = () => {
    //播放列表只有一首歌时单曲循环
    if (playList.length === 1) {
      handleLoop();
      return;
    }

    let index = currentIndex - 1;
    if (index < 0) index = playList.length - 1;
    if (!playing) togglePlayingDispatch(true);
    changeCurrentIndexDispatch(index);
  };
  //改变播放模式0,1,2
  const changeMode = () => {
    let newMode = (mode + 1) % 3;
    if (newMode === 0) {
      //顺序模式
      changePlayListDispatch(sequencePlayList);
      let index = findIndex(currentSong, sequencePlayList);
      //播放列表改变后当前歌曲的下标也改
      changeCurrentIndexDispatch(index);
      setModeText("顺序循环");
    } else if (newMode === 1) {
      //单曲循环
      //单曲循环时，列表是顺序的，只是播放完后不会切换下一曲
      changePlayListDispatch(sequencePlayList);
      setModeText("单曲循环");
    } else if (newMode === 2) {
      //随机播放
      let newList = shuffle(sequencePlayList);
      let index = findIndex(currentSong, newList);
      changePlayListDispatch(newList);
      changeCurrentIndexDispatch(index);
      setModeText("随机播放");
    }
    changeModeDispatch(newMode);
    //模式切换后出现3秒的提示信息
    toastRef.current.show();
  };

  //下一曲
  const handleNext = () => {
    //播放列表只有一首歌时单曲循环
    if (playList.length === 1) {
      handleLoop();
      return;
    }
    let index = currentIndex + 1;
    if (index === playList.length) index = 0;
    if (!playing) togglePlayingDispatch(true);
    changeCurrentIndexDispatch(index);
  };
  //
  const handleEnd = () => {
    if (mode === playMode.loop) {
      //循环模式则重复播放
      handleLoop();
    } else {
      handleNext();
    }
  };
  //处理播放错误
  const handleError = () => {
    //如果歌曲为vip，播放会错误，出错后不会setsongready，所以此处打印错误并设置一下，否则后面就不能播放了
    alert("播放出错，该歌曲为VIP专享");
    setSongReady(true);
  };

  return (
    <div>
      {isEmptyObject(currentSong) ? null : (
        <MiniPlayer
          song={currentSong}
          fullScreen={fullScreen}
          playing={playing}
          toggleFullScreen={toggleFullScreenDispatch}
          clickPlaying={clickPlaying}
          percent={percent}
          togglePlayList={togglePlayListDispatch}
        />
      )}
      {isEmptyObject(currentSong) ? null : (
        <NormalPlayer
          song={currentSong}
          fullScreen={fullScreen}
          playing={playing}
          mode={mode}
          changeMode={changeMode}
          duration={duration}
          currentTime={currentTime} //当前播放时间
          percent={percent} //播放进度
          toggleFullScreen={toggleFullScreenDispatch}
          clickPlaying={clickPlaying}
          onProgressChange={onProgressChange}
          handlePrev={handlePrev}
          handleNext={handleNext}
          togglePlayList={togglePlayListDispatch}
          currentLyric={currentLyric.current}
          currentPlayingLyric={currentPlayingLyric}
          currentLineNum={currentLineNum.current}
        />
      )}
      <audio
        ref={audioRef}
        onTimeUpdate={updateTime} //播放时持续触发
        onEnded={handleEnd}
        onError={handleError}
      ></audio>
      <PlayList></PlayList>
      <Toast text={modeText} ref={toastRef}></Toast>
    </div>
  );
}

// 映射Redux全局的state到组件的props上
const mapStateToProps = (state) => ({
  fullScreen: state.getIn(["player", "fullScreen"]), //全屏状态
  playing: state.getIn(["player", "playing"]), //播放状态
  currentSong: state.getIn(["player", "currentSong"]), //当前歌曲
  showPlayList: state.getIn(["player", "showPlayList"]), //是否展示播放列表
  mode: state.getIn(["player", "mode"]), //播放模式
  currentIndex: state.getIn(["player", "currentIndex"]), //当前歌曲下标
  playList: state.getIn(["player", "playList"]), //播放列表
  sequencePlayList: state.getIn(["player", "sequencePlayList"]), //顺序播放列表
});

// 映射dispatch到props上
const mapDispatchToProps = (dispatch) => {
  return {
    togglePlayingDispatch(data) {
      //改变播放状态
      dispatch(changePlayingState(data));
    },
    toggleFullScreenDispatch(data) {
      //改变全屏状态
      dispatch(changeFullScreen(data));
    },
    togglePlayListDispatch(data) {
      //是否展示播放列表
      dispatch(changeShowPlayList(data));
    },
    changeCurrentIndexDispatch(index) {
      //改变播放歌曲下标
      dispatch(changeCurrentIndex(index));
    },
    changeCurrentDispatch(data) {
      //改变当前歌曲
      dispatch(changeCurrentSong(data));
    },
    changeModeDispatch(data) {
      //改变播放模式
      dispatch(changePlayMode(data));
    },
    changePlayListDispatch(data) {
      //改变播放列表
      dispatch(changePlayList(data));
    },
  };
};

// 将ui组件包装成容器组件
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Player));
