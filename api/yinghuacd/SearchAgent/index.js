import { Dom, getDomFromString } from "../../../public/Dom";

const href = 'http://www.yinghuacd.com/search/';

class Agent {
  constructor() {
    this._url = href
  }

  afterSearch(callback) {
    this._afterSearch = callback;
  }

  getResult(liDoms) {
    return liDoms.map((liDom, index) => {
      const aDom = liDom.getElementsByTagName('h2')[0].getElementsByTagName('a')[0]
      const spans = liDom.getElementsByTagName('span')
      return {
        href: aDom.href,
        img: liDom.getElementsByTagName('img')[0].src,
        state: spans[0]?spans[0].innerHTML:'',
        title: aDom.innerHTML,
        id: index,
        type: spans[1].getElementsByClass('a').map((aDom)=>{return aDom.innerHTML}),
        info: liDom.getElementsByTagName('p')[0].innerHTML
      }
    })
  }

  search(arg) {
    if (this._afterSearch) {
      if(!arg) {
        this._afterSearch([])
        return
      }
      arg = arg.trim()
      if(arg==='') {
        this._afterSearch([])
        return
      }
      fetch(`${this._url}${arg}/`)
        .then(response => response.text())
        .then((responseText) => {
          const document = getDomFromString(responseText);
          // debugger;
          //获取页数
          const pages = document.getElementsByClass('pages')
          if (pages.length === 0) {
            const liDoms = document.getElementsByClass('lpic')[0].getElementsByTagName("li")
            const result = this.getResult(liDoms)
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
                return document.getElementsByClass('lpic')[0].getElementsByTagName("li")
              })
              .catch(err => { console.log(err) })
          })
          return Promise.all(promises)
        })
        .then((liDomsaa) => {
          if(liDomsaa.length === 0) {
            return
          }
          const liDoms = liDomsaa.flat()
          const result = this.getResult(liDoms)
          this._afterSearch(result)
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}


export { Agent };