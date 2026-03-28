import React, { useState } from "react";
import { Ico } from "../components/ui/Ico.jsx";
import { Btn } from "../components/ui/Btn.jsx";
import { TxRow } from "../components/cards/TxRow.jsx";
import { fmtAmt, fmtDate, todayISO } from "../utils/format.js";
import { uid } from "../utils/id.js";
import { BLANK_TX } from "../constants/defaults.js";

const Sparkline = ({ data, color, height = 30 }) => {
  if(!data || data.length < 2) return null;
  const max = Math.max(...data.map(Math.abs), 1);
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 100},${50 - (v / max) * 40}`).join(" ");
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height, opacity: 0.6 }}>
      <polyline fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={pts} />
    </svg>
  );
};

const QuickAdd = ({ categories, onSave, theme }) => {
  const [amt, setAmt] = useState("");
  const [cat, setCat] = useState(categories[0]?.id || "");
  const C = theme;

  const submit = () => {
    if(!amt || isNaN(amt)) return;
    onSave({ ...BLANK_TX, id: uid(), amount: parseFloat(amt), category: cat, date: todayISO() });
    setAmt("");
  };

  return (
    <div style={{background:C.card, border:`1px solid ${C.border}`, borderRadius:24, padding:14, display:"flex", alignItems:"center", gap:10, backdropFilter:"blur(12px)"}}>
      <div style={{flex:1, position:"relative"}}>
        <span style={{position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:C.sub, fontSize:12, fontWeight:800}}>₹</span>
        <input type="number" value={amt} onChange={e=>setAmt(e.target.value)} placeholder="0.00" style={{width:"100%", background:C.input, border:"none", borderRadius:14, padding:"10px 10px 10px 24px", color:C.text, fontSize:15, fontWeight:800, fontFamily:"'JetBrains Mono',monospace"}} />
      </div>
      <select value={cat} onChange={e=>setCat(e.target.value)} style={{background:C.input, border:"none", borderRadius:14, padding:"10px", color:C.text, fontSize:13, fontWeight:700, outline:"none"}}>
        {categories.slice(0, 8).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      <button onClick={submit} style={{width:42, height:42, borderRadius:14, background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})`, border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center"}} onMouseOver={e=>e.currentTarget.style.transform="scale(1.05)"} onMouseOut={e=>e.currentTarget.style.transform="scale(1)"}><Ico n="plus" sz={18} c="#000"/></button>
    </div>
  );
};

