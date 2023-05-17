import React, {createContext} from 'react';
import ApiWrapper from './ApiContext';
import SrcWrapper from './SrcContext';
import ThemeWrapper from './ThemeContext';

const ContentWrapper: React.FC<{children: any}> = ({children}) => {
  return (
    <ThemeWrapper>
      <ApiWrapper>
        <SrcWrapper>{children}</SrcWrapper>
      </ApiWrapper>
    </ThemeWrapper>
  );
};

export default ContentWrapper;
