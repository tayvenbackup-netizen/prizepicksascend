import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, Loader2, AlertCircle, CheckCircle2, Eye, EyeOff, Trophy, ShieldOff, X } from 'lucide-react';

interface Props { onValidate: (key: string) => Promise<boolean>; error: string; }

const API_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/validate-key`;

const KeyEntryScreen = ({ onValidate, error }: Props) => {
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMsg, setResetMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim() || loading) return;
    setLoading(true);
    const ok = await onValidate(key);
    if (ok) { setSuccess(true); await new Promise(r => setTimeout(r, 600)); }
    setLoading(false);
  };

  const handleResetDevice = async () => {
    if (!resetToken.trim() || resetLoading) return;
    setResetLoading(true);
    setResetMsg(null);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({ action: 'reset_master_device', reset_token: resetToken.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (data?.success) {
        setResetMsg({ type: 'ok', text: 'Device lock cleared. You can now sign in on this device.' });
        setResetToken('');
        setTimeout(() => setResetOpen(false), 1500);
      } else {
        setResetMsg({ type: 'err', text: data?.error || 'Reset failed' });
      }
    } catch {
      setResetMsg({ type: 'err', text: 'Connection error' });
    }
    setResetLoading(false);
  };

  const blockKeys = (e: React.KeyboardEvent) => {
    if (e.key === 'F12') e.preventDefault();
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) e.preventDefault();
  };

  return (
    <div
      onKeyDown={blockKeys}
      onContextMenu={(e) => e.preventDefault()}
      className="fixed inset-0 z-[9999] flex items-center justify-center px-4 overflow-hidden select-none"
      style={{ background: 'radial-gradient(circle at 30% 0%, #1a1530 0%, #0a0a14 60%, #050509 100%)', color: '#fff' }}
    >
      <div aria-hidden className="pointer-events-none absolute" style={{ top: '-167px', right: '-140px', width: '440px', height: '447px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(140,107,250,0.22) 0%, rgba(140,107,250,0) 70%)', filter: 'blur(20px)' }} />
      <div aria-hidden className="pointer-events-none absolute" style={{ bottom: '-160px', left: '-120px', width: '380px', height: '380px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(108,92,231,0.14) 0%, rgba(108,92,231,0) 70%)', filter: 'blur(20px)' }} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative w-full max-w-sm">
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, duration: 0.5 }} className="flex items-center justify-center gap-2 mb-5">
          <span className="h-px w-8" style={{ background: 'linear-gradient(to right, transparent, #4a4566)' }} />
          <span className="text-[10px] font-bold uppercase" style={{ color: '#bbaefc', letterSpacing: '0.36em' }}>Ascend2k LarpPickz</span>
          <span className="h-px w-8" style={{ background: 'linear-gradient(to left, transparent, #4a4566)' }} />
        </motion.div>

        <div className="text-center mb-8">
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ delay: 0.1, type: 'spring', stiffness: 200 }} className="relative w-24 h-24 mx-auto mb-4">
            <motion.div aria-hidden className="absolute inset-0 rounded-2xl"
              style={{ background: 'radial-gradient(circle, rgba(187,174,252,0.55) 0%, rgba(187,174,252,0) 70%)', filter: 'blur(14px)' }}
              animate={{ opacity: [0.45, 0.85, 0.45], scale: [1, 1.08, 1] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }} />
            <div className="absolute inset-0 flex items-center justify-center rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(187,174,252,0.18), rgba(120,90,220,0.06))', border: '1px solid rgba(187,174,252,0.25)' }}>
              <Trophy className="w-10 h-10" style={{ color: '#bbaefc' }} />
            </div>
          </motion.div>
          <h1 className="text-2xl font-bold mb-1 tracking-tight">Ascend2k LarpPickz</h1>
          <p className="text-sm" style={{ color: '#8d87a8' }}>Enter your access key to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={key}
              onChange={e => setKey(e.target.value)}
              placeholder="Enter your key..."
              disabled={loading || success}
              autoComplete="off"
              spellCheck={false}
              className="w-full h-12 px-4 pr-11 rounded-lg text-sm focus:outline-none transition-colors disabled:opacity-50"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(187,174,252,0.25)', color: '#fff' }}
              autoFocus
            />
            <button type="button" onClick={() => setShowKey(!showKey)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#8d87a8' }}>
              {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <AnimatePresence>
            {error && !success && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex items-center gap-2 text-xs px-1" style={{ color: '#ff7a7a' }}>
                <AlertCircle className="w-3.5 h-3.5 shrink-0" /><span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button type="submit" disabled={!key.trim() || loading || success} whileTap={{ scale: 0.97 }}
            className="w-full h-12 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 text-white disabled:opacity-40"
            style={{ background: success ? '#16a34a' : 'linear-gradient(135deg, #6c5ce7, #8b6cf3)' }}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" />
              : success ? (<><CheckCircle2 className="w-4 h-4" /> Access Granted</>)
              : (<><KeyRound className="w-4 h-4" /> Unlock</>)}
          </motion.button>
        </form>

        <p className="text-center text-[11px] mt-6 leading-relaxed" style={{ color: '#6e6889' }}>
          Don't have a key? Contact <span style={{ color: '#bbaefc' }}>@Ascend2k</span> on Telegram.
        </p>

        {error?.toLowerCase().includes('locked to another device') && (
          <button
            type="button"
            onClick={() => { setResetOpen(true); setResetMsg(null); }}
            className="mt-3 w-full text-[11px] flex items-center justify-center gap-1.5 py-2 rounded-md transition-colors"
            style={{ color: '#bbaefc', background: 'rgba(187,174,252,0.06)', border: '1px solid rgba(187,174,252,0.18)' }}
          >
            <ShieldOff className="w-3.5 h-3.5" /> Reset device lock (owner only)
          </button>
        )}

        <button
          type="button"
          onClick={() => { setResetOpen(true); setResetMsg(null); }}
          className="block mx-auto mt-3 text-[10px] underline-offset-2 hover:underline"
          style={{ color: '#4a4566' }}
        >
          Owner device reset
        </button>


        <div className="flex items-center justify-center gap-1.5 mt-8">
          <div className="w-1 h-1 rounded-full" style={{ background: '#bbaefc' }} />
          <span className="text-[9px] font-semibold uppercase" style={{ color: '#6e6889', letterSpacing: '0.32em' }}>Powered by Ascend2k</span>
          <div className="w-1 h-1 rounded-full" style={{ background: '#bbaefc' }} />
        </div>
      </motion.div>

      <AnimatePresence>
        {resetOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center px-4"
            style={{ background: 'rgba(0,0,0,0.7)' }}
            onClick={() => !resetLoading && setResetOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm rounded-xl p-5"
              style={{ background: '#15101f', border: '1px solid rgba(187,174,252,0.2)' }}
            >
              <button
                type="button"
                onClick={() => !resetLoading && setResetOpen(false)}
                className="absolute right-3 top-3"
                style={{ color: '#6e6889' }}
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2 mb-3">
                <ShieldOff className="w-4 h-4" style={{ color: '#bbaefc' }} />
                <h2 className="text-sm font-semibold text-white">Reset master device lock</h2>
              </div>
              <p className="text-[11px] mb-4 leading-relaxed" style={{ color: '#8d87a8' }}>
                Enter the master reset token to unbind the master key from its current device. This also signs out all admin sessions.
              </p>
              <input
                type="password"
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                placeholder="MASTER_RESET_TOKEN"
                disabled={resetLoading}
                autoComplete="off"
                spellCheck={false}
                className="w-full h-10 px-3 rounded-md text-sm focus:outline-none disabled:opacity-50"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(187,174,252,0.25)', color: '#fff' }}
              />
              {resetMsg && (
                <div
                  className="mt-3 flex items-start gap-1.5 text-[11px]"
                  style={{ color: resetMsg.type === 'ok' ? '#86efac' : '#ff7a7a' }}
                >
                  {resetMsg.type === 'ok'
                    ? <CheckCircle2 className="w-3.5 h-3.5 mt-px shrink-0" />
                    : <AlertCircle className="w-3.5 h-3.5 mt-px shrink-0" />}
                  <span>{resetMsg.text}</span>
                </div>
              )}
              <button
                type="button"
                onClick={handleResetDevice}
                disabled={!resetToken.trim() || resetLoading}
                className="mt-4 w-full h-10 rounded-md font-semibold text-sm flex items-center justify-center gap-2 text-white disabled:opacity-40"
                style={{ background: 'linear-gradient(135deg, #6c5ce7, #8b6cf3)' }}
              >
                {resetLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Reset device lock</>}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default KeyEntryScreen;
