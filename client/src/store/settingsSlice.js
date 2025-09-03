import { createSlice } from "@reduxjs/toolkit";
import { saveApiKeys, loadApiKeys } from "../utils/storage";

const initialState = {
  apiKeys: {
    alphaVantage: import.meta.env.VITE_ALPHA_VANTAGE_KEY,
    finnhub: import.meta.env.VITE_FINNHUB_KEY,
  },
};

const settingsSlice = createSlice({
  name: "settings",
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

export const { loadSettings, updateApiKey, updateApiKeys } =
  settingsSlice.actions;
export default settingsSlice.reducer;
