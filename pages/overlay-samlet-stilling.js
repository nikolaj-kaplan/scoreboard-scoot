import { useSheetData } from '../lib/useSheetData';
import { formatIfNumericDK } from '../lib/tableUtils';
import ViewportClamp from '../lib/ViewportClamp';
import { overlayConfig } from '../lib/overlayConfig';

export default function OverlaySamletStilling() {
  const { allData, loading } = useSheetData(5000);

  if (loading || !allData) {
    return null;
  }

  const rows = allData['Out1_Oversigt'] || [];
  if (rows.length < 4) return null;

  // Extract "Samlet Stilling" section (columns 15-20)
  const title = rows[0]?.[15] || '';
  const subtitle = rows[0]?.[16] || '';
  const headers = rows[3]?.slice(15, 21) || [];
  const dataRows = rows.slice(4).map(row => row.slice(15, 21)).filter(row => row[1]);

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
          pointerEvents: 'none',
          textAlign: 'right',
          zIndex: 40
        }}>
          <div style={{
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
        <table style={{ 
          width: '100%',
          borderCollapse: 'separate',
          borderSpacing: '0 4px',
          marginTop: 14
        }}>
          <thead>
            <tr>
              <th style={{ 
                background: 'linear-gradient(to bottom, #1e40af 0%, #1e3a8a 100%)',
                color: '#fff',
                padding: '12px 18px',
                textAlign: 'center',
                fontSize: 22,
                fontWeight: 700,
                textTransform: 'uppercase',
                boxShadow: 'inset 0 4px 0 rgba(255,255,255,0.3), inset 0 -5px 0 rgba(0,0,0,0.6), 0 4px 8px rgba(0,0,0,0.4)',
                textShadow: '0 3px 6px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6)',
                whiteSpace: 'nowrap'
              }}>
                #
              </th>
              <th style={{ 
                background: 'linear-gradient(to bottom, #1e40af 0%, #1e3a8a 100%)',
                color: '#fff',
                padding: '12px 26px',
                textAlign: 'left',
                fontSize: 22,
                fontWeight: 700,
                textTransform: 'uppercase',
                boxShadow: 'inset 0 4px 0 rgba(255,255,255,0.3), inset 0 -5px 0 rgba(0,0,0,0.6), 0 4px 8px rgba(0,0,0,0.4)',
                textShadow: '0 3px 6px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6)',
                whiteSpace: 'nowrap'
              }}>
                {headers[2]}
              </th>
              <th style={{ 
                background: 'linear-gradient(to bottom, #1e40af 0%, #1e3a8a 100%)',
                color: '#fff',
                padding: '12px 22px',
                textAlign: 'center',
                fontSize: 22,
                fontWeight: 700,
                textTransform: 'uppercase',
                boxShadow: 'inset 0 4px 0 rgba(255,255,255,0.3), inset 0 -5px 0 rgba(0,0,0,0.6), 0 4px 8px rgba(0,0,0,0.4)',
                textShadow: '0 3px 6px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6)',
                whiteSpace: 'nowrap'
              }}>
                {headers[3]}
              </th>
              <th style={{ 
                background: 'linear-gradient(to bottom, #1e40af 0%, #1e3a8a 100%)',
                color: '#fff',
                padding: '12px 22px',
                textAlign: 'center',
                fontSize: 22,
                fontWeight: 700,
                textTransform: 'uppercase',
                boxShadow: 'inset 0 4px 0 rgba(255,255,255,0.3), inset 0 -5px 0 rgba(0,0,0,0.6), 0 4px 8px rgba(0,0,0,0.4)',
                textShadow: '0 3px 6px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6)',
                whiteSpace: 'nowrap'
              }}>
                {headers[4]}
              </th>
              <th style={{ 
                background: 'linear-gradient(to bottom, #1e40af 0%, #1e3a8a 100%)',
                color: '#fff',
                padding: '12px 26px',
                textAlign: 'center',
                fontSize: 22,
                fontWeight: 700,
                textTransform: 'uppercase',
                boxShadow: 'inset 0 4px 0 rgba(255,255,255,0.3), inset 0 -5px 0 rgba(0,0,0,0.6), 0 4px 8px rgba(0,0,0,0.4)',
                textShadow: '0 3px 6px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6)',
                whiteSpace: 'nowrap'
              }}>
                {headers[5]}
              </th>
            </tr>
          </thead>
          <tbody>
            {dataRows.map((row, i) => (
              <tr key={i}>
                <td style={{ 
                  background: 'linear-gradient(to bottom, #1e40af 0%, #1e3a8a 100%)',
                  color: '#fff',
                  padding: '14px 18px',
                  fontSize: 34,
                  fontWeight: 900,
                  textAlign: 'center',
                  boxShadow: 'inset 0 4px 0 rgba(255,255,255,0.3), inset 0 -5px 0 rgba(0,0,0,0.6), 0 4px 8px rgba(0,0,0,0.3)',
                  textShadow: '0 4px 8px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6), 2px 2px 0 rgba(0,0,0,0.5)'
                }}>
                  {(() => { const v = row[0]; const n = parseInt(typeof v === 'string' ? v.replace(/[,\.].*$/, '') : v, 10); return isNaN(n) ? v : n; })()}
                </td>
                <td style={{ 
                  background: 'linear-gradient(to bottom, #2a2a2a 0%, #1a1a1a 100%)',
                  color: '#fff',
                  padding: '14px 20px',
                  fontSize: 28,
                  fontWeight: 700,
                  boxShadow: 'inset 0 3px 0 rgba(255,255,255,0.12), inset 0 -4px 0 rgba(0,0,0,0.5), 0 3px 6px rgba(0,0,0,0.3)',
                  textShadow: '0 3px 6px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6)'
                }}>
                  {row[2]}
                </td>
                <td style={{ 
                  background: 'linear-gradient(to bottom, #2a2a2a 0%, #1a1a1a 100%)',
                  color: '#fff',
                  padding: '14px 16px',
                  fontSize: 28,
                  fontWeight: 600,
                  textAlign: 'center',
                  boxShadow: 'inset 0 3px 0 rgba(255,255,255,0.12), inset 0 -4px 0 rgba(0,0,0,0.5), 0 3px 6px rgba(0,0,0,0.3)',
                  textShadow: '0 3px 6px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6)'
                }}>
                  {formatIfNumericDK(row[3])}
                </td>
                <td style={{ 
                  background: 'linear-gradient(to bottom, #2a2a2a 0%, #1a1a1a 100%)',
                  color: '#fff',
                  padding: '14px 16px',
                  fontSize: 28,
                  fontWeight: 600,
                  textAlign: 'center',
                  boxShadow: 'inset 0 3px 0 rgba(255,255,255,0.12), inset 0 -4px 0 rgba(0,0,0,0.5), 0 3px 6px rgba(0,0,0,0.3)',
                  textShadow: '0 3px 6px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6)'
                }}>
                  {formatIfNumericDK(row[4])}
                </td>
                <td style={{ 
                  background: 'linear-gradient(to bottom, #2a2a2a 0%, #1a1a1a 100%)',
                  color: '#fff',
                  padding: '14px 20px',
                  fontSize: 32,
                  fontWeight: 900,
                  textAlign: 'center',
                  boxShadow: 'inset 0 3px 0 rgba(255,255,255,0.12), inset 0 -4px 0 rgba(0,0,0,0.5), 0 3px 6px rgba(0,0,0,0.3)',
                  textShadow: '0 4px 8px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6), 2px 2px 0 rgba(0,0,0,0.5)'
                }}>
                  {formatIfNumericDK(row[5])}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ViewportClamp>
  );
}
