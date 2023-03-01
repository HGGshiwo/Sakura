import { Dom, getDomFromString } from "../../Dom";

const href = 'http://www.yinghuacd.com';

const showUrl = 'show' //详情页

class Agent {
  constructor(url) {
    this._url = href + url
  }

  afterLoad(callback) {
    this._afterLoad = callback;
  }

  load() {
    fetch(this._url)
      .then(response => response.text())
      .then((responseText) => {

        const document = getDomFromString(responseText);
        let thumb_l = document.getElementsByClass('thumb l')[0];
        let title = document.getElementsByTagName('h1')[0];

        let img = thumb_l.getElementsByTagName('img')[0];

        let sinInfoDom = document.getElementsByClass('sinfo')[0]
        let infoSubDoms = sinInfoDom.getElementsByTagName('span');
        const pDoms = sinInfoDom.getElementsByTagName('p')
        let state = pDoms[0].innerHTML
        let alias = '暂无别名'

        if (pDoms.length !== 1) {
          //有别名
          alias = pDoms[0].innerHTML
          state = pDoms[1].innerHTML
        }

        let infoSub = {
          author: infoSubDoms[4].getElementsByTagName('a').reduce((pre, cur) => pre + ' ' + cur.innerHTML, ''),
          alias,
          state,
          time: infoSubDoms[0].getElementsByTagName('a')[0].innerHTML,
          type: infoSubDoms[2].getElementsByTagName('a').map(a => {
            return a.innerHTML;
          }),
          produce: infoSubDoms[1].getElementsByTagName('a')[0].innerHTML,
        };

        let infoDom = document.getElementsByClass('info')[0];

        //播放列表
        let movurlDoms = document.getElementsByClass('movurl');
        let playList = {};

        movurlDoms[0]
          .getElementsByTagName('li')
          .forEach((liDom, index) => {
            const a = liDom.getElementsByTagName('a')[0];
            let key = a.innerHTML;
            if (!playList[key]) {
              playList[key] = { key, data: [] }
            }
            playList[key].data.push(href + a.href)
          });

        const _sources = Object.values(playList).sort((a, b) => {
          return a.key > b.key ? 1 : -1
        })

        //相关系列

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

        this._afterLoad({
          title: title.innerHTML,
          img: img.src,
          infoSub,
          recommands,
          sources: _sources,
          info: infoDom.innerHTML
        })
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
        const type = src_type[0].includes('m3u8') ? 'm3u8' : src_type[1]
        callback(true, src_type[0], type)
      })
      .catch(err => {
        console.log(err)
        callback(false)
      })
  }

  loadVideoSrc(url, callback) {
    // debugger;
    this._loadVideoSrc(url, callback, 3)
  }
}


export { Agent };