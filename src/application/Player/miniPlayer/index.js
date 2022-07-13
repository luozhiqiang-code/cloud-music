import React, { useEffect, useRef, useState } from "react";
import { getName } from "../../../api/utils";
import { MiniPlayerContainer } from "./style";
import { CSSTransition } from "react-transition-group";
import ProgressCircle from "../../../baseUI/progress-circle";

function MiniPlayer(props) {
  const { song, fullScreen, playing, percent } = props;

  const { toggleFullScreen, clickPlaying, togglePlayList } = props;
  //这个状态保证播放器首次出现也会有过渡动画，而不是只在切换为normalPlayer才有
  const [firstShow, setFirstShow] = useState(false);

  const miniPlayerRef = useRef();
  useEffect(() => {
    setFirstShow(true);
  });
  //是否展示播放列表
  const handleTogglePlayList = (e) => {
    togglePlayList(true);
    e.stopPropagation();
  };

  return (
    <CSSTransition
      in={!fullScreen && firstShow}
      timeout={300}
      classNames="mini"
      unmountOnExit
      onEnter={() => {
        // miniPlayerRef.current.style.display = "flex";
      }}
      onExited={() => {
        // miniPlayerRef.current.style.display = "none";
      }}
    >
      <MiniPlayerContainer
        ref={miniPlayerRef}
        onClick={() => toggleFullScreen(true)}
      >
        <div className="icon">
          <div className="imgWrapper">
            <img
              className={`play ${playing ? "" : "pause"}`}
              src={song.al.picUrl}
              width="40"
              height="40"
              alt="img"
            />
          </div>
        </div>
        <div className="text">
          <h2 className="name">{song.name}</h2>
          <p className="desc">{getName(song.ar)}</p>
        </div>
        <div className="control">
          <ProgressCircle
            radius={15}
            percent={percent}
            innerStrokeWidth={3}
            outerStrokeWidth={3}
          >
            {playing ? (
              <span
                className="icon-mini iconfont icon-pause"
                onClick={(e) => clickPlaying(e, false)}
              >
                &#xe616;
              </span>
            ) : (
              <span
                className="icon-mini iconfont icon-play"
                onClick={(e) => clickPlaying(e, true)}
              >
                &#xea82;
              </span>
            )}
          </ProgressCircle>
        </div>
        <div className="control" onClick={handleTogglePlayList}>
          <span className="iconfont">&#xe636;</span>
        </div>
      </MiniPlayerContainer>
    </CSSTransition>
  );
}

export default React.memo(MiniPlayer);
