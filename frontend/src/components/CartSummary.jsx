import React from 'react';
import { ArrowRight, Trash2, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function CartSummary({ cart, onRemoveItem, onCheckout, isSubmitting }) {
  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const serviceFee = cart.length > 0 ? 35 : 0;
  const total = subtotal + serviceFee;
  const hasPromotionalItems = cart.some(item => item.offer_applied);

  return (
    <div className="cart-layout">
      {/* Manifest Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="text-lg font-bold text-primary">Dispatched Manifest Items</h2>
            <p className="text-xs text-muted">Review selected inventory items before vector allocation.</p>
          </div>
          <span className="mono text-xs text-muted">{cart.length} item(s)</span>
        </div>

        <div className="card-body" style={{ padding: 0 }}>
          {cart.length === 0 ? (
            <div style={{ padding: 48, textAlign: 'center' }}>
              <p className="text-secondary font-medium">Manifest is currently unallocated.</p>
              <p className="text-xs text-muted" style={{ marginTop: 6 }}>
                Select catalogue items to initiate route vector modeling.
              </p>
            </div>
          ) : (
            <table className="cart-items-table">
              <thead>
                <tr>
                  <th>Inventory Item</th>
                  <th>Rate Type</th>
                  <th style={{ textAlign: 'right' }}>Price</th>
                  <th style={{ width: 50 }}></th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <div className="font-semibold text-primary">{item.name}</div>
                      <div className="text-xs text-muted">Stock ID: #INV-0{item.id}</div>
                    </td>
                    <td>
                      {item.offer_applied ? (
                        <span className="badge badge-warning">
                          Flash Allocation Applied
                        </span>
                      ) : (
                        <span className="badge badge-subtle">
                          Standard Logistics Rate
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="mono font-bold text-primary">₹{item.price}</div>
                      {item.offer_applied && (
                        <div className="mono text-xs text-muted" style={{ textDecoration: 'line-through' }}>
                          ₹{item.original_price}
                        </div>
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(index)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                        title="Remove Item"
                      >
                        <Trash2 style={{ width: 15, height: 15 }} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Financial & Dispatch Summary Card */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-base font-bold text-primary">Fulfillment Cost Breakdown</h3>
        </div>

        <div className="card-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
              <span className="text-secondary">Inventory Subtotal</span>
              <span className="mono font-semibold text-primary">₹{subtotal}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
              <span className="text-secondary">DOM Dynamic Routing Tariff</span>
              <span className="mono font-semibold text-primary">₹{serviceFee}</span>
            </div>

            {hasPromotionalItems && (
              <div style={{ padding: '12px 14px', backgroundColor: 'var(--coral-light)', border: '1px solid var(--coral-border)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--coral-dark)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <AlertTriangle style={{ width: 16, height: 16, shrink: 0, marginTop: 2, color: 'var(--coral-accent)' }} />
                  <div>
                    <div style={{ fontWeight: 700 }}>Promotional allocation expired.</div>
                    <div style={{ marginTop: 2 }}>
                      Promotional allocation threshold elapsed during transaction preparation. Default tariff schedule restored pursuant to Section 4.2.
                    </div>
                    <div className="mono" style={{ marginTop: 6, fontWeight: 700, color: 'var(--coral-accent)' }}>
                      Price Variance: +₹{cart[0] ? (cart[0].original_price - cart[0].price) : 180} (+{cart[0] ? Math.round(((cart[0].original_price - cart[0].price) / cart[0].price) * 100) : 82}%)
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div>
                <span className="text-base font-bold text-primary">Total Invoiced</span>
                <div className="text-xs text-muted">Inclusive of automated logistics tariffs</div>
              </div>
              <span className="mono font-bold text-2xl text-primary">₹{total}</span>
            </div>
          </div>
        </div>

        <div className="card-footer">
          <button 
            type="button" 
            className="btn btn-primary btn-block btn-lg"
            onClick={onCheckout}
            disabled={cart.length === 0 || isSubmitting}
          >
            <span>{isSubmitting ? 'Calibrating Vector...' : 'Dispatch Order Manifest'}</span>
            <ArrowRight style={{ width: 16, height: 16 }} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 12, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <ShieldCheck style={{ width: 14, height: 14, color: 'var(--emerald-accent)' }} />
            <span>Fulfillment protected by DOM Automated Precision Protocol</span>
          </div>
        </div>
      </div>
    </div>
  );
}
