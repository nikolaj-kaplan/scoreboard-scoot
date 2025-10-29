import { useSheetData } from '../lib/useSheetData';

export default function OverlayRiderPresentation() {
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
    alder: rider[4] || '',
    række: rider[5] || '',
    klub: rider[6] || '',
    bedsteTrick: rider[7] || '',
    bedstePlacering: rider[8] || '',
    funFact: rider[9] || '',
    instagram: rider[10] || ''
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 100px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ width: '100%', maxWidth: 1720 }}>
        {/* Skewed header */}
        <div style={{ position: 'relative', marginBottom: 60 }}>
          <div style={{
            display: 'flex',
            alignItems: 'stretch',
            height: 160,
            marginBottom: 12
          }}>
            {/* Blue gradient section */}
            <div style={{
              background: 'linear-gradient(to bottom, #1e40af 0%, #1e3a8a 100%)',
              padding: '40px 80px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              transform: 'skewX(-10deg)',
              marginRight: -30,
              boxShadow: 'inset 0 3px 0 rgba(255,255,255,0.25), inset 0 -4px 0 rgba(0,0,0,0.5)'
            }}>
              <div style={{ transform: 'skewX(10deg)' }}>
                <div style={{ 
                  fontSize: 72, 
                  fontWeight: 900, 
                  color: '#fff',
                  letterSpacing: 6,
                  textTransform: 'uppercase',
                  textAlign: 'center'
                }}>
                  {riderInfo.navn}
                </div>
              </div>
            </div>

            {/* Dark section with category */}
            <div style={{
              background: 'linear-gradient(to bottom, #2a2a2a 0%, #1a1a1a 100%)',
              padding: '40px 60px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              transform: 'skewX(-10deg)',
              minWidth: 280,
              boxShadow: 'inset 0 3px 0 rgba(255,255,255,0.15), inset 0 -4px 0 rgba(0,0,0,0.5)'
            }}>
              <div style={{ transform: 'skewX(10deg)' }}>
                <div style={{ 
                  fontSize: 48, 
                  fontWeight: 900, 
                  color: '#fff',
                  letterSpacing: 2
                }}>
                  {riderInfo.række}
                </div>
              </div>
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

        {/* Info Grid */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr',
          gap: 16,
          marginBottom: 24
        }}>
          <div style={{ 
            background: 'linear-gradient(to bottom, #2a2a2a 0%, #1a1a1a 100%)',
            padding: '28px 32px',
            boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.08), inset 0 -3px 0 rgba(0,0,0,0.4)'
          }}>
            <div style={{ color: '#888', fontSize: 18, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 2, fontWeight: 600 }}>
              ALDER
            </div>
            <div style={{ color: '#fff', fontSize: 42, fontWeight: 900 }}>
              {riderInfo.alder}
            </div>
          </div>

          <div style={{ 
            background: 'linear-gradient(to bottom, #2a2a2a 0%, #1a1a1a 100%)',
            padding: '28px 32px',
            boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.08), inset 0 -3px 0 rgba(0,0,0,0.4)'
          }}>
            <div style={{ color: '#888', fontSize: 18, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 2, fontWeight: 600 }}>
              KLUB/HOLD
            </div>
            <div style={{ color: '#fff', fontSize: 32, fontWeight: 700, lineHeight: 1.2 }}>
              {riderInfo.klub}
            </div>
          </div>

          <div style={{ 
            background: 'linear-gradient(to bottom, #1e40af 0%, #1e3a8a 100%)',
            padding: '28px 32px',
            gridColumn: 'span 2',
            boxShadow: 'inset 0 3px 0 rgba(255,255,255,0.25), inset 0 -4px 0 rgba(0,0,0,0.5)'
          }}>
            <div style={{ color: '#cce5ff', fontSize: 18, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 2, fontWeight: 600 }}>
              BEDSTE PLACERING
            </div>
            <div style={{ color: '#fff', fontSize: 42, fontWeight: 900 }}>
              {riderInfo.bedstePlacering}
            </div>
          </div>
        </div>

        {/* Bedste Trick */}
        {riderInfo.bedsteTrick && (
          <div style={{ 
            background: 'linear-gradient(to bottom, #2a2a2a 0%, #1a1a1a 100%)',
            padding: '32px 40px',
            marginBottom: 24,
            boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.08), inset 0 -3px 0 rgba(0,0,0,0.4)'
          }}>
            <div style={{ color: '#1e40af', fontSize: 20, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 2, fontWeight: 700 }}>
              BEDSTE TRICK
            </div>
            <div style={{ color: '#fff', fontSize: 36, fontWeight: 900, letterSpacing: 1 }}>
              {riderInfo.bedsteTrick}
            </div>
          </div>
        )}

        {/* Fun Fact */}
        {riderInfo.funFact && (
          <div style={{ 
            background: 'linear-gradient(to bottom, #2a2a2a 0%, #1a1a1a 100%)',
            padding: '32px 40px',
            marginBottom: 24,
            boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.08), inset 0 -3px 0 rgba(0,0,0,0.4)'
          }}>
            <div style={{ color: '#888', fontSize: 20, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 2, fontWeight: 700 }}>
              FUN FACT
            </div>
            <div style={{ color: '#fff', fontSize: 28, lineHeight: 1.6, fontWeight: 500 }}>
              {riderInfo.funFact}
            </div>
          </div>
        )}

        {/* Instagram */}
        {riderInfo.instagram && (
          <div style={{ 
            background: 'linear-gradient(to bottom, #1e40af 0%, #1e3a8a 100%)',
            padding: '24px 40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'inset 0 3px 0 rgba(255,255,255,0.25), inset 0 -4px 0 rgba(0,0,0,0.5)'
          }}>
            <span style={{ color: '#fff', fontSize: 32, marginRight: 20, fontWeight: 700 }}>📱</span>
            <span style={{ color: '#fff', fontSize: 32, fontWeight: 700, letterSpacing: 1 }}>
              @{riderInfo.instagram}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
