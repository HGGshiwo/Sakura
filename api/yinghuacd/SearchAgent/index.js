import { Dom, getDomFromString } from "../../../public/Dom";

const href = 'http://www.yinghuacd.com/search/';

class Agent {
  constructor() {
    this._url = href
  }

  afterSearch(callback) {
    this._afterSearch = callback;
  }

  search(arg) {
    if (this._afterSearch) {
      fetch(`${this._url}${arg}/`)
        .then(response => response.text())
        .then((responseText) => {
          const document = getDomFromString(responseText);
          // debugger;
          //获取页数
          const pages = document.getElementsByClass('pages')
          if (pages.length === 0) {
            const h2Doms = document.getElementsByTagName("h2")
            const result = h2Doms.map((h2Dom, index) => {
              const aDom = h2Dom.getElementsByTagName('a')[0]
              return {
                title: aDom.innerHTML,
                id: index,
                data: aDom.href
              }
            })
            this._afterSearch(result) //只有一页结果
            return [];
          }
          const aDoms = pages[0].getElementsByTagName('a')
          const promises = aDoms.slice(3, -2).map(aDom => {
            return fetch(`${this._url}${arg}/${aDom.href}`)
              .then(response => response.text())
              .then((responseText) => {
                console.log(1)
                const document = getDomFromString(responseText)
                return document.getElementsByTagName("h2")
              })
              .catch(err => { console.log(err) })
          })
          return Promise.all(promises)
        })
        .then((h2Domsaa) => {
          if(h2Domsaa.length === 0) {
            return
          }
          const h2Doms = h2Domsaa.flat()
          const result = h2Doms.map((h2Dom, index) => {
            const aDom = h2Dom.getElementsByTagName('a')[0]
            return {
              title: aDom.innerHTML,
              id: index,
              data: aDom.href
            }
          })
          this._afterSearch(result)
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}


export { Agent };