// https://www.23qb.com/book/1888/271243.html

import { apiName } from "."
import { loadInfoPage, loadPlayerData } from "../.."
import { getDomFromString } from "../../Dom"
var iconv = require('iconv-lite');
import { Buffer } from 'buffer';

const loadPage: loadInfoPage = (url, callback) => {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function () {
    if (this.status == 200) {
      const responseText = iconv.decode(Buffer.from(this.response), 'gbk')
      const documnet = getDomFromString(responseText)
      const title = documnet.getElementsByClassName('d_title')![0].getElementsByTagName('h1')![0].innerHTML
      const img = documnet.getElementsByClassName('coverecom w_770 left')![0].getElementsByTagName('img')![0].src!
      const liDoms = documnet.getElementsByClassName('bookright')![0].getElementsByTagName('li')!
      console.log(111)
      const infoSub = {
        author: liDoms[0].getElementsByTagName('a')![0].innerHTML,
        alias: '',
        state: liDoms[2].getElementsByTagName('span')![0].innerHTML,
        time: liDoms[3].getElementsByTagName('span')![0].innerHTML,
        type: [liDoms[2].getElementsByTagName('span')![0].innerHTML],
        produce: '',
      }
      const recommands = documnet.getElementById('product')!.getElementsByTagName('ul')![0].getElementsByTagName('li')!.map(item => {
        return {
          href: item.getElementsByTagName('a')![0].href,
          apiName,
          img: item.getElementsByTagName('img')![0]._src,
          state: '',
          title: item.getElementsByTagName('h3')![0].innerHTML,
        }
      })
      const info = documnet.getElementsByClassName('hm-scroll')![0].getElementsByTagName('p')![0].innerHTML
      const sources = documnet.getElementsByClassName('chaw_c')![0].getElementsByTagName('li')!.map(liDom => {
        const aDom = liDom.getElementsByTagName('a')![0]
        return {
          key: aDom.innerHTML.trim(),
          data: ['https://www.23qb.com' + aDom.href!]
        }
      })
      callback({
        title,
        img,
        infoSub,
        recommands,
        sources,
        info,
        relatives: [],
      })
    } else {
      console.error('Error while requesting', url, this);
    }
  }
  xhr.send();
}


const loadTextSrc: loadPlayerData = (url, callback) => {
  console.log(url)
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function () {
    if (this.status == 200) {
      const responseText = iconv.decode(Buffer.from(this.response), 'gbk')
      const document = getDomFromString(responseText)
      const datas = document.getElementsByTagName('p')!.map(pDom => pDom.innerHTML)
      callback(true, datas)
    } else {
      console.error('Error while requesting', url, this);
    }
  };
  xhr.send();
}
export default loadPage;
export { loadTextSrc };