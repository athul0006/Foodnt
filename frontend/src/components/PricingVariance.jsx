import React from 'react';
import { AlertTriangle, TrendingUp } from 'lucide-react';

export default function PricingVariance({
  promoPrice = 219,
  standardPrice = 399,
  finalPrice = 399,
  priceVariance = 180,
  priceVariancePct = 82,
  offerFailed = true
}) {
  const serviceFee = 35;
  const invoicedTotal = finalPrice + serviceFee;

  return (
    <div className="pricing-variance-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h3 className="text-base font-bold text-primary">Financial & Pricing Variance Audit</h3>
          <p className="text-xs text-muted">Real-time tariff adjustment and rate reconciliation ledger.</p>
        </div>
        <span className="badge badge-coral">
          Promotional allocation expired
        </span>
      </div>

      {/* Prominent Promotional Allocation Alert Box */}
      <div style={{ marginBottom: 16, padding: '12px 14px', backgroundColor: 'var(--coral-light)', border: '1px solid var(--coral-border)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--coral-dark)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <AlertTriangle style={{ width: 16, height: 16, shrink: 0, marginTop: 2, color: 'var(--coral-accent)' }} />
          <div>
            <div style={{ fontWeight: 700, marginBottom: 2 }}>Promotional allocation expired.</div>
            <div>
              The promotional window threshold lapsed prior to cryptographic order settlement. The dynamic billing ledger has automatically restored the standard tariff schedule.
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown Ledger */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="variance-line-item">
          <span className="text-secondary">Listed Promotional Price</span>
          <span className="mono font-semibold text-muted" style={{ textDecoration: 'line-through' }}>
            ₹{promoPrice}
          </span>
        </div>

        <div className="variance-line-item">
          <span className="text-secondary">Standard Catalogue Price</span>
          <span className="mono font-semibold text-primary">
            ₹{standardPrice}
          </span>
        </div>

        <div className="variance-line-item" style={{ color: 'var(--coral-dark)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <TrendingUp style={{ width: 15, height: 15, color: 'var(--coral-accent)' }} />
            <span style={{ fontWeight: 600 }}>Price Variance (Adjustment)</span>
          </div>
          <span className="mono font-bold" style={{ color: 'var(--coral-accent)' }}>
            +₹{priceVariance} (+{priceVariancePct}%)
          </span>
        </div>

        <div className="variance-line-item">
          <span className="text-secondary">DOM Automated Routing Tariff</span>
          <span className="mono font-semibold text-primary">₹{serviceFee}.00</span>
        </div>

        <div className="variance-line-item" style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 12 }}>
          <div>
            <span className="text-base font-bold text-primary">Final Invoiced Total</span>
            <div className="text-xs text-muted">Standard price (₹{standardPrice}) + DOM tariff (₹{serviceFee})</div>
          </div>
          <span className="mono font-extrabold text-2xl text-primary">
            ₹{invoicedTotal}
          </span>
        </div>
      </div>
    </div>
  );
}
