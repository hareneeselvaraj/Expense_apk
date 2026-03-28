import React from "react";

export const FLabel = ({children, theme}) => {
  const C = theme;
  return <label style={{color:C.sub,fontSize:10,fontWeight:800,letterSpacing:".1em",textTransform:"uppercase",display:"block",marginBottom:5}}>{children}</label>;
};

export const FInput = ({value,onChange,placeholder,type="text",style:x, theme}) => {
  const C = theme;
  return (
    <input value={value} onChange={onChange} placeholder={placeholder} type={type} style={{
      background:C.input,borderWidth:1,borderStyle:"solid",borderColor:C.border,borderRadius:10,padding:"10px 13px",
      color:C.text,fontSize:14,outline:"none",width:"100%",boxSizing:"border-box",fontFamily:"inherit",...x
    }}/>
  );
};
