import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import WidgetCard from '../Dashboard/WidgetCard';
import { refreshWidgetData } from '../../store/dashboardSlice';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

export default function WatchlistWidget({ widget }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(refreshWidgetData(widget.id));
    }, widget.refreshInterval * 1000);

    // Initial load
    dispatch(refreshWidgetData(widget.id));

    return () => clearInterval(interval);
  }, [dispatch, widget.id, widget.refreshInterval]);

  const renderWatchlistItems = () => {
    if (!widget.data || !Array.isArray(widget.data)) {
      return (
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">No watchlist data available</p>
        </div>
      );
    }

    return widget.data.slice(0, 5).map((item, index) => (
      <div key={index} className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
        <div>
          <div className="font-medium text-card-foreground text-sm" data-testid={`watchlist-symbol-${index}`}>
            {item.symbol || `Item ${index + 1}`}
          </div>
          <div className="text-xs text-muted-foreground">
            {item.name || item.description || 'No description'}
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono text-card-foreground text-sm" data-testid={`watchlist-price-${index}`}>
            {formatCurrency(item.price || item.value || 0)}
          </div>
          <div className={`text-xs flex items-center ${
            (item.change || 0) >= 0 ? 'text-chart-1' : 'text-destructive'
          }`}>
            <i className={`fas ${(item.change || 0) >= 0 ? 'fa-arrow-up' : 'fa-arrow-down'} text-xs mr-1`}></i>
            {formatPercentage(item.changePercent || item.change || 0)}
          </div>
        </div>
      </div>
    ));
  };

  return (
    <WidgetCard widget={widget}>
      <div className="space-y-3" data-testid={`watchlist-items-${widget.id}`}>
        {renderWatchlistItems()}
      </div>
    </WidgetCard>
  );
}
