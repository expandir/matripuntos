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
import Chat from './pages/Chat';

function App() {
  console.log('App component rendering');

  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
            <Toaster position="top-center" />
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/link" element={<LinkCouple />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/rewards" element={<Rewards />} />
              <Route path="/history" element={<History />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/chat" element={<Chat />} />
            </Routes>
          </div>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
