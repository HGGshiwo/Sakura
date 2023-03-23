import { SearchInfo } from "../../type/SearchInfo";
import { Dom, getDomFromString } from "../Dom";

const href = 'http://www.yinghuacd.com/search/';

function getResult(liDoms: Dom[]) {
  return liDoms.map((liDom, index) => {
    const aDom: Dom = liDom!.getElementsByTagName('h2')![0].getElementsByTagName('a')![0]
    const spans = liDom.getElementsByTagName('span')
    return {
      href: 'http://www.yinghuacd.com' + aDom.href,
      img: liDom!.getElementsByTagName('img')![0].src,
      state: spans![0] ? spans![0].innerHTML : '',
      title: aDom.innerHTML,
      id: `${index}`,
      type: spans![1].getElementsByClassName('a')!.map((aDom) => { return aDom.innerHTML }),
      info: liDom!.getElementsByTagName('p')![0].innerHTML
    }
  })
}

function loadPage(arg: string, _afterSearch: (result: SearchInfo[]) => void) {
  const _url = href
  if (_afterSearch) {
    if (!arg) {
      _afterSearch([])
      return
    }
    arg = arg.trim()
    if (arg === '') {
      _afterSearch([])
      return
    }
    fetch(`${_url}${arg}/`)
      .then(response => response.text())
      .then((responseText) => {
        const document = getDomFromString(responseText);
        // debugger;
        //获取页数
        const pages = document.getElementsByClassName('pages')
        if (pages!.length === 0) {
          const liDoms = document!.getElementsByClassName('lpic')![0].getElementsByTagName("li")
          const result = getResult(liDoms!)
          _afterSearch(result as SearchInfo[]) //只有一页结果
          return [];
        }
        const aDoms = pages![0].getElementsByTagName('a')
        const promises = aDoms!.slice(3, -2).map(aDom => {
          return fetch(`${_url}${arg}/${aDom.href}`)
            .then(response => response.text())
            .then((responseText) => {
              const document = getDomFromString(responseText)
              return document!.getElementsByClassName('lpic')![0].getElementsByTagName("li")
            })
            .catch(err => { console.log(err) })
        })
        return Promise.all(promises)
      })
      .then((liDomsaa) => {
        if (liDomsaa.length === 0) {
          return
        }
        const liDoms = liDomsaa.flat()
        const result = getResult(liDoms as Dom[])
        _afterSearch(result as SearchInfo[])
      })
      .catch(err => {
        console.log(err)
      })
  }
}


export default loadPage;