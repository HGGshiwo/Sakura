import React, {createContext} from 'react';
import ApiWrapper from './ApiContext';
import SrcWrapper from './SrcContext';
import ThemeWrapper from './ThemeContext';
import DownloadWrapper from './DownloadContext';

const ContentWrapper: React.FC<{children: any}> = ({children}) => {
  return (
    <DownloadWrapper>
      <ThemeWrapper>
        <ApiWrapper>
          <SrcWrapper>{children}</SrcWrapper>
        </ApiWrapper>
      </ThemeWrapper>
    </DownloadWrapper>
  );
};

export default ContentWrapper;
