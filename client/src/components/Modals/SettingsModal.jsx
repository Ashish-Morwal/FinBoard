import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeSettingsModal, toggleTheme, clearAllWidgets } from '../../store/dashboardSlice';
import { updateApiKeys, loadSettings } from '../../store/settingsSlice';
import { exportDashboardConfig, importDashboardConfig } from '../../utils/storage';
import { useToast } from '../../hooks/use-toast';

export default function SettingsModal() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { modals, theme, widgets } = useSelector((state) => state.dashboard);
  const { apiKeys } = useSelector((state) => state.settings);
  
  const [localApiKeys, setLocalApiKeys] = useState({
    alphaVantage: '',
    finnhub: '',
  });

  const isOpen = modals.settings.isOpen;

  useEffect(() => {
    if (isOpen) {
      dispatch(loadSettings());
    }
  }, [isOpen, dispatch]);

  useEffect(() => {
    setLocalApiKeys(apiKeys);
  }, [apiKeys]);

  const handleCloseModal = () => {
    dispatch(closeSettingsModal());
  };

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const handleApiKeyChange = (provider, value) => {
    setLocalApiKeys(prev => ({
      ...prev,
      [provider]: value
    }));
  };

  const handleSaveSettings = () => {
    dispatch(updateApiKeys(localApiKeys));
    toast({
      title: "Success",
      description: "Settings saved successfully!",
    });
    handleCloseModal();
  };

  const handleExportDashboard = () => {
    try {
      exportDashboardConfig({ widgets, theme });
      toast({
        title: "Success",
        description: "Dashboard configuration exported successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export dashboard configuration",
        variant: "destructive",
      });
    }
  };

  const handleImportDashboard = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      try {
        const file = e.target.files[0];
        if (file) {
          const config = await importDashboardConfig(file);
          // This would trigger a dashboard reload
          window.location.reload();
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to import dashboard configuration",
          variant: "destructive",
        });
      }
    };
    input.click();
  };

  const handleClearDashboard = () => {
    if (window.confirm('Are you sure you want to clear all widgets? This action cannot be undone.')) {
      dispatch(clearAllWidgets());
      toast({
        title: "Success",
        description: "All widgets cleared successfully!",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 modal-backdrop flex items-center justify-center z-50" data-testid="settings-modal">
      <div className="bg-popover border border-border rounded-xl shadow-2xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-popover-foreground">Settings</h2>
          <button 
            className="text-muted-foreground hover:text-foreground p-1"
            onClick={handleCloseModal}
            data-testid="button-close-settings"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Theme Toggle */}
          <div>
            <label className="text-sm font-medium text-popover-foreground mb-3 block">Appearance</label>
            <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <i className={`fas ${theme === 'dark' ? 'fa-moon' : 'fa-sun'} text-muted-foreground`}></i>
                <span className="text-sm text-popover-foreground">Dark Mode</span>
              </div>
              <button 
                className={`relative w-11 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring ${
                  theme === 'dark' ? 'bg-primary' : 'bg-secondary'
                }`}
                onClick={handleToggleTheme}
                data-testid="toggle-theme"
              >
                <div className={`absolute top-1 w-4 h-4 bg-primary-foreground rounded-full transition-transform ${
                  theme === 'dark' ? 'right-1' : 'left-1'
                }`}></div>
              </button>
            </div>
          </div>
          
          {/* API Configuration */}
          <div>
            <label className="text-sm font-medium text-popover-foreground mb-3 block">API Configuration</label>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Alpha Vantage API Key</label>
                <input 
                  type="password" 
                  placeholder="Enter your API key"
                  className="w-full bg-input border border-border rounded-lg px-3 py-2 text-popover-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  value={localApiKeys.alphaVantage}
                  onChange={(e) => handleApiKeyChange('alphaVantage', e.target.value)}
                  data-testid="input-alpha-vantage-key"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Finnhub API Key</label>
                <input 
                  type="password" 
                  placeholder="Enter your API key"
                  className="w-full bg-input border border-border rounded-lg px-3 py-2 text-popover-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  value={localApiKeys.finnhub}
                  onChange={(e) => handleApiKeyChange('finnhub', e.target.value)}
                  data-testid="input-finnhub-key"
                />
              </div>
            </div>
          </div>
          
          {/* Dashboard Management */}
          <div>
            <label className="text-sm font-medium text-popover-foreground mb-3 block">Dashboard Management</label>
            <div className="space-y-2">
              <button 
                className="w-full bg-secondary text-secondary-foreground py-2 px-3 rounded-lg hover:bg-accent transition-colors text-sm text-left"
                onClick={handleExportDashboard}
                data-testid="button-export-dashboard"
              >
                <i className="fas fa-download mr-2"></i>
                Export Dashboard Configuration
              </button>
              <button 
                className="w-full bg-secondary text-secondary-foreground py-2 px-3 rounded-lg hover:bg-accent transition-colors text-sm text-left"
                onClick={handleImportDashboard}
                data-testid="button-import-dashboard"
              >
                <i className="fas fa-upload mr-2"></i>
                Import Dashboard Configuration
              </button>
              <button 
                className="w-full bg-destructive/20 text-destructive py-2 px-3 rounded-lg hover:bg-destructive/30 transition-colors text-sm text-left"
                onClick={handleClearDashboard}
                data-testid="button-clear-dashboard"
              >
                <i className="fas fa-trash mr-2"></i>
                Clear All Widgets
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 p-6 border-t border-border">
          <button 
            type="button"
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-accent transition-colors"
            onClick={handleCloseModal}
            data-testid="button-cancel-settings"
          >
            Cancel
          </button>
          <button 
            type="button"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            onClick={handleSaveSettings}
            data-testid="button-save-settings"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
