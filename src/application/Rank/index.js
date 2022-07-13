import React, { useEffect } from "react";
import { connect } from "react-redux";
import { filterIndex } from "../../api/utils";
import Scroll from "../../baseUI/scroll";
import { getRankList } from "./store";
import { Container, List, ListItem, SongList } from "./style";
import Loading from "../../baseUI/loading";
import { Outlet, useNavigate } from "react-router-dom";

function Rank(props) {
  //从props传递过来的数据是immutable格式，使用前需要toJS()
  const { rankList: list, loading, songsCount } = props;
  const { getRankListDispatch } = props;
  const rankList = list ? list.toJS() : [];

  useEffect(() => {
    //增加判断条件，避免不必要的渲染。不加条件的话，切换Tab会重新渲染
    if (!rankList.size) {
      getRankListDispatch();
    }
  }, []);

  //获取全球榜单的开始下标
  const globalIndex = filterIndex(rankList);
  //分割出官方榜单
  const officialList = rankList.slice(0, globalIndex);
  //分割出全球榜单
  const globalList = rankList.slice(globalIndex);
  //导航对象
  const navigate = useNavigate();
  const enterDetail = (detail) => {
    //导航到榜单详情页面，使用添加模式，如果需要替换则添加配置信息{replace：true}
    navigate(`/rank/${detail.id}`);
  };

  const renderSongList = (list) => {
    //渲染榜单的前三名的数据
    return list.length ? (
      <SongList>
        {list.map((item, index) => {
          return (
            <li key={index}>
              {index + 1}. {item.first} - {item.second}
            </li>
          );
        })}
      </SongList>
    ) : null;
  };
  const renderRankList = (list, global) => {
    return (
      <List globalRank={global}>
        {list.map((item, index) => {
          //此处数据有问题，所以两个重复的key(item.coverImgId)，用idex解决
          return (
            <ListItem
              key={index}
              tracks={item.tracks}
              onClick={() => enterDetail(item)}
            >
              <div className="img_wrapper">
                <img src={item.coverImgUrl} alt="封面" />
                <div className="decorate"></div>
                <span className="update_frequecy">{item.updateFrequency}</span>
              </div>
              {renderSongList(item.tracks)}
            </ListItem>
          );
        })}
      </List>
    );
  };

  let displayStyle = loading ? { display: "none" } : { display: "" };

  return (
    <Container play={songsCount}>
      <Scroll>
        <div>
          <h1 className="offical" style={displayStyle}>
            官方榜
          </h1>
          {renderRankList(officialList)}
          <h1 className="global" style={displayStyle}>
            全球榜
          </h1>
          {renderRankList(globalList, true)}
          <Loading show={loading}></Loading>
        </div>
      </Scroll>
      <Outlet></Outlet>
    </Container>
  );
}

const mapStateToProps = (state) => ({
  rankList: state.getIn(["rank", "rankList"]), //歌曲排行列表数据
  loading: state.getIn(["rank", "loading"]), //加载状态
  songsCount: state.getIn(["player", "playList"]).size, //播放列表长度，用于给mini播放器腾地儿
});

const mapDiapatchToProps = (dispatch) => ({
  getRankListDispatch() {
    dispatch(getRankList());
  },
});

export default connect(mapStateToProps, mapDiapatchToProps)(React.memo(Rank));
