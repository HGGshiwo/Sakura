import { create } from 'zustand'
import parseConfig from '../api'
import Api from '../type/Api';

const useApi = create<Api>((set) => ({
  api: parseConfig(),
}))

export default useApi;