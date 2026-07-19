import { motion } from 'framer-motion';

export default function AdminPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
      <h2 className="text-2xl font-semibold">Admin Panel</h2>
      <p className="mt-2 text-slate-400">Manage users, posts, reports, analytics, and moderation tools.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-slate-800/80 p-4">Users</div>
        <div className="rounded-2xl bg-slate-800/80 p-4">Posts</div>
        <div className="rounded-2xl bg-slate-800/80 p-4">Reports</div>
      </div>
    </motion.div>
  );
}
