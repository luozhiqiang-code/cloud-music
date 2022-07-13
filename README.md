# 基于React Hooks、Immutable数据流实现的移动端Web播放器

## 项目简介

**前言：**在前端的学习过程中过，笔者已经做过了三个项目。第一个是模仿简书的写作平台，这个项目让我初尝React开发的甜头，了解了一些React生态的一些最佳实践。第二个是包括前中后端的个人博客系统，这个项目让我对与JavaScript这门语言有了新的认识，体会到了前后的统一语言的畅快和方便。给我最大的感受就是相比于本科接触的Java Spring，用node.js来开发后端是真的轻便，快捷。node的洋葱圈模型和中间件模式和Springboot 的面向切面有异曲同工之妙，当然了，目前我也只能理解到node.js的一些皮毛，还需要通过工作中的大量实践才能进一步体会到两者的区别和联系。这两个项目中我都是用第三方组件库，或者自己封装些简单的组件。那么为了进一步体会组件库的设计和开发，参考antd开源项目和一些教程，开发了一套自己的组件库eason-ui。到目前为止对前端开发也算是有了一个初步的认识，但是我对于移动端web应用的开发还不是很了解。所以参考神三元的开源项目，做了这个移动端web播放器。

**简介：**本项目是以 React 全家桶 (包含 Hooks) 以及 immutable 数据流为基础打造的一款高质量的移动端音乐类 WebApp 

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

### 2.推荐歌单详情

### 3.歌手部分
![Uploading singers.gif…]()

### 4.排行榜部分
![rank](https://user-images.githubusercontent.com/65885530/178689265-ba1409d7-1bb6-4df4-b85e-e2ac992084e8.gif)

### 5.搜索部分

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

项目虽然简单，但是收获的知识不少。巩固了React基础语法（状态、事件、组件、属性），对React架构有了更深刻的理解诸如虚拟Dom原理、生命周期函数、react中过渡和动画的实现、容器组件和无状态组件的设计、利用Styled-components封装自己的组件、redux中间件原理。

## 项目运行

1.将项目clone下来

```shell
$ git clone https://github.com/luozhiqiang-code/cloud-music.git
$ cd could-music
$ npm install

$ git clone https://github.com/Binaryify/NeteaseCloudMusicApi.git
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


