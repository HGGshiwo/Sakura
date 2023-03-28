import RecommandInfo from "../../../type/RecommandInfo";
import { Section } from "../../../type/Section";
import { getDomFromString } from "../../Dom";
import {getDataFromVideoImgDoms} from './utils'
const href = 'https://www.scyinghua.com';
const apiName = 'scyinghua'

function loadPage(_afterLoad: (carousels: RecommandInfo[], sections: Section[]) => void, _afterErr?: (err: string) => void) {

  fetch('https://www.scyinghua.com/#')
    .then(response => response.text())
    .then((responseText) => {
      const document = getDomFromString(responseText);

      //获取最近更新/日本动漫/国产动漫/美国动漫/动漫电影
      let py3Doms = document.getElementsByTagName('section')!
      py3Doms.splice(2,1)
      const sections = py3Doms.map((py3Dom) => {
        const moreDom = py3Dom.getElementsByClassName('more')![0] //精选是没有more的
        return {
          href: moreDom ? href + moreDom.getElementsByTagName('a')![0].href! : '',
          apiName,
          title: py3Dom.getElementsByClassName('h3-md')![0].innerHTML,
          data: getDataFromVideoImgDoms(href, py3Dom, apiName)
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