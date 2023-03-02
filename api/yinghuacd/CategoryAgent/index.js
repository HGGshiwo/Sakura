import { Dom, getDomFromString } from "../../Dom";

const href = 'http://www.yinghuacd.com/';

class Agent {
  constructor() {
    this._url = href
  }

  afterLoad(callback) {
    this._afterLoad = callback;
  }

  load(arg) {
    if (this._afterLoad) {
      fetch(`${this._url}${arg}/`)
        .then(response => response.text())
        .then((responseText) => {
          const document = getDomFromString(responseText);
          //获取国产经典动漫, 搞笑-童话,...
          let imgs = document.getElementsByClass('imgs')
          const sections = document.getElementsByClass('dtit')
            .map((dtitDom, index) => {
              console.log(66, imgs)
              return {
                title: dtitDom.getElementsByTagName('h2')[0].innerHTML,
                href: '',
                data: imgs[index].getElementsByTagName('li')
                  .map((liDom, index) => {
                    console.log(liDom)
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
          carousels = sections[0].data.splice(0, 5)
          this._afterLoad({
            carousels,
            sections
          })
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}


export { Agent };