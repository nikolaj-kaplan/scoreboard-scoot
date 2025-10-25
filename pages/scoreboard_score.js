import { useEffect, useState } from 'react';

export default function ScoreboardScore(){
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

  if(!rows) return <main style={{padding:24,fontFamily:'Segoe UI'}}><h1>Visning af score board - score</h1><p>Indlæser...</p></main>
  const headers = rows[0];
  const body = rows.slice(1);
  // simple presentation: assume score is in last column and sort by it
  const sorted = body.slice().sort((a,b)=>{
    const aVal = parseFloat(a[a.length-1])||0;
    const bVal = parseFloat(b[b.length-1])||0;
    return bVal - aVal;
  });

  return (
    <main style={{fontFamily:'Segoe UI, Tahoma, sans-serif', padding:24}}>
      <h1>Visning af score board - score</h1>
      <table style={{width:'100%', borderCollapse:'collapse'}}>
        <thead><tr>{headers.map((h,i)=>(<th key={i} style={{padding:8,borderBottom:'1px solid #ddd'}}>{h}</th>))}</tr></thead>
        <tbody>
          {sorted.map((r,ri)=>(<tr key={ri}>{r.map((c,ci)=>(<td key={ci} style={{padding:8,borderBottom:'1px solid #eee'}}>{c}</td>))}</tr>))}
        </tbody>
      </table>
      <div style={{marginTop:16}}><a href="/">Tilbage til menu</a></div>
    </main>
  )
}
