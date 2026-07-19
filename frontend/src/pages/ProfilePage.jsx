import { motion } from 'framer-motion';

export default function ProfilePage({ user }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
      <h2 className="text-2xl font-semibold">Profile</h2>
      <p className="mt-2 text-slate-400">Edit profile, upload media, and manage privacy from this panel.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-slate-800/80 p-4">
          <p className="text-sm text-slate-400">Full name</p>
          <p className="text-lg font-semibold">{user?.fullName || 'Your Name'}</p>
        </div>
        <div className="rounded-2xl bg-slate-800/80 p-4">
          <p className="text-sm text-slate-400">Username</p>
          <p className="text-lg font-semibold">{user?.username || 'username'}</p>
        </div>
      </div>
    </motion.div>
  );
}
