import { createContext } from "react";
import appTheme from "../theme";

const AppContext = createContext<{
    theme: typeof appTheme.red;
    changeTheme: (name: string) =>void;
    source: Record<string, any>;
    themeName: string;
    changeSource: (type: 'Novel'|'Comic'|'Anime', source: string)=>void;
    api: Record<string, Record<string, Record<string, any>>>
}>({
    theme: appTheme.red, themeName: 'red',  //用户主题
    changeTheme: (name: string) => { }, 
    source: {Anime: '', Comic: '', Novel: ''}, //主页数据源
    changeSource: (type: 'Novel'|'Comic'|'Anime', source: string)=>{ },
    api: {},
});

export default AppContext;