import { create } from 'zustand'
import storage from '../storage';

type ChangeSource = (key: 'Novel' | 'Comic' | 'Anime', _source: string) => void

const useSource = create<{ source: any, changeSource: ChangeSource }>((set, get) => {
  storage.load({ key: 'source' }).then(
    source => set({ source }),
    () => set({ source: { Anime: 'scyinghua', Comic: 'biquge', Novel: 'qb' } }),
  );
  return {
    source: { Anime: 'scyinghua', Comic: 'biquge', Novel: 'qb' },
    changeSource: (key: 'Novel' | 'Comic' | 'Anime', _source: string) => {
      const { source } = get()
      let newSource = { ...source };
      newSource[key] = _source;
      set({ source: newSource });
      //持久化保存数据
      storage.save({
        key: 'source',
        data: newSource,
        expires: null,
      });
    }
  }
})

export default useSource;
