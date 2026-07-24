import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './components/Home';
import TriggerDeadzone from './components/TriggerDeadzone';
import Mapping from './components/Mapping';
import ButtonMapping from './components/ButtonMapping';
import ReflexRange from './components/ReflexRange';
import GeneralSettings from './components/GeneralSettings';

export default function App() {
  // Initialize app session - run once on app load
  useEffect(() => {
    // Check if this is a fresh session (new open) or active session (navigation)
    const isActiveSession = sessionStorage.getItem('appInitialized');

    if (!isActiveSession) {
      // Fresh session - reset to G HUB profile if currently on onboard
      const currentPreset = localStorage.getItem('currentPreset');
      const isOnboard = currentPreset && ['p1', 'p2', 'p3'].includes(currentPreset);

      if (!currentPreset || isOnboard) {
        // Reset to default G HUB profile
        localStorage.setItem('currentPreset', 'desktop');
      }

      // Mark session as initialized
      sessionStorage.setItem('appInitialized', 'true');
    }
    // If active session, do nothing - respect current profile
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mapping" element={<ButtonMapping />} />
        <Route path="/sticks" element={<Mapping />} />
        <Route path="/triggers" element={<TriggerDeadzone />} />
        <Route path="/reflex-range" element={<ReflexRange />} />
        <Route path="/general-settings" element={<GeneralSettings />} />
      </Routes>
    </BrowserRouter>
  );
}
