import { Route, Routes } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import { NotificationContainer } from './components/common/index';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import MissionPlanning from './pages/MissionPlanning';
import SatelliteOperations from './pages/SatelliteOperations';
import Resources from './pages/Resources';
import Recommendations from './pages/Recommendations';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

function AppContent() {
  const { toasts, removeToast } = useAppContext();

  return (
    <>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/missions" element={<MissionPlanning />} />
          <Route path="/operations" element={<SatelliteOperations />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MainLayout>
      <NotificationContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
