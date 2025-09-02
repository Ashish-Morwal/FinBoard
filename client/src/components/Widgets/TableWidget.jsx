import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import WidgetCard from '../Dashboard/WidgetCard';
import { refreshWidgetData } from '../../store/dashboardSlice';
import { formatCurrency } from '../../utils/formatters';

export default function TableWidget({ widget }) {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(refreshWidgetData(widget.id));
    }, widget.refreshInterval * 1000);

    // Initial load
    dispatch(refreshWidgetData(widget.id));

    return () => clearInterval(interval);
  }, [dispatch, widget.id, widget.refreshInterval]);

  useEffect(() => {
    if (widget.data && Array.isArray(widget.data)) {
      const filtered = widget.data.filter(row =>
        Object.values(row).some(value =>
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setFilteredData(filtered);
    }
  }, [widget.data, searchQuery]);

  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  const renderCellValue = (value, fieldPath) => {
    if (value === undefined || value === null) return 'N/A';
    
    if (fieldPath.toLowerCase().includes('price') || fieldPath.toLowerCase().includes('rate')) {
      return formatCurrency(value);
    }
    
    return String(value);
  };

  return (
    <WidgetCard widget={widget}>
      <div className="mb-4 flex items-center justify-between">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search table..." 
            className="bg-input border border-border rounded-lg px-3 py-1 text-sm w-48 pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-testid={`search-input-${widget.id}`}
          />
          <i className="fas fa-search absolute left-2.5 top-2 text-muted-foreground text-xs"></i>
        </div>
        <span className="text-xs text-muted-foreground" data-testid={`table-stats-${widget.id}`}>
          {filteredData.length} of {widget.data?.length || 0} items
        </span>
      </div>
      
      <div className="overflow-x-auto">
        {widget.selectedFields.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {widget.selectedFields.map((field, index) => (
                  <th key={index} className="text-left text-xs font-medium text-muted-foreground py-3 px-2">
                    {field.label}
                    <i className="fas fa-sort ml-1"></i>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                    {widget.selectedFields.map((field, fieldIndex) => (
                      <td key={fieldIndex} className="py-3 px-2 text-sm text-card-foreground">
                        {renderCellValue(getNestedValue(row, field.path), field.path)}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={widget.selectedFields.length} className="py-8 text-center text-muted-foreground">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">No fields selected for table display</p>
          </div>
        )}
      </div>
    </WidgetCard>
  );
}
