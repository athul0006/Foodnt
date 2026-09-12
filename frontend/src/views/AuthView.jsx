import React, { useState } from 'react';
import { Lock, User as UserIcon, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export default function AuthView({ onAuth, authError, currentUser, onSignOut }) {
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onAuth(mode, formData);
    setLoading(false);
  };

  if (currentUser) {
    return (
      <div className="auth-wrapper" style={{ textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: 'var(--brand-light)', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <UserIcon style={{ width: 24, height: 24 }} />
        </div>
        <h2 className="text-xl font-bold text-primary">Authenticated Session</h2>
        <p className="mono text-xs text-muted" style={{ margin: '6px 0 20px' }}>{currentUser.email}</p>

        <div style={{ padding: 16, backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', marginBottom: 24, textAlign: 'left', fontSize: '0.85rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span className="text-muted">Operator ID</span>
            <span className="mono font-semibold text-primary">#USR-{currentUser.id || currentUser.user_id}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="text-muted">Access Level</span>
            <span className="mono font-semibold text-emerald">DOM-AUTHORIZED</span>
          </div>
        </div>

        <button 
          type="button" 
          className="btn btn-outline btn-block"
          onClick={onSignOut}
        >
          Sign Out of Terminal
        </button>
      </div>
    );
  }

  return (
    <div className="auth-wrapper">
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ display: 'inline-flex', padding: 8, backgroundColor: 'var(--brand-light)', borderRadius: 'var(--radius-sm)', color: 'var(--brand-primary)', marginBottom: 12 }}>
          <Lock style={{ width: 20, height: 20 }} />
        </div>
        <h2 className="text-xl font-bold text-primary">Logistics Terminal Access</h2>
        <p className="text-xs text-muted" style={{ marginTop: 4 }}>
          Authenticate to dispatch inventory through the DOM network.
        </p>
      </div>

      {/* Mode Toggle */}
      <div style={{ display: 'flex', padding: 4, backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', marginBottom: 20 }}>
        <button
          type="button"
          className={`btn btn-sm ${mode === 'login' ? 'btn-primary' : 'btn-outline'}`}
          style={{ flex: 1, border: 'none' }}
          onClick={() => setMode('login')}
        >
          Sign In
        </button>
        <button
          type="button"
          className={`btn btn-sm ${mode === 'signup' ? 'btn-primary' : 'btn-outline'}`}
          style={{ flex: 1, border: 'none' }}
          onClick={() => setMode('signup')}
        >
          Create Account
        </button>
      </div>

      {authError && (
        <div style={{ padding: '10px 14px', backgroundColor: 'var(--coral-light)', border: '1px solid var(--coral-border)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--coral-dark)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertCircle style={{ width: 16, height: 16, shrink: 0 }} />
          <span>{authError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {mode === 'signup' && (
          <div className="form-group">
            <label className="form-label">Full Name / Operator Alias</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Alex Mercer"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Enterprise Email</label>
          <input
            type="email"
            className="form-input"
            placeholder="operator@foodnt.internal"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Security Credential</label>
          <input
            type="password"
            className="form-input"
            placeholder="••••••••"
            value={formData.password}
            onChange={e => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-block btn-lg"
          disabled={loading}
          style={{ marginTop: 8 }}
        >
          <span>{loading ? 'Authenticating...' : mode === 'login' ? 'Authenticate Access' : 'Register Operator'}</span>
          <ArrowRight style={{ width: 16, height: 16 }} />
        </button>
      </form>

      <div style={{ marginTop: 24, textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        <ShieldCheck style={{ width: 14, height: 14, display: 'inline-block', verticalAlign: 'middle', marginRight: 4, color: 'var(--emerald-accent)' }} />
        Encrypted via 256-bit SHA Session Token
      </div>
    </div>
  );
}