export default function Dashboard({ user, transactions, categories, tags, accounts, stats, netWorth, getDayFlow, viewDate, setViewDate, onEditTx, onAddTx, onSave, theme }) {
  const C = theme;
  const dateRef = React.useRef(null);
  
  return (
    <div className="page-enter" style={{padding:"20px 20px 100px 20px",display:"flex",flexDirection:"column",gap:24}}>
      
      {/* Greeting + Month Picker */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
        <div>
          <h1 style={{fontSize:24,fontWeight:900,color:C.text,margin:0,letterSpacing:"-.03em"}}>Hello, {user?.name?.split(" ")[0]||"User"}!</h1>
          <div style={{display:"flex",alignItems:"center",gap:8,marginTop:4}}>
            <button onClick={()=>setViewDate(new Date(viewDate.getFullYear(),viewDate.getMonth()-1,1))} style={{background:C.input,borderWidth:1,borderStyle:"solid",borderColor:C.border,borderRadius:"50%",padding:4,color:C.sub,cursor:"pointer"}}><Ico n="chevronLeft" sz={14}/></button>
            <span 
              onClick={() => {
                try { dateRef.current?.showPicker(); } catch (e) {}
              }}
              style={{fontSize:13,color:C.sub,fontWeight:700,textTransform:"uppercase",letterSpacing:".05em", position:"relative", cursor:"pointer"}}
            >
              {viewDate.toLocaleString("en",{month:"long",year:"numeric"})}
              <input 
                ref={dateRef}
                type="date"
                value={viewDate.toISOString().split("T")[0]}
                onChange={(e) => {
                  if (e.target.value) setViewDate(new Date(e.target.value));
                }}
                style={{
                  position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
                  opacity: 0, cursor: "pointer"
                }}
              />
            </span>
            <button onClick={()=>setViewDate(new Date(viewDate.getFullYear(),viewDate.getMonth()+1,1))} style={{background:C.input,borderWidth:1,borderStyle:"solid",borderColor:C.border,borderRadius:"50%",padding:4,color:C.sub,cursor:"pointer"}}><Ico n="chevronRight" sz={14}/></button>
          </div>
        </div>
        {user?.picture && <img src={user.picture} style={{width:44,height:44,borderRadius:14,border:`2px solid ${C.borderLight}`,boxShadow:C.shadow}} alt="Profile"/>}
      </div>


      {/* Net Worth Hero Card */}
      <div style={{
        background: `linear-gradient(135deg, ${C.card}, ${C.bg})`, border: `1px solid ${C.border}`, borderRadius:32, padding:24,
        position: "relative", overflow: "hidden", boxShadow: C.shadow
      }}>
        <div style={{position:"absolute", top:-50, right:-50, width:150, height:150, background:C.primary, filter:"blur(80px)", opacity:0.1}}/>
        <div style={{color:C.sub, fontSize:12, fontWeight:800, textTransform:"uppercase", letterSpacing:".1em"}}>Current Net Worth</div>
        <div style={{color:C.text, fontSize:36, fontWeight:900, margin:"8px 0", fontFamily:"'JetBrains Mono',monospace", letterSpacing:"-0.03em"}}>{fmtAmt(netWorth)}</div>
        <div style={{display:"flex", alignItems:"center", gap:12, marginTop:16, borderTop: `1px solid ${C.border}`, paddingTop: 16}}>
          <div style={{flex:1}}>
            <div style={{color:C.sub, fontSize:10, fontWeight:700, marginBottom:4}}>30D CASH FLOW</div>
            <Sparkline data={getDayFlow(30)} color={C.primary} height={40} />
          </div>
          <div style={{width:1, height:40, background:C.border}}/>
          <div style={{textAlign:"right"}}>
            <div style={{color:C.income, fontSize:14, fontWeight:900}}>+{fmtAmt(transactions.filter(t=>t.creditDebit==="Credit" && t.date.startsWith(new Date().toISOString().slice(0,7))).reduce((s,t)=>s+t.amount,0))}</div>
            <div style={{color:C.sub, fontSize:10, fontWeight:700}}>THIS MONTH</div>
          </div>
        </div>
      </div>

      {/* Vitals Grid */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:12}}>
        {[
          {l:"Inflow",a:stats.income,co:C.income,ic:"trendUp"},
          {l:"Outflow",a:stats.expense,co:C.expense,ic:"trendDown"},
          {l:"Growth",a:stats.invest,co:C.invest,ic:"stars"}
        ].map((s,i)=>(
          <div key={i} style={{
            background:C.card, borderWidth:1, borderStyle:"solid", borderColor:C.border, borderRadius:24, padding:16,
            backdropFilter:"blur(16px) saturate(200%)", display:"flex", flexDirection:"column", gap:10, transition:"all .4s cubic-bezier(0.16, 1, 0.3, 1)",
            boxShadow:C.cardGlow||"none"
          }} onMouseEnter={e=>{e.currentTarget.style.borderColor=s.co;e.currentTarget.style.boxShadow=`0 0 24px ${s.co}22`;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.boxShadow=C.cardGlow||"none";}}>
            <div style={{width:32,height:32,borderRadius:10,background:s.co+"15",display:"flex",alignItems:"center",justifyContent:"center",border:`1px solid ${s.co}20`}}>
              <Ico n={s.ic} sz={16} c={s.co}/>
            </div>
            <div>
              <div style={{color:C.sub,fontSize:9,fontWeight:800,textTransform:"uppercase",letterSpacing:".08em"}}>{s.l}</div>
              <div style={{color:s.co,fontSize:14,fontWeight:800,fontFamily:"'JetBrains Mono',monospace",marginTop:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{fmtAmt(s.a)}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Allocation Hub */}
      {Object.keys(stats.catMap).length>0 && (
        <div style={{background:C.card,borderWidth:1,borderStyle:"solid",borderColor:C.border,borderRadius:32,padding:24, backdropFilter:"blur(12px)"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
            <div style={{color:C.text,fontSize:16,fontWeight:800, display:"flex", alignItems:"center", gap:8}}><Ico n="grid" sz={18} c={C.primary}/> Allocation</div>
          </div>
          
          {Object.entries(stats.catMap).sort((a,b)=>b[1]-a[1]).slice(0,4).map(([name,amt],idx)=>{
            const cat=categories.find(c=>c.name===name), max=Math.max(...Object.values(stats.catMap)), pct=Math.round((amt/max)*100);
            const hasBudget = cat?.budget && cat.budget > 0;
            const budgetPct = hasBudget ? Math.min(Math.round((amt / cat.budget) * 100), 100) : 0;
            const overBudget = hasBudget && amt > cat.budget;
            return (
              <div key={name} style={{marginBottom:idx===Object.entries(stats.catMap).slice(0,4).length-1?0:20}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:8,alignItems:"flex-end"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:10,height:10,borderRadius:"30%",background:cat?.color||C.sub}}/>
                    <span style={{color:C.text,fontSize:14,fontWeight:700}}>{name}</span>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{color:C.text,fontSize:13,fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{fmtAmt(amt)}{hasBudget && <span style={{color:C.sub,fontSize:10}}> / {fmtAmt(cat.budget)}</span>}</div>
                    {hasBudget ? (
                      <div style={{color:overBudget?C.expense:budgetPct>80?"#f59e0b":C.income,fontSize:10,fontWeight:700}}>{overBudget?"⚠ Over budget!":`${budgetPct}% used`}</div>
                    ) : (
                      <div style={{color:C.sub,fontSize:10,fontWeight:700}}>{pct}% focus</div>
                    )}
                  </div>
                </div>
                <div style={{height:8,background:C.muted,borderRadius:4, overflow:"hidden"}}>
                  <div style={{height:"100%",width:hasBudget?`${budgetPct}%`:`${pct}%`,background:overBudget?`linear-gradient(90deg, ${C.expense}, ${C.expense}dd)`:`linear-gradient(90deg, ${cat?.color||C.primary}, ${cat?.color||C.secondary}dd)`,borderRadius:4, transition:"width 1.5s cubic-bezier(0.16, 1, 0.3, 1)"}}/>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Recent Activity */}
      <div style={{background:C.card,borderWidth:1,borderStyle:"solid",borderColor:C.border,borderRadius:28,padding:20}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16, padding:"0 4px"}}>
          <div style={{color:C.text,fontSize:16,fontWeight:800}}>Recent Activity</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {transactions.slice(0,5).map(t=>(
            <TxRow key={t.id} t={t} categories={categories} tags={tags} accounts={accounts} onClick={()=>onEditTx(t)} theme={C}/>
          ))}
        </div>
      </div>
    </div>
  );
}
