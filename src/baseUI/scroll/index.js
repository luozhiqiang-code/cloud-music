import React, {
  forwardRef,
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  useMemo,
} from "react";
import PropTypes from "prop-types";
import BScroll from "better-scroll";
import styled from "styled-components";
import Loading from "../loading";
import LoadingV2 from "../loadingV2";
import { debounce } from "../../api/utils";

const ScrollContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const PullUpLoading = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 5px;
  width: 60px;
  margin: auto;
  z-index: 100;
`;

export const PullDownLoading = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0px;
  height: 30px;
  margin: auto;
  z-index: 100;
`;
//函数组件的ref不能直接传递给父组件，所以用forwordRef透传ref
const Scroll = forwardRef((props, ref) => {
  //better-scroll的实例对象 在dom中控制container和content的高度实现滚动
  const [bScroll, setBScroll] = useState();
  //指向滚动容器dom的引用
  const scrollContaninerRef = useRef();

  const {
    direction,
    click,
    refresh,
    bounceTop,
    bounceBottom,
    pullUpLoading,
    pullDownLoading,
  } = props;

  const { pullUp, pullDown, onScroll } = props;
  //useMemo使用后每次用的都是缓存的函数实例，并且debounce后函数执行次数降低了，从打印的结果可以看出，优化了内存和执行次数
  const pullUpDebounce = useMemo(() => {
    return debounce(pullUp, 300);
  }, [pullDown]);
  // 千万注意，这里不能省略依赖，
  // 不然拿到的始终是第一次 pullUp 函数的引用，相应的闭包作用域变量都是第一次的，产生闭包陷阱。下同。
  const pullDownDebounce = useMemo(() => {
    return debounce(pullDown, 300);
  });

  useEffect(() => {
    //在组件挂载之前就得实例化BScroll对象，同时获得容器和内容的高度，否则挂载后会滚动无效
    const scroll = new BScroll(scrollContaninerRef.current, {
      scrollX: direction === "horizental",
      scrollY: direction === "vertical",
      probeType: 3,
      click: click, //组织click的默认行为
      bounce: {
        //当内容碰到边界是否反弹
        top: bounceTop,
        bottom: bounceBottom,
      },
    });
    setBScroll(scroll);
    return () => {
      setBScroll(null);
    };
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    //如果bScroll实例不存在或者onScroll回调函数不存在则直接返回
    if (!bScroll || !onScroll) return;
    bScroll.on("scroll", (scroll) => {
      onScroll(scroll);
    });
    return () => {
      bScroll.off("scroll");
    };
  }, [onScroll, bScroll]);

  useEffect(() => {
    //如果bScroll实例不存在或者pullUp回调函数不存在则直接返回
    if (!bScroll || !pullUp) return;
    const handlePullUp = () => {
      // 判断是否滑动到了底部,或者超过底部
      //maxScrollY是个负值，y轴负方向
      if (bScroll.y <= bScroll.maxScrollY) {
        pullUpDebounce();
      }
    };

    bScroll.on("scrollEnd", handlePullUp);
    return () => {
      bScroll.off("scrollEnd", handlePullUp);
    };
  }, [pullUp, bScroll, pullUpDebounce]);

  useEffect(() => {
    //如果bScroll实例不存在或者pullDown回调函数不存在则直接返回
    if (!bScroll || !pullDown) return;
    const handlePullDown = (pos) => {
      // 判断用户的下拉动作
      //当下拉的距离超过顶部50px才触发,有交互感
      if (pos.y > 50) {
        pullDownDebounce();
        console.log("ll");
      }
    };
    //当点击结束瞬间，判断是否是下拉到顶的动作。如果放到scroll里面会持续触发，并且因为反弹效果也会触发
    bScroll.on("touchEnd", handlePullDown);
    //解绑
    return () => {
      bScroll.off("touchEnd", handlePullDown);
    };
  }, [pullDown, bScroll, pullDownDebounce]);

  useEffect(() => {
    //组件每次更新时都要调用refresh函数，使得实例BScroll重新计算容器和内容的宽高，否则会出错
    if (refresh && bScroll) {
      bScroll.refresh();
    }
  });
  //useImperativeHandle用于给外界组件传递当前区间的ref引用的对象中的方法和变量，ref由forWardRef默认传入
  //配合使用。这里将bScroll实例和refresh方法封装到对象中通过闭包返回给外层的对象
  useImperativeHandle(ref, () => ({
    refresh() {
      if (bScroll) {
        bScroll.refresh();
        bScroll.scrollTo(0, 0);
      }
    },
    getBScroll() {
      if (bScroll) {
        return bScroll;
      }
    },
  }));
  //根据传入的布尔值返回style对象来决定是否显示Loading 动画
  const pullUpdDisplayStyle = pullUpLoading
    ? { display: "" }
    : { display: "none" };
  const pullDownDisplayStyle = pullDownLoading
    ? { diplay: "" }
    : { display: "none" };

  return (
    <ScrollContainer ref={scrollContaninerRef}>
      {props.children}
      {/* 滑到底部加载动画 */}
      <PullUpLoading style={pullUpdDisplayStyle}>
        <Loading></Loading>
      </PullUpLoading>
      {/* 顶部下拉刷新动画 */}
      <PullDownLoading style={pullDownDisplayStyle}>
        <LoadingV2></LoadingV2>
      </PullDownLoading>
    </ScrollContainer>
  );
});

Scroll.defaultProps = {
  direction: "vertical",
  click: true,
  refresh: true,
  onScroll: null,
  pullUpLoading: false,
  pullDownLoading: false,
  pullUp: null,
  pullDown: null,
  bounceTop: true,
  bounceBottom: true,
};

Scroll.propTypes = {
  direction: PropTypes.oneOf(["vertical", "horizental"]), //滚动的方向
  refresh: PropTypes.bool, //是否刷新，刷新是为了获取新的wrapper和content的高度，否则content变更后滚动出错
  onScroll: PropTypes.func, //滚动的回调函数
  pullUp: PropTypes.func, //上拉回调
  pullDown: PropTypes.func, //下拉回调
  pullUpLoading: PropTypes.bool, //是否开启上拉加载动画
  pullDownLoading: PropTypes.bool, //是否开启下拉加载动画
  bounceTop: PropTypes.bool, // 是否支持向上吸顶
  bounceBottom: PropTypes.bool, // 是否支持向上吸顶
};

export default Scroll;
