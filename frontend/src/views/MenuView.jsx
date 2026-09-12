import React, { useState } from 'react';
import FoodCard from '../components/FoodCard.jsx';
import { Zap } from 'lucide-react';

export default function MenuView({ menu, offerTimers, onAddToCart }) {
  const [activeCategory, setActiveCategory] = useState('ALL');

  const categories = ['ALL', ...Array.from(new Set(menu.map(i => i.category)))];

  const filteredItems = activeCategory === 'ALL'
    ? menu
    : menu.filter(item => item.category === activeCategory);

  return (
    <div>
      {/* Catalogue Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div className="mono text-xs text-brand font-semibold" style={{ letterSpacing: '0.04em', marginBottom: 4 }}>
            INVENTORY CATALOGUE
          </div>
          <h2 className="text-2xl font-bold text-primary">Autonomous Fulfillment Menu</h2>
          <p className="text-sm text-muted" style={{ marginTop: 2 }}>
            Select inventory batches for algorithmic routing and vector allocation.
          </p>
        </div>

        {/* Informational Flash Notice */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <Zap style={{ width: 15, height: 15, color: 'var(--amber-accent)' }} />
          <span>Flash promotional allocations are subject to instant expiration.</span>
        </div>
      </div>

      {/* Category Pills */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, overflowX: 'auto', paddingBottom: 4 }}>
        {categories.map(cat => (
          <button
            key={cat}
            type="button"
            className={`btn btn-sm ${activeCategory === cat ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Responsive Grid: 3 cols desktop, 2 cols tablet, 1 col mobile */}
      <div className="food-grid">
        {filteredItems.map(item => (
          <FoodCard
            key={item.id}
            item={item}
            timer={offerTimers[item.id] || 0}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  );
}
