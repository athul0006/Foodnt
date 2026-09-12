import React from 'react';
import { ArrowRight, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';
import { getFoodImage } from '../constants/foodItems.js';

export default function ManifestAudit({ originalItem, mutatedItem, originalImage, mutatedImage }) {
  const safeOriginal = originalItem || 'Truffle Mushroom Burger';
  const safeMutated = mutatedItem || 'Classic Chicken Burger';
  const isMutated = safeOriginal !== safeMutated;

  const origImg = originalImage || getFoodImage(safeOriginal);
  const mutImg = mutatedImage || getFoodImage(safeMutated);

  return (
    <div className="manifest-audit-card">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <div className="mono text-xs text-muted" style={{ fontWeight: 600, letterSpacing: '0.05em', marginBottom: 2 }}>
            PAYLOAD VERIFICATION
          </div>
          <h3 className="text-base font-bold text-primary">FULFILLMENT INTEGRITY</h3>
          <p className="text-xs text-muted" style={{ marginTop: 2 }}>
            Automated verification of physical package contents versus initial dispatch request.
          </p>
        </div>
        {isMutated ? (
          <span className="badge badge-coral" style={{ fontWeight: 700 }}>
            ITEM MUTATION DETECTED
          </span>
        ) : (
          <span className="badge badge-emerald" style={{ fontWeight: 700 }}>
            NO MUTATION DETECTED
          </span>
        )}
      </div>

      {/* Visual Mutation Pipeline Flow */}
      <div className="fulfillment-mutation-flow">
        {/* Ordered Item Box */}
        <div className="mutation-item-box ordered">
          <div className="mutation-item-badge mono">ORDERED ITEM</div>
          <div className="mutation-img-wrap">
            <img 
              src={origImg} 
              alt={safeOriginal} 
              className="mutation-food-img"
              onError={(e) => { e.currentTarget.src = getFoodImage(safeOriginal); }}
            />
          </div>
          <div className="mutation-item-details">
            <div className="mutation-item-name text-primary font-bold">{safeOriginal}</div>
            <div className="mono text-xs text-muted">Requested Specification</div>
          </div>
        </div>

        {/* Mutation Arrow & Connector */}
        <div className="mutation-connector">
          <div className="mutation-connector-badge mono">
            {isMutated ? 'FULFILLMENT MUTATION' : 'VERIFIED MATCH'}
          </div>
          <div className="mutation-arrow-circle" style={{ backgroundColor: isMutated ? 'var(--coral-light)' : 'var(--emerald-light)', borderColor: isMutated ? 'var(--coral-border)' : 'var(--emerald-border)', color: isMutated ? 'var(--coral-accent)' : 'var(--emerald-accent)' }}>
            {isMutated ? <ArrowRight style={{ width: 16, height: 16 }} /> : <CheckCircle2 style={{ width: 16, height: 16 }} />}
          </div>
          <div className="mono text-[10px] text-muted font-semibold" style={{ textAlign: 'center', marginTop: 4 }}>
            {isMutated ? 'Dispatched' : 'Nominal'}
          </div>
        </div>

        {/* Fulfilled Item Box */}
        <div className={`mutation-item-box fulfilled ${isMutated ? 'mutated-active' : ''}`}>
          <div className="mutation-item-badge mono" style={{ color: isMutated ? 'var(--coral-accent)' : 'var(--emerald-accent)' }}>
            FULFILLED ITEM
          </div>
          <div className="mutation-img-wrap">
            <img 
              src={mutImg} 
              alt={safeMutated} 
              className="mutation-food-img"
              onError={(e) => { e.currentTarget.src = getFoodImage(safeMutated); }}
            />
          </div>
          <div className="mutation-item-details">
            <div className="mutation-item-name font-bold" style={{ color: isMutated ? 'var(--coral-accent)' : 'var(--text-primary)' }}>
              {safeMutated}
            </div>
            <div className="mono text-xs" style={{ color: isMutated ? 'var(--coral-accent)' : 'var(--text-muted)' }}>
              {isMutated ? 'Active Dispatched Inventory' : 'Original Specification Fulfilled'}
            </div>
          </div>
        </div>
      </div>

      {/* Serious Warning / Status Callout */}
      {isMutated ? (
        <div className="mutation-alert-box">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <div style={{ padding: 4, backgroundColor: '#ffffff', borderRadius: 'var(--radius-sm)', shrink: 0, marginTop: 1 }}>
              <AlertTriangle style={{ width: 16, height: 16, color: 'var(--coral-accent)' }} />
            </div>
            <div>
              <div className="font-bold text-coral mono text-xs" style={{ letterSpacing: '0.04em', marginBottom: 2 }}>
                ITEM MUTATION DETECTED
              </div>
              <div className="font-semibold text-primary" style={{ fontSize: '0.85rem' }}>
                Requested inventory was modified during fulfillment processing.
              </div>
              <div className="text-xs text-secondary" style={{ marginTop: 4, lineHeight: 1.4 }}>
                Automated regional inventory reconciliation substituted the requested SKU with an active node allocation. Order remains in transit.
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mutation-nominal-box">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <CheckCircle2 style={{ width: 16, height: 16, color: 'var(--emerald-accent)' }} />
            <div className="text-xs font-semibold text-emerald">
              Item fulfilled as requested • No mutation detected
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
