import { SearchInfo } from "../../../type/SearchInfo";
import { Dom, getDomFromString } from "../../Dom";

const href = 'https://www.biqug.org/index.php/search?key=';

function loadPage(arg: string, _afterSearch: (result: SearchInfo[]) => void) {
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
    // fetch(`${_url}${arg}`)
    //   .then(response => response.text())
    //   .then((responseText) => {
    //     const document = getDomFromString(responseText);
    //     // const results = document!.getElementsByClassName('common-comic-item')!.map((itemDom) => getRecommandInfoFromCover(itemDom, 'biquge')).map((result, index) => ({ ...result, id: result.href, type: [], info: '' }))
    //     // _afterSearch(results) //只有一页结果

    //   })
    //   .catch(err => {
    //     console.log(err)
    //   })
  }
}


export default loadPage;