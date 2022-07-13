import React, { useEffect, useState } from "react";
import { SliderContainer } from "./style";
// Import Swiper styles
import "swiper/dist/css/swiper.css";
import Swiper from "swiper";

function Slider(props) {
  const [sliderSwipper, setSliderSwiper] = useState(null);
  const { bannerList } = props;
  //这里使用html方式，swiper展示轮播图，先初始化Swiper对象
  //然后设置容器.slider-container，包裹swiper-wrapper 和每个幻灯片 swiper-slide 以及分页包裹swiper-patination
  //里面有bullte表示激活的slider
  useEffect(() => {
    if (bannerList && !sliderSwipper) {
      let newSliderSwiper = new Swiper(".slider-container", {
        loop: true,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },
        pagination: { el: ".swiper-pagination" },
      });
      setSliderSwiper(newSliderSwiper);
    }
  }, [bannerList, sliderSwipper]);
  return (
    <SliderContainer>
      <div className="before"> </div>
      <div className="slider-container">
        <div className="swiper-wrapper">
          {bannerList.map((slider) => {
            return (
              <div className="swiper-slide" key={slider.imageUrl}>
                <div className="slider-nav">
                  <img
                    src={slider.imageUrl}
                    width="100%"
                    height="100%"
                    alt="推荐"
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="swiper-pagination"></div>
      </div>
    </SliderContainer>
  );
}

export default React.memo(Slider);
