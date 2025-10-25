import Link from 'next/link';

export default function Home() {
  return (
    <main style={{fontFamily: 'Segoe UI, Tahoma, sans-serif', padding: 24}}>
      <h1>Scoreboard - Menu</h1>
      <ul>
        <li><Link href="/aktiv_koerer">Visning af aktiv kører</Link></li>
        <li><Link href="/scoreboard_raekkefoelge">Visning af score board - rækkefølge</Link></li>
        <li><Link href="/scoreboard_score">Visning af score board - score</Link></li>
        <li><Link href="/detaljere_aktiv_koerer">Visning - detaljere visning af aktiv kører</Link></li>
      </ul>
    </main>
  )
}
