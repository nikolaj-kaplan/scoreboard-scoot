import { useSheetData } from '../lib/useSheetData';

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
              boxShadow: 'inset 0 3px 0 rgba(255,255,255,0.15), inset 0 -4px 0 rgba(0,0,0,0.5)'
            }}>
              <div style={{ transform: 'skewX(10deg)' }}>
                <div style={{ 
                  fontSize: 52, 
                  fontWeight: 900, 
                  color: '#fff',
                  letterSpacing: 3,
                  lineHeight: 1.1
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
              justifyContent: 'center',
              flex: 1,
              transform: 'skewX(-10deg)',
              boxShadow: 'inset 0 3px 0 rgba(255,255,255,0.25), inset 0 -4px 0 rgba(0,0,0,0.5)'
            }}>
              <div style={{ transform: 'skewX(10deg)' }}>
                <div style={{ 
                  fontSize: 48, 
                  fontWeight: 900, 
                  color: '#fff',
                  letterSpacing: 4,
                  textTransform: 'uppercase'
                }}>
                  {subtitle}
                </div>
              </div>
            </div>
          </div>

          {/* Subtitle bar */}
          <div style={{
            background: 'linear-gradient(90deg, #1e40af 0%, transparent 100%)',
            padding: '12px 40px',
            marginTop: 8,
            boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.2), inset 0 -2px 0 rgba(0,0,0,0.4)'
          }}>
            <div style={{ 
              fontSize: 24, 
              fontWeight: 700, 
              color: '#fff',
              letterSpacing: 3,
              textTransform: 'uppercase'
            }}>
              Samlet Stilling
            </div>
          </div>

          {/* Branding */}
          <div style={{
            position: 'absolute',
            top: -60,
            right: 0,
            textAlign: 'right'
          }}>
            <div style={{ 
              fontSize: 56, 
              fontWeight: 700, 
              color: '#1e40af',
              fontFamily: 'Brush Script MT, cursive',
              fontStyle: 'italic',
              marginBottom: 8,
              textShadow: '0 4px 8px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3), 2px 2px 0 rgba(255,255,255,0.2)'
            }}>
              Mills Club
            </div>
            <div style={{ 
              fontSize: 22, 
              fontWeight: 700, 
              color: '#888',
              letterSpacing: 3,
              textTransform: 'uppercase',
              textShadow: '0 2px 4px rgba(0,0,0,0.5), 1px 1px 0 rgba(255,255,255,0.1)'
            }}>
              Sjællandsmesterskaberne
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
                boxShadow: 'inset 0 3px 0 rgba(255,255,255,0.25), inset 0 -4px 0 rgba(0,0,0,0.5)'
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
                boxShadow: 'inset 0 3px 0 rgba(255,255,255,0.25), inset 0 -4px 0 rgba(0,0,0,0.5)'
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
                boxShadow: 'inset 0 3px 0 rgba(255,255,255,0.25), inset 0 -4px 0 rgba(0,0,0,0.5)'
              }}>
                {headers[3]}
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
                boxShadow: 'inset 0 3px 0 rgba(255,255,255,0.25), inset 0 -4px 0 rgba(0,0,0,0.5)'
              }}>
                {headers[4]}
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
                boxShadow: 'inset 0 3px 0 rgba(255,255,255,0.25), inset 0 -4px 0 rgba(0,0,0,0.5)'
              }}>
                {headers[5]}
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
                  boxShadow: i < 3 ? 'inset 0 3px 0 rgba(255,255,255,0.25), inset 0 -4px 0 rgba(0,0,0,0.5)' : 'inset 0 2px 0 rgba(255,255,255,0.08), inset 0 -3px 0 rgba(0,0,0,0.4)'
                }}>
                  {row[0]}
                </td>
                <td style={{ 
                  background: 'linear-gradient(to bottom, #2a2a2a 0%, #1a1a1a 100%)',
                  color: '#fff',
                  padding: '24px 30px',
                  fontSize: 26,
                  fontWeight: 700,
                  boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.08), inset 0 -3px 0 rgba(0,0,0,0.4)'
                }}>
                  {row[2]}
                </td>
                <td style={{ 
                  background: 'linear-gradient(to bottom, #2a2a2a 0%, #1a1a1a 100%)',
                  color: '#fff',
                  padding: '24px 25px',
                  fontSize: 26,
                  fontWeight: 600,
                  textAlign: 'center',
                  boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.08), inset 0 -3px 0 rgba(0,0,0,0.4)'
                }}>
                  {row[3]}
                </td>
                <td style={{ 
                  background: 'linear-gradient(to bottom, #2a2a2a 0%, #1a1a1a 100%)',
                  color: '#fff',
                  padding: '24px 25px',
                  fontSize: 26,
                  fontWeight: 600,
                  textAlign: 'center',
                  boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.08), inset 0 -3px 0 rgba(0,0,0,0.4)'
                }}>
                  {row[4]}
                </td>
                <td style={{ 
                  background: 'linear-gradient(to bottom, #2a2a2a 0%, #1a1a1a 100%)',
                  color: '#fff',
                  padding: '24px 30px',
                  fontSize: 30,
                  fontWeight: 900,
                  textAlign: 'center',
                  boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.08), inset 0 -3px 0 rgba(0,0,0,0.4)'
                }}>
                  {row[5]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
