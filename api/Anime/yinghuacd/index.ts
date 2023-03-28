import home from "./home";
import info, { loadVideoSrc } from "./video";
import search from './search'
import category from './category'
import daily from './daily'
import rank from './rank'
import all from './all'
const apiName = 'yinghuacd'
const player = loadVideoSrc
export {
    home,
    player,
    info,
    search,
    all,
    rank,
    daily,
    category,
    apiName
}