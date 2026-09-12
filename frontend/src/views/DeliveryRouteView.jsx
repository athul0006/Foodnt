import React, { useState } from 'react';
import InteractiveRouteMap from '../components/InteractiveRouteMap.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { RefreshCw, Radio, Truck, PackageCheck } from 'lucide-react';
import { getFoodImage } from '../constants/foodItems.js';

const ROUTE_STAGES = [
  {
    stage: 0,
    name: "Nominal Dispatch",
    plannedKm: 2.4,
    actualKm: 2.4,
    deviationPct: "+0%",
    etaMin: 14,
    delayMin: "+0 min",
    status: "Driver Assigned & Moving Toward Restaurant",
    badgeType: "brand",
    logEvent: "Driver assigned. Moving toward restaurant."
  },
  {
    stage: 1,
    name: "Pickup Approach",
    plannedKm: 2.4,
    actualKm: 2.7,
    deviationPct: "+12%",
    etaMin: 10,
    delayMin: "-4 min",
    status: "Driver Approach Detected. Approaching Pickup Node.",
    badgeType: "emerald",
    logEvent: "Driver approach detected. Approaching pickup node."
  },
  {
    stage: 2,
    name: "Recalibrated Drift",
    plannedKm: 2.4,
    actualKm: 3.6,
    deviationPct: "+45%",
    etaMin: 17,
    delayMin: "+3 min",
    status: "Trajectory Optimization: Off-Route Branch Detected",
    badgeType: "subtle",
    logEvent: "Trajectory optimization: Off-route branch detected."
  },
  {
    stage: 3,
    name: "Errant U-Turn",
    plannedKm: 2.4,
    actualKm: 5.4,
    deviationPct: "+125%",
    etaMin: 28,
    delayMin: "+14 min",
    status: "Rerouting: Driver Executed an Unexpected U-Turn",
    badgeType: "warning",
    logEvent: "Rerouting: Driver executed an unexpected U-turn."
  },
  {
    stage: 4,
    name: "District Boundary Crossing",
    plannedKm: 2.4,
    actualKm: 7.8,
    deviationPct: "+225%",
    etaMin: 41,
    delayMin: "+27 min",
    status: "Optimization Alert: Driver Has Crossed District Lines",
    badgeType: "coral",
    logEvent: "District boundary crossed. Entering District 04 Outer Rim."
  },
  {
    stage: 5,
    name: "Severe Orbital Divergence",
    plannedKm: 2.4,
    actualKm: 11.2,
    deviationPct: "+366%",
    etaMin: 55,
    delayMin: "+41 min",
    status: "System Warning: Delivery Vector Diverging Exponentially",
    badgeType: "coral",
    logEvent: "System Warning: Delivery vector diverging exponentially."
  },
  {
    stage: 6,
    name: "Fulfillment Completed",
    plannedKm: 2.4,
    actualKm: 11.2,
    deviationPct: "+366%",
    etaMin: 0,
    delayMin: "+41 min",
    status: "Fulfillment Completed: Significant Operational Variance Detected",
    badgeType: "emerald",
    logEvent: "Order Status: Marked Delivered (Fulfillment: Suboptimal)."
  }
];

