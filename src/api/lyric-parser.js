//解析[00:01.997]这一类时间戳的正则表达式
//(?:X)在正则中表示所匹配的子组X不作为结果输出
const timeExp = /\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g;

const STATE_PAUSE = 0;
const STATE_PLAYING = 1;
export default class Lyric {
  /**
   * @params {string} lrc
   * @params {function} handler
   */
  constructor(lrc, hanlder = () => {}) {
    this.lrc = lrc;
    this.lines = []; //这是解析后的数组，每一项包含对应的歌词和时间
    this.handler = hanlder; //回调函数
    this.state = STATE_PAUSE; //播放状态
    this.curLineIndex = 0; //当前播放歌词所在的行数
    this.startStamp = 0; //歌曲开始的时间戳

    this._initLines();
  }

  _initLines() {
    //解析代码
    const lines = this.lrc.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]; //如"[00:01.997]作词: 薛之谦"
      let result = timeExp.exec(line);
      if (!result) continue;
      const txt = line.replace(timeExp, "").trim(); //现在把时间戳去掉，只剩下歌词文本
      if (txt) {
        //第三个匹配组为毫秒
        if (result[3].length === 3) {
          result[3] = result[3] / 10; //[00:01.997]中匹配到的997就会被切成99
        }
        //将事件转化为毫秒
        this.lines.push({
          time:
            result[1] * 60 * 1000 + result[2] * 1000 + (result[3] || 0) * 10, //转化具体到毫秒的时间，result[3] * 10可理解为 (result / 100) * 1000
          txt,
        });
      }
    }
    //这一步不执行也行，主要是排除字符串内容错误的问题
    this.lines.sort((a, b) => {
      return a.time - b.time;
    }); //根据时间排序
  }

  //offset为时间进度，isSeek标志位表示用户是否手动调整进度
  play(offset = 0, isSeek = false) {
    // 如果歌词行数为0，不能播放
    if (!this.lines.length) {
      return;
    }

    this.state = STATE_PLAYING;
    //找到大于当前进度的下一行
    this.curLineIndex = this._findcurLineIndex(offset);
    //现在正处于第this.curLineIndex-1行
    //立即定位，方式是调用传来的回调函数，并把当前歌词信息传给它
    this._callHandler(this.curLineIndex - 1);
    //更新时间戳，因为播放会存在暂停等情况，时间戳是动态的
    this.startStamp = +new Date() - offset;
    //如果剩余歌词还没播放完，继续播放
    if (this.curLineIndex < this.lines.length) {
      //清除上一次的播放定时器
      clearTimeout(this.timer);
      //继续播放剩余的歌词
      this._playRest(isSeek);
    }
  }

  //歌词播放开关
  togglePlay(offset) {
    if (this.state === STATE_PLAYING) {
      this.stop();
    } else {
      this.state = STATE_PLAYING;
      this.play(offset, true);
    }
  }
  //歌词暂停
  stop() {
    this.state = STATE_PAUSE;
    clearTimeout(this.timer);
  }
  //歌词切换到某个时间点
  seek(offset) {
    this.play(offset, true);
  }
  //给定时间进度，找到对应歌词的下标
  _findcurLineIndex(time) {
    for (let i = 0; i < this.lines.length; i++) {
      //由于时间不是完全相等，只要找到第一个大于等于time的点即可
      if (time <= this.lines[i].time) {
        return i;
      }
    }
    return this.lines.length - 1;
  }

  _callHandler(i) {
    if (i < 0) {
      return;
    }
    this.handler({
      txt: this.lines[i].txt,
      lineNum: i,
    });
  }
  // isSeek标志位表示用户是否手动调整进度
  _playRest(isSeek = false) {
    //下一个要播放的行
    let line = this.lines[this.curLineIndex];
    let delay;
    if (isSeek) {
      delay = line.time - (+new Date() - this.startStamp);
      //如果手动调节，那么播放的位置位于两个单词行之间，用下一个行的时间减去目前已经播放的时间，就是距离下一行的间隔
    } else {
      //拿到上一行的歌词开始时间，算间隔
      let preTime = this.lines[this.curLineIndex - 1]
        ? this.lines[this.curLineIndex - 1].time
        : 0;
      delay = line.time - preTime;
    }
    //计算完了下一个歌词行的开始时间间隔后，用定时器来实现下一次切换
    this.timer = setTimeout(() => {
      this._callHandler(this.curLineIndex++);
      //递归调用_playRest()，直到最后一行播放完
      if (
        this.curLineIndex < this.lines.length &&
        this.state === STATE_PLAYING
      ) {
        this._playRest();
      }
    }, delay);
  }
}
