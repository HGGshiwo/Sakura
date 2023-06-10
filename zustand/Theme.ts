import React, { createContext, useEffect, useState } from 'react';
import storage from '../storage';
import { create } from 'zustand'
import appTheme from '../theme';

interface State {
  theme: typeof appTheme.red;
  changeTheme: (name: string) => void;
  themeName: string;
}

const useTheme = create<State>((set, get) => {
  storage.load({ key: 'themeName' }).then(
    themeName => set({ theme: appTheme[themeName], themeName }),
    () => set({ theme: appTheme.red, themeName: 'red' })
  );
  return {
    theme: appTheme.red,
    themeName: 'red',
    changeTheme: (themeName: string) => {
      set({ theme: appTheme[themeName], themeName })
      //持久化保存数据
      storage.save({
        key: 'themeName',
        data: themeName,
        expires: null,
      });
    }
  }
})

export default useTheme;