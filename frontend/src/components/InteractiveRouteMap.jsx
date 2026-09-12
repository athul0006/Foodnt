import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Compass } from 'lucide-react';

export default function InteractiveRouteMap({ stage = 0, stageData }) {
  const [zoom, setZoom] = useState(1);
  const [showPlanned, setShowPlanned] = useState(true);
  const [showDistrict, setShowDistrict] = useState(true);

  // Driver positions & rotation angles for each deterministic stage
  const driverPositions = [
    { x: 220, y: 345, angle: 30, status: 'Driver Assigned - Approaching Node ALPHA' },
    { x: 190, y: 350, angle: 40, status: 'Pickup Approach Detected (ETA: 10 min)' },
    { x: 360, y: 240, angle: 65, status: 'Trajectory Optimization: Off-Route Branch (ETA: 17 min)' },
    { x: 335, y: 240, angle: 225, status: 'U-Turn Executed (Opposite Bearing - ETA: 28 min)' },
    { x: 575, y: 415, angle: 140, status: 'District 04 Crossing Verified (ETA: 41 min)' },
    { x: 805, y: 475, angle: 110, status: 'Severe Orbital Divergence (ETA: 55 min)' },
    { x: 720, y: 160, angle: 0, status: 'Fulfillment Completed: Significant Variance' }
  ];

  const currentDriver = driverPositions[stage] || driverPositions[0];

  // Actual route paths for each stage
  const actualPaths = [
    "M 160 360 L 220 345",
    "M 160 360 L 260 325",
    "M 160 360 L 260 325 L 360 240",
    "M 160 360 L 260 325 L 360 240 C 410 190, 420 120, 360 120 C 300 120, 305 190, 350 210 L 335 240",
    "M 160 360 L 260 325 L 360 240 C 410 190, 420 120, 360 120 C 300 120, 305 190, 350 210 L 335 240 L 375 350 L 500 385 L 575 415",
    "M 160 360 L 260 325 L 360 240 C 410 190, 420 120, 360 120 C 300 120, 305 190, 350 210 L 335 240 L 375 350 L 500 385 L 575 415 Q 670 450, 740 430 L 805 475",
    "M 160 360 L 260 325 L 360 240 C 410 190, 420 120, 360 120 C 300 120, 305 190, 350 210 L 335 240 L 375 350 L 500 385 L 575 415 Q 670 450, 740 430 L 805 475 C 860 380, 840 220, 720 160"
  ];

  const routeColor = stage === 0 ? 'var(--brand-primary)' : stage === 1 ? 'var(--emerald-accent)' : stage <= 3 ? 'var(--amber-accent)' : 'var(--coral-accent)';

  return (
    <div className="interactive-map-card">
      {/* Map Header Controls */}
      <div className="map-header-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Compass style={{ width: 18, height: 18, color: 'var(--brand-primary)' }} />
          <div>
            <h3 className="text-sm font-bold text-primary">Municipal Geospatial Telemetry Grid</h3>
            <p className="text-xs text-muted">Vector Tracking Protocol DOM-RF9 • Node Synchronized</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            type="button"
            className={`btn btn-sm ${showPlanned ? 'btn-secondary' : 'btn-outline'}`}
            onClick={() => setShowPlanned(!showPlanned)}
            style={{ fontSize: '0.72rem', padding: '4px 8px' }}
          >
            {showPlanned ? 'Hide Planned Vector' : 'Show Planned Vector'}
          </button>
          
          <button
            type="button"
            className={`btn btn-sm ${showDistrict ? 'btn-secondary' : 'btn-outline'}`}
            onClick={() => setShowDistrict(!showDistrict)}
            style={{ fontSize: '0.72rem', padding: '4px 8px' }}
          >
            {showDistrict ? 'Hide District Border' : 'Show District Border'}
          </button>
        </div>
      </div>

      {/* Main Map Viewport Canvas */}
      <div className="map-canvas-wrapper">
        {/* Floating Zoom Controls */}
        <div className="map-floating-controls">
          <button
            type="button"
            className="map-control-btn"
            onClick={() => setZoom(z => Math.min(1.6, z + 0.2))}
            title="Zoom In"
          >
            <ZoomIn style={{ width: 16, height: 16 }} />
          </button>
          <button
            type="button"
            className="map-control-btn"
            onClick={() => setZoom(z => Math.max(0.8, z - 0.2))}
            title="Zoom Out"
          >
            <ZoomOut style={{ width: 16, height: 16 }} />
          </button>
          <button
            type="button"
            className="map-control-btn"
            onClick={() => setZoom(1)}
            title="Reset Map View"
          >
            <RotateCcw style={{ width: 15, height: 15 }} />
          </button>
        </div>

        {/* Floating Real-Time Vector Status Pill */}
        <div className="map-floating-banner">
          <span className="status-dot active-pulsing" style={{ backgroundColor: routeColor }} />
          <span className="mono font-semibold">{currentDriver.status}</span>
          <span style={{ color: '#94a3b8' }}>•</span>
          <span className="mono">Azimuth: {currentDriver.angle}°</span>
        </div>

        {/* Vector SVG Map Rendering */}
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 900 520" 
          preserveAspectRatio="xMidYMid meet"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center center', transition: 'transform 0.2s ease-out' }}
        >
          {/* Subtle Grid Background */}
          <defs>
            <pattern id="street-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <rect width="40" height="40" fill="#f8fafc" />
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#edf2f7" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="900" height="520" fill="url(#street-grid)" />

          {/* Urban City Blocks (Subtle Geometric Shapes) */}
          <g fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1">
            <rect x="60" y="40" width="100" height="80" rx="4" />
            <rect x="180" y="40" width="120" height="80" rx="4" />
            <rect x="60" y="140" width="100" height="120" rx="4" />
            <rect x="180" y="140" width="120" height="120" rx="4" />
            <rect x="60" y="280" width="80" height="180" rx="4" />
            <rect x="180" y="380" width="140" height="90" rx="4" />

            <rect x="320" y="40" width="110" height="60" rx="4" />
            <rect x="320" y="270" width="110" height="70" rx="4" />
            <rect x="320" y="360" width="110" height="110" rx="4" />

            {/* East District Blocks */}
            <rect x="540" y="40" width="140" height="90" rx="4" />
            <rect x="700" y="40" width="140" height="90" rx="4" />
            <rect x="540" y="150" width="130" height="110" rx="4" />
            <rect x="690" y="190" width="150" height="90" rx="4" />
            <rect x="540" y="280" width="140" height="90" rx="4" />
            <rect x="700" y="300" width="140" height="100" rx="4" />
            <rect x="540" y="390" width="110" height="90" rx="4" />
            <rect x="670" y="420" width="170" height="60" rx="4" />
          </g>

          {/* Waterway / River Dividing Municipal Sectors */}
          <path
            d="M 470 0 C 450 100, 520 220, 485 320 C 460 390, 510 470, 495 520 L 535 520 C 550 470, 500 390, 525 320 C 560 220, 490 100, 510 0 Z"
            fill="#e0f2fe"
            stroke="#bae6fd"
            strokeWidth="1.5"
          />
          <text x="475" y="40" fill="#0284c7" fontSize="9" fontFamily="JetBrains Mono" fontWeight="600" transform="rotate(85 475,40)">
            RIVER CANAL METRO
          </text>

          {/* Bridge Overpasses Crossing River */}
          <rect x="470" y="130" width="55" height="16" fill="#cbd5e1" stroke="#94a3b8" rx="2" />
          <rect x="470" y="250" width="55" height="20" fill="#cbd5e1" stroke="#94a3b8" rx="2" />
          <rect x="470" y="375" width="55" height="20" fill="#cbd5e1" stroke="#94a3b8" rx="2" />

          {/* Arterial Road Network (Thick White Roadways) */}
          <g stroke="#ffffff" strokeWidth="16" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Grand Arterial East-West */}
            <path d="M 40 260 L 860 260" />
            {/* North-South Corridors */}
            <path d="M 310 30 L 310 490" />
            <path d="M 685 30 L 685 490" />
            {/* Northern Orbital Bypass */}
            <path d="M 160 360 L 160 30 C 450 -10, 800 20, 860 260 L 860 480" />
            {/* Diagonal Connection to Sector 7 */}
            <path d="M 310 260 L 500 260 L 720 160" />
            {/* Southern Industrial Connector */}
            <path d="M 310 385 L 685 385 L 860 480" />
          </g>

          {/* Road Network Centerlines */}
          <g stroke="#e2e8f0" strokeWidth="1" fill="none" strokeDasharray="6 6">
            <path d="M 40 260 L 860 260" />
            <path d="M 310 30 L 310 490" />
            <path d="M 685 30 L 685 490" />
            <path d="M 310 385 L 685 385 L 860 480" />
          </g>

          {/* District Boundary Checkpoint Line */}
          {showDistrict && (
            <g>
              <line x1="495" y1="0" x2="495" y2="520" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="6 6" />
              <rect x="420" y="475" width="150" height="24" fill="rgba(15, 23, 42, 0.9)" rx="4" />
              <text x="430" y="491" fill="#ffffff" fontSize="9" fontFamily="JetBrains Mono" fontWeight="700">
                DISTRICT 04 BORDER CHECKPOINT
              </text>
            </g>
          )}

          {/* Street & Zone Cartography Labels */}
          <text x="70" y="254" fill="#94a3b8" fontSize="9" fontFamily="JetBrains Mono" fontWeight="600">
            GRAND ARTERIAL AVE
          </text>
          <text x="540" y="254" fill="#94a3b8" fontSize="9" fontFamily="JetBrains Mono" fontWeight="600">
            SECTOR 7 EXPRESSWAY
          </text>
          <text x="70" y="495" fill="#64748b" fontSize="10" fontFamily="Inter" fontWeight="700">
            DISTRICT 01 (CENTRAL MUNICIPAL GRID)
          </text>
          <text x="650" y="30" fill="#64748b" fontSize="10" fontFamily="Inter" fontWeight="700">
            DISTRICT 04 (OUTER INDUSTRIAL RIM)
          </text>
          <text x="700" y="508" fill="#ef4444" fontSize="9" fontFamily="JetBrains Mono" fontWeight="700">
            NORTHERN ORBITAL BYPASS
          </text>

          {/* Planned Direct Route Line (Grey Dashed) */}
          {showPlanned && (
            <g>
              <path
                d="M 160 360 L 310 260 L 495 260 L 720 160"
                stroke="#94a3b8"
                strokeWidth="3.5"
                fill="none"
                strokeDasharray="8 8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <text x="360" y="280" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono" fontWeight="600">
                Optimal Planned Vector (2.4 km)
              </text>
            </g>
          )}

          {/* Actual Escalating Route Line (Solid Blue ➔ Amber ➔ Coral) */}
          <path
            d={actualPaths[stage]}
            stroke={routeColor}
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Deviation Highlights (Wrong Turn / U-Turn annotation at stage >= 2) */}
          {stage >= 2 && (
            <g transform="translate(360, 100)">
              <rect x="-65" y="-12" width="130" height="22" fill="#fef2f2" stroke="#fca5a5" rx="3" />
              <text x="0" y="3" fill="#dc2626" fontSize="9" fontFamily="JetBrains Mono" fontWeight="700" textAnchor="middle">
                ANOMALOUS U-TURN
              </text>
            </g>
          )}

          {/* District Crossing annotation at stage >= 3 */}
          {stage >= 3 && (
            <g transform="translate(560, 370)">
              <rect x="-85" y="-12" width="170" height="22" fill="#fffbeb" stroke="#fde68a" rx="3" />
              <text x="0" y="3" fill="#b45309" fontSize="9" fontFamily="JetBrains Mono" fontWeight="700" textAnchor="middle">
                DISTRICT LINE CROSSED (+225%)
              </text>
            </g>
          )}

          {/* NODE 1: RESTAURANT MARKER */}
          <g transform="translate(160, 360)">
            <circle cx="0" cy="0" r="18" fill="rgba(37, 99, 235, 0.15)" />
            <circle cx="0" cy="0" r="10" fill="#2563eb" />
            <circle cx="0" cy="0" r="4" fill="#ffffff" />
            {/* Marker Label */}
            <rect x="-60" y="-34" width="120" height="22" fill="#ffffff" stroke="#cbd5e1" rx="4" />
            <text x="0" y="-19" fill="#0f172a" fontSize="10" fontFamily="Inter" fontWeight="700" textAnchor="middle">
              RESTAURANT
            </text>
            <text x="0" y="28" fill="#64748b" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">
              Node ALPHA (Kitchen)
            </text>
          </g>

          {/* NODE 2: CUSTOMER MARKER */}
          <g transform="translate(720, 160)">
            <circle cx="0" cy="0" r="20" fill="rgba(5, 150, 105, 0.15)" />
            <circle cx="0" cy="0" r="11" fill="#059669" />
            <circle cx="0" cy="0" r="4" fill="#ffffff" />
            {/* Marker Label */}
            <rect x="-55" y="-36" width="110" height="22" fill="#ffffff" stroke="#cbd5e1" rx="4" />
            <text x="0" y="-21" fill="#0f172a" fontSize="10" fontFamily="Inter" fontWeight="700" textAnchor="middle">
              CUSTOMER
            </text>
            <text x="0" y="28" fill="#64748b" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">
              Sector 7, Suite 402
            </text>
          </g>

          {/* NODE 3: DYNAMIC DRIVER MARKER */}
          <g transform={`translate(${currentDriver.x}, ${currentDriver.y})`}>
            {/* Pulsing Radar Aura */}
            <circle cx="0" cy="0" r="22" fill={stage >= 3 ? "rgba(239, 68, 68, 0.25)" : "rgba(37, 99, 235, 0.25)"} className="active-pulsing" />
            <circle cx="0" cy="0" r="12" fill={routeColor} />
            
            {/* Directional Azimuth Pointer */}
            <g transform={`rotate(${currentDriver.angle})`}>
              <polygon points="-5,-5 8,0 -5,5" fill="#ffffff" />
            </g>

            {/* Floating Driver Label */}
            <rect x="18" y="-12" width="115" height="24" fill="rgba(15, 23, 42, 0.9)" rx="4" />
            <text x="75" y="4" fill="#ffffff" fontSize="9" fontFamily="JetBrains Mono" fontWeight="700" textAnchor="middle">
              DRIVER UNIT #04
            </text>
          </g>
        </svg>
      </div>

      {/* Map Legend Bar */}
      <div className="map-legend">
        <div className="legend-item">
          <div className="legend-line-planned" />
          <span>Planned Vector (2.4 km)</span>
        </div>

        <div className="legend-item">
          <div className="legend-line-actual" />
          <span>Active Driver Vector</span>
        </div>

        <div className="legend-item">
          <div className="legend-line-deviation" />
          <span>Errant Deviation Detour</span>
        </div>

        <div className="legend-item">
          <span className="status-dot" style={{ backgroundColor: '#2563eb' }} />
          <span>Node Alpha (Restaurant)</span>
        </div>

        <div className="legend-item">
          <span className="status-dot" style={{ backgroundColor: '#059669' }} />
          <span>Destination (Customer)</span>
        </div>
      </div>
    </div>
  );
}
