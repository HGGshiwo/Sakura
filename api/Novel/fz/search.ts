import { apiName } from ".";
import { SearchInfo } from "../../../type/SearchInfo";
import { Dom, getDomFromString } from "../../Dom";

function loadPage(arg: string, _afterSearch: (result: SearchInfo[]) => void) {
  const _url = 'https://www.56fz.net/home/search'
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
    fetch(`https://www.56fz.net/home/search`, {
      method: 'POST',
      headers: {
        'Content-Type':'application/x-www-form-urlencoded',
      },
      body: `action=search&q=${arg}`
    })
      .then(response => response.text())
      .then((responseText) => {
        const document = getDomFromString(responseText);
        console.log(document)
        const results = document!.getElementsByClassName('item-cover')!.map((itemDom) => {
          const aDom = itemDom.getElementsByTagName('a')![0]
          return {
            id: aDom.href!,
            href: 'https://www.56fz.net' + aDom.href!,
            apiName,
            title: aDom.getElementsByTagName('h3')![0].innerHTML,
            type: [],
            info: '',
            img: 'https://www.56fz.net' + aDom.getElementsByTagName('img')![0]["data-original"],
            state: '',
          }
        })
        _afterSearch(results) //只有一页结果
      })
      .catch(err => {
        console.log(err)
      })
  }
}


export default loadPage;