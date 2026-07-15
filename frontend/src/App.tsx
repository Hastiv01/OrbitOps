import { Route, Routes } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import { NotificationContainer } from './components/common/index';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import MissionPlanning from './pages/MissionPlanning';
import MissionScheduler from './pages/MissionScheduler';
import ConstraintOptimization from './pages/ConstraintOptimization';
import SatelliteOperations from './pages/SatelliteOperations';
import GroundStationPlanner from './pages/GroundStationPlanner';
import PayloadPlanner from './pages/PayloadPlanner';
import Resources from './pages/Resources';
import Recommendations from './pages/Recommendations';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';
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
          <Route path="/scheduler" element={<MissionScheduler />} />
          <Route path="/optimization" element={<ConstraintOptimization />} />
          <Route path="/operations" element={<SatelliteOperations />} />
          <Route path="/ground-stations" element={<GroundStationPlanner />} />
          <Route path="/payloads" element={<PayloadPlanner />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MainLayout>
      <NotificationContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
}

import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;