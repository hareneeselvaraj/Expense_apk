import React, { useState } from "react";
import { Ico } from "../ui/Ico.jsx";
import { Btn } from "../ui/Btn.jsx";
import { uid } from "../../utils/id.js";

export function TagForm({ editTag, onSave, onCancel, theme }) {
  const C = theme;
  const [name, setName] = useState(editTag?.name || "");
  const [color, setColor] = useState(editTag?.color || "#3b82f6");

  const colors = ["#ef4444", "#f97316", "#f59e0b", "#eab308", "#10b981", "#06b6d4", "#3b82f6", "#6366f1", "#a855f7", "#ec4899", "#64748b"];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      id: editTag?.id || uid(),
      name: name.trim().replace(/^#/, ""), // Remove leading # if user typed it
      color
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{padding:24, display:"flex", flexDirection:"column", gap:24}}>
      <div style={{display:"flex", gap:20, alignItems:"center"}}>
        <div style={{
          width:64, height:64, borderRadius:20, background:`linear-gradient(135deg, ${color}33, ${color}11)`,
          display:"flex", alignItems:"center", justifyContent:"center", border:`1px solid ${color}66`,
          fontSize:32, boxShadow:`0 10px 20px ${color}22`, backdropFilter:"blur(10px)", color:color
        }}>
          #
        </div>
        <div style={{flex:1}}>
          <label style={{color:C.sub, fontSize:10, fontWeight:900, textTransform:"uppercase", letterSpacing:".1em"}}>Tag Name</label>
          <input 
            autoFocus
            value={name}
            onChange={e=>setName(e.target.value)}
            placeholder="e.g. Vacation"
            style={{
              width:"100%", background:"none", border:"none", borderBottom:`2px solid ${C.border}`,
              color:C.text, fontSize:22, fontWeight:800, padding:"8px 0", outline:"none",
              transition:"border-color .3s"
            }}
            onFocus={e=>e.target.style.borderColor=C.primary}
            onBlur={e=>e.target.style.borderColor=C.border}
          />
        </div>
      </div>

      <div>
        <label style={{color:C.sub, fontSize:10, fontWeight:900, textTransform:"uppercase", letterSpacing:".1em", display:"block", marginBottom:12}}>Identity Color</label>
        <div style={{display:"flex", flexWrap:"wrap", gap:10}}>
          {colors.map(c => (
            <button key={c} type="button" onClick={()=>setColor(c)} style={{
              width:32, height:32, borderRadius:"50%", background:c, border:color===c?`3px solid #fff`:`2px solid transparent`,
              cursor:"pointer", transition:"transform .2s", boxShadow:color===c?`0 0 15px ${c}`:"none"
            }} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.2)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}/>
          ))}
        </div>
      </div>

      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginTop:8}}>
        <Btn theme={C} v="ghost" full onClick={onCancel}>Cancel</Btn>
        <Btn theme={C} v="primary" full type="submit">Save Tag</Btn>
      </div>
    </form>
  );
}
