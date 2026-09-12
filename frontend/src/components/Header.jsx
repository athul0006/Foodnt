import React from 'react';
import { ShoppingBag, User } from 'lucide-react';

export default function Header({ view, setView, user, cartCount, activeOrderId }) {
  return (
    <header className="app-header">
      <div className="header-inner">
        {/* Brand Wordmark */}
        <div className="brand-logo" onClick={() => setView('landing')}>
          <div className="brand-mark">F</div>
          <div>
            <span className="brand-name">Foodn't</span>
            <span className="mono text-xs text-muted" style={{ marginLeft: '6px', fontWeight: 500 }}>
              LOGISTICS
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="header-nav" aria-label="Main Navigation">
          <button 
            type="button" 
            className={`nav-link ${view === 'menu' ? 'active' : ''}`}
            onClick={() => setView('menu')}
          >
            Catalogue
          </button>
          
          <button 
            type="button" 
            className={`nav-link ${view === 'tracking' ? 'active' : ''}`}
            onClick={() => setView('tracking')}
          >
            Delivery Status
          </button>

          <button 
            type="button" 
            className={`nav-link ${view === 'route' ? 'active' : ''}`}
            onClick={() => setView('route')}
          >
            Delivery Route
          </button>
          
          <button 
            type="button" 
            className={`nav-link ${view === 'auth' ? 'active' : ''}`}
            onClick={() => setView('auth')}
          >
            {user ? 'Account' : 'Sign In'}
          </button>
        </nav>

        {/* System & Cart Actions */}
        <div className="header-actions">
          {/* Live System Indicator */}
          <div className="system-status-chip">
            <span className="status-dot active-pulsing" />
            <span>DOM v2.4 • 14ms</span>
          </div>

          {/* Cart Indicator */}
          <button 
            type="button" 
            className="cart-trigger-btn"
            onClick={() => setView('cart')}
            title="View Order Manifest"
          >
            <ShoppingBag style={{ width: 16, height: 16, color: 'var(--text-secondary)' }} />
            <span style={{ fontSize: '0.825rem' }}>Manifest</span>
            {cartCount > 0 && (
              <span className="cart-count-badge mono">{cartCount}</span>
            )}
          </button>

          {/* User Profile Pill */}
          {user && (
            <div className="user-pill" title={user.email}>
              <User style={{ width: 14, height: 14, color: 'var(--brand-primary)' }} />
              <span className="mono text-xs font-semibold">{user.name || user.email.split('@')[0]}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
