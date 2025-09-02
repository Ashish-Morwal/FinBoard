import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../components/Layout/Header';
import DashboardGrid from '../components/Dashboard/DashboardGrid';
import AddWidgetModal from '../components/Modals/AddWidgetModal';
import SettingsModal from '../components/Modals/SettingsModal';
import WidgetConfigModal from '../components/Modals/WidgetConfigModal';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { loadDashboardConfig } from '../store/dashboardSlice';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { widgets, isLoading } = useSelector((state) => state.dashboard);
  const { modals } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(loadDashboardConfig());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner />
          </div>
        ) : (
          <DashboardGrid />
        )}
      </main>

      {/* Modals */}
      {modals.addWidget.isOpen && <AddWidgetModal />}
      {modals.settings.isOpen && <SettingsModal />}
      {modals.widgetConfig.isOpen && <WidgetConfigModal />}
    </div>
  );
}
