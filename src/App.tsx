import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './hooks/useAuth';
import { ThemeProvider } from './hooks/useTheme';
import Login from './pages/Login';
import LinkCouple from './pages/LinkCouple';
import Dashboard from './pages/Dashboard';
import Rewards from './pages/Rewards';
import History from './pages/History';
import Profile from './pages/Profile';
import Achievements from './pages/Achievements';
import FairPlay from './pages/FairPlay';
import Statistics from './pages/Statistics';
import Calendar from './pages/Calendar';
import Onboarding from './pages/Onboarding';
import ResetPassword from './pages/ResetPassword';

function App() {

  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Toaster position="top-center" />
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/link" element={<LinkCouple />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/history" element={<History />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/fairplay" element={<FairPlay />} />
            <Route path="/calendario" element={<Calendar />} />
            <Route path="/statistics" element={<Statistics />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
