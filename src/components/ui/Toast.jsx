import React from "react";

export const Toast = ({ toast, theme }) => {
  if (!toast) return null;
  const C = theme;
  return (
    <div style={{position:"fixed",bottom:92,left:"50%",transform:"translateX(-50%)",zIndex:999,background:toast.type==="error"?"#2a0a10":"#082018",border:`1px solid ${toast.type==="error"?C.expense:C.income}`,color:toast.type==="error"?C.expense:C.income,padding:"10px 20px",borderRadius:12,fontSize:13,fontWeight:700,whiteSpace:"nowrap",boxShadow:"0 8px 32px #00000077"}}>
      {toast.msg}
    </div>
  );
};
