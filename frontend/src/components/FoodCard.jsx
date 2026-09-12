import React, { useState } from 'react';
import { Plus, Zap, AlertCircle, Check } from 'lucide-react';

export default function FoodCard({ item, timer, onAddToCart }) {
  const [justAdded, setJustAdded] = useState(false);
  const isOfferActive = item.has_offer && timer > 0;
  const currentPrice = isOfferActive ? item.offer_price : item.base_price;

  const handleAdd = () => {
    onAddToCart(item);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 900);
  };

  return (
    <div className="food-card">
      {/* Media & Category */}
      <div className="food-card-media">
        <img 
          src={item.image} 
          alt={item.name} 
          className="food-card-image" 
          loading="lazy"
        />
        <div className="food-card-category">
          {item.category}
        </div>
      </div>

      {/* Body Content */}
      <div className="food-card-body">
        <h3 className="food-card-title">{item.name}</h3>
        <p className="food-card-desc">{item.description}</p>

        {/* Dynamic Flash Allocation Countdown */}
        {item.has_offer && (
          <div className={`food-card-timer ${isOfferActive ? '' : 'expired'}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {isOfferActive ? (
                <Zap style={{ width: 14, height: 14 }} />
              ) : (
                <AlertCircle style={{ width: 14, height: 14 }} />
              )}
              <span style={{ fontWeight: 600 }}>
                {isOfferActive ? 'Dynamic Allocation Window' : 'Allocation Window Closed'}
              </span>
            </div>
            <span className="mono font-bold" style={{ letterSpacing: '0.05em' }}>
              {isOfferActive 
                ? `00:${timer < 10 ? '0' : ''}${timer}`
                : 'EXPIRED'
              }
            </span>
          </div>
        )}

        {/* Pricing & Add to Order CTA */}
        <div className="food-card-footer">
          <div className="price-container">
            <div className={`price-active ${isOfferActive ? 'has-discount' : ''}`}>
              ₹{currentPrice}
            </div>
            {isOfferActive && (
              <div className="price-original">
                Standard: ₹{item.base_price}
              </div>
            )}
          </div>

          <button 
            type="button" 
            className={`btn btn-sm ${justAdded ? 'btn-secondary' : 'btn-primary'}`}
            onClick={handleAdd}
            aria-label={`Add ${item.name} to order`}
          >
            {justAdded ? (
              <>
                <Check style={{ width: 15, height: 15, color: 'var(--emerald-accent)' }} />
                <span>Added!</span>
              </>
            ) : (
              <>
                <Plus style={{ width: 15, height: 15 }} />
                <span>Add to Order</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
