import React from 'react';
import MetricCard from '../components/MetricCard.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import DeliveryRouteMap from '../components/DeliveryRouteMap.jsx';
import TelemetryTimeline from '../components/TelemetryTimeline.jsx';
import PricingVariance from '../components/PricingVariance.jsx';
import ManifestAudit from '../components/ManifestAudit.jsx';
import PerformanceReport from '../components/PerformanceReport.jsx';
import { ArrowLeft, RefreshCw, Navigation } from 'lucide-react';

export default function TrackingDashboard({
  order,
  telemetryLogs,
  onRecalibrate,
  isRecalibrating,
  onNewOrder,
  onViewRoute
}) {
  if (!order) {
    return (
      <div className="card card-padded" style={{ textAlign: 'center', maxWidth: 480, margin: '40px auto' }}>
        <h3 className="text-lg font-bold text-primary">No Active Dispatch Session</h3>
        <p className="text-xs text-muted" style={{ margin: '8px 0 20px' }}>
          Select items from the catalogue to initialize route vector tracking.
        </p>
        <button type="button" className="btn btn-primary" onClick={onNewOrder}>
          Open Catalogue
        </button>
      </div>
    );
  }

  const isDelivered = order.eta_minutes === 0 || order.delivered;
  const etaMinutes = order.eta_minutes ?? 14;
  const deviation = order.deviation_index || '+142%';
  const efficiency = order.efficiency_score || '14.2';

  return (
    <div className="tracking-dashboard">
      {/* 1. Order Header Bar */}
      <div className="tracking-header-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button 
            type="button" 
            className="btn btn-outline btn-sm" 
            onClick={onNewOrder}
            title="Return to Catalogue"
          >
            <ArrowLeft style={{ width: 14, height: 14 }} />
            <span>Catalogue</span>
          </button>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2 className="text-xl font-bold text-primary mono">
                #ORD-0{order.order_id}
              </h2>
              <StatusBadge
                status={isDelivered ? 'FULFILLMENT FINALIZED' : (order.status || 'IN TRANSIT')}
                type={isDelivered ? 'emerald' : 'coral'}
                pulse={!isDelivered}
              />
            </div>
            <p className="text-xs text-muted" style={{ marginTop: 2 }}>
              Dispatched Destination: <strong>Sector 7, Suite 402</strong> • Route Protocol: DOM-AGX
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {onViewRoute && (
            <button 
              type="button" 
              className="btn btn-outline btn-sm"
              onClick={onViewRoute}
              title="Inspect Live Delivery Route"
            >
              <Navigation style={{ width: 13, height: 13, color: 'var(--brand-primary)' }} />
              <span>Delivery Route Map</span>
            </button>
          )}

          <button 
            type="button" 
            className="btn btn-secondary btn-sm"
            onClick={onRecalibrate}
            disabled={isRecalibrating}
          >
            <RefreshCw style={{ width: 13, height: 13, animation: isRecalibrating ? 'spin 1s linear infinite' : 'none' }} />
            <span>Recalibrate Vector</span>
          </button>
        </div>
      </div>

      {/* 2 & 3 & 7 & 10. Metric KPIs Grid (4 Columns) */}
      <div className="tracking-kpis-grid">
        <MetricCard
          label="Dynamic ETA"
          value={isDelivered ? '0 MIN' : `${etaMinutes} MIN`}
          meta={isDelivered ? 'Marked Delivered' : 'Auto-recalculating'}
          variant={isDelivered ? 'emerald' : etaMinutes > 25 ? 'coral' : 'amber'}
        />

        <MetricCard
          label="Vector Drift Deviation"
          value={deviation}
          meta="Off-axis trajectory index"
          variant="coral"
        />

        <MetricCard
          label="Driver Transponder"
          value={`${order.driver_distance_km || '4.2'} KM`}
          meta="Current straight-line distance"
          variant="brand"
        />

        <MetricCard
          label="System Efficiency Index"
          value={`${efficiency}%`}
          meta="Trajectory & substitution rating"
          variant="coral"
        />
      </div>

      {/* Main 2-Column Command Center: Left (60%), Right (40%) */}
      <div className="tracking-columns">
        {/* Left Column: Route Telemetry Vector Map & Live Log Stream */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* 4. Route Summary & Vector Map */}
          <DeliveryRouteMap 
            eta={etaMinutes} 
            deviationIndex={deviation} 
            status={order.status} 
          />

          {/* 5 & 9. Live Telemetry Event Stream & Recalibrate CTA */}
          <TelemetryTimeline
            logs={telemetryLogs}
            onRecalibrate={onRecalibrate}
            isRecalibrating={isRecalibrating}
          />
        </div>

        {/* Right Column: Manifest Audit, Financial Variance, Performance Report */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* 8. Order Integrity & Item Substitution Audit */}
          <ManifestAudit
            originalItem={order.original_item || order.items?.[0]?.name || 'Truffle Mushroom Burger'}
            mutatedItem={order.mutated_item || order.items?.[0]?.mutated_name || 'Classic Chicken Burger'}
            originalImage={order.original_image}
            mutatedImage={order.mutated_image}
          />

          {/* 6. Pricing Variance & Reverse-Discount Audit */}
          <PricingVariance
            promoPrice={order.promo_price || order.items?.[0]?.promo_price || 219}
            standardPrice={order.standard_price || order.base_price || 399}
            finalPrice={order.final_price || 399}
            priceVariance={order.price_variance || 180}
            priceVariancePct={order.price_variance_pct || 82}
            offerFailed={true}
          />

          {/* 10. Performance Score Gauge & Fulfillment Report */}
          <PerformanceReport 
            initialEta={order.initial_eta || 14}
            finalEta={order.final_eta || 55}
            etaVariance={order.eta_variance || "+41 min"}
            plannedKm={order.planned_km || 2.4}
            actualKm={order.actual_km || 7.8}
            routeDeviation={order.route_deviation || "+225%"}
            promoPrice={order.promo_price || 219}
            finalPrice={order.final_price || 399}
            priceVariancePct={order.price_variance_pct ? `${order.price_variance_pct}%` : "+82%"}
            orderIntegrity={order.order_integrity || "MODIFIED"}
            originalItem={order.original_item || order.items?.[0]?.name || "Truffle Mushroom Burger"}
            mutatedItem={order.mutated_item || order.items?.[0]?.mutated_name || "Classic Chicken Burger"}
            efficiencyScore={order.efficiency_score || 18.4}
            isDelivered={isDelivered}
          />
        </div>
      </div>
    </div>
  );
}
