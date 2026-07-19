import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiCamera, FiHeart, FiMessageCircle, FiStar } from 'react-icons/fi';
import api from '../services/api';

export default function AuthPage({ setUser }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ username: '', email: '', password: '', fullName: '' });
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
    const res = await api.post(endpoint, form);
    if (mode === 'login') {
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      navigate('/');
    } else {
      alert('Registration successful. Use login now.');
      setMode('login');
    }
  };

  return (
    <div className="grid min-h-[76vh] items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-5">
        <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-slate-900/70 px-3 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.28)] backdrop-blur">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 via-fuchsia-500 to-amber-400 font-black text-white shadow-lg">IG</div>
          <span className="font-semibold text-slate-100">NovaGram</span>
        </div>
        <div className="space-y-3">
          <h2 className="text-4xl font-semibold tracking-tight text-slate-50 sm:text-5xl">Share your world, beautifully.</h2>
          <p className="max-w-xl text-lg text-slate-400">A polished Instagram-inspired home for posts, stories, reels, and close connections.</p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm text-slate-300">
          <span className="rounded-full border border-white/10 bg-slate-900/70 px-3 py-2 text-slate-300 shadow-[0_10px_30px_rgba(0,0,0,0.28)] backdrop-blur"><FiCamera className="mr-2 inline" />Photo stories</span>
          <span className="rounded-full border border-white/10 bg-slate-900/70 px-3 py-2 text-slate-300 shadow-[0_10px_30px_rgba(0,0,0,0.28)] backdrop-blur"><FiHeart className="mr-2 inline" />Engagement</span>
          <span className="rounded-full border border-white/10 bg-slate-900/70 px-3 py-2 text-slate-300 shadow-[0_10px_30px_rgba(0,0,0,0.28)] backdrop-blur"><FiMessageCircle className="mr-2 inline" />Real-time chats</span>
          <span className="rounded-full border border-white/10 bg-slate-900/70 px-3 py-2 text-slate-300 shadow-[0_10px_30px_rgba(0,0,0,0.28)] backdrop-blur"><FiStar className="mr-2 inline" />Premium feel</span>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="rounded-[32px] border border-white/10 bg-slate-900/80 p-8 shadow-[0_30px_100px_rgba(2,6,23,0.55)] backdrop-blur-2xl transition-all hover:-translate-y-1">
        <h3 className="mb-2 text-2xl font-semibold text-slate-50">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h3>
        <p className="mb-6 text-sm text-slate-400">Join the next generation of social storytelling.</p>
        <div className="mb-6 flex rounded-full bg-slate-800/80 p-1">
          <button className={`flex-1 rounded-full px-4 py-2 text-sm font-medium ${mode === 'login' ? 'bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white shadow-sm' : 'text-slate-400'}`} onClick={() => setMode('login')}>Login</button>
          <button className={`flex-1 rounded-full px-4 py-2 text-sm font-medium ${mode === 'register' ? 'bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white shadow-sm' : 'text-slate-400'}`} onClick={() => setMode('register')}>Register</button>
        </div>
        <form onSubmit={submit} className="space-y-3">
          {mode === 'register' && (
            <>
              <input className="w-full rounded-2xl border border-white/10 bg-slate-800/80 px-4 py-3 text-slate-100 outline-none focus:border-pink-400" placeholder="Full name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
              <input className="w-full rounded-2xl border border-white/10 bg-slate-800/80 px-4 py-3 text-slate-100 outline-none focus:border-pink-400" placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
            </>
          )}
          <input className="w-full rounded-2xl border border-white/10 bg-slate-800/80 px-4 py-3 text-slate-100 outline-none focus:border-pink-400" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="w-full rounded-2xl border border-white/10 bg-slate-800/80 px-4 py-3 text-slate-100 outline-none focus:border-pink-400" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <button className="w-full rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 px-4 py-3 font-semibold text-white shadow-lg">{mode === 'login' ? 'Sign In' : 'Create Account'}</button>
        </form>
      </motion.div>
    </div>
  );
}
