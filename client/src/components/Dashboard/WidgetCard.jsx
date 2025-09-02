import { useDispatch } from 'react-redux';
import { removeWidget, openWidgetConfigModal, refreshWidgetData } from '../../store/dashboardSlice';
import { formatTimeAgo } from '../../utils/formatters';

export default function WidgetCard({ widget, children }) {
  const dispatch = useDispatch();

  const handleRefresh = () => {
    dispatch(refreshWidgetData(widget.id));
  };

  const handleConfigure = () => {
    dispatch(openWidgetConfigModal(widget));
  };

  const handleRemove = () => {
    dispatch(removeWidget(widget.id));
  };

  return (
    <div className="widget-container bg-card rounded-xl p-6 border border-border shadow-lg" data-testid={`widget-card-${widget.id}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
            <i className="fas fa-chart-line text-primary-foreground text-xs"></i>
          </div>
          <h3 className="font-semibold text-card-foreground" data-testid={`widget-title-${widget.id}`}>
            {widget.name}
          </h3>
          <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
            {widget.refreshInterval}s
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            className="text-muted-foreground hover:text-foreground p-1"
            onClick={handleRefresh}
            title="Refresh"
            data-testid={`button-refresh-${widget.id}`}
          >
            <i className="fas fa-sync text-xs"></i>
          </button>
          <button 
            className="text-muted-foreground hover:text-foreground p-1"
            onClick={handleConfigure}
            title="Configure"
            data-testid={`button-configure-${widget.id}`}
          >
            <i className="fas fa-cog text-xs"></i>
          </button>
          <button 
            className="text-muted-foreground hover:text-destructive p-1"
            onClick={handleRemove}
            title="Remove"
            data-testid={`button-remove-${widget.id}`}
          >
            <i className="fas fa-times text-xs"></i>
          </button>
        </div>
      </div>
      
      {children}
      
      {widget.lastUpdated && (
        <div className="text-xs text-muted-foreground mt-3" data-testid={`widget-last-updated-${widget.id}`}>
          Last updated: {formatTimeAgo(widget.lastUpdated)}
        </div>
      )}
    </div>
  );
}
