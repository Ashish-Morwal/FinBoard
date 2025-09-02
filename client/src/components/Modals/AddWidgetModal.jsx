import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  closeAddWidgetModal,
  updateNewWidget,
  setApiFields,
  setApiTestResult,
  setApiTesting,
  addSelectedField,
  removeSelectedField,
  addWidget,
} from '../../store/dashboardSlice';
import { testApiConnection, extractFieldsFromResponse } from '../../utils/apiService';
import { useToast } from '../../hooks/use-toast';

export default function AddWidgetModal() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { modals } = useSelector((state) => state.dashboard);
  const settings = useSelector((state) => state.settings);
  
  const { isOpen, newWidget, apiFields, isTestingApi, apiTestResult } = modals.addWidget;
  
  const [fieldSearch, setFieldSearch] = useState('');
  const [showArraysOnly, setShowArraysOnly] = useState(false);
  const [displayMode, setDisplayMode] = useState('card');

  const filteredFields = apiFields.filter(field => {
    const matchesSearch = field.path.toLowerCase().includes(fieldSearch.toLowerCase());
    const matchesArrayFilter = !showArraysOnly || field.isArray;
    return matchesSearch && matchesArrayFilter;
  });

  const handleCloseModal = () => {
    dispatch(closeAddWidgetModal());
  };

  const handleInputChange = (field, value) => {
    dispatch(updateNewWidget({ [field]: value }));
  };

  const handleTestApi = async () => {
    if (!newWidget.apiUrl) {
      toast({
        title: "Error",
        description: "Please enter an API URL first",
        variant: "destructive",
      });
      return;
    }

    dispatch(setApiTesting(true));
    dispatch(setApiTestResult(null));

    try {
      const response = await testApiConnection(newWidget.apiUrl, settings.apiKeys);
      const fields = extractFieldsFromResponse(response);
      
      dispatch(setApiFields(fields));
      dispatch(setApiTestResult({
        success: true,
        message: `API connection successful! ${fields.length} top-level fields found.`,
      }));
      
      toast({
        title: "Success",
        description: "API connection successful!",
      });
    } catch (error) {
      dispatch(setApiTestResult({
        success: false,
        message: `Failed to connect: ${error.message}`,
      }));
      
      toast({
        title: "Error",
        description: `Failed to connect to API: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      dispatch(setApiTesting(false));
    }
  };

  const handleAddField = (field) => {
    dispatch(addSelectedField({
      path: field.path,
      label: field.path.split('.').pop(),
      type: field.type,
    }));
  };

  const handleRemoveField = (fieldPath) => {
    dispatch(removeSelectedField(fieldPath));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!newWidget.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a widget name",
        variant: "destructive",
      });
      return;
    }

    if (!newWidget.apiUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter an API URL",
        variant: "destructive",
      });
      return;
    }

    if (newWidget.selectedFields.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one field to display",
        variant: "destructive",
      });
      return;
    }

    dispatch(addWidget({
      ...newWidget,
      type: displayMode,
    }));

    toast({
      title: "Success",
      description: "Widget added successfully!",
    });

    handleCloseModal();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 modal-backdrop flex items-center justify-center z-50" data-testid="add-widget-modal">
      <div className="bg-popover border border-border rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-border flex-shrink-0">
          <h2 className="text-lg font-semibold text-popover-foreground">Add New Widget</h2>
          <button 
            className="text-muted-foreground hover:text-foreground p-1"
            onClick={handleCloseModal}
            data-testid="button-close-modal"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-grow">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Widget Name */}
            <div>
              <label className="text-sm font-medium text-popover-foreground mb-2 block">Widget Name</label>
              <input 
                type="text" 
                placeholder="e.g., Bitcoin Price Tracker"
                className="w-full bg-input border border-border rounded-lg px-3 py-2 text-popover-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                value={newWidget.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                data-testid="input-widget-name"
              />
            </div>
            
            {/* API URL */}
            <div>
              <label className="text-sm font-medium text-popover-foreground mb-2 block">API URL</label>
              <div className="flex space-x-2">
                <input 
                  type="url" 
                  placeholder="e.g., https://api.coinbase.com/v2/exchange-rates?currency=BTC"
                  className="flex-1 bg-input border border-border rounded-lg px-3 py-2 text-popover-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  value={newWidget.apiUrl}
                  onChange={(e) => handleInputChange('apiUrl', e.target.value)}
                  data-testid="input-api-url"
                />
                <button 
                  type="button"
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
                  onClick={handleTestApi}
                  disabled={isTestingApi}
                  data-testid="button-test-api"
                >
                  {isTestingApi ? (
                    <>
                      <i className="fas fa-spinner animate-spin text-sm"></i>
                      <span>Testing...</span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-vial text-sm"></i>
                      <span>Test</span>
                    </>
                  )}
                </button>
              </div>
              
              {/* API Test Result */}
              {apiTestResult && (
                <div className={`mt-2 flex items-center space-x-2 text-xs border rounded-lg px-3 py-2 ${
                  apiTestResult.success 
                    ? 'text-chart-1 bg-chart-1/10 border-chart-1/20' 
                    : 'text-destructive bg-destructive/10 border-destructive/20'
                }`}>
                  <i className={`fas ${apiTestResult.success ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
                  <span>{apiTestResult.message}</span>
                </div>
              )}
            </div>
            
            {/* Refresh Interval */}
            <div>
              <label className="text-sm font-medium text-popover-foreground mb-2 block">Refresh Interval (seconds)</label>
              <input 
                type="number" 
                min="30" 
                placeholder="30"
                className="w-full bg-input border border-border rounded-lg px-3 py-2 text-popover-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                value={newWidget.refreshInterval}
                onChange={(e) => handleInputChange('refreshInterval', parseInt(e.target.value) || 30)}
                data-testid="input-refresh-interval"
              />
            </div>
            
            {/* Display Mode Selection */}
            {apiFields.length > 0 && (
              <div>
                <label className="text-sm font-medium text-popover-foreground mb-3 block">Select Fields to Display</label>
                <div className="mb-4">
                  <label className="text-xs text-muted-foreground mb-2 block">Display Mode</label>
                  <div className="flex space-x-2">
                    {[
                      { id: 'card', icon: 'fa-id-card', label: 'Card' },
                      { id: 'table', icon: 'fa-table', label: 'Table' },
                      { id: 'chart', icon: 'fa-chart-line', label: 'Chart' },
                      { id: 'watchlist', icon: 'fa-star', label: 'Watchlist' },
                    ].map((mode) => (
                      <button 
                        key={mode.id}
                        type="button"
                        className={`px-3 py-1 rounded text-xs transition-colors ${
                          displayMode === mode.id 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-secondary text-secondary-foreground hover:bg-accent'
                        }`}
                        onClick={() => setDisplayMode(mode.id)}
                        data-testid={`button-display-mode-${mode.id}`}
                      >
                        <i className={`fas ${mode.icon} mr-1`}></i>
                        {mode.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Field Search */}
                <div className="mb-3">
                  <label className="text-xs text-muted-foreground mb-2 block">Search Fields</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Search for fields..."
                      className="w-full bg-input border border-border rounded-lg px-3 py-2 pl-8 text-popover-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                      value={fieldSearch}
                      onChange={(e) => setFieldSearch(e.target.value)}
                      data-testid="input-field-search"
                    />
                    <i className="fas fa-search absolute left-2.5 top-2.5 text-muted-foreground text-xs"></i>
                  </div>
                </div>
                
                {/* Field Options */}
                <div className="mb-3">
                  <label className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <input 
                      type="checkbox" 
                      className="rounded text-primary focus:ring-ring" 
                      checked={showArraysOnly}
                      onChange={(e) => setShowArraysOnly(e.target.checked)}
                      data-testid="checkbox-arrays-only"
                    />
                    <span>Show arrays only (for table view)</span>
                  </label>
                </div>
                
                {/* Available Fields */}
                <div className="mb-4">
                  <label className="text-xs text-muted-foreground mb-2 block">Available Fields</label>
                  <div className="bg-secondary/30 rounded-lg p-3 max-h-48 overflow-y-auto space-y-2">
                    {filteredFields.length > 0 ? (
                      filteredFields.map((field, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-input rounded border border-border hover:bg-accent/50 transition-colors">
                          <div className="flex-1">
                            <div className="text-sm text-popover-foreground font-mono">{field.path}</div>
                            <div className="text-xs text-muted-foreground">{field.type} | {String(field.value).substring(0, 50)}</div>
                          </div>
                          <button 
                            type="button"
                            className="text-primary hover:text-primary/80 p-1"
                            onClick={() => handleAddField(field)}
                            title="Add field"
                            data-testid={`button-add-field-${index}`}
                          >
                            <i className="fas fa-plus text-xs"></i>
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        {apiFields.length === 0 ? 'Test API connection to see available fields' : 'No fields match your search'}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Selected Fields */}
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">Selected Fields</label>
                  <div className="space-y-2">
                    {newWidget.selectedFields.length > 0 ? (
                      newWidget.selectedFields.map((field, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-primary/10 border border-primary/20 rounded-lg">
                          <span className="text-sm font-mono text-popover-foreground">{field.label}</span>
                          <button 
                            type="button"
                            className="text-destructive hover:text-destructive/80 p-1"
                            onClick={() => handleRemoveField(field.path)}
                            title="Remove field"
                            data-testid={`button-remove-field-${index}`}
                          >
                            <i className="fas fa-times text-xs"></i>
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">No fields selected</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
        
        {/* Modal Actions - Fixed at bottom */}
        <div className="flex justify-end space-x-3 p-6 border-t border-border flex-shrink-0">
          <button 
            type="button"
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-accent transition-colors"
            onClick={handleCloseModal}
            data-testid="button-cancel"
          >
            Cancel
          </button>
          <button 
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            data-testid="button-add-widget"
          >
            Add Widget
          </button>
        </div>
      </div>
    </div>
  );
}
