import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { Container, ShortcutWrapper, HotKey } from "./style";
import SearchBox from "../../baseUI/search-box";
import { connect } from "react-redux";
import { getHotKeyWords } from "./store/actionCreators";
import { changeEnterLoading, getSuggestList } from "./store/actionCreators";
import Scroll from "../../baseUI/scroll";
import Loading from "../../baseUI/loading";
import LazyLoad, { forceCheck } from "react-lazyload";
import { List, ListItem } from "./style";
import { SongItem } from "./style";
import { getName } from "../../api/utils";
import MusicalNote from "../../baseUI/music-note";
import { getSongDetail } from "./../Player/store/actionCreators";

function Search(props) {
  const {
    hotList,
    enterLoading,
    suggestList: immutableSuggestList,
    songsCount,
    songsList: immutableSongsList,
  } = props;

  const {
    getHotKeyWordsDispatch,
    changeEnterLoadingDispatch,
    getSuggestListDispatch,
    getSongDetailDispatch,
  } = props;

  const suggestList = immutableSuggestList.toJS();
  const songsList = immutableSongsList.toJS();

  // 控制动画
  const [show, setShow] = useState(false);
  //异步查询字符串
  const [query, setQuery] = useState("");
  //用新的state存储热词，如果用query会渲染循环
  const [hotQuery, setHotQuery] = useState("");
  const musicNoteRef = useRef();
  const navigate = useNavigate();
  useEffect(() => {
    setShow(true);
  }, []);

  // 由于是传给子组件的方法，尽量用 useCallback 包裹，以使得在依赖未改变，始终给子组件传递的是相同的引用
  const searchBack = useCallback(() => {
    setShow(false);
  }, []);

  const handleQuery = (q) => {
    //每次发起查询时保存当此查询，下次作比较
    setQuery(q);
    if (!q) return;
    changeEnterLoadingDispatch(true);
    getSuggestListDispatch(q);
  };
  //初次渲染时，搜索框为空，获得热门搜索列表
  useEffect(() => {
    setShow(true);
    // 用了 redux 缓存，不再赘述
    console.log(hotList.size);
    if (!hotList.size) getHotKeyWordsDispatch();
  }, []);

  //当搜索框为空时，展示热门搜索列表
  const renderHotKey = () => {
    let list = hotList ? hotList.toJS() : [];
    return (
      <ul>
        {list.map((item) => {
          return (
            <li
              className="item"
              key={item.first}
              onClick={() => setHotQuery(item.first)}
            >
              <span>{item.first}</span>
            </li>
          );
        })}
      </ul>
    );
  };

  const selectItem = (e, id) => {
    getSongDetailDispatch(id);
    musicNoteRef.current.startAnimation({
      x: e.nativeEvent.clientX,
      y: e.nativeEvent.clientY,
    });
  };

  const renderSingers = () => {
    let singers = suggestList.artists;
    if (!singers || !singers.length) return;
    return (
      <List>
        <h1 className="title"> 相关歌手 </h1>
        {singers.map((item, index) => {
          return (
            <ListItem
              key={item.accountId + "" + index}
              onClick={() => navigate(`/singers/${item.id}`)}
            >
              <div className="img_wrapper">
                <LazyLoad
                  placeholder={
                    <img
                      width="100%"
                      height="100%"
                      src={require("./singer.png")}
                      alt="singer"
                    />
                  }
                >
                  <img
                    src={item.picUrl}
                    width="100%"
                    height="100%"
                    alt="music"
                  />
                </LazyLoad>
              </div>
              <span className="name"> 歌手: {item.name}</span>
            </ListItem>
          );
        })}
      </List>
    );
  };
  const renderAlbum = () => {
    let albums = suggestList.playlists;
    if (!albums || !albums.length) return;
    return (
      <List>
        <h1 className="title"> 相关歌单 </h1>
        {albums.map((item, index) => {
          return (
            <ListItem
              key={item.accountId + "" + index}
              onClick={() => navigate(`/album/${item.id}`)}
            >
              <div className="img_wrapper">
                <LazyLoad
                  placeholder={
                    <img
                      width="100%"
                      height="100%"
                      src={require("./music.png")}
                      alt="music"
                    />
                  }
                >
                  <img
                    src={item.coverImgUrl}
                    width="100%"
                    height="100%"
                    alt="music"
                  />
                </LazyLoad>
              </div>
              <span className="name"> 歌单: {item.name}</span>
            </ListItem>
          );
        })}
      </List>
    );
  };
  const renderSongs = () => {
    return (
      <SongItem style={{ paddingLeft: "20px" }}>
        {songsList.map((item) => {
          return (
            <li key={item.id} onClick={(e) => selectItem(e, item.id)}>
              <div className="info">
                <span>{item.name}</span>
                <span>
                  {getName(item.artists)} - {item.album.name}
                </span>
              </div>
            </li>
          );
        })}
      </SongItem>
    );
  };

  return (
    <CSSTransition
      in={show}
      timeout={300}
      appear={true}
      classNames="fly"
      unmountOnExit
      onExited={() => navigate(-1)}
    >
      <Container play={songsCount}>
        <div className="search_box_wrapper">
          <SearchBox
            back={searchBack}
            newQuery={hotQuery}
            handleQuery={handleQuery}
          ></SearchBox>
        </div>
        <ShortcutWrapper show={query}>
          <Scroll onScorll={forceCheck}>
            <div>
              <HotKey>
                <h1 className="title"> 热门搜索 </h1>
                {renderHotKey()}
              </HotKey>
              {renderSingers()}
              {renderAlbum()}
              {renderSongs()}
            </div>
          </Scroll>
        </ShortcutWrapper>
        <Loading show={enterLoading}></Loading>
        <MusicalNote ref={musicNoteRef}></MusicalNote>
      </Container>
    </CSSTransition>
  );
}

// 映射 Redux 全局的 state 到组件的 props 上
const mapStateToProps = (state) => ({
  hotList: state.getIn(["search", "hotList"]),
  enterLoading: state.getIn(["search", "enterLoading"]),
  suggestList: state.getIn(["search", "suggestList"]),
  songsCount: state.getIn(["player", "playList"]).size,
  songsList: state.getIn(["search", "songsList"]),
});

// 映射 dispatch 到 props 上
const mapDispatchToProps = (dispatch) => {
  return {
    getHotKeyWordsDispatch() {
      dispatch(getHotKeyWords());
    },
    changeEnterLoadingDispatch(data) {
      dispatch(changeEnterLoading(data));
    },
    getSuggestListDispatch(data) {
      dispatch(getSuggestList(data));
    },
    getSongDetailDispatch(id) {
      dispatch(getSongDetail(id));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Search));
