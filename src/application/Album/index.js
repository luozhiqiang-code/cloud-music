import React, { useState, useCallback, useRef, useEffect } from "react";
import { Container } from "./style";
import { CSSTransition } from "react-transition-group";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../baseUI/header";
import Scroll from "../../baseUI/scroll";
import { TopDesc, Menu, SongList, SongItem } from "./style";
import { isEmptyObject } from "../../api/utils";
import style from "../../assets/global-style";
import { changeEnterLoading, getAlbumList } from "./store/actionCreators";
import { connect } from "react-redux";
import Loading from "../../baseUI/loading";
import MusicNote from "../../baseUI/music-note";
import SongsList from "../SongsList";

export const HEADER_HEIGHT = 45; //顶部header的高度，用于判断列表上拉与顶部header的位置关系

function Album(props) {
  //控制组件是否显示的状态
  const [showStatus, setShowStatus] = useState(true);
  //控制顶端横幅是否滚动的状态
  const [isMarquee, setIsMarquee] = useState(false);
  const [title, setTitle] = useState("歌单");

  const headerElement = useRef();
  const musicNoteRef = useRef();
  const { currentAlbum: currentAlbumImmutable, enterLoading } = props;
  const { getAlbumDataDispatch } = props;
  //获取url中的param参数，歌单的id
  let { id } = useParams();

  useEffect(() => {
    //根据歌单id异步获取歌单数据
    getAlbumDataDispatch(id);
  }, [getAlbumDataDispatch]);
  //导航对象
  const navigate = useNavigate();

  const handleBack = useCallback(() => {
    //退出按钮的回调函数，设置展示转头为false，csstransition包裹的组件会播放离开过渡动画，完后卸载组件
    setShowStatus(false);
  }, []);

  const musicAnimation = (x, y) => {
    musicNoteRef.current.startAnimation({ x, y });
  };

  let currentAlbum = currentAlbumImmutable && currentAlbumImmutable.toJS();
  //useCallback 缓存函数，否则父组件重新渲染，父组件的函数也是新的，传给子组件，那么子组件的props是新的，Memo浅比较也为新
  //产生不必要的渲染
  const handleScroll = useCallback(
    //判断滚动的高度是否超过header高度，超过则开始显示为红色，并将标题改为歌单的名字，展示跑马灯效果
    (pos) => {
      //当滚动高度为-45时，已经滚动到了header的高度
      let minScrollY = -HEADER_HEIGHT;
      //计算滚动的高度与header的比例，从而header逐渐变为颜色例如（-45/-45）=>（-85/-45）
      let percent = Math.abs(pos.y / minScrollY);
      //headerDOM元素的引用
      let headerDom = headerElement.current;
      //上来的高度超过header高度是开始渐变色
      if (pos.y < minScrollY) {
        //设置颜色为红色
        headerDom.style.backgroundColor = style["theme-color"];
        //利用透明度来改变红色深浅，例如percent 1.1 => 3.2
        //在1.1-3.0透明度线性变化，再网上则一直取1
        headerDom.style.opacity = Math.min(1, (percent - 1) / 2);
        //将标题设置为歌单的名字
        setTitle(currentAlbum.name);
        //开启标题跑马灯效果
        setIsMarquee(true);
      } else {
        //当上拉高度小于header时，显示常态
        headerDom.style.backgroundColor = "";
        headerDom.style.opacity = 1;
        setTitle("歌单");
        setIsMarquee(false);
      }
    },
    [currentAlbum]
  );

  const renderTopDesc = () => {
    return (
      <TopDesc background={currentAlbum.coverImgUrl} className="top">
        <div className="background">
          <div className="filter"></div>
        </div>
        <div className="img_wrapper">
          <div className="decorate"></div>
          <img src={currentAlbum.coverImgUrl} alt="" />
          <div className="play_count">
            <span className="iconfont play">&#xe63f; </span>
            <span className="count">
              {Math.floor(currentAlbum.subscribedCount / 1000) / 10} 万{" "}
            </span>
          </div>
        </div>
        <div className="desc_wrapper">
          <div className="title">{currentAlbum.name}</div>
          <div className="person">
            <div className="avatar">
              <img src={currentAlbum.creator.avatarUrl} alt="" />
            </div>
            <div className="name">{currentAlbum.creator.nickname}</div>
          </div>
        </div>
      </TopDesc>
    );
  };

  const renderMenu = () => {
    return (
      <Menu>
        <div>
          <span className="iconfont">&#xe891;</span>
          评论
        </div>
        <div>
          <span className="iconfont">&#xe8ab;</span>
          点赞
        </div>
        <div>
          <span className="iconfont">&#xe8b9;</span>
          收藏
        </div>
        <div>
          <span className="iconfont">&#xe8c4;</span>
          更多
        </div>
      </Menu>
    );
  };

  return (
    <CSSTransition
      in={showStatus}
      timeout={300}
      classNames="fly"
      appear={true}
      umountOnExit
      onExited={() => {
        navigate && navigate(-1);
      }}
    >
      <Container>
        <Header
          title={title}
          handleClick={handleBack}
          ref={headerElement}
          isMarquee={isMarquee}
        ></Header>
        {!isEmptyObject(currentAlbum) ? (
          <Scroll bounceTop={false} onScroll={handleScroll}>
            <div>
              {renderTopDesc()}
              {renderMenu()}
              {/* {renderSongList()} */}
              <SongsList
                songs={currentAlbum.tracks}
                collectCount={currentAlbum.subscribedCount}
                showCollect={true}
                showBackground={true}
                musicAnimation={musicAnimation}
              ></SongsList>
            </div>
          </Scroll>
        ) : null}
        <Loading show={enterLoading}></Loading>
        <MusicNote ref={musicNoteRef}></MusicNote>
      </Container>
    </CSSTransition>
  );
}

const mapStateToProps = (state) => ({
  currentAlbum: state.getIn(["album", "currentAlbum"]),
  enterLoading: state.getIn(["album", "enterLoading"]),
});

const mapDiapatchToProps = (dispatch) => ({
  getAlbumDataDispatch(id) {
    dispatch(changeEnterLoading(true));
    dispatch(getAlbumList(id));
  },
});

export default connect(mapStateToProps, mapDiapatchToProps)(React.memo(Album));
