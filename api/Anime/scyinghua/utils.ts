import { Dom } from "../../Dom"

const getDataFromVideoImgDoms = (href: string, father: Dom, apiName: string) => {
    return father.getElementsByClassName('video-img-box mb-e-20')!.map((videoImgDom, index) => {
        let img = videoImgDom.getElementsByTagName('img')![0]["data-src"]!.replace('https','http')
        if(img==='/' || img.includes('None')) {
            img = 'https://s1.hdslb.com/bfs/static/laputa-home/client/assets/load-error.685235d2.png'
        }
        return {
            id: index.toString(),
            href: href + videoImgDom.getElementsByTagName('a')![0].href!,
            apiName,
            img,
            title: videoImgDom.getElementsByTagName('h6')![0].getElementsByTagName('a')![0].innerHTML,
            state: videoImgDom.getElementsByClassName('label')![0].innerHTML,
        }
    })
}

export {getDataFromVideoImgDoms}
