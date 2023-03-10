//樱花动漫api
import {getDomFromString} from '../Dom';
import { GetUrlQuery } from './ckplayer4';
import {__getset_play} from './yx_playpre10';

const url = 'https://m.yhdmp.net/showp/22598.html';
const href = 'https://m.yhdmp.net';

class Agent {
  constructor(_url) {
    this.resultQue = []
    this.handling = false
    this._url = _url;
    this.cookie = ''
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
      .then(responseText => {
        const document = getDomFromString(responseText);
        let show = document.getElementsByClass('show')[0];
        let title = show.getElementsByTagName('h1')[0];
        if (this._afterLoadTitle) {
          this._afterLoadTitle(title.innerHTML);
        }

        let img = show.getElementsByTagName('img')[0];
        if (this._afterLoadImgSrc) {
          this._afterLoadImgSrc(`https:${img.src}`);
        }

        let infoSubDoms = show
          .getElementsByClass('info-sub')[0]
          .getElementsByTagName('p');
        let infoSub = {
          author: infoSubDoms[0].innerHTML,
          alias: infoSubDoms[1].innerHTML.split('/'),
          state: infoSubDoms[2].innerHTML,
          time: infoSubDoms[3].innerHTML,
          type: infoSubDoms[4].getElementsByTagName('a').map(a => {
            return a.innerHTML;
          }),
          produce: infoSubDoms[5].innerHTML,
        };
        if (this._afterLoadInfoSub) {
          this._afterLoadInfoSub(infoSub);
        }

        let infoDom = document.getElementsByClass('info')[0];
        if (this._afterLoadInfo) {
          this._afterLoadInfo(infoDom.innerHTML);
        }

        //播放列表
        let playTabDoms = document
          .getElementById('play_tabs')
          .getElementById('menu0')
          .getElementsByTagName('li');
        let movurlDoms = document.getElementsByClass('movurl');
        let playList = {};

        playTabDoms.forEach((playTab, index) => {
          movurlDoms[index]
            .getElementsByTagName('li')
            .forEach((liDom, index) => {
              const a = liDom.getElementsByTagName('a')[0];
              let key = a.innerHTML;
              playList[key] = playList[key]
                ? [...playList[key], href+a.href]
                : [href+a.href];
            });
        });
        if (this._afterLoadPlayList) {
          this._afterLoadPlayList(playList);
        }

        //相关系列
        let listDoms = document.getElementsByClass('list');
        let relatives = listDoms[1].getElementsByTagName('li').map(liDom => {
          return {
            data: liDom.getElementsByTagName('a')[0].href,
            title: liDom.getElementsByClass('itemtext')[0].innerHTML,
            id: index,
          };
        });
        if (this._afterLoadRelatives) {
          this._afterLoadRelatives(relatives);
        }
        //相关推荐
        let recommands = listDoms[2]
          .getElementsByTagName('li')
          .map((liDom, index) => {
            let style = liDom.getElementsByClass('imgblock')[0].style;
            let src = /(?<=background-image:url\(').*?(?='\))/.exec(style)[0];
            if (!src.includes('http')) {
              src = 'https:' + src;
            }
            return {
              id: index,
              href: liDom.getElementsByTagName('a')[0].href,
              img: src,
              title: liDom.getElementsByClass('itemtext')[0].innerHTML,
              state: liDom.getElementsByClass('itemimgtext')[0].innerHTML,
            };
          });
        if (this._afterLoadRecommands) {
          this._afterLoadRecommands(recommands);
        }
      });
  }

  handleQue (afterLoadVideoSrc) {
    debugger;
    if(this.resultQue.length != 0) {
      let {state, src} = this.resultQue.shift()
      if (state) {
        src = GetUrlQuery(src, "url");
        console.log(src)
        afterLoadVideoSrc(state, src);
        this.resultQue = []
        this.handling = false
      }
      else {
        this.handleQue(afterLoadVideoSrc)
      }
    }
    else {
      //处理所有请求，但是没有获取到src
      this.handling = false
      afterLoadVideoSrc(false, '')
    }
  }

  loadVideoSrc(url, afterLoadVideoSrc) {
    const _afterLoadVideoSrc = (state, src) => {
      this.resultQue.push({state, src})
      if(!this.handling) {
        this.handling = true
        this.handleQue(afterLoadVideoSrc)
      }
    };
    __getset_play(this, url, _afterLoadVideoSrc, 3);
  }
}

export {Agent};
