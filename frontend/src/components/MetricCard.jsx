import React from 'react';

export default function MetricCard({ label, value, meta, trend, variant = 'default' }) {
  let valueColor = 'var(--text-primary)';
  if (variant === 'coral') valueColor = 'var(--coral-accent)';
  if (variant === 'amber') valueColor = 'var(--amber-accent)';
  if (variant === 'emerald') valueColor = 'var(--emerald-accent)';
  if (variant === 'brand') valueColor = 'var(--brand-primary)';

  return (
    <div className="metric-card">
      <div className="metric-label">{label}</div>
      <div className="metric-value" style={{ color: valueColor }}>
        {value}
      </div>
      {meta && <div className="metric-meta">{meta}</div>}
      {trend && <div className="metric-meta mono">{trend}</div>}
    </div>
  );
}
