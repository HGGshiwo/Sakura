import { createContext } from "react";
import appTheme from "../theme";

const AppContext = createContext({ 
    theme: appTheme.red, themeName: 'red',  //用户主题
    changeTheme: (name: string) => { }, 
    animeSource: '', //主页数据源
    changeAnimeSource: (name: string)=>{ },
});

export default AppContext;