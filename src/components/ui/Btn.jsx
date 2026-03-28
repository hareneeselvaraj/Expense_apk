import React from "react";
import { Ico } from "./Ico.jsx";

export const Btn = ({children,onClick,v="primary",icon,disabled,full,sm,theme}) => {
  const C = theme;
  const vs={
    primary:{bg:`linear-gradient(135deg, ${C.primary}, ${C.secondary})`,co:"#000",bo:"none"},
    ghost:{bg:"transparent",co:C.text,bo:`1px solid ${C.border}`},
    danger:{bg:C.expense,co:"#fff",bo:"none"},
    soft:{bg:C.muted,co:C.text,bo:"none"}
  };
  const s=vs[v]||vs.primary;
  const isGrad = s.bg.includes("gradient");
  return (
    <button onClick={onClick} disabled={disabled} style={{
      backgroundColor: isGrad ? "transparent" : s.bg,
      backgroundImage: isGrad ? s.bg : "none",
      backgroundSize: isGrad ? "200% 200%" : "auto",
      animation: (v==="primary" && isGrad) ? "gradientShift 3s ease infinite" : "none",
      color:s.co,borderWidth:s.bo==="none"?0:1,borderStyle:"solid",borderColor:s.bo==="none"?"transparent":C.border,borderRadius:16,padding:sm?"8px 16px":"14px 24px",
      fontSize:sm?13:14,fontWeight:800,cursor:disabled?"not-allowed":"pointer",opacity:disabled?0.5:1,
      display:"flex",alignItems:"center",gap:8,justifyContent:"center",
      width:full?"100%":"auto",fontFamily:"inherit",transition:"all .35s cubic-bezier(0.16, 1, 0.3, 1)",
      boxShadow:v==="primary"?`0 4px 20px ${C.primaryDim}`:"none",
    }} onMouseEnter={e=>{if(!disabled){e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=v==="primary"?`0 8px 32px ${C.primaryDim}, 0 0 40px ${C.primaryDim}`:"none";}}} onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow=v==="primary"?`0 4px 20px ${C.primaryDim}`:"none";}}>
      {icon&&<Ico n={icon} sz={sm?14:16} c={s.co}/>}{children}
    </button>
  );
};
