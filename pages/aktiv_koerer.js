import { useEffect, useState } from 'react';

function renderTable(rows) {
  if (!rows || !rows.length) return <p>Ingen data fundet.</p>;
  const headers = rows[0];
  const body = rows.slice(1);
  return (
    <table style={{borderCollapse:'collapse', width:'100%'}}>
      <thead>
        <tr>{headers.map((h,i)=>(<th key={i} style={{borderBottom:'1px solid #ddd', textAlign:'left', padding:8}}>{h}</th>))}</tr>
      </thead>
      <tbody>
        {body.map((r,ri)=>(
          <tr key={ri}>{r.map((c,ci)=>(<td key={ci} style={{padding:8, borderBottom:'1px solid #eee'}}>{c}</td>))}</tr>
        ))}
      </tbody>
    </table>
  )
}

export default function AktivKoerer() {
  const [rows, setRows] = useState(null);
  useEffect(()=>{
    let mounted = true;
    async function fetchRows() {
      try {
        const res = await fetch('/api/sheet?range=Out1_Oversigt');
        const json = await res.json();
        if (mounted) setRows(json.data);
      } catch (e) {
        console.error(e);
      }
    }
    fetchRows();
    const id = setInterval(fetchRows, 5000);
    return ()=>{ mounted=false; clearInterval(id); }
  },[]);

  return (
    <main style={{fontFamily:'Segoe UI, Tahoma, sans-serif', padding:24}}>
      <h1>Visning af aktiv kører</h1>
      <div>{renderTable(rows)}</div>
      <div style={{marginTop:16}}><a href="/">Tilbage til menu</a></div>
    </main>
  )
}
