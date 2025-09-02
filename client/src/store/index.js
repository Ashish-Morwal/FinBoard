import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from './dashboardSlice';
import settingsReducer from './settingsSlice';

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['dashboard/updateWidgetData'],
      },
    }),
});
