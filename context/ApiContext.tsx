import {createContext, useEffect, useState} from 'react';
import parseConfig from '../api';
import Api from '../type/Api';

const ApiContext = createContext<{api: Api}>({api: {}});

const ApiWrapper: React.FC<{children: any}> = ({children}) => {
  const [api, setApi] = useState<Api>(parseConfig());
  return <ApiContext.Provider value={{api}} children={children} />;
};

export default ApiWrapper;
export {ApiContext};
