import { useSheetData } from '../lib/useSheetData';

export default function OverlayRiderRun() {
  const { allData, loading } = useSheetData(5000);

  if (loading || !allData) {
    return null;
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
      minHeight: '100vh', 
      background: '#000',
      display: 'flex',
      alignItems: 'flex-end',
      padding: '0 60px 60px 60px',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Bottom bar */}
      <div style={{ width: '100%', display: 'flex', alignItems: 'stretch', height: 110 }}>
        {/* Blue section with branding and category */}
        <div style={{
          background: 'linear-gradient(to bottom, #1e40af 0%, #1e3a8a 100%)',
          padding: '20px 50px',
          display: 'flex',
          alignItems: 'center',
          gap: 40,
          transform: 'skewX(-10deg)',
          marginRight: -20,
          minWidth: 460,
          boxShadow: 'inset 0 4px 0 rgba(255,255,255,0.3), inset 0 -5px 0 rgba(0,0,0,0.6), 0 4px 8px rgba(0,0,0,0.4)'
        }}>
          <div style={{ transform: 'skewX(10deg)', display: 'flex', alignItems: 'center', gap: 40 }}>
            <div style={{ 
              fontSize: 48, 
              fontWeight: 900, 
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontFamily: 'Brush Script MT, cursive',
              fontStyle: 'italic',
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.8)) drop-shadow(0 2px 4px rgba(0,0,0,0.6)) drop-shadow(2px 2px 0 rgba(255,215,0,0.4)) drop-shadow(4px 4px 0 rgba(0,0,0,0.4))'
            }}>
              Mills Club
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.25)',
              padding: '10px 24px',
              boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.2), inset 0 -2px 0 rgba(0,0,0,0.3)'
            }}>
              <div style={{ color: '#fff', fontSize: 20, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2, textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                {riderInfo.række}
              </div>
            </div>
          </div>
        </div>

        {/* Dark section with rider name */}
        <div style={{
          background: 'linear-gradient(to bottom, #2a2a2a 0%, #1a1a1a 100%)',
          padding: '20px 50px',
          display: 'flex',
          alignItems: 'center',
          transform: 'skewX(-10deg)',
          marginRight: -20,
          flex: 1,
          boxShadow: 'inset 0 4px 0 rgba(255,255,255,0.2), inset 0 -6px 0 rgba(0,0,0,0.6), 0 4px 8px rgba(0,0,0,0.4)'
        }}>
          <div style={{ transform: 'skewX(10deg)' }}>
            <div style={{ color: '#fff', fontSize: 40, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 3, textShadow: '0 4px 8px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6)' }}>
              {riderInfo.navn}
            </div>
          </div>
        </div>

        {/* Scores section */}
        <div style={{
          display: 'flex',
          gap: 0,
          alignItems: 'stretch'
        }}>
          {/* Run 1 */}
          <div style={{ 
            background: 'linear-gradient(to bottom, #2a2a2a 0%, #1a1a1a 100%)',
            padding: '20px 32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minWidth: 140,
            textAlign: 'center',
            borderLeft: '2px solid #000',
            boxShadow: 'inset 0 3px 0 rgba(255,255,255,0.12), inset 0 -4px 0 rgba(0,0,0,0.5), 0 3px 6px rgba(0,0,0,0.3)'
          }}>
            <div style={{ color: '#888', fontSize: 16, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 2, fontWeight: 700, textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>
              RUN 1
            </div>
            <div style={{ color: '#fff', fontSize: 32, fontWeight: 900, textShadow: '0 3px 6px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6)' }}>
              {riderInfo.run1}
            </div>
          </div>

          {/* Run 2 */}
          <div style={{ 
            background: 'linear-gradient(to bottom, #2a2a2a 0%, #1a1a1a 100%)',
            padding: '20px 32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minWidth: 140,
            textAlign: 'center',
            borderLeft: '2px solid #000',
            boxShadow: 'inset 0 3px 0 rgba(255,255,255,0.12), inset 0 -4px 0 rgba(0,0,0,0.5), 0 3px 6px rgba(0,0,0,0.3)'
          }}>
            <div style={{ color: '#888', fontSize: 16, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 2, fontWeight: 700, textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>
              RUN 2
            </div>
            <div style={{ color: '#fff', fontSize: 32, fontWeight: 900, textShadow: '0 3px 6px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6)' }}>
              {riderInfo.run2}
            </div>
          </div>

          {/* Best Run - Blue highlight */}
          <div style={{ 
            background: 'linear-gradient(to bottom, #1e40af 0%, #1e3a8a 100%)',
            padding: '20px 40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minWidth: 160,
            textAlign: 'center',
            borderLeft: '2px solid #000',
            boxShadow: 'inset 0 4px 0 rgba(255,255,255,0.3), inset 0 -5px 0 rgba(0,0,0,0.6), 0 4px 8px rgba(0,0,0,0.3)'
          }}>
            <div style={{ color: '#cce5ff', fontSize: 16, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 2, fontWeight: 700, textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>
              BEST RUN
            </div>
            <div style={{ color: '#fff', fontSize: 36, fontWeight: 900, textShadow: '0 4px 8px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6)' }}>
              {riderInfo.bestRun}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
