import React from "react";
import styled from "styled-components";
import style from "../../assets/global-style";

const CircleWrapper = styled.div`
  position: relative;
  circle {
    transform-origin: center center;
    &.progress-background {
      stroke: ${style["theme-color-shadow"]};
    }
    &.progress-bar {
      transform: rotate(-90deg);
      stroke: ${style["theme-color"]};
    }
  }
`;

function ProgressCircle(props) {
  const { radius, percent, innerStrokeWidth, outerStrokeWidth } = props;
  // 整个背景的周长
  const dashArray = Math.PI * 100;
  // 没有高亮的部分，剩下高亮的就是进度
  const dashOffset = (1 - percent) * dashArray;
  const viewBoxHeight = radius * 2 + outerStrokeWidth;
  const viewBoxWidth = viewBoxHeight;
  //圆形边框的总长，也就是虚线的长度
  const strokeDasharray = Math.PI * 2 * radius;
  //边框的移动距离（边框逆时针方向移动，要取1-perce,得到正向的效果）
  const strokeDashoffset = strokeDasharray * (1 - percent);
  return (
    <CircleWrapper>
      <svg
        width={viewBoxWidth}
        height={viewBoxHeight}
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="progress-background"
          r={radius}
          cx={viewBoxWidth / 2}
          cy={viewBoxHeight / 2}
          fill="transparent"
          strokeWidth={outerStrokeWidth}
        />
        <circle
          className="progress-bar"
          r={radius}
          cx={viewBoxWidth / 2}
          cy={viewBoxHeight / 2}
          fill="transparent"
          strokeWidth={innerStrokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      {props.children}
    </CircleWrapper>
  );
}

export default React.memo(ProgressCircle);
