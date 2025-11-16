export default function LoadingSpinner() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '40px',
      backgroundColor: '#00ff00',
      zIndex: 9999
    }}>
      <svg className="ap" viewBox="0 0 128 256" width="128px" height="256px" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="ap-grad1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(223,90%,55%)" />
            <stop offset="100%" stopColor="hsl(253,90%,55%)" />
          </linearGradient>
          <linearGradient id="ap-grad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(193,90%,55%)" />
            <stop offset="50%" stopColor="hsl(223,90%,55%)" />
            <stop offset="100%" stopColor="hsl(253,90%,55%)" />
          </linearGradient>
        </defs>
        <circle className="ap__ring" r="56" cx="64" cy="192" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="16" strokeLinecap="round" />
        <circle className="ap__worm1" r="56" cx="64" cy="192" fill="none" stroke="url(#ap-grad1)" strokeWidth="16" strokeLinecap="round" strokeDasharray="87.96 263.89" />
        <path className="ap__worm2" d="M120,192A56,56,0,0,1,8,192C8,161.07,16,8,64,8S120,161.07,120,192Z" fill="none" stroke="url(#ap-grad2)" strokeWidth="16" strokeLinecap="round" strokeDasharray="87.96 494" />
      </svg>
      
      {/* Loading text */}
      <div style={{
        fontSize: 32,
        fontWeight: 900,
        color: '#000',
        textTransform: 'uppercase',
        letterSpacing: 4,
        textShadow: '2px 2px 0 rgba(255, 255, 255, 0.3)'
      }}>
        Henter data...
      </div>
      
      {/* Keyframes for spinner animation */}
      <style jsx>{`
        .ap {
          width: 8em;
          height: 16em;
        }
        .ap__worm1,
        .ap__worm2 {
          animation-duration: 3s;
          animation-iteration-count: infinite;
        }
        .ap__worm1 {
          animation-name: worm1;
        }
        .ap__worm2 {
          animation-name: worm2;
          visibility: hidden;
        }

        @keyframes worm1 {
          from {
            animation-timing-function: ease-in-out;
            stroke-dashoffset: -87.96;
          }
          20% {
            animation-timing-function: ease-in;
            stroke-dashoffset: 0;
          }
          60% {
            stroke-dashoffset: -791.68;
            visibility: visible;
          }
          60.1%,
          to {
            stroke-dashoffset: -791.68;
            visibility: hidden;
          }
        }
        @keyframes worm2 {
          from,
          60% {
            stroke-dashoffset: -87.96;
            visibility: hidden;
          }
          60.1% {
            animation-timing-function: cubic-bezier(0,0,0.5,0.75);
            stroke-dashoffset: -87.96;
            visibility: visible;
          }
          77% {
            animation-timing-function: cubic-bezier(0.5,0.25,0.5,0.88);
            stroke-dashoffset: -340;
            visibility: visible;
          }
          to {
            stroke-dashoffset: -669.92;
            visibility: visible;
          }
        }
      `}</style>
    </div>
  );
}
