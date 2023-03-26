import { Dom } from "../../Dom"

const getRecommandInfoFromCover = (father: Dom) => {
    const coverDom = father.getElementsByClassName('cover')![0]
    const tagDom = coverDom.getElementsByClassName('cover__tag')![0]
    return {
        href: coverDom.getElementsByTagName('a')![0].href!,
        img: coverDom.getElementsByTagName('img')![0]["data-original"]!,
        state: tagDom ? tagDom.innerHTML : '',
        title: father.getElementsByClassName('comic__title')![0].getElementsByTagName('a')![0].innerHTML,
    }
}

export { getRecommandInfoFromCover }