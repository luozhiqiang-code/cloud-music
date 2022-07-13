import React, { useContext, useEffect, useState } from "react";
import Horizen from "../../baseUI/horizen-item";
import { alphaTypes, categoryTypes } from "../../api/config";
import { NavContainer } from "./style";
import { ListContainer, List, ListItem } from "./style";
import Scroll from "../../baseUI/scroll";
import {
  changeEnterLoading,
  changePageCount,
  changePullDownLoadig,
  changePullUpLoading,
  getHotSingerList,
  getSingerList,
  refreshMoreHotSingerList,
  refreshMoreSingerList,
} from "./store/actionCreators";
import { connect } from "react-redux";
import Loading from "../../baseUI/loading";
import LazyLoad, { forceCheck } from "react-lazyload";
import { CategoryContext, CHANGE_ALPHA, CHANGE_CATEGORY } from "./data";
import { Outlet, useNavigate } from "react-router-dom";

function Singers(props) {
  const {
    singerList,
    enterLoading,
    pullDownLoading,
    pullUpLoading,
    pageCount,
    songsCount,
  } = props;

  const {
    updateDispatch,
    getHotSingerDispath,
    pullDownRefreshDispath,
    pullUpRefreshDispatch,
  } = props;

  // const [category, setCategory] = useState("");
  const { data, dispatch } = useContext(CategoryContext); //将state提升到父级context，从而实现切换tab保留选择历史
  const { category, alpha } = data.toJS();
  // const [alpha, setAlpha] = useState("");

  useEffect(() => {
    //加上判断条件后，切换tab不会重新发送请求
    if (!singerList.size) {
      getHotSingerDispath();
    }
  }, []);
  //字母项的回调函数，点击字母项时应该修改context存的字母数据同时还有根据新字母发送请求更改列表
  const handleUpdateAlpha = (val) => {
    // setAlpha(val);
    //用Context传入的dispatch来修改redux中的数据
    dispatch({ type: CHANGE_ALPHA, data: val });
    //更新分类歌手列表
    updateDispatch(category, val);
  };
  //分类项的回调函数，点击分类项时应该修改context存的分类数据同时还有根据新分类发送请求更改列表
  const handleUpdateCategory = (val) => {
    // setCategory(val);
    //用Context传入的dispatch来修改redux中的数据
    dispatch({ type: CHANGE_CATEGORY, data: val });
    //更新分类歌手列表
    updateDispatch(val, alpha);
  };

  const handlePullUp = () => {
    pullUpRefreshDispatch(category, alpha, category === "", pageCount);
  };

  const handlePullDown = () => {
    pullDownRefreshDispath(category, alpha);
  };
  const navigate = useNavigate();
  const enterDetail = (detail) => {
    navigate(`/singers/${detail.id}`);
  };
  //渲染歌手列表
  const renderSingerList = () => {
    //使用前得吧immutable数据转JS
    const singerListJS = singerList ? singerList.toJS() : [];
    return (
      <List>
        {singerListJS.map((item, index) => {
          return (
            <ListItem
              key={item.accountId + "" + index}
              onClick={() => {
                enterDetail(item);
              }}
            >
              <div className="img_wrapper">
                <LazyLoad
                  placeholder={
                    <img
                      width="100%"
                      height="100%"
                      src={require("./singer.png")}
                      alt="music"
                    />
                  }
                >
                  <img
                    src={`${item.picUrl}?param=300x300`}
                    width="100%"
                    height="100%"
                    alt="mucis"
                  />
                </LazyLoad>
              </div>
              <span className="name">{item.name}</span>
            </ListItem>
          );
        })}
      </List>
    );
  };

  return (
    <div>
      <NavContainer>
        <Horizen
          list={categoryTypes}
          title={"分类 (默认热门):"}
          oldVal={category}
          handleClick={handleUpdateCategory}
        ></Horizen>
        <Horizen
          list={alphaTypes}
          title={"首字母:"}
          oldVal={alpha}
          handleClick={handleUpdateAlpha}
        ></Horizen>
      </NavContainer>
      <ListContainer play={songsCount}>
        <Scroll
          direction={"vertical"}
          pullUp={handlePullUp}
          pullDown={handlePullDown}
          onScroll={forceCheck}
          pullUpLoading={pullUpLoading}
          pullDownLoading={pullDownLoading}
        >
          {renderSingerList()}
        </Scroll>
        <Loading show={enterLoading}></Loading>
      </ListContainer>
      <Outlet></Outlet>
    </div>
  );
}

const mapStateToProps = (state) => ({
  singerList: state.getIn(["singers", "singerList"]), //歌手列表数据
  enterLoading: state.getIn(["singers", "enterLoading"]), //入场加载状态
  pullUpLoading: state.getIn(["singers", "pullUpLoading"]), //上拉加载状态
  pullDownLoading: state.getIn(["singers", "pullDownLoading"]), //下拉刷新状态
  pageCount: state.getIn(["singers", "pageCount"]), //当前页码
  songsCount: state.getIn(["player", "playList"]).size, //播放列表的歌曲数量,用于判断是否腾出空间给播放组件
});

const mapDiapatchToProps = (dispatch) => ({
  //未选择筛选时，获得页面的默认热门歌手
  getHotSingerDispath() {
    dispatch(getHotSingerList());
  },
  //获取筛选后的歌手名单
  updateDispatch(category, alpha) {
    dispatch(changePageCount(0)); //改变分类，页数也得从0开始
    dispatch(changeEnterLoading(true)); //开始加载动画，loding...
    dispatch(getSingerList(category, alpha)); //异步加载数据，加载完后会结束loading动画
  },
  //上拉加载更多歌手名单，分有分类加载和无分类加载
  pullUpRefreshDispatch(category, alpha, hot, count) {
    //开启上拉加载动画
    dispatch(changePullUpLoading(true));
    //当前页码加一
    dispatch(changePageCount(count + 1));
    if (hot) {
      //无分类加载
      dispatch(refreshMoreHotSingerList());
    } else {
      //有分类加载
      dispatch(refreshMoreSingerList(category, alpha));
    }
  },
  //顶部下拉刷新，分为有分类刷新和无分类刷新
  pullDownRefreshDispath(category, alpha) {
    //开启下拉刷新动画
    dispatch(changePullDownLoadig(true));
    //下拉刷新后获得第一页数据，得更改页码
    dispatch(changePageCount(0));
    //如果为选择分类，则分类和字母都为空串，此时为无分类刷新
    if (category === "" && alpha === "") {
      dispatch(getHotSingerList());
    } else {
      //分类数据不为空串则为有分类刷新
      dispatch(getSingerList(category, alpha));
    }
  },
});

export default connect(
  mapStateToProps,
  mapDiapatchToProps
)(React.memo(Singers));
