import React, { useState, useEffect, useRef, useCallback } from "react";
import { CSSTransition } from "react-transition-group";
import { Container } from "./style";
import { HEADER_HEIGHT } from "./../../api/config";
import { ImgWrapper, CollectButton, SongListWrapper, BgLayer } from "./style";
import Header from "../../baseUI/header/index";
import Scroll from "../../baseUI/scroll/index";
import SongsList from "../SongsList";
import { connect } from "react-redux";
import Loading from "./../../baseUI/loading/index";
import { getSingerInfo, changeEnterLoading } from "./store/actionCreators";
import { useNavigate, useParams } from "react-router-dom";
import MusicNote from "../../baseUI/music-note";

/**实现该组件的效果，更好的方式应该是将收藏按钮放到滚动内容中，并且给滚动内容设置白色背景，而不是利用复杂的元素充当白板 */
function Singer(props) {
  const initialHeight = useRef(0);
  const [showStatus, setShowStatus] = useState(true);

  const {
    artist: immutableArtist,
    songs: immutableSongs,
    loading,
    songsCount,
  } = props;

  const { getSingerDataDispatch } = props;

  const artist = immutableArtist.toJS();
  const songs = immutableSongs.toJS();

  const collectButton = useRef();
  const imageWrapper = useRef();
  const songScrollWrapper = useRef();
  const songScroll = useRef();
  const header = useRef();
  // const layer = useRef();

  const musicNoteRef = useRef();
  const musicAnimation = (x, y) => {
    musicNoteRef.current.startAnimation({ x, y });
  };

  //往上偏移的尺寸，露出圆角
  const OFFSET = 5;
  const { id } = useParams(); //得到的是一个param对象
  //组件挂载后，给BgLayer背板设置初始位置
  useEffect(() => {
    //根据歌手id获取歌曲信息
    getSingerDataDispatch(id);

    //获得图片的可见高度
    let h = imageWrapper.current.offsetHeight;
    initialHeight.current = h;
    //初始化时给滚动容器设置高度（也可以在css种设置，更方便）
    songScrollWrapper.current.style.top = `${h - OFFSET}px`;
    //把遮罩设置与滚动内容高度一致，作为背景
    // layer.current.style.top = `${h - OFFSET}px`;
    //初始容器高度改变需要刷新以获得新的高度，如果滑动出问题，记得试试刷新
    songScroll.current.refresh();
    // eslint-disable-next-line
  }, []);

  const handleScroll = useCallback((pos) => {
    //获取图片的高度
    let height = initialHeight.current;
    //获得滚动内容的高度
    const newY = pos.y;
    //获得图片的应用
    const imageDOM = imageWrapper.current;
    //获得按钮的引用
    const buttonDOM = collectButton.current;
    //获得顶部header的引用
    const headerDOM = header.current;
    //获得白色背板的引用
    // const layerDOM = layer.current;
    //miniScroll表示滚动内容滚动到header底边的坐标
    const minScrollY = -(height - OFFSET) + HEADER_HEIGHT;
    //指的是滑动距离占图片高度的百分比
    const percent = Math.abs(newY / height);
    //当下滑时随着距离放大图片,同时设置按钮也随列表移动（）
    if (newY > 0) {
      imageDOM.style["transform"] = `scale(${1 + percent})`;
      buttonDOM.style["transform"] = `translate3d(0, ${newY}px, 0)`;
      // layerDOM.style.top = `${height - OFFSET + newY}px`;
    } else if (newY >= minScrollY) {
      //当上拉高度小于header高度时
      //将白色背板的高度设置与滚动内容一致
      // layerDOM.style.top = `${height - OFFSET - Math.abs(newY)}px`;
      //这时候保证遮罩的层叠优先级比图片高，不至于被图片挡住
      // layerDOM.style.zIndex = 1;
      //将背景图片正常显示
      //设置top75%，也就是是宽度的0.75，css中开始就是这么定义的
      //这里为了获得宽度的75%，不能用height，用padding，height设置为0
      imageDOM.style.paddingTop = "75%";
      imageDOM.style.zIndex = -1;
      //按钮跟着移动且渐渐变透明
      buttonDOM.style["transform"] = `translate3d(0, ${newY}px, 0)`;
      buttonDOM.style["opacity"] = `${1 - percent * 2}`;
    } else if (newY < minScrollY) {
      //往上滑动，但是超过Header部分
      // layerDOM.style.top = `${HEADER_HEIGHT - OFFSET}px`;
      // layerDOM.style.zIndex = 1;
      //防止溢出的歌单内容遮住Header
      // headerDOM.style.zIndex = 100;
      //此时图片高度与Header一致
      imageDOM.style.paddingTop = `${HEADER_HEIGHT}px`;
      imageDOM.style.zIndex = 99;
    }
  }, []);

  const setShowStatusFalse = useCallback(() => {
    setShowStatus(false);
  }, []);

  const navigate = useNavigate(); //history对象的封装
  return (
    <CSSTransition
      in={showStatus}
      timeout={300}
      classNames="fly"
      appear={true}
      unmountOnExit
      onExited={() => navigate(-1)}
    >
      <Container play={songsCount}>
        <Header
          handleClick={setShowStatusFalse}
          title={artist.name}
          ref={header}
        ></Header>
        <ImgWrapper ref={imageWrapper} bgUrl={artist.picUrl}>
          <div className="filter"></div>
        </ImgWrapper>
        <CollectButton ref={collectButton}>
          <span className="iconfont">&#xe8ab;</span>
          <span className="text">收藏</span>
        </CollectButton>
        {/* <BgLayer ref={layer}></BgLayer> */}
        <SongListWrapper ref={songScrollWrapper}>
          <Scroll ref={songScroll} onScroll={handleScroll}>
            <SongsList
              songs={songs}
              showCollect={false}
              musicAnimation={musicAnimation}
              showBackground={true}
            ></SongsList>
          </Scroll>
        </SongListWrapper>
        {loading ? <Loading></Loading> : null}
        <MusicNote ref={musicNoteRef}></MusicNote>
      </Container>
    </CSSTransition>
  );
}

// 映射Redux全局的state到组件的props上
const mapStateToProps = (state) => ({
  artist: state.getIn(["singerInfo", "artist"]), //获取歌手信息
  songs: state.getIn(["singerInfo", "songsOfArtist"]), //获取歌手的歌曲
  loading: state.getIn(["singerInfo", "loading"]), //加载状态
  songsCount: state.getIn(["player", "playList"]).size, //尽量减少toJS操作，直接取size属性就代表了list的长度
});
// 映射dispatch到props上
const mapDispatchToProps = (dispatch) => {
  return {
    getSingerDataDispatch(id) {
      dispatch(changeEnterLoading(true));
      dispatch(getSingerInfo(id));
    },
  };
};

// 将ui组件包装成容器组件
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Singer));
