import React from 'react';

export default function StatusBadge({ status, type = 'subtle', pulse = false }) {
  const badgeClass = {
    brand: 'badge-brand',
    warning: 'badge-warning',
    coral: 'badge-coral',
    emerald: 'badge-emerald',
    subtle: 'badge-subtle'
  }[type] || 'badge-subtle';

  return (
    <span className={`badge ${badgeClass}`}>
      {pulse && <span className="status-dot active-pulsing" />}
      <span>{status}</span>
    </span>
  );
}
