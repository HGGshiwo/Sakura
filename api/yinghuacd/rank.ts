import { RecommandInfo } from "../../type/RecommandInfo";
import { Dom, getDomFromString } from "../Dom";

const href = 'http://www.yinghuacd.com';


function loadPage(_afterLoad: (data: RecommandInfo[]) => void, _afterErr?: (err: string) => void) {
  const _url = href
  fetch(_url)
    .then(response => response.text())
    .then((responseText) => {
      const document = getDomFromString(responseText);
      //获取动漫排行
      let picsDom = document.getElementsByClassName('pics')![0]
      const rankings = picsDom.getElementsByTagName('li')!.map((liDom, index) => {
        const spanDoms = liDom.getElementsByTagName('span')!
        return {
          id: index,
          img: liDom.getElementsByTagName('img')![0].src!,
          state: spanDoms[0].getElementsByTagName('font')![0].innerHTML,
          title: liDom.getElementsByTagName('h2')![0].getElementsByTagName('a')![0].innerHTML,
          href: liDom.getElementsByTagName('a')![0].href!,
          type: spanDoms[1].getElementsByTagName('a')!.map((aDom: Dom) => aDom.innerHTML),
          info: spanDoms[1].getElementsByTagName('a')![0].innerHTML
        }
      })

      _afterLoad(rankings)

    }).catch(err => {
      console.log(err)
      if (_afterErr) {
        _afterErr(`${err}`)
      }
    })
}

export default loadPage;