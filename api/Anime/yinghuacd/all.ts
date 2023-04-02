import RecommandInfo from "../../../type/RecommandInfo";
import { Dom, getDomFromString } from "../../Dom";
import { getResult } from "./utils";

const href = 'http://www.yinghuacd.com';


function loadPage(arg: string, _afterSearch: (data: RecommandInfo[]) => void) {
  console.log(`http://www.yinghuacd.com/${arg}/`)
  fetch(`http://www.yinghuacd.com/${arg}/`)
    .then(response => response.text())
    .then((responseText) => {
      const document = getDomFromString(responseText);
      //获取页数
      const pages = document!.getElementsByClassName('pages')!
      if (pages!.length === 0) {
        const liDoms = document!.getElementsByClassName('lpic')![0].getElementsByTagName("li")!
        const result = getResult(liDoms)
        _afterSearch(result) //只有一页结果
        return [];
      }
      const aDoms: Dom[] = pages[0].getElementsByTagName('a')!
      const promises = aDoms.slice(3, -2).map(aDom => {
        return fetch(`${href}${aDom.href}`)
          .then(response => response.text())
          .then((responseText) => {
            const document = getDomFromString(responseText)
            return document!.getElementsByClassName('lpic')![0].getElementsByTagName("li")
          })
          .catch(err => { console.log(err) })
      })
      return Promise.all(promises)
    })
    .then((liDomsaa) => {
      if (liDomsaa.length === 0) {
        return
      }
      const liDoms = liDomsaa.flat()
      const result = getResult(liDoms as Dom[])
      _afterSearch(result)
    })
    .catch(err => {
      console.log(err)
    })
}

export default loadPage;