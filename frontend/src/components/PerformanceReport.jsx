import React from 'react';
import { TrendingDown, CheckCircle2, FileText } from 'lucide-react';

export default function PerformanceReport({
  initialEta = 14,
  finalEta = 55,
  etaVariance = "+41 min",
  plannedKm = 2.4,
  actualKm = 7.8,
  routeDeviation = "+225%",
  standardPrice = 399,
  promoPrice = 219,
  finalPrice = 399,
  priceVariancePct = "+82%",
  orderIntegrity = "MODIFIED",
  mutatedItem = "Classic Chicken Burger",
  originalItem = "Truffle Mushroom Burger",
  efficiencyScore = 18.4,
  isDelivered = false
}) {
  const score = parseFloat(efficiencyScore || 18.4);
  const circumference = 2 * Math.PI * 52; // r = 52, C ≈ 326.7
  const strokeOffset = circumference * (1 - Math.min(1, Math.max(0, score / 100)));
  const isMutated = originalItem !== mutatedItem;

  return (
    <div className="performance-report-card" style={{ textAlign: 'left', padding: '28px 24px' }}>
      {/* Report Header Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ padding: 8, backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', color: 'var(--brand-primary)' }}>
            <FileText style={{ width: 18, height: 18 }} />
          </div>
          <div>
            <h3 className="text-base font-bold text-primary">FULFILLMENT PERFORMANCE REPORT</h3>
            <p className="text-xs text-muted">Post-Dispatch Algorithmic Variance & Resource Ledger</p>
          </div>
        </div>
        <span className="mono text-xs text-muted">DOM-AUDIT #772</span>
      </div>

      {/* Primary Status Banner */}
      <div style={{ marginBottom: 24, padding: '14px 16px', backgroundColor: 'var(--coral-light)', border: '1px solid var(--coral-border)', borderRadius: 'var(--radius-md)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <CheckCircle2 style={{ width: 20, height: 20, color: 'var(--emerald-accent)', shrink: 0 }} />
          <div>
            <div className="font-bold text-primary" style={{ fontSize: '1rem' }}>
              Fulfillment completed
            </div>
            <div className="text-xs font-semibold text-coral" style={{ marginTop: 2 }}>
              Significant operational variance detected.
            </div>
          </div>
        </div>
      </div>

      {/* Prominent Circular Progress Gauge: OPERATIONAL PERFORMANCE */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: 24, padding: '16px 20px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', marginBottom: 24 }}>
        {/* SVG Circular Gauge */}
        <div style={{ position: 'relative', width: 130, height: 130, shrink: 0 }}>
          <svg width="130" height="130" viewBox="0 0 130 130">
            {/* Background Track */}
            <circle
              cx="65"
              cy="65"
              r="52"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="10"
            />
            {/* Value Progress Stroke */}
            <circle
              cx="65"
              cy="65"
              r="52"
              fill="none"
              stroke="var(--coral-accent)"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeOffset}
              strokeLinecap="round"
              transform="rotate(-90 65 65)"
              style={{ transition: 'stroke-dashoffset 1s ease-out' }}
            />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span className="mono font-black text-2xl text-primary" style={{ lineHeight: 1 }}>
              {score.toFixed(1)}%
            </span>
            <span className="mono text-[10px] text-muted font-bold" style={{ letterSpacing: '0.05em', marginTop: 2 }}>
              EFFICIENCY
            </span>
          </div>
        </div>

        {/* Gauge Explanation Text */}
        <div style={{ flex: 1 }}>
          <div className="mono text-xs font-bold text-coral" style={{ textTransform: 'uppercase', marginBottom: 4 }}>
            OPERATIONAL PERFORMANCE
          </div>
          <p className="text-xs text-secondary" style={{ lineHeight: 1.5 }}>
            Composite fulfillment rating derived continuously across spatial vector drift, promotional tariff restoration, and material inventory mutation.
          </p>
          <div style={{ marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            <TrendingDown style={{ width: 13, height: 13, color: 'var(--coral-accent)' }} />
            <span>Optimal Baseline: 100.0% • Efficiency Score: {score.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Detailed 4-Tile Audit Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 16 }}>
        {/* 1. ITEM INTEGRITY */}
        <div style={{ padding: 14, backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
          <div className="mono text-xs text-muted font-semibold" style={{ marginBottom: 8, letterSpacing: '0.04em' }}>
            ITEM INTEGRITY
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: 4 }}>
            <span className="text-secondary">Requested Item</span>
            <span className="font-semibold text-primary" style={{ fontSize: '0.78rem', maxWidth: '60%', textAlign: 'right' }}>{originalItem}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: 4 }}>
            <span className="text-secondary">Fulfilled Item</span>
            <span className="font-bold" style={{ fontSize: '0.78rem', color: isMutated ? 'var(--coral-accent)' : 'var(--text-primary)', maxWidth: '60%', textAlign: 'right' }}>
              {mutatedItem}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', paddingTop: 6, borderTop: '1px solid var(--border-subtle)' }}>
            <span className="font-semibold" style={{ color: isMutated ? 'var(--coral-accent)' : 'var(--emerald-accent)' }}>Mutation Status</span>
            <span className="mono font-bold" style={{ color: isMutated ? 'var(--coral-accent)' : 'var(--emerald-accent)' }}>
              {isMutated ? 'DETECTED' : 'NOMINAL'}
            </span>
          </div>
        </div>

        {/* 2. PRICE INTEGRITY */}
        <div style={{ padding: 14, backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
          <div className="mono text-xs text-muted font-semibold" style={{ marginBottom: 8, letterSpacing: '0.04em' }}>
            PRICE INTEGRITY
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: 4 }}>
            <span className="text-secondary">Listed Price</span>
            <span className="mono font-semibold text-primary">₹{standardPrice}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: 4 }}>
            <span className="text-secondary">Promotional Price</span>
            <span className="mono font-semibold text-muted" style={{ textDecoration: 'line-through' }}>₹{promoPrice}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: 4 }}>
            <span className="text-secondary">Final Invoiced Price</span>
            <span className="mono font-semibold text-primary">₹{finalPrice}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', paddingTop: 6, borderTop: '1px solid var(--border-subtle)' }}>
            <span className="font-semibold text-coral">Price Variance</span>
            <span className="mono font-bold text-coral">+{priceVariancePct.includes('%') ? priceVariancePct : `${priceVariancePct}%`}</span>
          </div>
        </div>

        {/* 3. ROUTE INTEGRITY */}
        <div style={{ padding: 14, backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
          <div className="mono text-xs text-muted font-semibold" style={{ marginBottom: 8, letterSpacing: '0.04em' }}>
            ROUTE INTEGRITY
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: 4 }}>
            <span className="text-secondary">Planned Distance</span>
            <span className="mono font-semibold text-primary">{plannedKm} km</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: 4 }}>
            <span className="text-secondary">Actual Distance</span>
            <span className="mono font-semibold text-primary">{actualKm} km</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', paddingTop: 6, borderTop: '1px solid var(--border-subtle)' }}>
            <span className="font-semibold text-coral">Route Deviation</span>
            <span className="mono font-bold text-coral">{routeDeviation}</span>
          </div>
        </div>

        {/* 4. ETA INTEGRITY */}
        <div style={{ padding: 14, backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
          <div className="mono text-xs text-muted font-semibold" style={{ marginBottom: 8, letterSpacing: '0.04em' }}>
            ETA INTEGRITY
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: 4 }}>
            <span className="text-secondary">Initial ETA</span>
            <span className="mono font-semibold text-primary">{initialEta} min</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: 4 }}>
            <span className="text-secondary">Final ETA</span>
            <span className="mono font-semibold text-primary">{finalEta} min</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', paddingTop: 6, borderTop: '1px solid var(--border-subtle)' }}>
            <span className="font-semibold text-coral">ETA Variance</span>
            <span className="mono font-bold text-coral">{etaVariance}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
