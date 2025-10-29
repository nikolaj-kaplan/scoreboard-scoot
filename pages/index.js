import Link from 'next/link';

export default function Home() {
  return (
    <main style={{fontFamily: 'Segoe UI, Tahoma, sans-serif', padding: 24}}>
      <h1>Scoreboard - Menu</h1>
      
      <h2 style={{marginTop: 32, marginBottom: 12, fontSize: 20, color: '#666'}}>Demo</h2>
      <ul>
        <li><Link href="/demo">View All Overlays in Grid</Link></li>
      </ul>

      <h2 style={{marginTop: 32, marginBottom: 12, fontSize: 20, color: '#666'}}>vMix Overlay Pages (1920x1080)</h2>
      <p style={{color: '#999', fontSize: 14, marginBottom: 12}}>
        These pages are designed for vMix HTML input with transparent black background
      </p>
      <ul>
        <li><Link href="/overlay-raekkefoelge">Overlay: Rækkefølge i Heat</Link></li>
        <li><Link href="/overlay-stilling-heat">Overlay: Stilling i Heat</Link></li>
        <li><Link href="/overlay-samlet-stilling">Overlay: Samlet Stilling</Link></li>
        <li><Link href="/overlay-rider-presentation">Overlay: Rider Præsentation (Før/Efter Run)</Link></li>
        <li><Link href="/overlay-rider-run">Overlay: Rider Run (Diskret Bund-Bar)</Link></li>
      </ul>
    </main>
  )
}
