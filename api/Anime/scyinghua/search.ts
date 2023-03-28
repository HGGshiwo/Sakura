import { SearchInfo } from "../../../type/SearchInfo";
import { Dom, getDomFromString } from "../../Dom";
import { getDataFromVideoImgDoms } from "./utils";

const href = 'https://www.scyinghua.com/search/-------------.html?wd=';

function loadPage(arg: string, _afterSearch:(result:SearchInfo[])=>void) {
  const _url = href
  if (_afterSearch) {
    if (!arg) {
      _afterSearch([])
      return
    }
    arg = arg.trim()
    if (arg === '') {
      _afterSearch([])
      return
    }
    fetch(`${_url}${arg}`)
      .then(response => response.text())
      .then((responseText) => {
        const document = getDomFromString(responseText);
        const results = getDataFromVideoImgDoms('http://www.scyinghua.com', document)
        _afterSearch(results.map(result=>({...result, type:[], info:''})))
      })
      .catch(err => {
        console.log(err)
      })
  }
}


export default loadPage;