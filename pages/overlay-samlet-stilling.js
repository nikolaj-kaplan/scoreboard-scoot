import { useSheetData } from '../lib/useSheetData';
import ViewportClamp from '../lib/ViewportClamp';
import { overlayConfig } from '../lib/overlayConfig';
import LoadingSpinner from '../lib/LoadingSpinner';
import StandingsTable from '../lib/StandingsTable';
import { useState } from 'react';

export default function OverlaySamletStilling() {
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

  const rows = allData['Out1_Oversigt'] || [];
  if (rows.length < 4) return null;

  // Helper function to extract heat number from code like "U11.H1.01" -> "Heat 1"
  const formatHeatCode = (code) => {
    if (!code) return '';
    const parts = code.split('.');
    if (parts.length >= 2 && parts[1].startsWith('H')) {
      const heatNum = parts[1].substring(1); // Extract number after 'H'
      return `Heat ${heatNum}`;
    }
    return '';
  };

  // Extract "Samlet Stilling" section (columns 15-20)
  const title = rows[0]?.[15] || '';
  const subtitle = rows[0]?.[16] || '';
  
  // Map data to standard format: rank, name, run1, run2, bestRun, heatCode
  const dataRows = rows.slice(4)
    .map(row => ({
      rank: row[15] || '-',       // Placering (column 15)
      heatCode: formatHeatCode(row[16] || ''), // Heat code (column 16)
      name: row[17] || '',        // Navn (column 17)
      run1: row[18] || '',        // Run1 (column 18)
      run2: row[19] || '',        // Run2 (column 19)
      bestRun: row[20] || ''      // Best Run (column 20)
    }))
    .filter(row => row.name);

  return (
    <ViewportClamp fixedTop={120} earlyThreshold={12} designWidth={1920} designHeight={1080} contentWidth="design">
      <div style={{ position: 'relative', width: '100%', maxWidth: 1880, margin: '10px 20px 50px', backgroundColor: overlayConfig.backgroundColor, minHeight: '100vh' }}>
        <div style={{ position: 'relative', margin: '0 0 6px 0', height: 110 }}>
          <div style={{ display: 'flex', height: '100%' }}>
            {/* Left dark section */}
            <div style={{
              background: 'linear-gradient(to bottom, #2a2a2a 0%, #1a1a1a 100%)',
              padding: '18px 50px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              transform: 'skewX(-10deg)',
              marginRight: -20,
              minWidth: 380,
              boxShadow: 'inset 0 4px 0 rgba(255,255,255,0.2), inset 0 -6px 0 rgba(0,0,0,0.6), 0 8px 16px rgba(0,0,0,0.5), 0 4px 8px rgba(0,0,0,0.4)'
            }}>
              <div style={{ transform: 'skewX(10deg)' }}>
                <div style={{
                  fontSize: 56,
                  fontWeight: 900,
                  color: '#fff',
                  letterSpacing: 3,
                  lineHeight: 1.1,
                  textShadow: '0 6px 12px rgba(0,0,0,0.8), 0 3px 6px rgba(0,0,0,0.6), 2px 2px 0 rgba(0,0,0,0.5), 4px 4px 0 rgba(0,0,0,0.3)'
                }}>
                  {title}
                </div>
              </div>
            </div>
            {/* Blue section */}
            <div style={{
              background: 'linear-gradient(to bottom, #1e40af 0%, #1e3a8a 100%)',
              padding: '18px 50px',
              display: 'flex',
              alignItems: 'center',
              flex: 1,
              transform: 'skewX(-10deg)',
              boxShadow: 'inset 0 4px 0 rgba(255,255,255,0.3), inset 0 -6px 0 rgba(0,0,0,0.6), 0 8px 16px rgba(0,0,0,0.5), 0 4px 8px rgba(0,0,0,0.4)'
            }}>
              <div style={{ transform: 'skewX(10deg)' }}>
                <div style={{
                  fontSize: 52,
                  fontWeight: 900,
                  color: '#fff',
                  letterSpacing: 4,
                  textTransform: 'uppercase',
                  textShadow: '0 6px 12px rgba(0,0,0,0.8), 0 3px 6px rgba(0,0,0,0.6), 2px 2px 0 rgba(0,0,0,0.5), 4px 4px 0 rgba(0,0,0,0.3)'
                }}>
                  {subtitle}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* External branding overlay */}
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
        {/* Subtitle bar below header */}
        <div style={{
          background: 'linear-gradient(90deg, #1e40af 0%, transparent 100%)',
          padding: '10px 36px',
          marginTop: 2,
          boxShadow: 'inset 0 3px 0 rgba(255,255,255,0.25), inset 0 -3px 0 rgba(0,0,0,0.5), 0 4px 8px rgba(0,0,0,0.4)'
        }}>
          <div style={{
            fontSize: 26,
            fontWeight: 700,
            color: '#fff',
            letterSpacing: 3,
            textTransform: 'uppercase',
            textShadow: '0 4px 8px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6), 2px 2px 0 rgba(0,0,0,0.5)'
          }}>Samlet Stilling</div>
        </div>
        {/* Table */}
        <StandingsTable dataRows={dataRows} />
      </div>
    </ViewportClamp>
  );
}
