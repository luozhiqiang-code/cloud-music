import React, { useRef, useEffect } from "react";
import { getName, formatPlayTime } from "../../../api/utils";
import {
  NormalPlayerContainer,
  Top,
  Middle,
  Bottom,
  Operators,
  CDWrapper,
  ProgressWrapper,
} from "./style";
import { CSSTransition } from "react-transition-group";
import { prefixStyle } from "../../../api/utils";
import animations from "create-keyframe-animation";
import ProgressBar from "../../../baseUI/progress-bar";
import { playMode } from "./../../../api/config";
import Scroll from "../../../baseUI/scroll";
import { LyricContainer, LyricWrapper } from "./style";

function NormalPlayer(props) {
  const { fullScreen, song, mode, playing, percent, currentTime, duration } =
    props;

  const {
    changeMode,
    handlePrev,
    handleNext,
    onProgressChange,
    clickPlaying,
    toggleFullScreen,
    togglePlayList,
  } = props;
  const { currentLineNum, currentPlayingLyric, currentLyric } = props;
  //Middle部分是否显示全屏歌词的引用，不用state避免重复渲染
  const currentState = useRef("");
  const lyricScrollRef = useRef();
  //每一行歌词的引用
  const lyricLineRefs = useRef([]);

  const normalPlayerRef = useRef();
  const cdWrapperRef = useRef();

  const transform = prefixStyle("transform");
  //
  useEffect(() => {
    if (!lyricScrollRef.current) return;
    let bScroll = lyricScrollRef.current.getBScroll();
    if (currentLineNum > 9) {
      // 滚动到当前歌词行的前的第9行的位置，呈现的效果就是一致高亮的是第五行
      let lineEl = lyricLineRefs.current[currentLineNum - 9].current;
      bScroll.scrollToElement(lineEl, 1000);
    } else {
      // 当前歌词行数 <=9, 直接滚动到最顶端
      bScroll.scrollTo(0, 0, 1000);
    }
  }, [currentLineNum]);

  const _getPosAndScale = () => {
    const targetWidth = 40;
    const paddingLeft = 40;
    const paddingBottom = 30;
    const paddingTop = 80;
    const width = window.innerWidth * 0.8; //cd宽度80%
    const scale = targetWidth / width;
    //从当前位置移动到左下角的坐标距离
    const x = -(window.innerWidth / 2 - paddingLeft);
    const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;
    //可以直接量
    // const x = -155;
    // const y = 645;
    return {
      x,
      y,
      scale,
    };
  };

  const enter = () => {
    //因为离开的时候设置的display：none，所以开始得这么设置
    normalPlayerRef.current.style.display = "block";
    const { x, y, scale } = _getPosAndScale(); //获取miniPlayer图片中心相对normalPlayer唱片中心的偏移
    let animation = {
      0: {
        transform: `translate3d(${x}px,${y}px,0) scale(${scale})`,
      },
      60: {
        transform: `translate3d(0, 0, 0) scale(1.1)`,
      },
      100: {
        transform: `translate3d(0, 0, 0) scale(1)`,
      },
    };
    animations.registerAnimation({
      name: "move",
      animation,
      presets: {
        duration: 400,
        easing: "linear",
      },
    });
    animations.runAnimation(cdWrapperRef.current, "move");
  };

  const afterEnter = () => {
    // 进入后解绑帧动画
    const cdWrapperDom = cdWrapperRef.current;
    animations.unregisterAnimation("move");
    cdWrapperDom.style.animation = "";
    //退出时将middle的状态切换会cd
    currentState.current = "";
  };

  const leave = () => {
    if (!cdWrapperRef.current) return;
    const cdWrapperDom = cdWrapperRef.current;
    cdWrapperDom.style.transition = "all 0.4s";
    const { x, y, scale } = _getPosAndScale();
    cdWrapperDom.style[
      transform
    ] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
  };
  //这一步其实可以再csstransition上用unmountExit解决，直接全卸载了
  const afterLeave = () => {
    if (!cdWrapperRef.current) return;
    const cdWrapperDom = cdWrapperRef.current;
    cdWrapperDom.style.transition = "";
    cdWrapperDom.style[transform] = "";
    normalPlayerRef.current.style.display = "none";
  };

  const getPlayMode = () => {
    let content;
    if (mode === playMode.sequence) {
      content = "&#xe6a1;";
    } else if (mode === playMode.loop) {
      content = "&#xe68d;";
    } else {
      content = "&#xe66b;";
    }
    return content;
  };
  //改变middle的状态，（歌词/唱片）
  const toggleCurrentState = () => {
    if (currentState.current !== "lyric") {
      currentState.current = "lyric";
    } else {
      currentState.current = "";
    }
  };
  return (
    <CSSTransition
      classNames="normal"
      in={fullScreen}
      timeout={400}
      mountOnEnter
      onEnter={enter}
      onEntered={afterEnter}
      onExit={leave}
      onExited={afterLeave}
      // unmountOnExit
    >
      <NormalPlayerContainer ref={normalPlayerRef}>
        <div className="background">
          <img
            src={song.al.picUrl + "?param=300x300"}
            width="100%"
            height="100%"
            alt="歌曲图片"
          />
        </div>
        <div className="background layer"></div>
        <Top className="top">
          <div className="back" onClick={() => toggleFullScreen(false)}>
            <span className="iconfont icon-back">&#xe600;</span>
          </div>
          <h1 className="title">{song.name}</h1>
          <h1 className="subtitle">{getName(song.ar)}</h1>
        </Top>
        <Middle
          ref={cdWrapperRef}
          onClick={toggleCurrentState}
          className="middle"
        >
          <CSSTransition
            timeout={400}
            classNames="fade"
            in={currentState.current !== "lyric"}
          >
            <CDWrapper
              style={{
                visibility:
                  currentState.current !== "lyric" ? "visible" : "hidden",
              }}
              className="cdWrapper"
            >
              <div className="cd">
                <img
                  className={`image play ${playing ? "" : "pause"}`}
                  src={song.al.picUrl + "?param=400x400"}
                  alt=""
                />
              </div>
              <p className="playing_lyric">{currentPlayingLyric}</p>
            </CDWrapper>
          </CSSTransition>
          <CSSTransition
            timeout={400}
            classNames="fade"
            in={currentState.current === "lyric"}
          >
            <LyricContainer>
              <Scroll ref={lyricScrollRef}>
                <LyricWrapper
                  style={{
                    visibility:
                      currentState.current === "lyric" ? "visible" : "hidden",
                  }}
                  className="lyric_wrapper"
                >
                  {currentLyric && currentLyric.lines.length !== 0 ? (
                    currentLyric.lines.map((item, index) => {
                      // 拿到每一行歌词的 DOM 对象，后面滚动歌词需要！
                      lyricLineRefs.current[index] = React.createRef();
                      return (
                        <p
                          className={`text ${
                            currentLineNum === index ? "current" : ""
                          }`}
                          key={item.time + index}
                          ref={lyricLineRefs.current[index]}
                        >
                          {item.txt}
                        </p>
                      );
                    })
                  ) : (
                    <p className="text pure"> 纯音乐，请欣赏。</p>
                  )}
                </LyricWrapper>
              </Scroll>
            </LyricContainer>
          </CSSTransition>
        </Middle>

        <Bottom className="bottom">
          <ProgressWrapper>
            <span className="time time-l">{formatPlayTime(currentTime)}</span>
            <div className="progress-bar-wrapper">
              <ProgressBar
                percent={percent}
                percentChange={onProgressChange}
              ></ProgressBar>
            </div>
            <div className="time time-r">{formatPlayTime(duration)}</div>
          </ProgressWrapper>
          <Operators>
            <div className="icon i-left" onClick={changeMode}>
              <span
                className="iconfont"
                dangerouslySetInnerHTML={{ __html: getPlayMode() }}
              ></span>
            </div>
            <div className="icon i-left" onClick={handlePrev}>
              <span className="iconfont">&#xe6e1;</span>
            </div>
            <div className="icon i-center">
              <span
                className="iconfont"
                onClick={(e) => clickPlaying(e, !playing)}
                dangerouslySetInnerHTML={{
                  __html: playing ? "&#xe629;" : "&#xea6e;",
                }}
              >
                {/*表达式中的字符在经过了转义,防止xss，所以最后输出就是字符串，不是icon {playing ? "&#xe629;" : "&#xea6e;"} */}
              </span>
            </div>
            <div className="icon i-right" onClick={handleNext}>
              <span className="iconfont">&#xe719;</span>
            </div>
            <div className="icon i-right">
              <span
                className="iconfont songsList"
                onClick={() => {
                  togglePlayList(true);
                }}
              >
                &#xe636;
              </span>
            </div>
          </Operators>
        </Bottom>
      </NormalPlayerContainer>
    </CSSTransition>
  );
}

export default React.memo(NormalPlayer);
