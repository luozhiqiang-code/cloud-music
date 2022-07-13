import { GlobalStyle } from "./style";
// import { IconStyle } from "./assets/iconfont/iconfont";
import { HashRouter, Routes, Route } from "react-router-dom";
import "./style.css";
import { Provider } from "react-redux";
import store from "./store";
import Home from "./application/Home";
import Recommend from "./application/Recommend";
import Rank from "./application/Rank";
import Singers from "./application/Singers";
import Data from "./application/Singers/data";
import Album from "./application/Album";
import Singer from "./application/Singer";
import Search from "./application/Search";

function App() {
  return (
    <Provider store={store}>
      <HashRouter>
        <GlobalStyle></GlobalStyle>
        {/* <IconStyle></IconStyle> */}
        <Data>
          <Routes>
            <Route path="/" element={<Home />}>
              <Route path="/" element={<Recommend />} />

              <Route path="recommend" element={<Recommend />}>
                <Route path=":id" element={<Album />} />
              </Route>

              <Route path="rank" element={<Rank />}>
                <Route path=":id" element={<Album />} />
              </Route>
              <Route path="singers" element={<Singers />}>
                <Route path=":id" element={<Singer />} />
              </Route>
              <Route path="search" element={<Search />} />

              <Route path="album/:id" element={<Album />} />
            </Route>
          </Routes>
        </Data>
      </HashRouter>
    </Provider>
  );
}

export default App;
