import { RecommandInfo } from "../../type/RecommandInfo";
import { Section } from "../../type/Section";
import { getDomFromString } from "../Dom";

const href = 'https://www.scyinghua.com/#';


function loadPage(_afterLoad: (carousels: RecommandInfo[], sections: Section[]) => void, _afterErr?: (err: string) => void) {
  const _url = href
  fetch(_url)
    .then(response => response.text())
    .then((responseText) => {
      const document = getDomFromString(responseText);

      //获取最近更新/日本动漫/国产动漫/美国动漫/动漫电影
      let py3Doms = document.getElementsByTagName('section')!
      py3Doms.splice(2,1)
      const sections = py3Doms.map((py3Dom) => {
        const moreDom = py3Dom.getElementsByClassName('more')![0] //精选是没有more的
        return {
          href: moreDom ? moreDom.getElementsByTagName('a')![0].href! : '',
          title: py3Dom.getElementsByClassName('h3-md')![0].innerHTML,
          data: py3Dom.getElementsByClassName('video-img-box mb-e-20')!.map((videoImgDom, index) => {
            return {
              id: index,
              href: videoImgDom.getElementsByTagName('a')![0].href!,
              img: videoImgDom.getElementsByTagName('img')![0]["data-src"]!,
              title: videoImgDom.getElementsByTagName('h6')![0].getElementsByTagName('a')![0].innerHTML,
              state: videoImgDom.getElementsByClassName('label')![0].innerHTML,
            }
          })
        }
      })
      let carousels_data = sections.splice(0, 1)
      let carousels = carousels_data[0].data
      _afterLoad(carousels, sections)

    }).catch(err => {
      console.log(err)
      if (_afterErr) {
        _afterErr(`${err}`)
      }
    })
}

export default loadPage;