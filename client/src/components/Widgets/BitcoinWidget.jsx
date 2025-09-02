import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import WidgetCard from '../Dashboard/WidgetCard';
import { refreshWidgetData } from '../../store/dashboardSlice';
import { formatCurrency } from '../../utils/formatters';

export default function BitcoinWidget({ widget }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(refreshWidgetData(widget.id));
    }, widget.refreshInterval * 1000);

    // Initial load
    dispatch(refreshWidgetData(widget.id));

    return () => clearInterval(interval);
  }, [dispatch, widget.id, widget.refreshInterval]);

  const renderFieldValue = (field) => {
    if (!widget.data) return 'Loading...';
    
    // Debug logging
    console.log('Widget data:', widget.data);
    console.log('Field path:', field.path);
    
    const value = getNestedValue(widget.data, field.path);
    
    console.log('Extracted value:', value);
    
    if (value === undefined || value === null) return 'N/A';
    
    // Format based on field type
    if (field.path.toLowerCase().includes('price') || field.path.toLowerCase().includes('rate')) {
      return formatCurrency(value);
    }
    
    return String(value);
  };

  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  return (
    <WidgetCard widget={widget}>
      <div className="space-y-3">
        {widget.selectedFields.map((field, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">{field.label}</span>
            <span className="font-mono text-card-foreground" data-testid={`field-value-${field.path}`}>
              {renderFieldValue(field)}
            </span>
          </div>
        ))}
        
        {widget.selectedFields.length === 0 && (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">No fields selected</p>
          </div>
        )}
      </div>
    </WidgetCard>
  );
}
