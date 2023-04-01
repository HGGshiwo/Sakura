import { apiName } from ".";
import { loadHomePage } from "../..";
import { getDomFromString } from "../../Dom";
var iconv = require('iconv-lite');
import { Buffer } from 'buffer';

const loadPage: loadHomePage = (_afterLoad,) => {

  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://www.23qb.com/');
  xhr.responseType = 'arraybuffer';
  xhr.onload = function () {
    if (this.status == 200) {
      const responseText = iconv.decode(Buffer.from(this.response), 'gbk')
      const document = getDomFromString(responseText)
      const sections = [...document.getElementsByClassName('coverecom w_440 left mbottom')!, ...document.getElementsByClassName('coverecom w_440 right mbottom')!].map((sectionDom) => {
        return {
          title: sectionDom.getElementsByTagName('em')![0].innerHTML,
          href: '',
          data: sectionDom.getElementsByTagName('dl')!.map(item => {
            return {
              href: 'https://www.23qb.com' + item.getElementsByTagName('a')![0].href,
              apiName,
              img: item.getElementsByTagName('img')![0]._src!,
              state: item.getElementsByClassName('tit')![0].innerHTML,
              title: item.getElementsByTagName('dd')![0].getElementsByTagName('a')![0].innerHTML,
            }
          })
        }
      })
      const carousels = document.getElementsByClassName('coverecom mbottom')![0].getElementsByTagName('dl')!.map(item => {
        return {
          href: 'https://www.23qb.com' + item.getElementsByTagName('a')![0].href,
          apiName,
          img: item.getElementsByTagName('img')![0]._src!,
          state: item.getElementsByClassName('tit')![0].innerHTML,
          title: item.getElementsByTagName('dd')![0].getElementsByTagName('a')![0].innerHTML,
        }
      })
      _afterLoad(carousels, sections)
    } else {
      console.error('Error while requesting', this);
    }
  };
  xhr.send();
}

export default loadPage;