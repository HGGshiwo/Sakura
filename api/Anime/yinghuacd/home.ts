import { apiName } from ".";
import HomePageInfo from "../../../type/PageInfo/HomePageInfo";
import RecommandInfo from "../../../type/RecommandInfo";
import { Section } from "../../../type/Section";
import { Dom, getDomFromString } from "../../Dom";

const href = 'http://www.yinghuacd.com';


function loadPage(_afterLoad: (carousels:RecommandInfo[], sections: Section[]) => void, _afterErr?: (err: string) => void) {
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
            apiName,
            href: href + liDom.getElementsByTagName('a')![0].href!,
            img: liDom.getElementsByTagName('img')![0].src!,
            title: liDom.getElementsByTagName('p')![0].innerHTML,
            state: liDom.getElementsByTagName('em')![0].innerHTML,
          }
        })
      })

      const carousels = carouselsaa.flat()
      //获取最近更新/日本动漫/国产动漫/美国动漫/动漫电影
      let first_l = document.getElementsByClassName('firs l')![0]
      let imgs = first_l.getElementsByClassName('img')!
      const sections = first_l.getElementsByClassName('dtit')!
        .map((dtitDom, index) => {
          return {
            title: dtitDom.getElementsByTagName('h2')![0].getElementsByTagName('a')![0].innerHTML,
            href: dtitDom.getElementsByTagName('span')![0].getElementsByTagName('a')![0].href!.substring(1),
            apiName,
            data: imgs[index].getElementsByTagName('li')!
              .map((liDom, index) => {
                let aDoms = liDom.getElementsByTagName('p')![1].getElementsByTagName('a')!
                let state = aDoms.length === 0 ? '' : aDoms[0].innerHTML
                return {
                  id: index,
                  apiName,
                  href: href + liDom.getElementsByTagName('a')![0].href!,
                  img: liDom.getElementsByTagName('img')![0].src!,
                  title: liDom.getElementsByTagName('p')![0].getElementsByTagName('a')![0].innerHTML,
                  state
                }
              })
          }
        })

      _afterLoad(carousels, sections)

    }).catch(err => {
      console.log(err)
      if (_afterErr) {
        _afterErr(`${err}`)
      }
    })
}

export default loadPage;