import React, { useState, useEffect } from "react";
import { Ico } from "./Ico.jsx";

export const Modal = ({open,onClose,title,children,theme}) => {
  const [active, setActive] = useState(false);
  const C = theme;
  useEffect(() => { if(open) setTimeout(()=>setActive(true), 10); else setActive(false); }, [open]);
  if(!open) return null;
  const isMobile = window.innerWidth < 600;
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.75)",backdropFilter:"blur(12px)",zIndex:600,display:"flex",alignItems:isMobile?"flex-end":"center",justifyContent:"center",transition:"opacity .3s ease",opacity:active?1:0, padding:isMobile?0:20}}>
      <div className="premium-scroll" onClick={e=>e.stopPropagation()} style={{
        background:C.surface, borderWidth:1,borderStyle:"solid",borderColor:C.border, borderRadius:isMobile?"36px 36px 0 0":"32px", width:"100%", maxWidth:600, maxHeight:isMobile?"92vh":"85vh", overflow:"auto",
        backdropFilter:"blur(32px) saturate(200%)", boxShadow:`${C.shadow}, ${C.cardGlow||"none"}`, transform:active?"translateY(0)":"translateY(100%)", transition:"transform .45s cubic-bezier(0.16, 1, 0.3, 1)"
      }}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"24px 24px 16px",borderBottom:`1px solid ${C.border}`,position:"sticky",top:0,background:C.surface,zIndex:1, backdropFilter:"blur(20px)"}}>
          <span style={{color:C.text,fontSize:18,fontWeight:800,letterSpacing:"-.02em"}}>{title}</span>
          <button onClick={onClose} style={{background:C.muted,border:"none",borderRadius:"50%",color:C.text,cursor:"pointer",padding:8,display:"flex",transition:"transform .2s"}} onMouseOver={e=>e.currentTarget.style.transform="scale(1.1)"} onMouseOut={e=>e.currentTarget.style.transform="scale(1)"}><Ico n="close" sz={20}/></button>
        </div>
        <div style={{padding:"20px 24px 40px"}}>{children}</div>
      </div>
    </div>
  );
};
