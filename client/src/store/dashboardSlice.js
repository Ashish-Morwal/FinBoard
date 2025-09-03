import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import {
  saveDashboardConfig,
  loadDashboardConfig as loadConfig,
} from "../utils/storage";
import { fetchWidgetData } from "../utils/apiService";
import { normalizeForWidgets, normalizeForTable } from "../utils/normalizers";

export const loadDashboardConfig = createAsyncThunk(
  "dashboard/loadConfig",
  async () => {
    return loadConfig();
  }
);

export const saveConfig = createAsyncThunk(
  "dashboard/saveConfig",
  async (_, { getState }) => {
    const { dashboard } = getState();
    saveDashboardConfig({ widgets: dashboard.widgets, theme: dashboard.theme });
  }
);

export const refreshWidgetData = createAsyncThunk(
  "dashboard/refreshWidgetData",
  async (widgetId, { getState }) => {
    const state = getState();
    const widget = state.dashboard.widgets.find((w) => w.id === widgetId);
    if (!widget) {
      console.warn("⚠️ Widget not found:", widgetId);
      return { widgetId, data: [], type: null };
    }
    const apiKeys = state.dashboard.apiKeys || {};
    console.log("🌍 Fetching for widget:", widget.title, "URL:", widget.apiUrl);
    try {
      const raw = await fetchWidgetData(widget.apiUrl, apiKeys);
      console.log("🐛 RAW API response for widget", widgetId, raw);
      return { widgetId, data: raw, type: widget.type };
    } catch (err) {
      console.error("❌ Error in refreshWidgetData:", err);
      return { widgetId, data: [], type: widget.type };
    }
  }
);

const initialState = {
  widgets: [],
  theme: "dark",
  isLoading: false,
  error: null,
  modals: {
    addWidget: {
      isOpen: false,
      newWidget: {
        name: "",
        apiUrl: "",
        refreshInterval: 30,
        type: "card",
        size: "medium",
        selectedFields: [],
      },
      apiFields: [],
      isTestingApi: false,
      apiTestResult: null,
    },
    settings: { isOpen: false },
    widgetConfig: { isOpen: false, widget: null },
  },
  draggedWidget: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    openAddWidgetModal: (state) => {
      state.modals.addWidget.isOpen = true;
      state.modals.addWidget.newWidget = {
        name: "",
        apiUrl: "",
        refreshInterval: 30,
        type: "card",
        size: "medium",
        selectedFields: [],
      };
      state.modals.addWidget.apiFields = [];
      state.modals.addWidget.apiTestResult = null;
    },
    closeAddWidgetModal: (state) => {
      state.modals.addWidget.isOpen = false;
    },
    openSettingsModal: (state) => {
      state.modals.settings.isOpen = true;
    },
    closeSettingsModal: (state) => {
      state.modals.settings.isOpen = false;
    },
    openWidgetConfigModal: (state, action) => {
      state.modals.widgetConfig.isOpen = true;
      state.modals.widgetConfig.widget = action.payload;
    },
    closeWidgetConfigModal: (state) => {
      state.modals.widgetConfig.isOpen = false;
      state.modals.widgetConfig.widget = null;
    },
    updateNewWidget: (state, action) => {
      state.modals.addWidget.newWidget = {
        ...state.modals.addWidget.newWidget,
        ...action.payload,
      };
    },
    setApiFields: (state, action) => {
      state.modals.addWidget.apiFields = action.payload;
    },
    setApiTestResult: (state, action) => {
      state.modals.addWidget.apiTestResult = action.payload;
    },
    setApiTesting: (state, action) => {
      state.modals.addWidget.isTestingApi = action.payload;
    },
    addSelectedField: (state, action) => {
      const field = action.payload;
      if (
        !state.modals.addWidget.newWidget.selectedFields.find(
          (f) => f.path === field.path
        )
      ) {
        state.modals.addWidget.newWidget.selectedFields.push(field);
      }
    },
    removeSelectedField: (state, action) => {
      const fieldPath = action.payload;
      state.modals.addWidget.newWidget.selectedFields =
        state.modals.addWidget.newWidget.selectedFields.filter(
          (f) => f.path !== fieldPath
        );
    },
    addWidget: (state, action) => {
      const newWidget = {
        ...action.payload,
        id: uuidv4(),
        position: state.widgets.length,
        lastUpdated: new Date().toISOString(),
      };
      state.widgets.push(newWidget);
      saveDashboardConfig({ widgets: state.widgets, theme: state.theme });
    },
    removeWidget: (state, action) => {
      const widgetId = action.payload;
      state.widgets = state.widgets.filter((w) => w.id !== widgetId);
      state.widgets.forEach((widget, index) => {
        widget.position = index;
      });
      saveDashboardConfig({ widgets: state.widgets, theme: state.theme });
    },
    updateWidget: (state, action) => {
      const { id, updates } = action.payload;
      const widgetIndex = state.widgets.findIndex((w) => w.id === id);
      if (widgetIndex !== -1) {
        state.widgets[widgetIndex] = {
          ...state.widgets[widgetIndex],
          ...updates,
        };
      }
      saveDashboardConfig({ widgets: state.widgets, theme: state.theme });
    },
    updateWidgetData: (state, action) => {
      const { widgetId, data } = action.payload;
      const widget = state.widgets.find((w) => w.id === widgetId);
      if (widget) {
        widget.data = data;
        widget.lastUpdated = new Date().toISOString();
      }
    },
    reorderWidgets: (state, action) => {
      const { startIndex, endIndex } = action.payload;
      const [removed] = state.widgets.splice(startIndex, 1);
      state.widgets.splice(endIndex, 0, removed);
      state.widgets.forEach((widget, index) => {
        widget.position = index;
      });
    },
    toggleTheme: (state) => {
      state.theme = state.theme === "dark" ? "light" : "dark";
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setDraggedWidget: (state, action) => {
      state.draggedWidget = action.payload;
    },
    clearAllWidgets: (state) => {
      state.widgets = [];
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadDashboardConfig.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadDashboardConfig.fulfilled, (state, action) => {
        state.isLoading = false;
        const payload = action.payload || {};
        state.widgets = payload.widgets || [];
        state.theme = payload.theme || "dark";
      })
      .addCase(loadDashboardConfig.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(refreshWidgetData.fulfilled, (state, action) => {
        if (action.payload) {
          const { widgetId, data, type } = action.payload;
          const widget = state.widgets.find((w) => w.id === widgetId);
          if (widget) {
            if (type === "table") {
              widget.data = normalizeForTable(data);
            } else {
              widget.data = normalizeForWidgets(data);
            }
            widget.lastUpdated = new Date().toISOString();
          }
        }
      });
  },
});

export const {
  openAddWidgetModal,
  closeAddWidgetModal,
  openSettingsModal,
  closeSettingsModal,
  openWidgetConfigModal,
  closeWidgetConfigModal,
  updateNewWidget,
  setApiFields,
  setApiTestResult,
  setApiTesting,
  addSelectedField,
  removeSelectedField,
  addWidget,
  removeWidget,
  updateWidget,
  updateWidgetData,
  reorderWidgets,
  toggleTheme,
  setTheme,
  setDraggedWidget,
  clearAllWidgets,
  setError,
  clearError,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
