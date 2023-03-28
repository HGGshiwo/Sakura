import { loadComicPage, loadInfoPage, loadPlayerData } from "../.."
import { getDomFromString } from "../../Dom"
import { getRecommandInfoFromCover } from "./utils"

const loadPage: loadInfoPage = (url, callback) => {
  fetch(url).then(response => response.text())
    .then(responseText => {
      console.log(url)
      const documnet = getDomFromString(responseText)
      const title = documnet.getElementsByClassName('comic-title j-comic-title')![0].innerHTML
      
      const img = documnet.getElementsByClassName('de-info__cover')![0].getElementsByTagName('img')![0].src!
      const infoSub = {
        author: documnet.getElementsByClassName('comic-author')![0].getElementsByClassName('name')![0].getElementsByTagName('a')![0].innerHTML,
        alias: '',
        state: documnet.getElementsByClassName('update-time')![0].innerHTML,
        time: '2023年3月26日',
        type: documnet.getElementsByClassName('comic-status')![0].getElementsByTagName('b')![0].getElementsByTagName('a')!.map(aDom => aDom!.innerHTML),
        produce: documnet.getElementsByClassName('comic-author')![0].getElementsByClassName('name')![0].getElementsByTagName('a')![0].innerHTML,
      }
      const recommands = documnet.getElementsByClassName('guess-item slide-item')!.map(getRecommandInfoFromCover)
      const info = documnet.getElementsByClassName('comic-intro')![0].getElementsByTagName('span')![0].innerHTML
      const sources = documnet.getElementsByClassName('chapter__list-box clearfix')![0].getElementsByTagName('li')!.map(liDom => {
        const aDom = liDom.getElementsByTagName('a')![0]
        return {
          key: aDom.innerHTML.trim(),
          data: [aDom.href!]
        }
      })
      callback({
        title,
        img,
        infoSub,
        recommands,
        sources,
        info,
        relatives: [],
      })
    })
}
const loadComicSrc:loadPlayerData = (url, callback) => {
  fetch(url).then(response => response.text())
    .then((responseText) => {
      const documnet = getDomFromString(responseText)
      const urls = documnet.getElementsByClassName('lazyload')!.map(lazyDom => lazyDom["data-original"]!)
      callback(true, urls)
    })
}
export default loadPage;
export { loadComicSrc };