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

  if(!rows) return (
    <main style={{minHeight:'100vh',background:'#000',padding:24,fontFamily:'Segoe UI',color:'#fff'}}>
      
    </main>
  )

  // Find the header row: prefer the row that contains the "Navn" label (last occurrence)
  let headerRowIndex = 0;
  for(let i=0;i<rows.length;i++){
    const r = rows[i];
    if(Array.isArray(r) && r.some(c=> typeof c === 'string' && c.trim().toLowerCase() === 'navn')){
      headerRowIndex = i;
    }
  }
  const headers = rows[headerRowIndex] || [];
  const body = rows.slice(headerRowIndex+1);

  // We only want these four columns (prefer the last occurrence of each label)
  const wanted = ['Navn','Run1','Run2','Best Run'];
  const indices = wanted.map(label=>{
    // search for exact match from the end
    for(let i=headers.length-1;i>=0;i--){
      const h = headers[i];
      if(typeof h === 'string' && h.trim().toLowerCase() === label.toLowerCase()) return i;
    }
    // fallback: try includes
    for(let i=headers.length-1;i>=0;i--){
      const h = headers[i] || '';
      if(typeof h === 'string' && h.trim().toLowerCase().includes(label.toLowerCase())) return i;
    }
    return -1;
  });

  // If we couldn't find sensible indices, fall back to the last 4 columns
  const fallback = indices.some(i=>i < 0);
  let displayHeaders = [];
  let filteredBody = [];
  if(fallback){
    const totalCols = headers.length;
    const start = Math.max(0, totalCols - 4);
    displayHeaders = headers.slice(start);
    filteredBody = body.map(r => Array.isArray(r) ? r.slice(start) : r);
  } else {
    displayHeaders = indices.map(i=> headers[i] || '');
    filteredBody = body.map(r => Array.isArray(r) ? indices.map(i=> r[i] || '') : r);
  }

  // simple presentation: assume score is in last displayed column and sort by it
  const sorted = filteredBody.slice().sort((a,b)=>{
    const aVal = parseFloat((a && a[a.length-1]))||0;
    const bVal = parseFloat((b && b[b.length-1]))||0;
    return bVal - aVal;
  });

  return (
    <div style={{minHeight:'100vh',background:'#000',display:'flex',alignItems:'center',justifyContent:'center',padding:24}}>
      <main style={{fontFamily:'Segoe UI, Tahoma, sans-serif', color:'#fff', width:'100%', maxWidth:1200}}>
  <h1 style={{marginBottom:16}}>Mills Club Sjællandsmesterskaberne</h1>
        <div style={{background:'#1f1f1f', padding:16, borderRadius:8}}>
          <table style={{width:'100%', borderCollapse:'collapse', color:'#fff'}}>
            <thead>
              <tr>
                {displayHeaders.map((h,i)=>(
                  <th key={i} style={{padding:'10px 8px',borderBottom:'2px solid #333',textAlign:'left',background:'#2a2a2a'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((r,ri)=>(
                <tr key={ri}>
                  {r.map((c,ci)=>(
                    <td key={ci} style={{padding:'10px 8px',borderBottom:'1px solid #2b2b2b'}}>{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  {/* back-link removed as requested */}
      </main>
    </div>
  )
}
