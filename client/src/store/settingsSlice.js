import { createSlice } from '@reduxjs/toolkit';
import { saveApiKeys, loadApiKeys } from '../utils/storage';

const initialState = {
  apiKeys: {
    alphaVantage: 'LWYGTIKY5PIVTGPU',
    finnhub: '',
  },
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    loadSettings: (state) => {
      const apiKeys = loadApiKeys();
      state.apiKeys = { ...state.apiKeys, ...apiKeys };
    },
    updateApiKey: (state, action) => {
      const { provider, key } = action.payload;
      state.apiKeys[provider] = key;
      saveApiKeys(state.apiKeys);
    },
    updateApiKeys: (state, action) => {
      state.apiKeys = { ...state.apiKeys, ...action.payload };
      saveApiKeys(state.apiKeys);
    },
  },
});

export const { loadSettings, updateApiKey, updateApiKeys } = settingsSlice.actions;
export default settingsSlice.reducer;
