import React from 'react';
import { Navigation } from 'lucide-react';

export default function DeliveryRouteMap({ eta, deviationIndex, status }) {
  const isDiverging = parseInt(deviationIndex || '0', 10) > 80 || eta > 20;

  return (
    <div className="telemetry-map-box">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 className="text-base font-bold text-primary">Trajectory Vector Mapping</h3>
          <p className="text-xs text-muted">Real-time geospatial vector telemetry from driver transponder.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="status-dot active-pulsing" style={{ backgroundColor: isDiverging ? 'var(--amber-accent)' : 'var(--emerald-accent)' }} />
          <span className="mono text-xs font-semibold text-secondary">
            {isDiverging ? 'ANOMALOUS VECTOR DETECTED' : 'VECTOR TRACKING NORMAL'}
          </span>
        </div>
      </div>

      {/* SVG Canvas Map Visualizer */}
      <div className="vector-map-canvas">
        <svg width="100%" height="100%" viewBox="0 0 600 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Subtle Grid Lines */}
          <defs>
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#e2e8f0" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* District boundary line */}
          <line x1="260" y1="0" x2="260" y2="240" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 4" />
          <text x="265" y="20" fill="#94a3b8" fontSize="10" fontFamily="JetBrains Mono" fontWeight="600">
            DISTRICT BOUNDARY LINE 04
          </text>

          {/* Optimal Intended Route (Grey Dashed) */}
          <path 
            d="M 60 120 C 180 120, 320 120, 520 120" 
            stroke="#94a3b8" 
            strokeWidth="2" 
            strokeDasharray="6 6" 
          />
          <text x="140" y="110" fill="#94a3b8" fontSize="10" fontFamily="JetBrains Mono">
            Planned Route Vector
          </text>

          {/* Actual Erratic Trajectory (Blue/Coral Vector showing unexpected loops) */}
          <path 
            d="M 60 120 Q 140 70, 220 140 T 320 210 Q 380 40, 420 170" 
            stroke={isDiverging ? "#ef4444" : "#2563eb"} 
            strokeWidth="3.5" 
            fill="none" 
            strokeLinecap="round" 
          />

          {/* Origin Node: Restaurant */}
          <circle cx="60" cy="120" r="8" fill="#2563eb" />
          <circle cx="60" cy="120" r="16" fill="rgba(37, 99, 235, 0.15)" />
          <text x="40" y="150" fill="#0f172a" fontSize="11" fontFamily="Inter" fontWeight="700">
            Node ALPHA
          </text>
          <text x="40" y="164" fill="#64748b" fontSize="9" fontFamily="JetBrains Mono">
            Culinary Hub
          </text>

          {/* Errant Driver Position */}
          <g transform="translate(420, 170)">
            <circle cx="0" cy="0" r="10" fill={isDiverging ? "#ef4444" : "#2563eb"} />
            <circle cx="0" cy="0" r="20" fill={isDiverging ? "rgba(239, 68, 68, 0.2)" : "rgba(37, 99, 235, 0.2)"} className="active-pulsing" />
            <polygon points="-4,-4 6,0 -4,4" fill="#ffffff" transform="rotate(45)" />
            <text x="16" y="4" fill="#0f172a" fontSize="11" fontFamily="Inter" fontWeight="700">
              Unit #04-DISPATCH
            </text>
            <text x="16" y="18" fill="#ef4444" fontSize="9" fontFamily="JetBrains Mono" fontWeight="600">
              Deviation: {deviationIndex || '+140%'}
            </text>
          </g>

          {/* Target Destination Node */}
          <circle cx="520" cy="120" r="8" fill="#059669" />
          <circle cx="520" cy="120" r="16" fill="rgba(5, 150, 105, 0.15)" />
          <text x="490" y="150" fill="#0f172a" fontSize="11" fontFamily="Inter" fontWeight="700">
            Recipient Hub
          </text>
          <text x="490" y="164" fill="#64748b" fontSize="9" fontFamily="JetBrains Mono">
            Suite 402, Sector 7
          </text>
        </svg>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Navigation style={{ width: 14, height: 14, color: 'var(--brand-primary)' }} />
          <span>Vector Azimuth: <strong>241° SW (Off-Axis by 68°)</strong></span>
        </div>
        <div className="mono text-xs text-muted">
          Transponder Protocol: DOM-RF9
        </div>
      </div>
    </div>
  );
}
