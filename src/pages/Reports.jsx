import React from "react";
import { Ico } from "../components/ui/Ico.jsx";
import { fmtAmt, fmtDate, dateRange, periodLabel } from "../utils/format.js";

export default function ReportsPage({ 
  reportTab, 
  setReportTab, 
  reportsMode, 
  setReportsMode, 
  reportsSubTab, 
  setReportsSubTab, 
  reportDate, 
  setReportDate, 
  filtered, // Globally filtered transactions from App.jsx
  categories,
  tags,
  theme 
}) {
  const C = theme;
  const dateRef = React.useRef(null);

  // 1. Filter by current Report's timeframe (Week/Month/Year)
  const reportTx = React.useMemo(() => {
    const [from, to] = dateRange(reportTab, reportDate);
    return filtered.filter(t => t.date >= from && t.date <= to);
  }, [filtered, reportTab, reportDate]);

  // 2. Calculate Stats
  const stats = React.useMemo(() => {
    const inc = reportTx.filter(t => t.txType === "Income").reduce((s, t) => s + t.amount, 0);
    const exp = reportTx.filter(t => t.txType === "Expense").reduce((s, t) => s + t.amount, 0);
    return { inc, exp, net: inc - exp };
  }, [reportTx]);

  const savingsRate = stats.inc > 0 ? Math.round(((stats.inc - stats.exp) / stats.inc) * 100) : 0;

  // 3. Aggregate for Breakdown view
  const aggrData = React.useMemo(() => {
    const expenseTx = reportTx.filter(t => t.txType === "Expense");
    const map = expenseTx.reduce((acc, t) => {
      const k = reportsMode === "category" 
        ? (categories.find(c => c.id === t.category)?.name || "Other") 
        : (t.tags?.[0] ? (tags.find(tg => tg.id === t.tags[0])?.name || "Tag") : "Untagged");
      acc[k] = (acc[k] || 0) + t.amount;
      return acc;
    }, {});
    return Object.entries(map).sort((a,b) => b[1] - a[1]);
  }, [reportTx, reportsMode, categories, tags]);

  const maxVal = aggrData.length > 0 ? aggrData[0][1] : 1;

  // 4. Trend Data calculation
  const trendData = React.useMemo(() => {
    if (reportsSubTab !== "trend" || reportTx.length === 0) return [];
    const map = {};
    reportTx.filter(t => t.txType === "Expense").forEach(t => {
      const gKey = reportTab === "year" ? t.date.substring(0, 7) : t.date;
      map[gKey] = (map[gKey] || 0) + t.amount;
    });
    const sorted = Object.entries(map).sort((a,b)=>a[0].localeCompare(b[0]));
    if (sorted.length === 0) return [];
    const max = Math.max(...sorted.map(x=>x[1]));
    return sorted.map(([k,v]) => ({ 
      label: reportTab === "year" ? new Date(k+"-01").toLocaleString("en", {month:"short"}).toUpperCase() : k.slice(-2), 
      val: v, 
      pct: (v/max)*100 
    }));
  }, [reportTx, reportTab, reportsSubTab]);

  return (
    <div className="page-enter" style={{padding:"20px 20px 100px 20px",display:"flex",flexDirection:"column",gap:24}}>
      <div style={{height:10}} />

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
        <span 
          onClick={() => {
            try { dateRef.current?.showPicker(); } catch (e) {}
          }}
          style={{fontSize:15,color:C.text,fontWeight:800,minWidth:160,textAlign:"center", letterSpacing:"-.02em", textTransform:"capitalize", fontFamily:"'JetBrains Mono',monospace", position:"relative", display:"inline-block", cursor:"pointer"}}
        >
          {reportTab==="week" ? `Wk ${fmtDate(reportDate).slice(0,6)}` : reportTab==="month" ? reportDate.toLocaleString("en",{month:"long",year:"numeric"}) : `Year ${reportDate.getFullYear()}`}
          <input 
            ref={dateRef}
            type="date"
            value={reportDate.toISOString().split("T")[0]}
            onChange={(e) => {
              if (e.target.value) setReportDate(new Date(e.target.value));
            }}
            style={{
              position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
              opacity: 0, cursor: "pointer"
            }}
          />
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
          {/* Compressed Net Flow Hero & Stats */}
          <div className="glass-card cyber-accent" style={{
            display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: 16,
            borderRadius:24, padding: "20px 24px", position:"relative", overflow:"hidden",
            boxShadow: `0 0 30px ${stats.net>=0?C.income:C.expense}1a`,
            border:`1px solid ${stats.net>=0?C.income:C.expense}33`, alignItems:"center"
          }}>
            <div className="scan-line" style={{background:`linear-gradient(to right, transparent, ${stats.net>=0?C.income:C.expense}44, transparent)`}} />
            <div style={{position:"absolute",top:-30,left:-30,width:100,height:100,background:stats.net>=0?C.income:C.expense,filter:"blur(50px)",opacity:0.1,borderRadius:"50%"}}/>
            
            {/* NET */}
            <div style={{ borderRight: `1px solid ${C.border}`, paddingRight: 16, position:"relative", zIndex:2 }}>
              <div style={{color:stats.net>=0?C.income:C.expense,fontSize:9,fontWeight:900,textTransform:"uppercase",letterSpacing:".15em",marginBottom:4, fontFamily:"'JetBrains Mono',monospace"}}>Net Flow Vector</div>
              <div style={{color:stats.net>=0?C.income:C.expense,fontSize:28,fontWeight:900,fontFamily:"'JetBrains Mono',monospace",letterSpacing:"-.04em", textShadow:`0 0 20px ${stats.net>=0?C.income:C.expense}44`}}>
                {stats.net>=0?"+":"−"}{fmtAmt(Math.abs(stats.net))}
              </div>
              <div style={{color:C.sub,fontSize:10,marginTop:6,fontWeight:700, textTransform:"uppercase"}}>{reportTx.length} TXNS {stats.inc > 0 ? `• ${savingsRate}% SAVED` : ""}</div>
            </div>

            {/* INC */}
            <div style={{ paddingLeft: 8, position:"relative", zIndex:2 }}>
              <div style={{color:C.sub,fontSize:9,fontWeight:900,textTransform:"uppercase",marginBottom:4, letterSpacing:".1em"}}>Gross Income</div>
              <div style={{color:C.income,fontSize:20,fontWeight:900,fontFamily:"'JetBrains Mono',monospace"}}>{fmtAmt(stats.inc)}</div>
            </div>

            {/* EXP */}
            <div style={{ position:"relative", zIndex:2 }}>
              <div style={{color:C.sub,fontSize:9,fontWeight:900,textTransform:"uppercase",marginBottom:4, letterSpacing:".1em"}}>Total Expense</div>
              <div style={{color:C.expense,fontSize:20,fontWeight:900,fontFamily:"'JetBrains Mono',monospace"}}>{fmtAmt(stats.exp)}</div>
            </div>
          </div>

          {/* Content Area (Breakdown vs Trend) */}
          <div className="glass-card cyber-accent" style={{borderRadius:32,padding:24, border:`1px solid ${C.primary}22`}}>
            <div style={{color:C.text,fontSize:16,fontWeight:900,marginBottom:28,display:"flex",alignItems:"center",gap:10, letterSpacing:"-.02em"}}>
              <Ico n={reportsSubTab==="trend"?"trendUp":"chart"} sz={20} c={C.primary}/> 
              {reportsSubTab==="trend" ? "Expense Trend" : `${reportsMode==="category"?"Category":"Tag"} Allocation`}
            </div>

            {reportsSubTab === "trend" ? (
              <div style={{display:"flex", alignItems:"flex-end", gap:8, height:200, paddingBottom:20, overflowX:"auto"}}>
                {trendData.length === 0 ? (
                  <div style={{width:"100%", padding:40, textAlign:"center", color:C.sub, fontSize:12, fontWeight:700, textTransform:"uppercase"}}>No expense data for trend</div>
                ) : trendData.map((d, i) => (
                  <div key={i} style={{flex:1, minWidth:24, display:"flex", flexDirection:"column", alignItems:"center", gap:8, height:"100%"}}>
                    <div style={{flex:1, display:"flex", alignItems:"flex-end", width:"100%", justifyContent:"center"}}>
                      <div style={{
                        width:"100%", maxWidth:30, height:`${Math.max(d.pct, 2)}%`, borderRadius:6,
                        background:`linear-gradient(to top, ${C.expense}22, ${C.expense})`,
                        boxShadow:`0 0 10px ${C.expense}44`, transition:"height 1s cubic-bezier(0.16, 1, 0.3, 1)"
                      }} />
                    </div>
                    <div style={{color:C.sub, fontSize:9, fontWeight:800, fontFamily:"'JetBrains Mono',monospace"}} title={fmtAmt(d.val)}>{d.label}</div>
                  </div>
                ))}
              </div>
            ) : (
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
            )}
          </div>
      </div>
    </div>
  );
}
