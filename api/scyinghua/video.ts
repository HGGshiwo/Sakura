import { Source } from "../../type/Source";
import VideoPageInfo from "../../type/VideoPageInfo";
import { Dom, getDomFromString } from "../Dom";

const href = 'https://www.scyinghua.com';


const loadPage = (url: string, callback: (data: VideoPageInfo) => void) => {
  const _url = href + url
  fetch(_url)
    .then(response => response.text())
    .then((responseText) => {
      const document = getDomFromString(responseText);
      let title = document!.getElementsByClassName('page-title')![0].innerHTML;
      let img = document.getElementsByClassName('url_img')![0];
      let videoInfoDoms = document!.getElementsByClassName('video-info-items')!
      let state = videoInfoDoms[3].getElementsByClassName('video-info-item')![0].innerHTML
      let alias = document.getElementsByClassName('video-subtitle')![0].innerHTML
      let infoSub = {
        author: videoInfoDoms[0].getElementsByTagName('a')!.reduce((pre, cur) => pre + ' ' + cur.innerHTML, ''),
        alias,
        state,
        time: videoInfoDoms[2].getElementsByClassName('video-info-item')![0].innerHTML,
        type: document.getElementsByClassName('video-info-aux')![0].getElementsByTagName('a')!.map(a => {
          return a.title!;
        }),
        produce: '',
      };

      let infoDom = document!.getElementsByClassName('content-text none')![0];

      //播放列表
      let moduleListDoms = document.getElementsByClassName('module-list module-player-list tab-list sort-list selected')!;
      let playList: Record<string, Source> = {};
      moduleListDoms[0]
        .getElementsByClassName('scroll-content')![0]
        .getElementsByTagName('a')!
        .forEach((aDom, index) => {
          let key = aDom.getElementsByTagName('span')![0].innerHTML;
          if (!playList[key]) {
            playList[key] = { key, data: [] }
          }
          playList[key as keyof typeof playList].data.push(href + aDom.href)
        });

      const _sources = Object.values(playList).sort((a: Source, b: Source) => {
        return a.key > b.key ? 1 : -1
      })

      //相关系列

      //相关推荐
      let recommands = document!
        .getElementsByClassName('col-6 col-sm-4 col-lg-3')!
        .map((col6Dom, index) => {
          return {
            id: index,
            href: col6Dom!.getElementsByTagName('a')![0].href!,
            img: col6Dom!.getElementsByTagName('img')![0]!['data-src']!,
            title: col6Dom!.getElementsByTagName('h6')![0].getElementsByTagName('a')![0].innerHTML,
            state: col6Dom!.getElementsByClassName('label')![0].innerHTML,
          };
        });

      callback({
        title: title,
        img: img.src!,
        infoSub,
        recommands,
        sources: _sources,
        info: infoDom.innerHTML,
        relatives: []
      })
    })
    .catch(err => console.log(err))
}

const loadVideoSrc = (url: string, callback: (state: boolean, src?: string, type?: string) => void) => {
  _loadVideoSrc(url, callback, 3)
}

const _loadVideoSrc = (url: string, callback: (state: boolean, src?: string, type?: string) => void, times: number) => {
  fetch(url).then(response => response.text())
    .then((responseText) => {
      if (responseText === '') {
        times > 0 ? _loadVideoSrc(url, callback, times - 1) : callback(false)
        return
      }
      let document = getDomFromString(responseText)!
      let src = document.getElementsByClassName('img-box bofang_box')![0].getElementsByTagName("script")![0]._dom.children[0].data
      let src_type = /(?<="url":").*(?=","url_next")/.exec(src)![0].replaceAll('\\', '')
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