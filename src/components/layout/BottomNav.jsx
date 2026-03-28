import React from "react";
import { Ico } from "../ui/Ico.jsx";

export const BottomNav = ({ page, setPage, theme }) => {
  const C = theme;
  const items = [
    {id:"dashboard",icon:"home",label:"Home"},
    {id:"transactions",icon:"list",label:"Txns"},
    {id:"reports",icon:"chart",label:"Report"},
    {id:"organize",icon:"grid",label:"Organize"},
    {id:"vault",icon:"bank",label:"Vault"}
  ];

  return (
    <nav style={{position:"fixed",bottom:16,left:"50%",transform:"translateX(-50%)",width:"calc(100% - 40px)",maxWidth:560,background:C.navBg,backdropFilter:"blur(32px) saturate(200%)",borderWidth:1,borderStyle:"solid",borderColor:C.border,borderRadius:28,display:"flex",padding:"8px 6px",zIndex:200, boxShadow:`${C.shadow}, 0 0 60px ${C.glow1||"transparent"}`}}>
      {items.map(n=>(
        <button key={n.id} onClick={()=>setPage(n.id)} style={{flex:1,background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"6px 0",color:page===n.id?C.primary:C.sub,fontFamily:"inherit",transition:"all .4s cubic-bezier(0.16, 1, 0.3, 1)", transform:page===n.id?"translateY(-3px)":"translateY(0)"}}>
          <div style={{position:"relative", display:"flex", alignItems:"center", justifyContent:"center"}}>
            {page===n.id && <div style={{position:"absolute", width:40, height:40, background:C.primaryDim, borderRadius:"14px", filter:"blur(12px)", animation:"pulseGlow 2s ease-in-out infinite"}}/>}
            <Ico n={n.icon} sz={22} c={page===n.id?C.primary:C.sub}/>
          </div>
          <span style={{fontSize:9,fontWeight:800, letterSpacing:".04em", textTransform:"uppercase", opacity:page===n.id?1:0.5, color:page===n.id?C.primary:C.sub, transition:"all .3s"}}>{n.label}</span>
        </button>
      ))}
    </nav>
  );
};
