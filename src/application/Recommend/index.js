import React, { useCallback, useEffect } from "react";
import Slider from "../../components/slider";
import RecommendList from "../../components/list";
import { Content } from "./style";
import Scroll from "../../baseUI/scroll";
import { connect } from "react-redux";
import * as actionCreators from "./store/actionCreators";
import { forceCheck } from "react-lazyload";
import Loading from "../../baseUI/loading";
import { Outlet } from "react-router-dom";

function Recommend(props) {
  //轮播图数据，推荐列表数据，入场动画布尔值，列表中的歌曲数量（数量不为零的时候设置列表距离底部60px，给播放器腾空间
  const { bannerList, recommendList, enterLoading, songsCount } = props;

  const { getBannerDataDispatch, getRecommendListDateDispatch } = props;
  useEffect(() => {
    //当从别的页面回到该页面会重新渲染，设置判断条件，当列表不为空则不重新获取数据也就不会重新生成react节点，直接渲染旧节点
    !bannerList.size && getBannerDataDispatch();
    !recommendList.size && getRecommendListDateDispatch();
  }, []); //空数组只在挂载时渲染一次
  const bannerListJS = bannerList ? bannerList.toJS() : [];
  const recommendListJS = recommendList ? recommendList.toJS() : [];
  //forceCheck会将可视区域内的图片加载，当混动时可视区域内的图片对象已经更改，得调用forceCheck来刷新加载
  return (
    <Content play={songsCount}>
      <Scroll className="list" onScroll={forceCheck}>
        <div>
          <Slider bannerList={bannerListJS}></Slider>
          <RecommendList recommendList={recommendListJS}></RecommendList>
        </div>
      </Scroll>
      <Loading show={enterLoading}></Loading>
      <Outlet></Outlet>
    </Content>
  );
}

const mapStateToProps = (state) => ({
  // 不要在这里将数据 toJS
  // 不然每次 diff 比对 props 的时候都是不一样的引用，还是导致不必要的重渲染，属于滥用 immutable
  //如果此处toJS,那么组件中的props就不能利用immutable数据特性（内容不变引用不变，内容变一点引用就变，配合React.memo的浅比较使用）
  bannerList: state.getIn(["recommend", "bannerList"]),
  recommendList: state.getIn(["recommend", "recommendList"]),
  enterLoading: state.getIn(["recommend", "enterLoading"]),
  songsCount: state.getIn(["player", "playList"]).size,
});

const mapDispathToProps = (dispatch) => {
  return {
    getBannerDataDispatch() {
      dispatch(actionCreators.getBannerList());
    },
    getRecommendListDateDispatch() {
      dispatch(actionCreators.getRecommendList());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispathToProps
)(React.memo(Recommend));
