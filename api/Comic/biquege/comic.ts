import { getDomFromString } from "../../Dom"

const loadComicSrc = (url: string, callback: (data: string[]) => void) => {
  fetch(url).then(response => response.text())
    .then((responseText) => {
      const documnet = getDomFromString(responseText)
      const urls = documnet.getElementsByClassName('lazyload')!.map(lazyDom=>lazyDom["data-original"]!)
      callback(urls)
    })
}
export { loadComicSrc };