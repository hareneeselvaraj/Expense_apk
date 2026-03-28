import React from "react";
import { Ico } from "../../components/ui/Ico.jsx";
import { Btn } from "../../components/ui/Btn.jsx";

export default function RulesPanel({ rules, categories, onAddRule, onEditRule, onDeleteRule, onMagicWand, theme }) {
  const C = theme;

  return (
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{background:C.primaryDim, border:`1px solid ${C.primary}33`, borderRadius:20, padding:16, display:"flex", alignItems:"center", gap:12}}>
        <div style={{width:32, height:32, borderRadius:8, background:C.primary, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, color:"#000"}}>🪄</div>
        <div style={{flex:1}}>
           <div style={{color:C.text, fontSize:12, fontWeight:800}}>Auto-Categorization</div>
           <div style={{color:C.sub, fontSize:10}}>Rules automatically set categories based on keywords.</div>
        </div>
        <Btn theme={C} sm icon="plus" onClick={onAddRule}>Add</Btn>
      </div>

      {rules.length === 0 ? (
        <div style={{padding:40, textAlign:"center", color:C.sub, fontSize:13}}>No rules defined yet.</div>
      ) : (
        <div style={{display:"flex", flexDirection:"column", gap:12}}>
          {rules.map(rule => (
            <div key={rule.id} style={{background:C.card, borderRadius:20, padding:16, border:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center"}}>
               <div style={{display:"flex", flexDirection:"column", gap:4}}>
                  <div style={{color:C.text, fontSize:13, fontWeight:700}}>If description contains <span style={{color:C.secondary}}>"{rule.pattern}"</span></div>
                  <div style={{display:"flex", alignItems:"center", gap:6}}>
                     <div style={{width:6, height:6, borderRadius:"50%", background:categories.find(c=>c.id===rule.categoryId)?.color || C.primary}}/>
                     <div style={{color:C.sub, fontSize:11, fontWeight:600}}>Set category to {categories.find(c=>c.id===rule.categoryId)?.name}</div>
                  </div>
               </div>
               <div style={{display:"flex", gap:8}}>
                  <button onClick={()=>onEditRule(rule)} style={{background:"none", border:"none", color:C.sub, cursor:"pointer"}}><Ico n="pen" sz={14}/></button>
                  <button onClick={()=>onDeleteRule(rule.id)} style={{background:"none", border:"none", color:C.expense, cursor:"pointer"}}><Ico n="trash" sz={14}/></button>
               </div>
            </div>
          ))}
        </div>
      )}

      <Btn theme={C} v="soft" full icon="stars" onClick={onMagicWand}>Magic Wand: Apply to All</Btn>
    </div>
  );
}
