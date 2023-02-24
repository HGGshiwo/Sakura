import { Dom, getDomFromString } from "../../../public/Dom";

const href = 'http://www.yinghuacd.com';

const showUrl = 'show' //详情页

class Agent {
  constructor(url) {
    this._url = href + url
  }

  afterLoadTitle(callback) {
    this._afterLoadTitle = callback;
  }

  afterLoadInfo(callback) {
    this._afterLoadInfo = callback;
  }

  afterLoadInfoSub(callback) {
    this._afterLoadInfoSub = callback;
  }

  afterLoadPlayList(callback) {
    this._afterLoadPlayList = callback;
  }

  afterLoadRelatives(callback) {
    this._afterLoadRelatives = callback;
  }

  afterLoadRecommands(callback) {
    this._afterLoadRecommands = callback;
  }

  afterLoadImgSrc(callback) {
    this._afterLoadImgSrc = callback;
  }

  load() {
    fetch(this._url)
      .then(response => response.text())
      .then((responseText) => {
        const document = getDomFromString(responseText);
        let thumb_l = document.getElementsByClass('thumb l')[0];
        let title = thumb_l.getElementsByTagName('a')[0];
        if (this._afterLoadTitle) {
          this._afterLoadTitle(title.innerHTML);
        }

        let img = thumb_l.getElementsByTagName('img')[0];
        if (this._afterLoadImgSrc) {
          this._afterLoadImgSrc(img.src);
        }
        let sinInfoDom = document.getElementsByClass('sinfo')[0]
        let infoSubDoms = sinInfoDom.getElementsByTagName('span');
        let infoSub = {
          author: infoSubDoms[4].getElementsByTagName('a').reduce((pre, cur)=>pre+' '+cur.innerHTML,''),
          alias: title.innerHTML,
          state: sinInfoDom.getElementsByTagName('p')[0].innerHTML,
          time: infoSubDoms[0].getElementsByTagName('a')[0].innerHTML,
          type: infoSubDoms[2].getElementsByTagName('a').map(a => {
            return a.innerHTML;
          }),
          produce: infoSubDoms[1].getElementsByTagName('a')[0].innerHTML,
        };
        if (this._afterLoadInfoSub) {
          this._afterLoadInfoSub(infoSub);
        }

        let infoDom = document.getElementsByClass('info')[0];
        if (this._afterLoadInfo) {
          this._afterLoadInfo(infoDom.innerHTML);
        }

        //播放列表
        let movurlDoms = document.getElementsByClass('movurl');
        let playList = {};

        movurlDoms[0]
          .getElementsByTagName('li')
          .forEach((liDom, index) => {
            const a = liDom.getElementsByTagName('a')[0];
            let key = a.innerHTML;
            playList[key] = playList[key]
              ? [...playList[key], href + a.href]
              : [href + a.href];
          });

        if (this._afterLoadPlayList) {
          this._afterLoadPlayList(playList);
        }

        //相关系列
        if (this._afterLoadRelatives) {
          this._afterLoadRelatives([]);
        }
        //相关推荐
        let recommands = document
          .getElementsByClass('pics')[0]
          .getElementsByTagName('li')
          .map((liDom, index) => {
            return {
              id: index,
              href: liDom.getElementsByTagName('a')[0].href,
              img: liDom.getElementsByTagName('img')[0].src,
              title: liDom.getElementsByTagName('h2')[0].getElementsByTagName('a')[0].innerHTML,
              state: liDom.getElementsByTagName('font')[0].innerHTML,
            };
          });
        if (this._afterLoadRecommands) {
          this._afterLoadRecommands(recommands);
        }
      })
  }

  _loadVideoSrc(url, callback, times) {
    fetch(url).then(response => response.text())
      .then((responseText) => {
        if (responseText === '') {
          times > 0 ? this.loadVideoSrc(url, callback, times - 1) : callback(false)
          return
        }
        let document = getDomFromString(responseText)
        let src_type = document.getElementById('playbox')["data-vid"].split('$')
        callback(true, src_type[0], src_type[1])
      })
      .catch(err => {
        console.log(err)
        callback(false)
      })
  }

  loadVideoSrc(url, callback) {
    debugger;
    this._loadVideoSrc(url, callback, 3)
  }
}


export { Agent };