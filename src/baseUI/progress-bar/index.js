import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import style from "../../assets/global-style";
import { prefixStyle } from "../../api/utils";

const ProgressBarWrapper = styled.div`
  height: 30px;
  /* 进度条底部 */
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);
    /* 进图条内容，就是会动的部分 */
    .progress {
      position: absolute;
      height: 100%;
      background: ${style["theme-color"]};
    }
    /* 进度条拖动按钮外包裹 */
    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
      /* 进度条按钮 */
      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid ${style["border-color"]};
        border-radius: 50%;
        background: ${style["theme-color"]};
      }
    }
  }
`;

function ProgressBar(props) {
  const progressBar = useRef();
  const progress = useRef();
  const progressBtn = useRef();
  //touch对象，存储touch的数据，例如开始位置，移动距离等
  const [touch, setTouch] = useState({});

  const { percent } = props;

  const { percentChange } = props;

  const progressBtnWidth = 16;
  //检测浏览器版本，提供前缀，提高兼容性
  const transform = prefixStyle("transform");

  useEffect(() => {
    if (percent >= 0 && percent <= 1 && !touch.initiated) {
      //进度条可见总长度
      const barWidth = progressBar.current.clientWidth - progressBtnWidth;
      //进度条进度
      const offsetWidth = percent * barWidth;
      progress.current.style.width = `${offsetWidth}px`;
      progressBtn.current.style[
        transform
      ] = `translate3d(${offsetWidth}px, 0, 0)`;
    }
    // eslint-disable-next-line
  }, [percent]);

  //改变百分比，将百分比与进度条挂钩
  const _changePercent = () => {
    //进度条总的可显示的宽度，要减去按钮遮住的
    const barWidth = progressBar.current.clientWidth - progressBtnWidth;
    //当前进度的百分比等于进度条的宽度除以总宽度
    const curPercent = progress.current.clientWidth / barWidth;
    //更改百分比后要调用回调函数(修改redux中的数据等)
    percentChange(curPercent);
  };
  //控制进度条的偏移量
  const _offset = (offsetWidth) => {
    //进度条绝对定位，通过设置宽度来表示进度条移动
    progress.current.style.width = `${offsetWidth}px`;
    //拖动按钮随进度条移动，用translate来解决x轴移动
    progressBtn.current.style.transform = `translate3d(${offsetWidth}px, 0, 0)`;
  };

  //直接点中进度条，跳转到响应的进度
  const progressClick = (e) => {
    //获得进度条距离视口的x坐标
    const rect = progressBar.current.getBoundingClientRect();
    //点击位置的x坐标减去进度条的开始坐标等于进度的长度
    const offsetWidth = e.pageX - rect.left;
    //更改进度的长度
    _offset(offsetWidth);
    //更改百分比
    _changePercent();
  };
  //进度条按钮点击的回调
  const progressTouchStart = (e) => {
    //点击事件开始时初始化新的touch对象
    const startTouch = {};
    //initial为true表示滑动动作开始了
    startTouch.initiated = true;
    //touch对象开始的坐标
    startTouch.startX = e.touches[0].pageX;
    //touch对象距离进度条左端的距离
    startTouch.left = progress.current.clientWidth;
    //保存touch对象
    setTouch(startTouch);
  };
  //进度条按钮点击并移动的回调
  const progressTouchMove = (e) => {
    //如果touch对象还未初始化，则不可以使用，直接返回
    if (!touch.initiated) return;
    //滑动距离，用新的touch开始距离减旧的就是滑动距离
    const deltaX = e.touches[0].pageX - touch.startX;
    //进度条的总可见宽度（去除按钮的宽度）
    const barWidth = progressBar.current.clientWidth - progressBtnWidth;
    //进度条的宽度
    //先计算相对于进度条原点的距离（touch.left+deltaX），该距离应该满足0<=x<=barWidth
    const offsetWidth = Math.min(Math.max(0, touch.left + deltaX), barWidth);
    _offset(offsetWidth);
  };
  //进度条按钮点击结束的回调
  const progressTouchEnd = (e) => {
    //
    // const endTouch = JSON.parse(JSON.stringify(touch));
    // endTouch.initiated = false;
    setTouch({});
    _changePercent();
  };

  return (
    <ProgressBarWrapper>
      <div className="bar-inner" ref={progressBar} onClick={progressClick}>
        <div className="progress" ref={progress}></div>
        <div
          className="progress-btn-wrapper"
          ref={progressBtn}
          onTouchStart={progressTouchStart}
          onTouchMove={progressTouchMove}
          onTouchEnd={progressTouchEnd}
        >
          <div className="progress-btn"></div>
        </div>
      </div>
    </ProgressBarWrapper>
  );
}

export default ProgressBar;
