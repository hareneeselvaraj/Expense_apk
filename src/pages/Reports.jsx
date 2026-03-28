import React from "react";
import { Ico } from "../components/ui/Ico.jsx";
import { Btn } from "../components/ui/Btn.jsx";
import { fmtAmt, fmtDate } from "../utils/format.js";

export default function ReportsPage({ 
  reportTab, 
  setReportTab, 
  reportsMode, 
  setReportsMode, 
  reportsSubTab, 
  setReportsSubTab, 
  reportDate, 
  setReportDate, 
  filtered, 
  stats, 
  savingsRate, 
  aggrData,
  theme 
}) {
  const C = theme;
  const maxVal = aggrData.length > 0 ? aggrData[0][1] : 1;

  return (
    <div className="page-enter" style={{padding:"20px 20px 100px 20px",display:"flex",flexDirection:"column",gap:24}}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <div>
          <h1 style={{fontSize:24,fontWeight:900,color:C.text,margin:0,letterSpacing:"-.03em", textShadow:`0 0 20px ${C.primary}44`}}>Wealth Report</h1>
          <p style={{fontSize:11,color:C.primary,margin:"4px 0 0",fontWeight:800,textTransform:"uppercase",letterSpacing:".1em", opacity:0.8}}>// Financial Intelligence Hub</p>
        </div>
        <div style={{background:C.primaryDim, color:C.primary, padding:"6px 14px", borderRadius:10, fontSize:10, fontWeight:900, fontFamily:"'JetBrains Mono',monospace", border:`1px solid ${C.primary}33`}}>ANALYTICS-X</div>
      </div>

      {/* Tab Selector (Week/Month/Year) */}
      <div style={{display:"flex",background:"rgba(255,255,255,0.03)",borderRadius:20,padding:4,border:`1px solid ${C.border}`, backdropFilter:"blur(24px)"}}>
        {["week","month","year"].map(t=>(
          <button key={t} onClick={()=>setReportTab(t)} style={{
            flex:1,padding:"12px",borderRadius:16,borderWidth:0,cursor:"pointer",fontSize:11,fontWeight:900,textTransform:"uppercase",letterSpacing:".1em",
            background:reportTab===t?C.primary:"transparent", 
            color:reportTab===t? "#000" : C.sub,
            boxShadow:reportTab===t?`0 0 20px ${C.primary}66`:"none",
            transition:"all .4s cubic-bezier(0.16, 1, 0.3, 1)"
          }}>{t}</button>
        ))}
      </div>

      {/* Mode & Sub-Tab Switchers */}
      <div style={{display:"flex", gap:12, alignItems:"center"}}>
        <div style={{display:"flex", background:"rgba(255,255,255,0.02)", borderRadius:16, padding:4, border:`1px solid ${C.border}`, flex:1, backdropFilter:"blur(10px)"}}>
          {[{id:"category",icon:"grid",label:"Cat"},{id:"tag",icon:"tag",label:"Tag"}].map(m => (
            <button key={m.id} onClick={()=>setReportsMode(m.id)} style={{
              flex:1, padding:"8px", borderRadius:12, border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6,
              background:reportsMode===m.id?C.primaryDim:"transparent",
              color:reportsMode===m.id?C.primary:C.sub, transition:"all .3s"
            }}>
              <Ico n={m.icon} sz={14} c={reportsMode===m.id?C.primary:C.sub}/>
              <span style={{fontSize:10, fontWeight:900, textTransform:"uppercase"}}>{m.label}</span>
            </button>
          ))}
        </div>
        
        <div style={{display:"flex", background:"rgba(255,255,255,0.02)", borderRadius:16, padding:4, border:`1px solid ${C.border}`, flex:1.5, backdropFilter:"blur(10px)"}}>
          {[{id:"breakdown",icon:"analyze",label:"Breakdown"},{id:"trend",icon:"trendUp",label:"Trend"}].map(s => (
            <button key={s.id} onClick={()=>setReportsSubTab(s.id)} style={{
              flex:1, padding:"8px", borderRadius:12, border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6,
              background:reportsSubTab===s.id?C.primaryDim:"transparent",
              color:reportsSubTab===s.id?C.primary:C.sub, transition:"all .3s"
            }}>
              <Ico n={s.icon} sz={14} c={reportsSubTab===s.id?C.primary:C.sub}/>
              <span style={{fontSize:10, fontWeight:900, textTransform:"uppercase"}}>{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Period Navigation */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:20, marginTop:10}}>
        <button onClick={()=>{
          const d = new Date(reportDate);
          if(reportTab==="week") d.setDate(d.getDate()-7);
          else if(reportTab==="month") d.setMonth(d.getMonth()-1);
          else d.setFullYear(d.getFullYear()-1);
          setReportDate(d);
        }} style={{background:C.primaryDim,border:`1px solid ${C.primary}33`,borderRadius:"50%",padding:10,color:C.primary,cursor:"pointer",display:"flex", transition:"transform .2s"}} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.1)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}><Ico n="chevronLeft" sz={18}/></button>
        <span style={{fontSize:15,color:C.text,fontWeight:800,minWidth:160,textAlign:"center", letterSpacing:"-.02em", textTransform:"capitalize", fontFamily:"'JetBrains Mono',monospace"}}>
          {reportTab==="week" ? `Wk ${fmtDate(reportDate).slice(0,6)}` : reportTab==="month" ? reportDate.toLocaleString("en",{month:"long",year:"numeric"}) : `Year ${reportDate.getFullYear()}`}
        </span>
        <button onClick={()=>{
          const d = new Date(reportDate);
          if(reportTab==="week") d.setDate(d.getDate()+7);
          else if(reportTab==="month") d.setMonth(d.getMonth()+1);
          else d.setFullYear(d.getFullYear()+1);
          setReportDate(d);
        }} style={{background:C.primaryDim,border:`1px solid ${C.primary}33`,borderRadius:"50%",padding:10,color:C.primary,cursor:"pointer",display:"flex", transition:"transform .2s"}} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.1)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}><Ico n="chevronRight" sz={18}/></button>
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:16}}>
          {/* Net Flow Hero */}
          <div className="glass-card cyber-accent" style={{
            borderRadius:32, padding:28, position:"relative", overflow:"hidden",
            boxShadow: `0 0 40px ${stats.net>=0?C.income:C.expense}1a`,
            border:`1px solid ${stats.net>=0?C.income:C.expense}33`
          }}>
            <div className="scan-line" style={{background:`linear-gradient(to bottom, transparent, ${stats.net>=0?C.income:C.expense}44, transparent)`}} />
            <div style={{position:"absolute",top:-30,right:-30,width:180,height:180,background:stats.net>=0?C.income:C.expense,filter:"blur(80px)",opacity:0.1,borderRadius:"50%"}}/>
            
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start", position:"relative", zIndex:2}}>
              <div>
                <div style={{color:stats.net>=0?C.income:C.expense,fontSize:10,fontWeight:900,textTransform:"uppercase",letterSpacing:".2em",marginBottom:10, fontFamily:"'JetBrains Mono',monospace"}}>Net Flow Vector</div>
                <div style={{color:stats.net>=0?C.income:C.expense,fontSize:42,fontWeight:900,fontFamily:"'JetBrains Mono',monospace",letterSpacing:"-.05em", textShadow:`0 0 20px ${stats.net>=0?C.income:C.expense}44`}}>
                  {stats.net>=0?"+":"−"}{fmtAmt(Math.abs(stats.net))}
                </div>
                <div style={{color:C.sub,fontSize:11,marginTop:10,fontWeight:700, textTransform:"uppercase"}}>{filtered.length} TXNS LOGGED</div>
              </div>
              {stats.inc > 0 && (
                <div style={{textAlign:"center"}}>
                  <div style={{width:72,height:72,borderRadius:"50%",border:`4px solid ${savingsRate>=0?C.income:C.expense}`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 0 30px ${savingsRate>=0?C.income+"33":C.expense+"33"}`, background:C.surface+"80", backdropFilter:"blur(10px)"}}>
                    <span style={{fontSize:18,fontWeight:900,color:savingsRate>=0?C.income:C.expense,fontFamily:"'JetBrains Mono',monospace"}}>{savingsRate}%</span>
                  </div>
                  <div style={{fontSize:9,fontWeight:900,color:C.sub,marginTop:10,textTransform:"uppercase", letterSpacing:".1em"}}>SAVINGS</div>
                </div>
              )}
            </div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <div className="glass-card" style={{borderRadius:24,padding:20, border:`1px solid ${C.income}33`}}>
              <div style={{color:C.sub,fontSize:9,fontWeight:900,textTransform:"uppercase",marginBottom:8, letterSpacing:".1em"}}>Gross Income</div>
              <div style={{color:C.income,fontSize:22,fontWeight:900,fontFamily:"'JetBrains Mono',monospace"}}>{fmtAmt(stats.inc)}</div>
            </div>
            <div className="glass-card" style={{borderRadius:24,padding:20, border:`1px solid ${C.expense}33`}}>
              <div style={{color:C.sub,fontSize:9,fontWeight:900,textTransform:"uppercase",marginBottom:8, letterSpacing:".1em"}}>Total Expense</div>
              <div style={{color:C.expense,fontSize:22,fontWeight:900,fontFamily:"'JetBrains Mono',monospace"}}>{fmtAmt(stats.exp)}</div>
            </div>
          </div>

          {/* Allocation List */}
          <div className="glass-card cyber-accent" style={{borderRadius:32,padding:24, border:`1px solid ${C.primary}22`}}>
            <div style={{color:C.text,fontSize:16,fontWeight:900,marginBottom:28,display:"flex",alignItems:"center",gap:10, letterSpacing:"-.02em"}}>
              <Ico n="chart" sz={20} c={C.primary}/> {reportsMode==="category"?"Category":"Tag"} Allocation
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:20}}>
              {aggrData.length === 0 ? (
                <div style={{padding:40, textAlign:"center", color:C.sub, fontSize:12, fontWeight:700, textTransform:"uppercase"}}>No data available for display</div>
              ) : aggrData.map(([name,val],idx)=>(
                <div key={idx}>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:13,fontWeight:800,marginBottom:8}}>
                    <span style={{color:C.text, letterSpacing:"-.01em"}}>{name}</span>
                    <span style={{color:C.primary,fontFamily:"'JetBrains Mono',monospace"}}>{fmtAmt(val)}</span>
                  </div>
                  <div style={{height:10,background:C.muted,borderRadius:5,overflow:"hidden", border:`1px solid ${C.border}`}}>
                    <div style={{
                      height:"100%",width:`${(val/maxVal)*100}%`,borderRadius:5,
                      background:`linear-gradient(90deg, ${C.primary}, ${C.secondary})`,
                      boxShadow:`0 0 10px ${C.primary}44`
                    }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
      </div>
    </div>
  );
}