export default function DeliveryRouteView({ activeOrder, onRecalibrateBackend }) {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [isRecalibrating, setIsRecalibrating] = useState(false);
  const [timelineEvents, setTimelineEvents] = useState([
    { time: '08:42', text: 'Driver assigned', isDivergent: false },
    { time: '08:43', text: 'Restaurant approach detected', isDivergent: false }
  ]);

  const currentStage = ROUTE_STAGES[currentStageIndex];
  const orderId = activeOrder?.order_id || 492;
  const originalItem = activeOrder?.original_item || activeOrder?.items?.[0]?.name || 'Truffle Mushroom Burger';
  const mutatedItem = activeOrder?.mutated_item || activeOrder?.items?.[0]?.mutated_name || 'Classic Chicken Burger';
  const isMutated = originalItem !== mutatedItem;

  // Recalibrate button advances the stage (worsens the route!) and appends to telemetry
  const handleRecalibrate = () => {
    setIsRecalibrating(true);

    const nextIndex = (currentStageIndex + 1) % ROUTE_STAGES.length;
    const nextStage = ROUTE_STAGES[nextIndex];

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setTimeout(() => {
      setCurrentStageIndex(nextIndex);
      setTimelineEvents(prev => [
        {
          time: timeStr,
          text: nextStage.logEvent,
          isDivergent: nextIndex >= 2
        },
        ...prev
      ]);
      setIsRecalibrating(false);

      if (onRecalibrateBackend) {
        onRecalibrateBackend();
      }
    }, 450);
  };

  return (
    <div className="route-view-container">
      {/* Page Header */}
      <div>
        <div className="mono text-xs text-brand font-semibold" style={{ letterSpacing: '0.05em', marginBottom: 4 }}>
          AUTONOMOUS SPATIAL TELEMETRY
        </div>
        <h1 className="text-3xl font-extrabold text-primary">Delivery Route</h1>
        <p className="text-sm text-muted" style={{ marginTop: 2 }}>
          Live fulfillment trajectory and algorithmic vector convergence mapping.
        </p>
      </div>

      {/* TOP SECTION: Order ID, Status, Current ETA, Deviation */}
      <div className="route-top-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div>
            <div className="mono text-xs text-muted">ORDER IDENTIFIER</div>
            <div className="mono text-xl font-bold text-primary">#ORD-0{orderId}</div>
          </div>
          <StatusBadge
            status={currentStage.status}
            type={currentStage.badgeType}
            pulse={true}
          />
        </div>

        <div className="route-top-stats">
          <div className="route-stat-pill">
            <span className="route-stat-label">Current Dynamic ETA</span>
            <span className="route-stat-val" style={{ color: currentStage.etaMin > 25 ? 'var(--coral-accent)' : 'var(--text-primary)' }}>
              {currentStage.etaMin} MIN
            </span>
          </div>

          <div className="route-stat-pill">
            <span className="route-stat-label">Vector Deviation</span>
            <span className="route-stat-val text-coral">
              {currentStage.deviationPct}
            </span>
          </div>

          <div className="route-stat-pill">
            <span className="route-stat-label">Fulfillment Status</span>
            <span className="route-stat-val mono" style={{ fontSize: '1rem', color: 'var(--brand-primary)' }}>
              Suboptimal
            </span>
          </div>
        </div>
      </div>

      {/* MAIN AREA: Interactive Map (70%) & Route Control / Telemetry Sidebar (30%) */}
      <div className="route-main-grid">
        {/* Main Map Visualizer */}
        <InteractiveRouteMap
          stage={currentStageIndex}
          stageData={currentStage}
        />

        {/* Route Sidebar */}
        <div className="route-sidebar">
          {/* DELIVERY FULFILLMENT Card */}
          <div className="delivery-fulfillment-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ padding: 6, backgroundColor: isMutated ? 'var(--coral-light)' : 'var(--emerald-light)', borderRadius: 'var(--radius-sm)', color: isMutated ? 'var(--coral-accent)' : 'var(--emerald-accent)' }}>
                  <PackageCheck style={{ width: 16, height: 16 }} />
                </div>
                <div>
                  <div className="mono text-[10px] text-muted font-bold" style={{ letterSpacing: '0.04em' }}>INVENTORY TELEMETRY</div>
                  <h3 className="text-sm font-bold text-primary">DELIVERY FULFILLMENT</h3>
                </div>
              </div>
              <span className={`badge ${isMutated ? 'badge-coral' : 'badge-emerald'}`}>
                {isMutated ? 'MUTATION DETECTED' : 'NOMINAL'}
              </span>
            </div>

            <div className="fulfillment-items-summary">
              {/* ORDERED ITEM */}
              <div className="fulfillment-field-box">
                <div className="mono text-[10px] text-muted font-semibold">ORDERED ITEM</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
                  <img 
                    src={getFoodImage(originalItem)} 
                    alt={originalItem}
                    className="fulfillment-mini-thumb" 
                    onError={(e) => { e.currentTarget.src = getFoodImage(originalItem); }}
                  />
                  <div>
                    <div className="font-bold text-primary" style={{ fontSize: '0.875rem' }}>{originalItem}</div>
                    <div className="mono text-[10px] text-muted">Customer Specification</div>
                  </div>
                </div>
              </div>

              {/* FULFILLED ITEM */}
              <div className="fulfillment-field-box" style={{ marginTop: 10, borderTop: '1px solid var(--border-subtle)', paddingTop: 10 }}>
                <div className="mono text-[10px] font-semibold" style={{ color: isMutated ? 'var(--coral-accent)' : 'var(--emerald-accent)' }}>
                  FULFILLED ITEM
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
                  <img 
                    src={getFoodImage(mutatedItem)} 
                    alt={mutatedItem}
                    className="fulfillment-mini-thumb" 
                    onError={(e) => { e.currentTarget.src = getFoodImage(mutatedItem); }}
                  />
                  <div>
                    <div className="font-bold" style={{ fontSize: '0.875rem', color: isMutated ? 'var(--coral-accent)' : 'var(--text-primary)' }}>
                      {mutatedItem}
                    </div>
                    <div className="mono text-[10px]" style={{ color: isMutated ? 'var(--coral-accent)' : 'var(--text-muted)' }}>
                      {isMutated ? 'Substituted Regional Allocation' : 'Specification Match'}
                    </div>
                  </div>
                </div>
              </div>

              {/* MUTATION STATUS */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: 10, marginTop: 10 }}>
                <span className="mono text-xs text-muted font-semibold">MUTATION STATUS</span>
                <span className="mono font-black text-xs" style={{ color: isMutated ? 'var(--coral-accent)' : 'var(--emerald-accent)', letterSpacing: '0.05em' }}>
                  {isMutated ? 'DETECTED' : 'NOMINAL'}
                </span>
              </div>
            </div>

            {isMutated && (
              <div style={{ marginTop: 10, padding: '8px 10px', backgroundColor: 'var(--coral-light)', border: '1px solid var(--coral-border)', borderRadius: 'var(--radius-sm)', fontSize: '0.72rem', color: 'var(--coral-dark)' }}>
                Requested inventory was modified during fulfillment processing.
              </div>
            )}
          </div>

          {/* Driver Information Card */}
          <div className="driver-info-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ padding: 8, backgroundColor: 'var(--brand-light)', borderRadius: 'var(--radius-sm)', color: 'var(--brand-primary)' }}>
                  <Truck style={{ width: 18, height: 18 }} />
                </div>
                <div>
                  <div className="font-bold text-primary" style={{ fontSize: '0.95rem' }}>Unit #04 Dispatch</div>
                  <div className="mono text-xs text-muted">DOM Transponder: RF9-ACT</div>
                </div>
              </div>
              <span className="badge badge-emerald">Active</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.825rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">Driver Assigned:</span>
                <span className="font-semibold text-primary">Autonomous Courier Unit 04</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">Current Trajectory Distance:</span>
                <span className="mono font-bold text-primary">{currentStage.actualKm} km</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">Route Deviation:</span>
                <span className="mono font-bold text-coral">{currentStage.deviationPct}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">Estimated Time to Arrival:</span>
                <span className="mono font-bold text-primary">{currentStage.etaMin} min</span>
              </div>
            </div>
          </div>

          {/* Route Analysis Panel */}
          <div className="route-analysis-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="text-sm font-bold text-primary">Spatial Route Analysis</h3>
              <span className="mono text-xs text-muted">MODEL v4.2</span>
            </div>

            <div className="route-analysis-grid">
              <div className="analysis-tile">
                <span className="analysis-tile-label">Planned Route</span>
                <span className="analysis-tile-value">{currentStage.plannedKm} km</span>
              </div>

              <div className="analysis-tile">
                <span className="analysis-tile-label">Actual Route</span>
                <span className="analysis-tile-value" style={{ color: currentStageIndex >= 2 ? 'var(--coral-accent)' : 'var(--brand-primary)' }}>
                  {currentStage.actualKm} km
                </span>
              </div>

              <div className="analysis-tile">
                <span className="analysis-tile-label">Route Deviation</span>
                <span className="analysis-tile-value text-coral">{currentStage.deviationPct}</span>
              </div>

              <div className="analysis-tile">
                <span className="analysis-tile-label">Estimated Delay</span>
                <span className="analysis-tile-value" style={{ color: 'var(--amber-accent)' }}>{currentStage.delayMin}</span>
              </div>
            </div>

            {/* Recalibrate Trajectory CTA */}
            <div style={{ marginTop: 18 }}>
              <button
                type="button"
                className="btn btn-primary btn-block btn-lg"
                onClick={handleRecalibrate}
                disabled={isRecalibrating}
              >
                <RefreshCw style={{ width: 16, height: 16, animation: isRecalibrating ? 'spin 1s linear infinite' : 'none' }} />
                <span>{isRecalibrating ? 'Recalibrating Vector...' : 'Recalibrate Trajectory'}</span>
              </button>
              <div className="text-xs text-muted" style={{ marginTop: 8, textAlign: 'center', lineHeight: 1.4 }}>
                Applies real-time DOM mathematical recalibration to driver trajectory vectors.
              </div>
            </div>
          </div>

          {/* Hackathon Demonstration Scrubber */}
          <div className="stage-scrubber-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="mono text-xs font-semibold text-secondary">
                SIMULATED TRAJECTORY STATE
              </span>
              <span className="mono text-xs text-muted">Stage {currentStageIndex + 1} of 5</span>
            </div>

            <div className="stage-buttons-row">
              {ROUTE_STAGES.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`stage-btn ${currentStageIndex === idx ? 'active' : ''}`}
                  onClick={() => setCurrentStageIndex(idx)}
                  title={s.name}
                >
                  S{idx}
                </button>
              ))}
            </div>
          </div>

          {/* Compact Telemetry Timeline */}
          <div className="compact-timeline-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="text-sm font-bold text-primary">Telemetry Timeline</h3>
              <Radio style={{ width: 14, height: 14, color: 'var(--brand-primary)' }} />
            </div>

            <div className="compact-timeline-list">
              {timelineEvents.map((evt, idx) => (
                <div key={idx} className={`compact-timeline-row ${evt.isDivergent ? 'active-step' : ''}`}>
                  <span className="mono font-semibold text-muted" style={{ shrink: 0 }}>{evt.time}</span>
                  <span style={{ fontWeight: 500 }}>{evt.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
