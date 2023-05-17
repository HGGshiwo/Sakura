import {createContext, useEffect, useState} from 'react';
import storage from '../storage';

const SrcContext = createContext<{
  source: Record<string, any>;
  changeSource: (type: 'Novel' | 'Comic' | 'Anime', source: string) => void;
}>({
  source: {Anime: '', Comic: '', Novel: ''}, //主页数据源
  changeSource: (type: 'Novel' | 'Comic' | 'Anime', source: string) => {},
});

const SrcWrapper: React.FC<{children: any}> = ({children}) => {
  const [source, setSource] = useState({Anime: 'scyinghua', Comic: 'biquge', Novel: 'qb'});

  const changeSource = (key: 'Novel' | 'Comic' | 'Anime', _source: string) => {
    let newSource = {...source};
    newSource[key] = _source;
    setSource({...newSource});
    //持久化保存数据
    storage.save({
      key: 'source',
      data: newSource,
      expires: null,
    });
  };

  useEffect(() => {
    storage.load({key: 'source'}).then(
      source => setSource(source),
      () => setSource({Anime: 'scyinghua', Comic: 'biquge', Novel: 'qb'}),
    );
  }, []);

  return (
    <SrcContext.Provider value={{source, changeSource}} children={children} />
  );
};

export default SrcWrapper;
export {SrcContext};
