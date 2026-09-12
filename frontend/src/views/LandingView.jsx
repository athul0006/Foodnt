import React from 'react';
import { ArrowRight, Compass, Activity } from 'lucide-react';

export default function LandingView({ onBrowseMenu, onTrackDelivery, hasActiveOrder }) {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div>
          <div className="hero-tag">
            <Activity style={{ width: 14, height: 14 }} />
            <span>Autonomous Food Logistics v2.4</span>
          </div>

          <h1 className="hero-title">
            Food delivery, <br />
            <span style={{ color: 'var(--brand-primary)' }}>optimized.</span>
          </h1>

          <p className="hero-subtitle">
            Foodn't operates a distributed Dynamic Order Management (DOM) engine engineered to recalibrate delivery vectors, dynamically rebalance localized macro-inventory, and maximize logistical entropy across municipal grids.
          </p>

          <div className="hero-cta-group">
            <button 
              type="button" 
              className="btn btn-primary btn-lg"
              onClick={onBrowseMenu}
            >
              <span>Explore Catalogue</span>
              <ArrowRight style={{ width: 16, height: 16 }} />
            </button>

            <button 
              type="button" 
              className="btn btn-outline btn-lg"
              onClick={onTrackDelivery}
            >
              <Compass style={{ width: 16, height: 16, color: 'var(--text-secondary)' }} />
              <span>{hasActiveOrder ? 'View Active Dispatch' : 'Telemetry Terminal'}</span>
            </button>
          </div>
        </div>

        {/* Dashboard Preview Widget */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <div>
              <div className="text-xs text-muted mono">REAL-TIME TELEMETRY STREAM</div>
              <h3 className="text-base font-bold text-primary">Regional Node Efficiency</h3>
            </div>
            <span className="badge badge-emerald">
              <span className="status-dot active-pulsing" />
              <span>DOM Active</span>
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ padding: 14, backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 6 }}>
                <span className="text-secondary font-medium">Dynamic Vector Stability</span>
                <span className="mono font-bold text-primary">18.4% Optimal</span>
              </div>
              <div style={{ height: 6, backgroundColor: 'var(--border-subtle)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: '18.4%', height: '100%', backgroundColor: 'var(--coral-accent)' }} />
              </div>
            </div>

            <div style={{ padding: 14, backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 6 }}>
                <span className="text-secondary font-medium">Flash Window Expiration Rate</span>
                <span className="mono font-bold text-primary">99.4% Surge</span>
              </div>
              <div style={{ height: 6, backgroundColor: 'var(--border-subtle)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: '99.4%', height: '100%', backgroundColor: 'var(--brand-primary)' }} />
              </div>
            </div>

            <div style={{ padding: 14, backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 6 }}>
                <span className="text-secondary font-medium">Macro Substitution Probability</span>
                <span className="mono font-bold text-primary">100.0% Guaranteed</span>
              </div>
              <div style={{ height: 6, backgroundColor: 'var(--border-subtle)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--amber-accent)' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* System Statistics Ribbon */}
      <section className="stats-ribbon">
        <div className="stat-item">
          <div className="stat-label">Average Vector Drift</div>
          <div className="stat-value text-coral">+184.2%</div>
          <div className="stat-trend">Standard reroute deviation</div>
        </div>

        <div className="stat-item">
          <div className="stat-label">Recalibration Latency</div>
          <div className="stat-value">14.0 ms</div>
          <div className="stat-trend">Edge compute response</div>
        </div>

        <div className="stat-item">
          <div className="stat-label">Substitution Integrity</div>
          <div className="stat-value" style={{ color: 'var(--amber-accent)' }}>100%</div>
          <div className="stat-trend">Automatic carbohydrate swap</div>
        </div>

        <div className="stat-item">
          <div className="stat-label">Autonomous Network Health</div>
          <div className="stat-value" style={{ color: 'var(--emerald-accent)' }}>99.9%</div>
          <div className="stat-trend">DOM cluster operational</div>
        </div>
      </section>
    </div>
  );
}
