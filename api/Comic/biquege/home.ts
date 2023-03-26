import { loadHomePage } from "../..";
import { getDomFromString } from "../../Dom";

const loadPage: loadHomePage = (_afterLoad,) => {
  fetch('https://www.biqug.org/')
    .then(response => response.text())
    .then((responseText) => {
      const document = getDomFromString(responseText)
      const carousels = document.getElementsByClassName('slide-item')!.map((itemDom) => {
        return {
          href: itemDom.getElementsByTagName('a')![0].href!,
          img: itemDom.getElementsByTagName('img')![0].src!,
          state: itemDom.getElementsByTagName('p')![0].innerHTML,
          title: itemDom.getElementsByTagName('p')![0].innerHTML,
        }
      })
      const sections = document.getElementsByClassName('in-sec-wr')!.map((sectionDom) => {
        const headDom = sectionDom.getElementsByClassName('in-sec__head')![0]
        return {
          title: headDom.getElementsByTagName('span')![0].innerHTML,
          href: headDom.getElementsByTagName('a')![0].href!,
          data: sectionDom.getElementsByClassName('in-comic--type-b cs-item')!.map((inDom) => {
            const coverDom = inDom.getElementsByClassName('cover')![0]
            const tagDom = coverDom.getElementsByClassName('cover__tag')![0]
            return {
              href: coverDom.getElementsByTagName('a')![0].href!,
              img: coverDom.getElementsByTagName('img')![0]["data-original"]!,
              state: tagDom ? tagDom.innerHTML : '',
              title: inDom.getElementsByClassName('comic__title')![0].getElementsByTagName('a')![0].innerHTML,
            }
          })
        }
      })
      _afterLoad(carousels, sections)
    })
}

export default loadPage;