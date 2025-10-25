import { useEffect, useState } from 'react';

function Table({rows}){
  if(!rows||!rows.length) return <p>Ingen data fundet.</p>;
  const headers = rows[0];
  const body = rows.slice(1);
  return (
    <table style={{borderCollapse:'collapse', width:'100%'}}>
      <thead><tr>{headers.map((h,i)=>(<th key={i} style={{padding:8, borderBottom:'1px solid #ddd'}}>{h}</th>))}</tr></thead>
      <tbody>
        {body.map((r,ri)=>(<tr key={ri}>{r.map((c,ci)=>(<td key={ci} style={{padding:8, borderBottom:'1px solid #eee'}}>{c}</td>))}</tr>))}
      </tbody>
    </table>
  );
}

export default function ScoreboardRaekke() {
  const [rows, setRows] = useState(null);
  useEffect(()=>{
    let m=true;
    async function f(){
      const res = await fetch('/api/sheet?range=Out1_Oversigt');
      const j = await res.json();
      if(m) setRows(j.data);
    }
    f();
    const id=setInterval(f,5000);
    return ()=>{m=false; clearInterval(id)};
  },[]);

  return (
    <main style={{fontFamily:'Segoe UI, Tahoma, sans-serif', padding:24}}>
      <h1>Visning af score board - rækkefølge</h1>
      <Table rows={rows} />
      <div style={{marginTop:16}}><a href="/">Tilbage til menu</a></div>
    </main>
  )
}
