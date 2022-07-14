# 基于React Hooks、Immutable数据流实现的移动端Web播放器

## 项目简介

前言：在前端的学习过程中过，我已经做过了三个项目。第一个是模仿简书的写作平台，这个项目让我初尝React开发的甜头，了解了一些React生态的一些最佳实践。第二个是包括前中后端的个人博客系统，这个项目让我对与JavaScript这门语言有了新的认识，体会到了前后端统一语言的畅快和方便。给我最大的感受就是相比于本科接触的Java Spring，用node.js来开发后端是更加轻便，快捷。node的洋葱圈模型和中间件模式和Springboot 的面向切面有异曲同工之妙，当然了，目前我也只是理解到的一些皮毛，还需要通过工作中的大量实践才能进一步体会到两者的区别和联系。在前两个项目中，我都是用第三方组件库开发页面，或者封装些简单的组件。为了进一步体会组件的设计和开发，参考antd开源项目和一些教程，开发了一套自己的组件库eason-ui。到目前为止对前端开发也算是有了一个初步的认识，但是我对于移动端web应用的开发还不是很了解。所以参考神三元的开源项目，做了这个移动端web播放器。

简介：本项目是以 React 全家桶 (包含 Hooks) 以及 immutable 数据流为基础打造的一款高质量的移动端音乐类 WebApp 

## 项目地址
打开方式:请用Chrome浏览器（按f12设置手机模式），或夸克手机浏览器打开。
地址: https://quiet-mochi-00c19f.netlify.app/

## 技术栈

前端部分:

    react v16.8 全家桶 (react，react-router) : 用于构建用户界面的 MVVM 框架

    redux: 著名 JavaScript 状态管理容器

    redux-thunk: 处理异步逻辑的 redux 中间件

    immutable: Facebook 历时三年开发出的进行持久性数据结构处理的库

    react-lazyload: react 懒加载库 better-scroll: 提升移动端滑动体验的知名库

    styled-components: 处理样式，体现 css in js 的前端工程化神器

    axios: 用来请求后端 api 的数据。

后端部分:

    采用 github 上开源的 NodeJS 版 api 接口 NeteaseCloudMusicApi，提供音乐数据。感谢 Binaryify 大佬开源接口！

## 项目结构

说明：本项目参考网易云音乐安卓端 app 界面开发，基础轮子组件没有借助任何 UI 框架，算是对自己的一个挑战，在这个过程也学到了不少设计经验。
![音乐播放器架构图](https://user-images.githubusercontent.com/65885530/178681272-36dd86ac-a576-4c86-be78-8f1b60f2d7bb.png)


## 功能实现

### 1.首页推荐部分
![index](https://user-images.githubusercontent.com/65885530/178689997-0f9cca80-4e36-40f6-a6e7-96973c607ad5.gif)


### 2.推荐歌单详情
![index-list](https://user-images.githubusercontent.com/65885530/178689891-4c04be7e-2870-45ec-a98b-6bd98d03b1b9.gif)


### 3.歌手部分
![singers](https://user-images.githubusercontent.com/65885530/178690091-1cc4f5e3-637f-4300-a078-53fb9a6aa24a.gif)


### 4.排行榜部分
![rank](https://user-images.githubusercontent.com/65885530/178689265-ba1409d7-1bb6-4df4-b85e-e2ac992084e8.gif)


### 5.搜索部分
![search](https://user-images.githubusercontent.com/65885530/178690133-3e173a53-4201-4946-84ed-930808d88da1.gif)


### 6.播放器部分
![player](https://user-images.githubusercontent.com/65885530/178689308-60be491c-8cf9-4470-9b14-27f8643eaa69.gif)


**待实现功能：**

1. 登录
2. 系统菜单
3. 黑胶唱片播放动画
4. 倍速播放
5 MV
6 待定...

## 项目收获

为了提升自己对于组件设计的理解，项目中的13个基础组件和12个应用组件都是用styled-components自己封装的。完成了七大模块，写了6000多行代码。在大大小小的组件封装中将React中的所有Hooks基本都应用了一遍，根据Fiber架构和immutable的思想对应用进行了各种优化，包括缓存节点、减少diff、异步渲染、懒加载、缓存回调函数、虚拟列表、防抖和节流、合理使用state和ref。对于前端动画的实现也有了更深的理解，一些动画分别用JS和CSS方式各实现了一遍。项目目前还没有进行多端适配，在不同平台或者屏幕不同的设备下会有一些bug，后面还会进一步完善争取适配多端。

## 项目运行

1.将项目clone下来

```shell
$ git clone https://github.com/luozhiqiang-code/cloud-music.git
$ cd cloud-music
$ npm install

$ git clone https://github.com/Binaryify/NeteaseCloudMusicApi.git
$ cd NeteaseCloudMusicApi
$ npm install
```

2.运行

首先到cloud-music/src/api/config.js修改后端接口地址

```javascript
export const baseUrl =
  "https://netease-cloud-music-api-five-zeta-45.vercel.app/";
```

然后到cloud-music、NeteaseCloudMusicApi目录下分别启动前中后台。

```javascript
$ npm run dev
$ node app.js
```


