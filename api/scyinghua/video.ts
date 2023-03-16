import { Source } from "../../type/Source";
import VideoPageInfo from "../../type/VideoPageInfo";
import { Dom, getDomFromString } from "../Dom";

const href = 'https://www.scyinghua.com/play';


const loadPage = (url:string, callback:(data: VideoPageInfo)=>void) => {
  const _url = href + url
  fetch(_url)
    .then(response => response.text())
    .then((responseText) => {

      const document = getDomFromString(responseText);
      let thumb_l = document!.getElementsByClassName('thumb l')![0];
      let title = document!.getElementsByTagName('h1')![0];

      let img = thumb_l!.getElementsByTagName('img')![0];

      let sinInfoDom = document!.getElementsByClassName('sinfo')![0]
      let infoSubDoms = sinInfoDom.getElementsByTagName('span');
      const pDoms = sinInfoDom.getElementsByTagName('p')
      let state = pDoms![0].innerHTML
      let alias = '暂无别名'

      if (pDoms!.length !== 1) {
        //有别名
        alias = pDoms![0].innerHTML
        state = pDoms![1].innerHTML
      }

      let infoSub = {
        author: infoSubDoms![4].getElementsByTagName('a')!.reduce((pre, cur) => pre + ' ' + cur.innerHTML, ''),
        alias,
        state,
        time: infoSubDoms![0].getElementsByTagName('a')![0].innerHTML,
        type: infoSubDoms![2].getElementsByTagName('a')!.map(a => {
          return a.innerHTML;
        }),
        produce: infoSubDoms![1].getElementsByTagName('a')![0].innerHTML,
      };

      let infoDom = document!.getElementsByClassName('info')![0];

      //播放列表
      let movurlDoms = document.getElementsByClassName('movurl');
      let playList: Record<string, Source>={};

      movurlDoms![0]
        .getElementsByTagName('li')!
        .forEach((liDom, index) => {
          const a = liDom!.getElementsByTagName('a')![0];
          let key = a.innerHTML;
          if (!playList[key]) {
            playList[key] = { key, data: [] }
          }
          playList[key as keyof typeof playList].data.push(href + a.href)
        });

      const _sources = Object.values(playList).sort((a:Source, b:Source) => {
        return a.key > b.key ? 1 : -1
      })

      //相关系列

      //相关推荐
      let recommands = document!
        .getElementsByClassName('pics')![0]
        .getElementsByTagName('li')!
        .map((liDom, index) => {
          return {
            id: index,
            href: liDom!.getElementsByTagName('a')![0].href!,
            img: liDom!.getElementsByTagName('img')![0].src!,
            title: liDom!.getElementsByTagName('h2')![0].getElementsByTagName('a')![0].innerHTML,
            state: liDom!.getElementsByTagName('font')![0].innerHTML,
          };
        });

      callback({
        title: title.innerHTML,
        img: img.src!,
        infoSub,
        recommands,
        sources: _sources,
        info: infoDom.innerHTML
      })
    })
}

const loadVideoSrc = (url:string, callback:(state:boolean, src?:string, type?: string )=>void) => {
  _loadVideoSrc(url, callback, 3)
}

const _loadVideoSrc = (url:string, callback:(state:boolean, src?:string, type?: string)=>void, times:number) => {
  fetch('https://www.scyinghua.com/play/397-1-2.html').then(response => response.text())
    .then((responseText) => {
      if (responseText === '') {
        times > 0 ? _loadVideoSrc(url, callback, times - 1) : callback(false)
        return
      }
      let document = getDomFromString(responseText)!
      let src = document.getElementsByClassName('img-box bofang_box')![0].getElementsByTagName("script")![0]._dom.children[0].data
      let src_type = /(?<="url":").*(?=","url_next")/.exec(src)![0].replaceAll('\\','')
      console.log(src_type)
      const type = src_type.includes('m3u8') ? 'm3u8' : 'mp4'
      callback(true, src_type, type)
    })
    .catch(err => {
      console.log(err)
      callback(false)
    })
}

export default loadPage
export { loadVideoSrc };