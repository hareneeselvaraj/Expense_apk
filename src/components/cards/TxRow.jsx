import React from "react";
import { Ico } from "../ui/Ico.jsx";
import { fmtAmt, fmtDate } from "../../utils/format.js";

export const TxRow = ({t, categories, tags, accounts, onClick, selected, onSelect, theme}) => {
  const C = theme;
  const cat = categories.find(c=>c.id===t.category);
  const txTags = (t.tags||[]).map(tid=>tags.find(tg=>tg.id===tid)).filter(Boolean);
  const amtColor = t.creditDebit==="Credit" ? C.credit : C.debit;

  return (
    <div style={{display:"flex", gap:10, alignItems:"center"}}>
      {onSelect && (
        <div onClick={(e)=>{e.stopPropagation(); onSelect(!selected);}} style={{
          width:24, height:24, borderRadius:8, border:`2px solid ${selected?C.primary:C.border}`, 
          background:selected?C.primary:"transparent", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", transition:"all .2s"
        }}>
          {selected && <Ico n="check" sz={14} c="#000"/>}
        </div>
      )}
      <div onClick={onClick} style={{
        flex:1, background:C.card, borderWidth:1, borderStyle:"solid", borderColor:selected?C.primary:C.border, borderRadius:22, padding:"16px", cursor:"pointer",
        display:"flex", flexDirection:"column", gap:12, transition:"all .35s cubic-bezier(0.16, 1, 0.3, 1)", backdropFilter:"blur(16px) saturate(200%)",
        boxShadow:selected?`0 8px 32px ${C.primaryDim}`:(C.cardGlow||"none"), transform:selected?"scale(1.02)":"none"
      }} onMouseEnter={e=>{if(!selected){e.currentTarget.style.borderColor=C.primary;e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 8px 32px ${C.primaryDim}`;}}} onMouseLeave={e=>{if(!selected){e.currentTarget.style.borderColor=C.border;e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow=C.cardGlow||"none";}}}>

      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:40,height:40,borderRadius:12,background:cat?.color+"20",display:"flex",alignItems:"center",justifyContent:"center",border:`1px solid ${cat?.color}40`}}>
             <div style={{width:10,height:10,borderRadius:"50%",background:cat?.color||C.sub}}/>
          </div>
          <div style={{display:"flex",flexDirection:"column"}}>
            <span style={{color:C.text,fontSize:14,fontWeight:700}}>{cat?.name||"Others"}</span>
            <span style={{color:C.sub,fontSize:11,fontWeight:500}}>{fmtDate(t.date)}</span>
          </div>
        </div>
        <div style={{textAlign:"right"}}>
          <span style={{color:amtColor,fontSize:16,fontWeight:800,fontFamily:"'JetBrains Mono',monospace"}}>
            {t.creditDebit==="Credit"?"+":"−"}{fmtAmt(t.amount)}
          </span>
          <div style={{fontSize:9,fontWeight:800,color:C.sub,marginTop:2,letterSpacing:".05em",textTransform:"uppercase"}}>{t.txType}</div>
        </div>
      </div>

      <div style={{color:C.text,fontSize:14,fontWeight:500,lineHeight:1.4, opacity:0.9}}>
        {t.description}
      </div>

      {(txTags.length>0 || t.accountId) && (
        <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap", paddingTop:4, borderTop:`1px solid ${C.border}`}}>
          {txTags.map(tg=>(
            <span key={tg.id} style={{background:tg.color+"20",color:tg.color,borderRadius:8,padding:"4px 10px",fontSize:11,fontWeight:700,border:`1px solid ${tg.color}40`}}>#{tg.name}</span>
          ))}
          {t.accountId && accounts.find(a=>a.id===t.accountId) && (
            <span style={{color:C.sub,fontSize:11,fontWeight:600,marginLeft:"auto",display:"flex",alignItems:"center",gap:4}}>
               <Ico n="bank" sz={12}/> {accounts.find(a=>a.id===t.accountId)?.name}
            </span>
          )}
        </div>
      )}
    </div>
  </div>
);
};
