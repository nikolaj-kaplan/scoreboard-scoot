export default function Demo() {
  const overlays = [
    { name: 'Rækkefølge', url: '/overlay-raekkefoelge' },
    { name: 'Stilling Heat', url: '/overlay-stilling-heat' },
    { name: 'Samlet Stilling', url: '/overlay-samlet-stilling' },
    { name: 'Rider Præsentation', url: '/overlay-rider-presentation' },
    { name: 'Rider Run', url: '/overlay-rider-run' }
  ];

  // Scale factor to fit 1920x1080 into smaller viewport
  const scale = 0.4; // 40% size (768x432px)
  const width = 1920;
  const height = 1080;

  return (
    <div style={{
      background: '#1a1a1a',
      minHeight: '100vh',
      padding: 40
    }}>
      <h1 style={{ 
        color: '#fff', 
        marginBottom: 30,
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif'
      }}>
        Overlay Demo Grid (Scaled 1920x1080)
      </h1>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(800px, 1fr))',
        gap: 30,
        maxWidth: 2400,
        margin: '0 auto'
      }}>
        {overlays.map((overlay) => (
          <div key={overlay.url} style={{
            background: '#2a2a2a',
            borderRadius: 8,
            padding: 20,
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
          }}>
            <h2 style={{
              color: '#fff',
              fontSize: 20,
              marginBottom: 15,
              fontFamily: 'Arial, sans-serif',
              textAlign: 'center'
            }}>
              {overlay.name}
            </h2>
            <div style={{
              width: width * scale,
              height: height * scale,
              margin: '0 auto',
              background: '#000',
              borderRadius: 4,
              overflow: 'hidden',
              position: 'relative'
            }}>
              <iframe
                src={overlay.url}
                style={{
                  width: width,
                  height: height,
                  border: 'none',
                  transform: `scale(${scale})`,
                  transformOrigin: '0 0',
                  position: 'absolute',
                  top: 0,
                  left: 0
                }}
                title={overlay.name}
              />
            </div>
            <div style={{
              marginTop: 10,
              textAlign: 'center'
            }}>
              <a 
                href={overlay.url} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  color: '#4CAF50',
                  textDecoration: 'none',
                  fontSize: 14
                }}
              >
                Open Full Screen (1920x1080) →
              </a>
            </div>
          </div>
        ))}
      </div>

      <div style={{ 
        textAlign: 'center', 
        marginTop: 40 
      }}>
        <a href="/" style={{ 
          color: '#4CAF50', 
          textDecoration: 'none',
          fontSize: 16
        }}>
          ← Back to Menu
        </a>
      </div>
    </div>
  );
}
