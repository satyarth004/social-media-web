import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FiHome, FiLogOut, FiMoon, FiShield, FiSun, FiUser } from 'react-icons/fi';

import AuthPage from './pages/AuthPage';
import FeedPage from './pages/FeedPage';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';
import api from './services/api';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/auth" replace />;
}

function App() {
  const [dark, setDark] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => setUser(res.data.user))
        .catch(() => localStorage.removeItem('token'));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <BrowserRouter>
      <div className={`relative min-h-screen overflow-hidden ${dark ? 'bg-slate-950 text-slate-100' : 'bg-transparent text-slate-900'}`}>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(244,114,182,0.16),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(56,189,248,0.12),_transparent_24%)]" />
        <header className={`sticky top-0 z-20 border-b ${dark ? 'border-white/10 bg-slate-950/80' : 'border-slate-800 bg-slate-900/80'} backdrop-blur-2xl`}>
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 via-fuchsia-500 to-amber-400 text-lg font-black text-white shadow-[0_14px_40px_rgba(244,114,182,0.45)]">
                IG
              </div>
              <div>
                <h1 className="text-lg font-semibold tracking-tight">NovaGram</h1>
                <p className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Instagram-inspired social hub</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/70 px-2 py-1.5">
              <Link to="/" className="rounded-full px-3 py-2 text-sm font-medium transition-all hover:scale-105 hover:bg-slate-800">
                <span className="flex items-center gap-2"><FiHome /> Home</span>
              </Link>
              {user && (
                <>
                  <Link to="/profile" className="rounded-full px-3 py-2 text-sm font-medium transition-all hover:scale-105 hover:bg-slate-800">
                    <span className="flex items-center gap-2"><FiUser /> Profile</span>
                  </Link>
                  <Link to="/admin" className="rounded-full px-3 py-2 text-sm font-medium transition-all hover:scale-105 hover:bg-slate-800">
                    <span className="flex items-center gap-2"><FiShield /> Admin</span>
                  </Link>
                </>
              )}
              <button onClick={() => setDark(!dark)} className="rounded-full border border-white/10 p-2.5 transition-all hover:scale-105">
                {dark ? <FiSun /> : <FiMoon />}
              </button>
              {user && (
                <button onClick={logout} className="rounded-full border border-white/10 p-2.5 transition-all hover:scale-105" title="Logout">
                  <FiLogOut />
                </button>
              )}
            </div>
          </div>
        </header>

        <motion.main initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="relative mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/auth" element={<AuthPage setUser={setUser} />} />
            <Route path="/" element={<ProtectedRoute><FeedPage user={user} /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage user={user} /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </motion.main>
      </div>
    </BrowserRouter>
  );
}

export default App;
