import { useDispatch, useSelector } from 'react-redux';
import { 
  openAddWidgetModal, 
  openSettingsModal, 
  toggleTheme 
} from '../../store/dashboardSlice';

export default function Header() {
  const dispatch = useDispatch();
  const { widgets, theme } = useSelector((state) => state.dashboard);

  const handleAddWidget = () => {
    dispatch(openAddWidgetModal());
  };

  const handleOpenSettings = () => {
    dispatch(openSettingsModal());
  };

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  return (
    <header className="border-b border-border bg-card" data-testid="dashboard-header">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <i className="fas fa-chart-line text-primary-foreground text-sm"></i>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Finance Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                <span data-testid="widget-count">{widgets.length}</span> active widgets • Real-time data
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <button 
              className="p-2 rounded-lg bg-secondary hover:bg-accent transition-colors"
              onClick={handleToggleTheme}
              title="Toggle theme"
              data-testid="button-toggle-theme"
            >
              <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'} text-secondary-foreground`}></i>
            </button>
            
            {/* Settings */}
            <button 
              className="p-2 rounded-lg bg-secondary hover:bg-accent transition-colors"
              onClick={handleOpenSettings}
              title="Settings"
              data-testid="button-settings"
            >
              <i className="fas fa-cog text-secondary-foreground"></i>
            </button>
            
            {/* Add Widget Button */}
            <button 
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
              onClick={handleAddWidget}
              data-testid="button-add-widget"
            >
              <i className="fas fa-plus text-sm"></i>
              <span>Add Widget</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
