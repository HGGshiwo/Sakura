import { createContext } from "react";
import appTheme from "../theme";

const AppContext = createContext({
    theme: appTheme.red, themeName: 'red',  //用户主题
    changeTheme: (name: string) => { }, 
    source: {Anime: '', Comic: '', Novel: ''}, //主页数据源
    changeSource: (type: 'Novel'|'Comic'|'Anime', source: string)=>{ },
});

export default AppContext;