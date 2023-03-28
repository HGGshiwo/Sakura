import { apiName } from ".";
import DailyInfo from "../../../type/DailyInfo";
import { Dom, getDomFromString } from "../../Dom";

const href = 'http://www.yinghuacd.com';

function loadPage(_afterLoad: (data: DailyInfo[][]) => void, _afterErr?: (err: string) => void) {
  const _url = href
  fetch(_url)
    .then(response => response.text())
    .then((responseText) => {
      const document = getDomFromString(responseText);

      //获取每日更新列表
      let tlistDom = document.getElementsByClassName('tlist')![0]
      const dailys = tlistDom.getElementsByTagName('ul')!.map((ulDom) => {
        return ulDom.getElementsByTagName('li')!.map((liDom, index) => {
          const aDoms = liDom.getElementsByTagName('a')!
          return {
            id: index,
            apiName,
            href1: href + aDoms[0].href!,
            href2: aDoms[1].href!,
            title: aDoms[1].innerHTML,
            state: aDoms[0].innerHTML,
          }
        })
      })

      _afterLoad(dailys)

    }).catch(err => {
      console.log(err)
      if (_afterErr) {
        _afterErr(`${err}`)
      }
    })
}

export default loadPage;