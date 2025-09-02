import { useDispatch } from 'react-redux';
import { openAddWidgetModal } from '../../store/dashboardSlice';

export default function AddWidgetPlaceholder({ isButton = false }) {
  const dispatch = useDispatch();

  const handleAddWidget = () => {
    dispatch(openAddWidgetModal());
  };

  if (isButton) {
    return (
      <button 
        className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center space-x-2"
        onClick={handleAddWidget}
        data-testid="button-add-first-widget"
      >
        <i className="fas fa-plus"></i>
        <span>Add Your First Widget</span>
      </button>
    );
  }

  return (
    <div 
      className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer" 
      onClick={handleAddWidget}
      data-testid="add-widget-placeholder"
    >
      <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-3">
        <i className="fas fa-plus text-primary text-lg"></i>
      </div>
      <h3 className="font-medium text-foreground mb-1">Add Widget</h3>
      <p className="text-sm text-muted-foreground">Connect to a finance API and create a custom widget</p>
    </div>
  );
}
