import { useSheetData } from '../lib/useSheetData';
import ViewportClamp from '../lib/ViewportClamp';
import { formatIfNumericDK } from '../lib/tableUtils';
import { overlayConfig } from '../lib/overlayConfig';
import LoadingSpinner from '../lib/LoadingSpinner';
import { useState } from 'react';

export default function OverlayRiderPresentation() {
  const { allData, loading, refresh, dataUpdated } = useSheetData(5000);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleLogoClick = async () => {
    setIsRefreshing(true);
    try {
      // Clear cache on server
      await fetch('/api/clear-cache', { method: 'POST' });
      // Refresh data
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
  
  const riderData = {
    Nummer: rider[1] || '',
    ImageUrl: rider[2] || '',
    Navn: rider[3] || '',
    Alder: rider[4] || '',
    Række: rider[5] || '',
    Klub: rider[6] || '',
    Sponsor: rider[7] || '',
    Run1: rider[13] || '',
    Run2: rider[14] || '',
    BestRun: rider[15] || '',
    Placering: rider[16] || ''
  };

  return (
    <ViewportClamp fixedTop={80} earlyThreshold={60} designWidth={1920} designHeight={1080} contentWidth="design" center={true}>
      <div style={{ position: 'relative', width: '100%', maxWidth: 1800, margin: '10px auto 50px', fontFamily: 'Arial, sans-serif', backgroundColor: overlayConfig.backgroundColor, minHeight: '100vh' }}>
        
        {/* Mills Club branding - top right */}
        <div style={{
          position: 'absolute',
          top: 26,
          right: 0,
          width: 660,
          pointerEvents: 'auto',
          textAlign: 'right',
          zIndex: 40,
          cursor: 'pointer'
        }}
        onClick={handleLogoClick}
        title="Click to refresh data">
          <div className={dataUpdated ? 'logo-glow' : ''} style={{
            fontSize: 138,
            fontWeight: 900,
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontFamily: 'Brush Script MT, cursive',
            fontStyle: 'italic',
            lineHeight: 0.7,
            transform: 'translateY(-55%)',
            filter: 'drop-shadow(0 16px 26px rgba(0,0,0,0.95)) drop-shadow(0 8px 14px rgba(0,0,0,0.7)) drop-shadow(3px 3px 0 rgba(255,215,0,0.55))'
          }}>Mills Club</div>
          <style jsx>{`
            .logo-glow {
              animation: glow-pulse 0.8s ease-in-out;
            }
            @keyframes glow-pulse {
              0%, 100% {
                filter: drop-shadow(0 16px 26px rgba(0,0,0,0.95)) drop-shadow(0 8px 14px rgba(0,0,0,0.7)) drop-shadow(3px 3px 0 rgba(255,215,0,0.55));
              }
              50% {
                filter: drop-shadow(0 0 30px rgba(255,215,0,1)) drop-shadow(0 0 60px rgba(255,165,0,0.8)) drop-shadow(0 0 90px rgba(255,140,0,0.6)) drop-shadow(3px 3px 0 rgba(255,215,0,0.55));
              }
            }
          `}</style>
          <div style={{
            marginTop: -26,
            display: 'inline-block',
            transform: 'skewX(-6deg)',
            background: 'linear-gradient(135deg, #1e40af 0%, #2f5fc4 55%, #3f7fdc 100%)',
            padding: '8px 40px 10px 46px',
            border: '2px solid rgba(255,255,255,0.45)',
            boxShadow: '0 12px 24px rgba(0,0,0,0.8), 0 5px 12px rgba(0,0,0,0.6), inset 0 2px 0 rgba(255,255,255,0.55), inset 0 -2px 0 rgba(0,0,0,0.65)',
            textShadow: '0 5px 10px rgba(0,0,0,0.9), 1px 1px 0 rgba(0,0,0,0.7)',
            fontSize: 30,
            fontWeight: 900,
            letterSpacing: 5,
            color: '#fff'
          }}>
            <span style={{ display: 'inline-block', transform: 'skewX(6deg)', position: 'relative', top: 2 }}>SJÆLLANDSMESTERSKABERNE</span>
          </div>
        </div>

        {/* Main content area */}
        <div style={{ display: 'flex', gap: 24, marginTop: 90 }}>
          
          {/* Left side - Rider Image */}
          {riderData.ImageUrl && (
            <div style={{
              width: 480,
              height: 640,
              flexShrink: 0,
              background: 'linear-gradient(to bottom, #2a2a2a 0%, #1a1a1a 100%)',
              boxShadow: 'inset 0 4px 0 rgba(255,255,255,0.15), inset 0 -6px 0 rgba(0,0,0,0.6), 0 8px 16px rgba(0,0,0,0.5)',
              overflow: 'hidden',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img 
                src={`/api/proxy-image?url=${encodeURIComponent(riderData.ImageUrl)}`}
                alt={riderData.Navn}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
          )}

          {/* Right side - Info */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
            
            {/* Name and Number */}
            <div style={{
              background: 'linear-gradient(to bottom, #1e40af 0%, #1e3a8a 100%)',
              padding: '32px 40px',
              boxShadow: 'inset 0 4px 0 rgba(255,255,255,0.3), inset 0 -6px 0 rgba(0,0,0,0.6), 0 8px 16px rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ 
                  fontSize: 64, 
                  fontWeight: 900, 
                  color: '#fff',
                  letterSpacing: 3,
                  textTransform: 'uppercase',
                  textShadow: '0 6px 12px rgba(0,0,0,0.8), 0 3px 6px rgba(0,0,0,0.6), 2px 2px 0 rgba(0,0,0,0.5)'
                }}>
                  {riderData.Navn}
                </div>
              </div>
            </div>

            {/* Info Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ 
                background: 'linear-gradient(to bottom, #2a2a2a 0%, #1a1a1a 100%)',
                padding: '24px 28px',
                boxShadow: 'inset 0 3px 0 rgba(255,255,255,0.12), inset 0 -4px 0 rgba(0,0,0,0.5), 0 3px 6px rgba(0,0,0,0.3)'
              }}>
                <div style={{ color: '#888', fontSize: 18, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 2, fontWeight: 600 }}>
                  RÆKKE
                </div>
                <div style={{ color: '#fff', fontSize: 42, fontWeight: 900, textShadow: '0 4px 8px rgba(0,0,0,0.8)' }}>
                  {riderData.Række}
                </div>
              </div>

              <div style={{ 
                background: 'linear-gradient(to bottom, #2a2a2a 0%, #1a1a1a 100%)',
                padding: '24px 28px',
                boxShadow: 'inset 0 3px 0 rgba(255,255,255,0.12), inset 0 -4px 0 rgba(0,0,0,0.5), 0 3px 6px rgba(0,0,0,0.3)'
              }}>
                <div style={{ color: '#888', fontSize: 18, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 2, fontWeight: 600 }}>
                  ALDER
                </div>
                <div style={{ color: '#fff', fontSize: 42, fontWeight: 900, textShadow: '0 4px 8px rgba(0,0,0,0.8)' }}>
                  {riderData.Alder}
                </div>
              </div>

              <div style={{ 
                background: 'linear-gradient(to bottom, #2a2a2a 0%, #1a1a1a 100%)',
                padding: '24px 28px',
                gridColumn: 'span 2',
                boxShadow: 'inset 0 3px 0 rgba(255,255,255,0.12), inset 0 -4px 0 rgba(0,0,0,0.5), 0 3px 6px rgba(0,0,0,0.3)'
              }}>
                <div style={{ color: '#888', fontSize: 18, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 2, fontWeight: 600 }}>
                  KLUB/HOLD
                </div>
                <div style={{ color: '#fff', fontSize: 32, fontWeight: 700, lineHeight: 1.2, textShadow: '0 3px 6px rgba(0,0,0,0.8)' }}>
                  {riderData.Klub}
                </div>
              </div>
            </div>

            {/* Best Trick / Sponsor */}
            {riderData.Sponsor && (
              <div style={{ 
                background: 'linear-gradient(to bottom, #2a2a2a 0%, #1a1a1a 100%)',
                padding: '24px 32px',
                boxShadow: 'inset 0 3px 0 rgba(255,255,255,0.12), inset 0 -4px 0 rgba(0,0,0,0.5), 0 3px 6px rgba(0,0,0,0.3)'
              }}>
                <div style={{ color: '#888', fontSize: 16, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 2, fontWeight: 700 }}>
                  Best trick/Sponsor
                </div>
                <div style={{ color: '#fff', fontSize: 28, fontWeight: 700, textShadow: '0 3px 6px rgba(0,0,0,0.8)' }}>
                  {riderData.Sponsor}
                </div>
              </div>
            )}

            {/* Scores */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16 }}>
              <div style={{ 
                background: 'linear-gradient(to bottom, #1e40af 0%, #1e3a8a 100%)',
                padding: '24px 20px',
                textAlign: 'center',
                boxShadow: 'inset 0 4px 0 rgba(255,255,255,0.3), inset 0 -5px 0 rgba(0,0,0,0.6), 0 4px 8px rgba(0,0,0,0.3)'
              }}>
                <div style={{ color: '#cce5ff', fontSize: 14, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 2, fontWeight: 700 }}>
                  PLACERING
                </div>
                <div style={{ color: '#fff', fontSize: 38, fontWeight: 900, textShadow: '0 4px 8px rgba(0,0,0,0.8)' }}>
                  {riderData.Placering || '-'}
                </div>
              </div>

              <div style={{ 
                background: 'linear-gradient(to bottom, #1e40af 0%, #1e3a8a 100%)',
                padding: '24px 20px',
                textAlign: 'center',
                boxShadow: 'inset 0 4px 0 rgba(255,255,255,0.3), inset 0 -5px 0 rgba(0,0,0,0.6), 0 4px 8px rgba(0,0,0,0.3)'
              }}>
                <div style={{ color: '#cce5ff', fontSize: 14, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 2, fontWeight: 700 }}>
                  RUN 1
                </div>
                <div style={{ color: '#fff', fontSize: 38, fontWeight: 900, textShadow: '0 4px 8px rgba(0,0,0,0.8)' }}>
                  {riderData.Run1 ? formatIfNumericDK(riderData.Run1) : '-'}
                </div>
              </div>

              <div style={{ 
                background: 'linear-gradient(to bottom, #1e40af 0%, #1e3a8a 100%)',
                padding: '24px 20px',
                textAlign: 'center',
                boxShadow: 'inset 0 4px 0 rgba(255,255,255,0.3), inset 0 -5px 0 rgba(0,0,0,0.6), 0 4px 8px rgba(0,0,0,0.3)'
              }}>
                <div style={{ color: '#cce5ff', fontSize: 14, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 2, fontWeight: 700 }}>
                  RUN 2
                </div>
                <div style={{ color: '#fff', fontSize: 38, fontWeight: 900, textShadow: '0 4px 8px rgba(0,0,0,0.8)' }}>
                  {riderData.Run2 ? formatIfNumericDK(riderData.Run2) : '-'}
                </div>
              </div>

              <div style={{ 
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
                padding: '24px 20px',
                textAlign: 'center',
                boxShadow: 'inset 0 4px 0 rgba(255,255,255,0.4), inset 0 -5px 0 rgba(0,0,0,0.5), 0 4px 8px rgba(0,0,0,0.3)'
              }}>
                <div style={{ color: 'rgba(0,0,0,0.7)', fontSize: 14, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 2, fontWeight: 900 }}>
                  BEST RUN
                </div>
                <div style={{ color: '#fff', fontSize: 38, fontWeight: 900, textShadow: '0 4px 8px rgba(0,0,0,0.6), 2px 2px 0 rgba(0,0,0,0.4)' }}>
                  {riderData.BestRun ? formatIfNumericDK(riderData.BestRun) : '-'}
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </ViewportClamp>
  );
}
