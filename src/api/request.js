import { axiosInstance, categoryMap } from "./config";
//获取轮播图数据
export const getBannerRequest = () => {
  return axiosInstance.get("/banner");
};
//获取推荐列表
export const getRecommendListRequest = () => {
  return axiosInstance.get("/personalized");
};
//获取热门歌手榜单
export const getHotSingerListRequest = (count) => {
  return axiosInstance.get(`/top/artists?offset=${count}`);
};
//获取分类歌手列表
export const getSingerListRequest = (category, alpha, count) => {
  const { type, area } = category.length ? categoryMap.get(category) : {};
  return axiosInstance.get(
    `/artist/list?type=${type}&area=${area}&initial=${alpha.toLowerCase()}&offset=${count}`
  );

  // return axiosInstance.get(
  //   `/artist/list?cat=${category}&initial=${alpha.toLowerCase()}&offset=${count}`
  // );
};
//获取排行榜
export const getRankListRequest = () => {
  return axiosInstance.get(`/toplist/detail`);
};
//获取歌单列表
export const getAlbumDetailRequest = (id) => {
  return axiosInstance.get(`/playlist/detail?id=${id}`);
};
//获取歌手信息
export const getSingerInfoRequest = (id) => {
  return axiosInstance.get(`/artists?id=${id}`);
};
//获取歌词
export const getLyricRequest = (id) => {
  return axiosInstance.get(`/lyric?id=${id}`);
};

//获取热门搜索词
export const getHotKeyWordsRequest = () => {
  return axiosInstance.get(`/search/hot`);
};
//获取搜索建议列表
export const getSuggestListRequest = (query) => {
  return axiosInstance.get(`/search/suggest?keywords=${query}`);
};
//获取搜索结果
export const getResultSongsListRequest = (query) => {
  return axiosInstance.get(`/search?keywords=${query}`);
};
//获取搜索的歌曲的单曲详情
export const getSongDetailRequest = (id) => {
  return axiosInstance.get(`/song/detail?ids=${id}`);
};
