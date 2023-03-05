import CategoryPageInfo from "../../type/PageInfo/CategoryPageInfo";
import { Dom, getDomFromString } from "../Dom";

const href = 'http://www.yinghuacd.com/';

function loadPage(arg: string, _afterLoad?: (data: CategoryPageInfo) => void) {
  const _url = href
  if (_afterLoad) {
    fetch(`${_url}${arg}/`)
      .then(response => response.text())
      .then((responseText) => {
        const document = getDomFromString(responseText);
        //获取国产经典动漫, 搞笑-童话,...
        let imgs = document.getElementsByClassName('imgs')!
        const sections = document.getElementsByClassName('dtit')!
          .map((dtitDom, index) => {
            return {
              title: dtitDom.getElementsByTagName('h2')![0].innerHTML,
              href: '',
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
        const carousels = sections[0].data.splice(0, 5)
        _afterLoad({
          carousels,
          sections
        })
      })
      .catch(err => {
        console.log(err)
      })
  }
}
export default loadPage;