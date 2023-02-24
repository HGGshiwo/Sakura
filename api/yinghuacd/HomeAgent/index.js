import { Dom, getDomFromString } from "../../../public/Dom";

const href = 'http://www.yinghuacd.com';

class Agent {
	constructor() {
		this._url = href
	}

	afterLoadCarousels(callback) {
		this._afterLoadCarousels = callback;
	}

	afterLoadRecent(callback) {
		this._afterLoadRecent = callback
	}
	afterLoadJapan(callback) {
		this._afterLoadJapan = callback
	}
	afterLoadHome(callback) {
		this._afterLoadHome = callback
	}
	afterLoadAmerica(callback) {
		this._afterLoadAmerica = callback
	}
	afterLoadDailys(callback) {
		this._afterLoadDailys = callback
	}

	afterLoadRankings(callback) {
		this._afterLoadRankings = callback
	}

	load() {
		fetch(this._url)
			.then(response => response.text())
			.then((responseText) => {
				const document = getDomFromString(responseText);
				//获取轮播
				if (this._afterLoadCarousels) {
					let heros = document.getElementsByClass("heros")
					let i = 0
					let carousels = heros.map((hero) => {
						console.log(hero.getElementsByTagName('li'))
						return hero.getElementsByTagName('li').map((liDom) => {
							let id = i
							i += 1
							return {
								id,
								href: liDom.getElementsByTagName('a')[0].href,
								img: liDom.getElementsByTagName('img')[0].src,
								title: liDom.getElementsByTagName('p')[0].innerHTML,
								state: liDom.getElementsByTagName('em')[0].innerHTML,
							}
						})
					})
					carousels = carousels.flat()
					this._afterLoadCarousels(carousels);
				}
				//获取最近更新/日本动漫/国产动漫/美国动漫/动漫电影
				let funcs = [this._afterLoadRecent, this._afterLoadJapan, this._afterLoadHome, this._afterLoadAmerica]
				let first_l = document.getElementsByClass('firs l')[0]
				let imgs = first_l.getElementsByClass('img')

				funcs.forEach((fun, index) => {
					if (fun) {
						const datas = imgs[index].getElementsByTagName('li')
							.map((liDom, index) => {
								return {
									id: index,
									href: liDom.getElementsByTagName('a')[0].href,
									img: liDom.getElementsByTagName('img')[0].src,
									title: liDom.getElementsByTagName('p')[0].getElementsByTagName('a')[0].innerHTML,
									state: liDom.getElementsByTagName('p')[1].getElementsByTagName('a')[0].innerHTML,
								}
							})
						fun(datas)
					}
				})


				//获取每日更新列表
				if (this._afterLoadDailys) {
					let tlistDom = document.getElementsByClass('tlist')[0]
					const dailys = tlistDom.getElementsByTagName('ul').map((ulDom) => {
						return ulDom.getElementsByTagName('li').map((liDom, index) => {
							const aDoms = liDom.getElementsByTagName('a')
							return {
								id: index,
								href1: aDoms[0].href,
								href2: aDoms[1].href,
								title: aDoms[1].innerHTML,
								state: aDoms[0].innerHTML,
							}
						})
					})
					this._afterLoadDailys(dailys)
				}

				//获取动漫排行
				if (this._afterLoadRankings) {
					let picsDom = document.getElementsByClass('pics')[0]
					picsDom.getElementsByTagName('li').map((liDom, index) => {
						const spanDoms = liDom.getElementsByTagName('span')
						return {
							id: index,
							img: liDom.getElementsByTagName('img')[0].src,
							title: liDom.getElementsByTagName('h2')[0].getElementsByTagName('a')[0].innerHTML,
							href: liDom.getElementsByTagName('a')[0].href,
							type: spanDoms[0].getElementsByTagName('font')[0].innerHTML,
							info: spanDoms[1].getElementsByTagName('a')[0].innerHTML
						}
					})
				}

			})
	}
}


export { Agent };