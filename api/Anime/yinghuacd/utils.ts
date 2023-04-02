import { apiName } from ".";
import { Dom } from "../../Dom";

const href = 'http://www.yinghuacd.com';

function getResult(liDoms: Dom[]) {
    return liDoms.map((liDom, index) => {
        const aDom = liDom.getElementsByTagName('h2')![0].getElementsByTagName('a')![0]
        const spans = liDom.getElementsByTagName('span')!
        return {
            apiName,
            href: href + aDom.href!,
            img: liDom!.getElementsByTagName('img')![0].src!,
            state: spans[0] ? spans[0].innerHTML : '',
            title: aDom.innerHTML,
            id: `${index}`,
            type: spans[1].getElementsByClassName('a')!.map((aDom) => { return aDom.innerHTML }),
            info: liDom.getElementsByTagName('p')![0].innerHTML
        }
    })
}

export { getResult }