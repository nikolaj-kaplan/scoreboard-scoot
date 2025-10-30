import { useSheetData } from '../lib/useSheetData';
import { formatIfNumericDK } from '../lib/tableUtils';

export default function OverlayStillingHeat() {
  const { allData, loading } = useSheetData(5000);

  if (loading || !allData) {
    return null;
  }

  const rows = allData['Out1_Oversigt'] || [];
  if (rows.length < 4) return null;

  // Extract "Stilling i Heat" section (columns 7-13)
  const title = rows[0]?.[7] || '';
  const heat = rows[0]?.[8] || '';
  const headers = rows[3]?.slice(7, 14) || [];
  const dataRows = rows.slice(4).map(row => row.slice(7, 14)).filter(row => row[1]);

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 80px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ width: '100%', maxWidth: 1760 }}>
        {/* Header with skewed blue bar */}
        <div style={{ position: 'relative', marginBottom: 40 }}>
          <div style={{
            display: 'flex',
            alignItems: 'stretch',
            height: 140
          }}>
            {/* Left dark section */}
            <div style={{
              background: 'linear-gradient(to bottom, #2a2a2a 0%, #1a1a1a 100%)',
              padding: '30px 60px',
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
                  fontSize: 52, 
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
              padding: '30px 60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              flex: 1,
              transform: 'skewX(-10deg)',
              boxShadow: 'inset 0 4px 0 rgba(255,255,255,0.3), inset 0 -6px 0 rgba(0,0,0,0.6), 0 8px 16px rgba(0,0,0,0.5), 0 4px 8px rgba(0,0,0,0.4)'
            }}>
              <div style={{ transform: 'skewX(10deg)' }}>
                <div style={{ 
                  fontSize: 58, 
                  fontWeight: 900, 
                  color: '#fff',
                  letterSpacing: 4,
                  textTransform: 'uppercase',
                  textShadow: '0 6px 12px rgba(0,0,0,0.8), 0 3px 6px rgba(0,0,0,0.6), 2px 2px 0 rgba(0,0,0,0.5), 4px 4px 0 rgba(0,0,0,0.3)'
                }}>
                  {heat}
                </div>
              </div>
            </div>
          </div>

          {/* Subtitle bar */}
          <div style={{
            background: 'linear-gradient(90deg, #1e40af 0%, transparent 100%)',
            padding: '12px 40px',
            marginTop: 8,
            boxShadow: 'inset 0 3px 0 rgba(255,255,255,0.25), inset 0 -3px 0 rgba(0,0,0,0.5), 0 4px 8px rgba(0,0,0,0.4)'
          }}>
            <div style={{ 
              fontSize: 24, 
              fontWeight: 700, 
              color: '#fff',
              letterSpacing: 3,
              textTransform: 'uppercase',
              textShadow: '0 4px 8px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6), 2px 2px 0 rgba(0,0,0,0.5)'
            }}>
              Stilling
            </div>
          </div>

          {/* Branding */}
          <div style={{
            position: 'absolute',
            top: -80,
            right: 0,
            textAlign: 'right'
          }}>
            <div style={{ 
              fontSize: 96, 
              fontWeight: 900, 
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontFamily: 'Brush Script MT, cursive',
              fontStyle: 'italic',
              marginBottom: 12,
              filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.8)) drop-shadow(0 4px 8px rgba(0,0,0,0.6)) drop-shadow(3px 3px 0 rgba(255,215,0,0.4)) drop-shadow(6px 6px 0 rgba(0,0,0,0.4))'
            }}>
              Mills Club
            </div>
            <div style={{ 
              fontSize: 26, 
              fontWeight: 900, 
              background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)',
              padding: '8px 20px',
              color: '#fff',
              letterSpacing: 4,
              textTransform: 'uppercase',
              display: 'inline-block',
              transform: 'skewX(-5deg)',
              boxShadow: '0 6px 12px rgba(0,0,0,0.6), 0 3px 6px rgba(0,0,0,0.4), inset 0 2px 0 rgba(255,255,255,0.3), inset 0 -2px 0 rgba(0,0,0,0.4)',
              textShadow: '0 3px 6px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6), 1px 1px 0 rgba(0,0,0,0.5)',
              border: '2px solid rgba(255,255,255,0.2)'
            }}>
              <span style={{ display: 'inline-block', transform: 'skewX(5deg)' }}>
                Sjællandsmesterskaberne
              </span>
            </div>
          </div>
        </div>

        {/* Table */}
        <table style={{ 
          width: '100%',
          borderCollapse: 'separate',
          borderSpacing: '0 4px'
        }}>
          <thead>
            <tr>
              <th style={{ 
                background: 'linear-gradient(to bottom, #1e40af 0%, #1e3a8a 100%)',
                color: '#fff',
                padding: '20px 20px',
                textAlign: 'center',
                fontSize: 20,
                fontWeight: 700,
                textTransform: 'uppercase',
                width: 80,
                boxShadow: 'inset 0 4px 0 rgba(255,255,255,0.3), inset 0 -5px 0 rgba(0,0,0,0.6), 0 4px 8px rgba(0,0,0,0.4)',
                textShadow: '0 3px 6px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6)'
              }}>
                #
              </th>
              <th style={{ 
                background: 'linear-gradient(to bottom, #1e40af 0%, #1e3a8a 100%)',
                color: '#fff',
                padding: '20px 30px',
                textAlign: 'left',
                fontSize: 20,
                fontWeight: 700,
                textTransform: 'uppercase',
                boxShadow: 'inset 0 4px 0 rgba(255,255,255,0.3), inset 0 -5px 0 rgba(0,0,0,0.6), 0 4px 8px rgba(0,0,0,0.4)',
                textShadow: '0 3px 6px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6)'
              }}>
                {headers[2]}
              </th>
              <th style={{ 
                background: 'linear-gradient(to bottom, #1e40af 0%, #1e3a8a 100%)',
                color: '#fff',
                padding: '20px 25px',
                textAlign: 'center',
                fontSize: 20,
                fontWeight: 700,
                textTransform: 'uppercase',
                width: 140,
                boxShadow: 'inset 0 4px 0 rgba(255,255,255,0.3), inset 0 -5px 0 rgba(0,0,0,0.6), 0 4px 8px rgba(0,0,0,0.4)',
                textShadow: '0 3px 6px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6)'
              }}>
                RUN 1
              </th>
              <th style={{ 
                background: 'linear-gradient(to bottom, #1e40af 0%, #1e3a8a 100%)',
                color: '#fff',
                padding: '20px 25px',
                textAlign: 'center',
                fontSize: 20,
                fontWeight: 700,
                textTransform: 'uppercase',
                width: 140,
                boxShadow: 'inset 0 4px 0 rgba(255,255,255,0.3), inset 0 -5px 0 rgba(0,0,0,0.6), 0 4px 8px rgba(0,0,0,0.4)',
                textShadow: '0 3px 6px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6)'
              }}>
                RUN 2
              </th>
              <th style={{ 
                background: 'linear-gradient(to bottom, #1e40af 0%, #1e3a8a 100%)',
                color: '#fff',
                padding: '20px 30px',
                textAlign: 'center',
                fontSize: 20,
                fontWeight: 700,
                textTransform: 'uppercase',
                width: 160,
                boxShadow: 'inset 0 4px 0 rgba(255,255,255,0.3), inset 0 -5px 0 rgba(0,0,0,0.6), 0 4px 8px rgba(0,0,0,0.4)',
                textShadow: '0 3px 6px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6)'
              }}>
                BEST RUN
              </th>
            </tr>
          </thead>
          <tbody>
            {dataRows.map((row, i) => (
              <tr key={i}>
                <td style={{ 
                  background: i < 3 ? 'linear-gradient(to bottom, #1e40af 0%, #1e3a8a 100%)' : 'linear-gradient(to bottom, #2a2a2a 0%, #1a1a1a 100%)',
                  color: '#fff',
                  padding: '24px 20px',
                  fontSize: 32,
                  fontWeight: 900,
                  textAlign: 'center',
                  boxShadow: i < 3 
                    ? 'inset 0 4px 0 rgba(255,255,255,0.3), inset 0 -5px 0 rgba(0,0,0,0.6), 0 4px 8px rgba(0,0,0,0.3)' 
                    : 'inset 0 3px 0 rgba(255,255,255,0.12), inset 0 -4px 0 rgba(0,0,0,0.5), 0 3px 6px rgba(0,0,0,0.3)',
                  textShadow: '0 4px 8px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6), 2px 2px 0 rgba(0,0,0,0.5)'
                }}>
                  {formatIfNumericDK(row[0])}
                </td>
                <td style={{ 
                  background: 'linear-gradient(to bottom, #2a2a2a 0%, #1a1a1a 100%)',
                  color: '#fff',
                  padding: '24px 30px',
                  fontSize: 26,
                  fontWeight: 700,
                  boxShadow: 'inset 0 3px 0 rgba(255,255,255,0.12), inset 0 -4px 0 rgba(0,0,0,0.5), 0 3px 6px rgba(0,0,0,0.3)',
                  textShadow: '0 3px 6px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6)'
                }}>
                  {formatIfNumericDK(row[2])}
                </td>
                <td style={{ 
                  background: 'linear-gradient(to bottom, #2a2a2a 0%, #1a1a1a 100%)',
                  color: '#fff',
                  padding: '24px 25px',
                  fontSize: 26,
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
                  padding: '24px 25px',
                  fontSize: 26,
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
                  padding: '24px 30px',
                  fontSize: 30,
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
    </div>
  );
}
