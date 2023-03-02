import { Dom, getDomFromString } from "../../Dom";

const href = 'http://www.yinghuacd.com';

class Agent {
  constructor() {
    this._url = href
  }

  afterLoad(callback) {
    this._afterLoad = callback;
  }

  afterErr(callback) {
    this._afterErr = callback
  }

  load() {
    fetch(this._url)
      .then(response => response.text())
      .then((responseText) => {
        const document = getDomFromString(responseText);
        //获取轮播

        let heros = document.getElementsByClass("heros")
        let i = 0
        let carousels = heros.map((hero) => {
          return hero.getElementsByTagName('li').map((liDom) => {
            let id = i
            i += 1
            return {
              id,
              href: liDom.getElementsByTagName('a')[0].href,
              img: liDom.getElementsByTagName('img')[0].src,
              title: liDom.getElementsByTagName('p')[0].innerHTML,
              state: liDom.getElementsByTagName('em')[0].innerHTML,
            }
          })
        })
        carousels = carousels.flat()

        //获取最近更新/日本动漫/国产动漫/美国动漫/动漫电影
        let first_l = document.getElementsByClass('firs l')[0]
        let imgs = first_l.getElementsByClass('img')
        const sections = first_l.getElementsByClass('dtit').slice(1)
          .map((dtitDom, index) => {
            return {
              title: dtitDom.getElementsByTagName('h2')[0].getElementsByTagName('a')[0].innerHTML,
              href: dtitDom.getElementsByTagName('span')[0].getElementsByTagName('a')[0].href,
              data: imgs[index].getElementsByTagName('li')
                .map((liDom, index) => {
                  let aDoms = liDom.getElementsByTagName('p')[1].getElementsByTagName('a')
                  let state = aDoms.length === 0 ? '' : aDoms[0].innerHTML
                  return {
                    id: index,
                    href: liDom.getElementsByTagName('a')[0].href,
                    img: liDom.getElementsByTagName('img')[0].src,
                    title: liDom.getElementsByTagName('p')[0].getElementsByTagName('a')[0].innerHTML,
                    state
                  }
                })
            }
          })

        //获取每日更新列表
        let tlistDom = document.getElementsByClass('tlist')[0]
        const dailys = tlistDom.getElementsByTagName('ul').map((ulDom) => {
          return ulDom.getElementsByTagName('li').map((liDom, index) => {
            const aDoms = liDom.getElementsByTagName('a')
            return {
              id: index,
              href1: aDoms[0].href,
              href2: aDoms[1].href,
              title: aDoms[1].innerHTML,
              state: aDoms[0].innerHTML,
            }
          })
        })

        //获取动漫排行
        let picsDom = document.getElementsByClass('pics')[0]
        picsDom.getElementsByTagName('li').map((liDom, index) => {
          const spanDoms = liDom.getElementsByTagName('span')
          return {
            id: index,
            img: liDom.getElementsByTagName('img')[0].src,
            title: liDom.getElementsByTagName('h2')[0].getElementsByTagName('a')[0].innerHTML,
            href: liDom.getElementsByTagName('a')[0].href,
            type: spanDoms[0].getElementsByTagName('font')[0].innerHTML,
            info: spanDoms[1].getElementsByTagName('a')[0].innerHTML
          }
        })

        this._afterLoad({
          carousels,
          dailys,
          sections,
        })

      }).catch(err => {
        console.log(err)
        if (this._afterErr) {
          this._afterErr(`${err}`)
        }
      })
  }
}


export { Agent };