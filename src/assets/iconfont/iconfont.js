import { createGlobalStyle } from "styled-components";

// import icon1 from "./iconfont.woff2?t=1652791546918";
// import icon2 from "./iconfont.woff?t=1652791546918";
// import icon3 from "./iconfont.ttf?t=1652791546918";

import icon1 from "http//at.alicdn.com/t/font_3424729_3wvym2rq9vv.woff2";
import icon2 from "http//at.alicdn.com/t/font_3424729_3wvym2rq9vv.woff";
import icon3 from "http//at.alicdn.com/t/font_3424729_3wvym2rq9vv.ttf";

export const IconStyle = createGlobalStyle`
@font-face {
  font-family: "iconfont"; /* Project id 3303381 */
  src: url(${icon1}) format('woff2'),
       url(${icon2}) format('woff'),
       url(${icon3}) format('truetype');
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-fangdajing:before {
  content: "\e637";
}

.icon-spin:before {
  content: "\e606";
}

.icon-fangdajing1:before {
  content: "\e60d";
}

.icon-yongyan:before {
  content: "\e600";
}

.icon-Aa:before {
  content: "\e636";
}

`;
