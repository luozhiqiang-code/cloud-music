import React from "react";
import { Top, Tab, TabItem } from "./style";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Player from "../Player";

function Home(props) {
  const navigate = useNavigate();
  return (
    <div>
      <Top>
        <span className="iconfont menu">&#xe660;</span>
        <span className="title">网易云音乐</span>
        <span
          className="iconfont search"
          onClick={() => {
            navigate("/search");
          }}
        >
          &#xe752;
        </span>
      </Top>
      <Tab>
        <NavLink
          to="/recommend"
          className={({ isActive }) => (isActive ? "selected" : undefined)}
        >
          <TabItem>
            <span>推荐</span>
          </TabItem>
        </NavLink>
        <NavLink
          to="/singers"
          className={({ isActive }) => (isActive ? "selected" : undefined)}
        >
          <TabItem>
            <span>歌手</span>
          </TabItem>
        </NavLink>
        <NavLink
          to="/rank"
          className={({ isActive }) => (isActive ? "selected" : undefined)}
        >
          <TabItem>
            <span>排行榜</span>
          </TabItem>
        </NavLink>
      </Tab>
      <Outlet />
      <Player></Player>
    </div>
  );
}

export default React.memo(Home);
