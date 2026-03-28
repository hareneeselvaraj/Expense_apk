import React from "react";
import { Ico } from "../ui/Ico.jsx";

export const Header = ({ title, theme, themeMode, toggleTheme, onOpenSettings, syncStatus, onOpenSync }) => {
  const C = theme;
  return (
    <div style={{position:"sticky",top:0,zIndex:300,background:C.headerBg,backdropFilter:"blur(32px) saturate(200%)",borderBottom:`1px solid ${C.border}`,padding:"14px 20px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <div style={{display:"flex", alignItems:"center", gap:10}}>
        <span style={{fontSize:20,fontWeight:900,letterSpacing:"-.04em", backgroundImage:`linear-gradient(135deg, ${C.primary}, ${C.secondary})`, backgroundSize:"200% 200%", animation:"gradientShift 4s ease infinite", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent"}}>{title}</span>
        
        <div onClick={onOpenSync} style={{display:"flex", alignItems:"center", gap:6, background:C.input, padding:"4px 10px", borderRadius:10, cursor:"pointer", border:`1px solid ${C.border}`}} onMouseEnter={e=>e.currentTarget.style.borderColor=C.primary} onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
           <div style={{width:8, height:8, borderRadius:"50%", background:syncStatus==="synced"?C.income:syncStatus==="pending"?"#f59e0b":syncStatus==="error"?C.expense:C.sub, boxShadow:`0 0 10px ${syncStatus==="synced"?C.income:syncStatus==="error"?C.expense:"transparent"}`}}/>
           <span style={{fontSize:9, fontWeight:800, color:C.sub, textTransform:"uppercase"}}>{syncStatus}</span>
        </div>
      </div>

      <div style={{display:"flex",gap:8}}>
        <button onClick={toggleTheme} style={{background:C.muted,borderWidth:1,borderStyle:"solid",borderColor:C.border,borderRadius:14,padding:"8px",color:C.text,cursor:"pointer",display:"flex",transition:"all .3s cubic-bezier(0.4,0,0.2,1)"}} onMouseOver={e=>{e.currentTarget.style.borderColor=C.primary;e.currentTarget.style.boxShadow=`0 0 16px ${C.primaryDim}`;}} onMouseOut={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.boxShadow="none";}}>
          <Ico n={themeMode==="dark"?"sun":"moon"} sz={18}/>
        </button>
         <button onClick={onOpenSettings} style={{background:C.muted,borderWidth:1,borderStyle:"solid",borderColor:C.border,borderRadius:14,padding:"8px",color:C.text,cursor:"pointer",display:"flex",transition:"all .3s cubic-bezier(0.4,0,0.2,1)"}} onMouseOver={e=>{e.currentTarget.style.borderColor=C.primary;e.currentTarget.style.boxShadow=`0 0 16px ${C.primaryDim}`;}} onMouseOut={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.boxShadow="none";}}>
          <Ico n="settings" sz={18}/>
        </button>
      </div>
    </div>
  );
};
