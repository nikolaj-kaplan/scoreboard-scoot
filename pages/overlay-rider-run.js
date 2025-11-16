import { useSheetData } from '../lib/useSheetData';
import { formatIfNumericDK } from '../lib/tableUtils';
import { overlayTheme } from '../lib/overlayStyles';
import { overlayConfig } from '../lib/overlayConfig';
import LoadingSpinner from '../lib/LoadingSpinner';
import { useState } from 'react';

export default function OverlayRiderRun() {
  const { allData, loading, refresh, dataUpdated } = useSheetData(5000);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleLogoClick = async () => {
    setIsRefreshing(true);
    try {
      await fetch('/api/clear-cache', { method: 'POST' });
      await refresh();
    } catch (error) {
      console.error('Error clearing cache:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (loading || isRefreshing || !allData) {
    return <LoadingSpinner />;
  }

  const rows = allData['Out2_ActiveRider'] || [];
  if (rows.length < 3) return null;

  // Row 2: Active rider data
  const rider = rows[2] || [];
  
  const riderInfo = {
    navn: rider[3] || '',
    række: rider[5] || '',
    run1: rider[13] || '-',
    run2: rider[14] || '-',
    bestRun: rider[15] || '-'
  };

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: 0,
      left: 0,
      right: 0,
      top: 0,
      backgroundColor: overlayConfig.backgroundColor
    }}>
      <div style={{ 
        position: 'fixed', 
        bottom: 20, 
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%', 
        maxWidth: overlayTheme.container.maxWidth, 
        fontFamily: 'Arial, sans-serif', 
        paddingLeft: 20, 
        paddingRight: 20,
        zIndex: 1000
      }}>
      <div style={{ width: '100%', display: 'flex', alignItems: 'stretch', height: overlayTheme.header.height }}>
          <div style={{
            background: 'linear-gradient(to bottom, #1e40af 0%, #1e3a8a 100%)',
            padding: overlayTheme.header.bluePadding,
            display: 'flex',
            alignItems: 'center',
            gap: 32,
            transform: 'skewX(-10deg)',
            marginRight: -20,
            minWidth: 460,
            boxShadow: 'inset 0 4px 0 rgba(255,255,255,0.3), inset 0 -5px 0 rgba(0,0,0,0.6), 0 4px 8px rgba(0,0,0,0.4)',
            cursor: 'pointer'
          }}
          onClick={handleLogoClick}
          title="Click to refresh data">
            <div style={{ transform: 'skewX(10deg)', display: 'flex', alignItems: 'center', gap: 40 }}>
              <div className={dataUpdated ? 'logo-glow' : ''} style={{
                fontSize: 54,
                fontWeight: 900,
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontFamily: 'Brush Script MT, cursive',
                fontStyle: 'italic',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.8)) drop-shadow(0 2px 4px rgba(0,0,0,0.6)) drop-shadow(2px 2px 0 rgba(255,215,0,0.4)) drop-shadow(4px 4px 0 rgba(0,0,0,0.4))'
              }}>Mills Club</div>
              <style jsx>{`
                .logo-glow {
                  animation: glow-pulse 0.8s ease-in-out;
                }
                @keyframes glow-pulse {
                  0%, 100% {
                    filter: drop-shadow(0 4px 8px rgba(0,0,0,0.8)) drop-shadow(0 2px 4px rgba(0,0,0,0.6)) drop-shadow(2px 2px 0 rgba(255,215,0,0.4)) drop-shadow(4px 4px 0 rgba(0,0,0,0.4));
                  }
                  50% {
                    filter: drop-shadow(0 0 25px rgba(255,215,0,1)) drop-shadow(0 0 50px rgba(255,165,0,0.8)) drop-shadow(0 0 75px rgba(255,140,0,0.6)) drop-shadow(2px 2px 0 rgba(255,215,0,0.4));
                  }
                }
              `}</style>
              <div style={{
                background: 'rgba(255, 255, 255, 0.25)',
                padding: '8px 20px',
                boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.25), inset 0 -2px 0 rgba(0,0,0,0.35)'
              }}>
                <div style={{ color: '#fff', fontSize: overlayTheme.fonts.badge - 6, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2, textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                  {riderInfo.række}
                </div>
              </div>
            </div>
          </div>
          <div style={{
            background: 'linear-gradient(to bottom, #2a2a2a 0%, #1a1a1a 100%)',
            padding: overlayTheme.header.darkPadding,
            display: 'flex',
            alignItems: 'center',
            transform: 'skewX(-10deg)',
            marginRight: -20,
            flex: 1,
            boxShadow: 'inset 0 4px 0 rgba(255,255,255,0.2), inset 0 -6px 0 rgba(0,0,0,0.6), 0 4px 8px rgba(0,0,0,0.4)'
          }}>
            <div style={{ transform: 'skewX(10deg)' }}>
              <div style={{ color: '#fff', fontSize: 44, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 3, textShadow: '0 4px 8px rgba(0,0,0,0.85), 0 2px 4px rgba(0,0,0,0.65)' }}>
                {riderInfo.navn}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 0, alignItems: 'stretch' }}>
            <div style={{
              background: 'linear-gradient(to bottom, #2a2a2a 0%, #1a1a1a 100%)',
              padding: '18px 28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              minWidth: 150,
              textAlign: 'center',
              borderLeft: '2px solid #000',
              boxShadow: 'inset 0 3px 0 rgba(255,255,255,0.12), inset 0 -4px 0 rgba(0,0,0,0.5), 0 3px 6px rgba(0,0,0,0.3)'
            }}>
              <div style={{ color: '#888', fontSize: 16, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 2, fontWeight: 700, textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>RUN 1</div>
              <div style={{ color: '#fff', fontSize: 34, fontWeight: 900, textShadow: '0 3px 6px rgba(0,0,0,0.85), 0 2px 4px rgba(0,0,0,0.65)' }}>{formatIfNumericDK(riderInfo.run1)}</div>
            </div>
            <div style={{
              background: 'linear-gradient(to bottom, #2a2a2a 0%, #1a1a1a 100%)',
              padding: '18px 28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              minWidth: 150,
              textAlign: 'center',
              borderLeft: '2px solid #000',
              boxShadow: 'inset 0 3px 0 rgba(255,255,255,0.12), inset 0 -4px 0 rgba(0,0,0,0.5), 0 3px 6px rgba(0,0,0,0.3)'
            }}>
              <div style={{ color: '#888', fontSize: 16, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 2, fontWeight: 700, textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>RUN 2</div>
              <div style={{ color: '#fff', fontSize: 34, fontWeight: 900, textShadow: '0 3px 6px rgba(0,0,0,0.85), 0 2px 4px rgba(0,0,0,0.65)' }}>{formatIfNumericDK(riderInfo.run2)}</div>
            </div>
            <div style={{
              background: 'linear-gradient(to bottom, #1e40af 0%, #1e3a8a 100%)',
              padding: '18px 32px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              minWidth: 170,
              textAlign: 'center',
              borderLeft: '2px solid #000',
              boxShadow: 'inset 0 4px 0 rgba(255,255,255,0.3), inset 0 -5px 0 rgba(0,0,0,0.6), 0 4px 8px rgba(0,0,0,0.3)'
            }}>
              <div style={{ color: '#cce5ff', fontSize: 16, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 2, fontWeight: 700, textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>BEST RUN</div>
              <div style={{ color: '#fff', fontSize: 38, fontWeight: 900, textShadow: '0 4px 8px rgba(0,0,0,0.85), 0 2px 4px rgba(0,0,0,0.65)' }}>{formatIfNumericDK(riderInfo.bestRun)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
