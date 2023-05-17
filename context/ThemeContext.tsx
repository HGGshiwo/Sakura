import React, {createContext, useEffect, useState} from 'react';
import storage from '../storage';
import appTheme from '../theme';

const ThemeContext = createContext<{
  theme: typeof appTheme.red;
  changeTheme: (name: string) => void;
  themeName: string;
}>({
  theme: appTheme.red,
  themeName: 'red', //用户主题
  changeTheme: (name: string) => {},
});

const ThemeWrapper: React.FC<{children: any}> = ({children}) => {
  const [theme, setTheme] = useState<any>(appTheme.red);
  const [themeName, setThemeName] = useState('');
  
  useEffect(() => {
    storage.load({key: 'themeName'}).then(
      themeName => {
        setTheme(appTheme[themeName]);
        setThemeName(themeName);
      },
      () => {
        setTheme(appTheme.red);
        setThemeName('red');
      },
    );
  }, []);
  
  const changeTheme = (themeName: string) => {
    setThemeName(themeName);
    setTheme(appTheme[themeName]);
    //持久化保存数据
    storage.save({
      key: 'themeName',
      data: themeName,
      expires: null,
    });
  };

  return (
    <ThemeContext.Provider value={{theme, themeName, changeTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};
export default ThemeWrapper;
export {ThemeContext};
