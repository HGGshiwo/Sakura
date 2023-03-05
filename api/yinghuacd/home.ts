import { AnimePageInfo } from "../../type/PageInfo/AnimePageInfo";
import { Dom, getDomFromString } from "../Dom";

const href = 'http://www.yinghuacd.com';


function loadPage(_afterLoad: (data: AnimePageInfo) => void, _afterErr?: (err: string) => void) {
  const _url = href
  fetch(_url)
    .then(response => response.text())
    .then((responseText) => {
      const document = getDomFromString(responseText);
      //获取轮播
      let heros = document.getElementsByClassName("heros")!
      let i = 0

      let carouselsaa = heros.map((hero) => {
        return hero.getElementsByTagName('li')!.map((liDom) => {
          let id = i
          i += 1
          return {
            id,
            href: liDom.getElementsByTagName('a')![0].href!,
            img: liDom.getElementsByTagName('img')![0].src!,
            title: liDom.getElementsByTagName('p')![0].innerHTML,
            state: liDom.getElementsByTagName('em')![0].innerHTML,
          }
        })
      })

      const carousels = carouselsaa.flat()
      const hrefs = ['ribendongman/', 'guochandongman/', 'meiguodongman/', 'ribendongman/', 'ribendongman/']
      //获取最近更新/日本动漫/国产动漫/美国动漫/动漫电影
      let first_l = document.getElementsByClassName('firs l')![0]
      let imgs = first_l.getElementsByClassName('img')!
      const sections = first_l.getElementsByClassName('dtit')!.slice(1)
        .map((dtitDom, index) => {
          return {
            title: dtitDom.getElementsByTagName('h2')![0].getElementsByTagName('a')![0].innerHTML,
            href: hrefs[index],//dtitDom.getElementsByTagName('span')[0].getElementsByTagName('a')[0].href,
            data: imgs[index].getElementsByTagName('li')!
              .map((liDom, index) => {
                let aDoms = liDom.getElementsByTagName('p')![1].getElementsByTagName('a')!
                let state = aDoms.length === 0 ? '' : aDoms[0].innerHTML
                return {
                  id: index,
                  href: liDom.getElementsByTagName('a')![0].href!,
                  img: liDom.getElementsByTagName('img')![0].src!,
                  title: liDom.getElementsByTagName('p')![0].getElementsByTagName('a')![0].innerHTML,
                  state
                }
              })
          }
        })

      //获取每日更新列表
      let tlistDom = document.getElementsByClassName('tlist')![0]
      const dailys = tlistDom.getElementsByTagName('ul')!.map((ulDom) => {
        return ulDom.getElementsByTagName('li')!.map((liDom, index) => {
          const aDoms = liDom.getElementsByTagName('a')!
          return {
            id: index,
            href1: aDoms[0].href!,
            href2: aDoms[1].href!,
            title: aDoms[1].innerHTML,
            state: aDoms[0].innerHTML,
          }
        })
      })

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

      _afterLoad({
        carousels,
        dailys,
        rankings,
        sections,
      })

    }).catch(err => {
      console.log(err)
      if (_afterErr) {
        _afterErr(`${err}`)
      }
    })
}

export default loadPage;