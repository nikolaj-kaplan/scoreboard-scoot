import { useEffect, useState } from 'react';

export default function DetaljereAktivKoerer(){
  const [rows, setRows] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(()=>{
    let m=true;
    async function f(){
      const res = await fetch('/api/sheet?range=Out2_ActiveRider');
      const j = await res.json();
      if(m) setRows(j.data);
    }
    f();
    const id=setInterval(f,5000);
    return ()=>{m=false; clearInterval(id)};
  },[]);

  if(!rows) return <main style={{padding:24,fontFamily:'Segoe UI'}}><h1>Detaljeret visning af aktiv kører</h1><p>Indlæser...</p></main>

  const headers = rows[0];
  const body = rows.slice(1);
  const active = body[selectedIndex] || body[0];

  return (
    <main style={{fontFamily:'Segoe UI, Tahoma, sans-serif', padding:24}}>
      <h1>Detaljeret visning af aktiv kører</h1>
      <div style={{display:'flex',gap:24}}>
        <div style={{flex:1}}>
          <h3>Liste</h3>
          <ul>
            {body.map((r,ri)=>(<li key={ri}><button onClick={()=>setSelectedIndex(ri)} style={{background:ri===selectedIndex?'#ddd':'transparent'}}>{r[0]||`Row ${ri+1}`}</button></li>))}
          </ul>
        </div>
        <div style={{flex:2}}>
          <h3>Detaljer</h3>
          <table style={{borderCollapse:'collapse'}}>
            <tbody>
              {headers.map((h,hi)=>(<tr key={hi}><th style={{textAlign:'left',padding:8,borderBottom:'1px solid #eee'}}>{h}</th><td style={{padding:8,borderBottom:'1px solid #eee'}}>{active[hi]}</td></tr>))}
            </tbody>
          </table>
        </div>
      </div>
      <div style={{marginTop:16}}><a href="/">Tilbage til menu</a></div>
    </main>
  )
}
