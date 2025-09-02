import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeWidgetConfigModal, updateWidget } from '../../store/dashboardSlice';
import { useToast } from '../../hooks/use-toast';

export default function WidgetConfigModal() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { modals } = useSelector((state) => state.dashboard);
  
  const { isOpen, widget } = modals.widgetConfig;
  
  const [configData, setConfigData] = useState({
    name: '',
    refreshInterval: 30,
    size: 'medium',
  });

  useEffect(() => {
    if (isOpen && widget) {
      setConfigData({
        name: widget.name,
        refreshInterval: widget.refreshInterval,
        size: widget.size,
      });
    }
  }, [isOpen, widget]);

  const handleCloseModal = () => {
    dispatch(closeWidgetConfigModal());
  };

  const handleInputChange = (field, value) => {
    setConfigData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveConfig = () => {
    if (!configData.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a widget name",
        variant: "destructive",
      });
      return;
    }

    dispatch(updateWidget({
      id: widget.id,
      updates: configData,
    }));

    toast({
      title: "Success",
      description: "Widget configuration updated successfully!",
    });

    handleCloseModal();
  };

  if (!isOpen || !widget) return null;

  return (
    <div className="fixed inset-0 bg-black/50 modal-backdrop flex items-center justify-center z-50" data-testid="widget-config-modal">
      <div className="bg-popover border border-border rounded-xl shadow-2xl w-full max-w-lg mx-4">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-popover-foreground">Configure Widget</h2>
          <button 
            className="text-muted-foreground hover:text-foreground p-1"
            onClick={handleCloseModal}
            data-testid="button-close-config"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-popover-foreground mb-2 block">Widget Title</label>
            <input 
              type="text" 
              className="w-full bg-input border border-border rounded-lg px-3 py-2 text-popover-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              value={configData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              data-testid="input-widget-title"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-popover-foreground mb-2 block">Refresh Interval (seconds)</label>
            <input 
              type="number" 
              min="30"
              className="w-full bg-input border border-border rounded-lg px-3 py-2 text-popover-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              value={configData.refreshInterval}
              onChange={(e) => handleInputChange('refreshInterval', parseInt(e.target.value) || 30)}
              data-testid="input-widget-interval"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-popover-foreground mb-2 block">Widget Size</label>
            <select 
              className="w-full bg-input border border-border rounded-lg px-3 py-2 text-popover-foreground focus:outline-none focus:ring-2 focus:ring-ring" 
              value={configData.size}
              onChange={(e) => handleInputChange('size', e.target.value)}
              data-testid="select-widget-size"
            >
              <option value="small">Small (1 column)</option>
              <option value="medium">Medium (2 columns)</option>
              <option value="large">Large (3 columns)</option>
              <option value="full">Full Width</option>
            </select>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 p-6 border-t border-border">
          <button 
            type="button"
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-accent transition-colors"
            onClick={handleCloseModal}
            data-testid="button-cancel-config"
          >
            Cancel
          </button>
          <button 
            type="button"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            onClick={handleSaveConfig}
            data-testid="button-save-config"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
