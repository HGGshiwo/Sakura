// https://www.56fz.net/books/28003/901.html

import { apiName } from "."
import { loadInfoPage, loadPlayerData } from "../.."
import RecommandInfo from "../../../type/RecommandInfo"
import { getDomFromString } from "../../Dom"

const loadPage: loadInfoPage = (url, callback) => {
  fetch(url).then(response => response.text()).then(responseText => {
    const documnet = getDomFromString(responseText)
    const title = documnet.getElementsByTagName('h1')![0].innerHTML
    const img = 'https://www.56fz.net' + documnet.getElementById('fmimg')!.getElementsByTagName('img')![0].src!
    const pDoms = documnet.getElementById('info')!.getElementsByTagName('p')!
    const infoSub = {
      author: pDoms[0].innerHTML.split("：")[1],
      alias: '',
      state: pDoms[3].getElementsByTagName('a')![0].innerHTML,
      time: pDoms[2].innerHTML.split("：")[1],
      type: pDoms[4].getElementsByTagName('a')!.map(aDom => aDom.innerHTML),
      produce: '',
    }
    const recommands = documnet.getElementById('listtj')!.getElementsByTagName('a')!.map(aDom => {
      return {
        href: 'https://www.56fz.net' + aDom.href,
        apiName,
        img: 'https://www.56fz.net/Public/images/nocover.jpg',
        state: '',
        title: aDom.innerHTML,
      }
    })
    console.log(1)
    const info = documnet.getElementById('intro')!.getElementsByTagName('p')![0].innerHTML
    const sources = documnet.getElementById('list')!.getElementsByTagName('a')!.map(aDom => {
      return {
        key: aDom.innerHTML.trim(),
        data: ['https://www.56fz.net' + aDom.href!]
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


const loadTextSrc: loadPlayerData = (url, callback) => {
  fetch(url).then(response => response.text()).then(responseText => {
    const document = getDomFromString(responseText)
    const datas = document.getElementById('content')!.innerHTML.split('\n')
    console.log(datas)
    callback(true, datas)
  })
}
export default loadPage;
export { loadTextSrc };