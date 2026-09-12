import React from 'react';
import { RefreshCw, Radio, AlertOctagon, CheckCircle2 } from 'lucide-react';

export default function TelemetryTimeline({ logs, onRecalibrate, isRecalibrating }) {
  return (
    <div className="telemetry-stream-box">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h3 className="text-base font-bold text-primary">Live Telemetry Event Log</h3>
          <p className="text-xs text-muted">Continuous event stream logged by the routing calibration engine.</p>
        </div>
        <button 
          type="button" 
          className="btn btn-outline btn-sm"
          onClick={onRecalibrate}
          disabled={isRecalibrating}
        >
          <RefreshCw style={{ width: 14, height: 14, animation: isRecalibrating ? 'spin 1s linear infinite' : 'none' }} />
          <span>Recalibrate Trajectory</span>
        </button>
      </div>

      <div className="stream-logs-container">
        {logs.length === 0 ? (
          <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Awaiting initial telemetry signal calibration...
          </div>
        ) : (
          logs.map((log, index) => {
            const isWarning = log.status.includes('U-turn') || log.status.includes('crossed') || log.status.includes('diverging') || log.status.includes('Suboptimal');
            const isDelivered = log.status.includes('Delivered');

            return (
              <div key={index} className={`stream-log-row ${isWarning ? 'divergent' : ''}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, shrink: 0 }}>
                  {isDelivered ? (
                    <CheckCircle2 style={{ width: 15, height: 15, color: 'var(--emerald-accent)' }} />
                  ) : isWarning ? (
                    <AlertOctagon style={{ width: 15, height: 15, color: 'var(--coral-accent)' }} />
                  ) : (
                    <Radio style={{ width: 15, height: 15, color: 'var(--brand-primary)' }} />
                  )}
                  <span className="stream-log-time">{log.time}</span>
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500 }}>{log.status}</div>
                </div>

                {log.deviation && (
                  <span className="mono font-semibold" style={{ fontSize: '0.75rem', color: isWarning ? 'var(--coral-dark)' : 'var(--text-muted)' }}>
                    Dev: {log.deviation}
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
