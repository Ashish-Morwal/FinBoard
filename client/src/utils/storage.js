const STORAGE_KEYS = {
  DASHBOARD_CONFIG: 'finboard-dashboard-config',
  API_KEYS: 'finboard-api-keys',
  THEME: 'finboard-theme',
};

export const saveDashboardConfig = (config) => {
  try {
    localStorage.setItem(STORAGE_KEYS.DASHBOARD_CONFIG, JSON.stringify(config));
  } catch (error) {
    console.error('Failed to save dashboard config:', error);
  }
};

export const loadDashboardConfig = () => {
  try {
    const config = localStorage.getItem(STORAGE_KEYS.DASHBOARD_CONFIG);
    if (config) {
      return JSON.parse(config);
    }
  } catch (error) {
    console.error('Failed to load dashboard config:', error);
  }
  
  return {
    widgets: [],
    theme: 'dark',
  };
};

export const saveApiKeys = (apiKeys) => {
  try {
    localStorage.setItem(STORAGE_KEYS.API_KEYS, JSON.stringify(apiKeys));
  } catch (error) {
    console.error('Failed to save API keys:', error);
  }
};

export const loadApiKeys = () => {
  try {
    const apiKeys = localStorage.getItem(STORAGE_KEYS.API_KEYS);
    if (apiKeys) {
      return JSON.parse(apiKeys);
    }
  } catch (error) {
    console.error('Failed to load API keys:', error);
  }
  
  return {
    alphaVantage: '',
    finnhub: '',
  };
};

export const exportDashboardConfig = (config) => {
  const dataStr = JSON.stringify(config, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = `finboard-config-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  
  URL.revokeObjectURL(link.href);
};

export const importDashboardConfig = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target.result);
        saveDashboardConfig(config);
        resolve(config);
      } catch (error) {
        reject(new Error('Invalid configuration file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
};

export const clearAllData = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Failed to clear storage:', error);
  }
};
