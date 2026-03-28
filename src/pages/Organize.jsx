import React from "react";
import CategoriesPanel from "./Organize/CategoriesPanel.jsx";
import TagsPanel from "./Organize/TagsPanel.jsx";
import BudgetsPanel from "./Organize/BudgetsPanel.jsx";
import RulesPanel from "./Organize/RulesPanel.jsx";

export default function OrganizePage({ 
  organizeTab, 
  setOrganizeTab, 
  categories, 
  transactions, 
  tags, 
  budgets, 
  rules, 
  DEF_CATS,
  onAddCat, onEditCat, onDeleteCat,
  onAddTag, onEditTag, onDeleteTag,
  onAddBudget, onEditBudget, onDeleteBudget,
  onAddRule, onEditRule, onDeleteRule, onMagicWand,
  theme 
}) {
  const C = theme;

  return (
    <div className="page-enter" style={{padding:"16px 16px 100px 16px",display:"flex",flexDirection:"column",gap:20}}>
      {/* Sub-tab switcher */}
      <div style={{display:"flex",background:C.input,borderRadius:16,padding:4,border:`1px solid ${C.border}`, backdropFilter:"blur(12px)"}}>
        {[{id:"categories",label:"Categories"},{id:"tags",label:"Tags"},{id:"budgets",label:"Budgets"},{id:"rules",label:"Rules"}].map(t=>(
          <button key={t.id} onClick={()=>setOrganizeTab(t.id)} style={{
            flex:1,padding:"10px",borderRadius:12,border:"none",cursor:"pointer",fontSize:11,fontWeight:800,textTransform:"uppercase",letterSpacing:".05em",
            background:organizeTab===t.id?`linear-gradient(135deg, ${C.primary}, ${C.secondary})`:"transparent",
            color:organizeTab===t.id?"#000":C.sub,
            boxShadow:organizeTab===t.id?`0 4px 12px ${C.primaryDim}`:"none",
            transition:"all .3s"
          }}>{t.label}</button>
        ))}
      </div>

      {organizeTab === "categories" && <CategoriesPanel {...{categories, transactions, DEF_CATS, onAddCat, onEditCat, onDeleteCat, theme}} />}
      {organizeTab === "tags" && <TagsPanel {...{tags, transactions, onAddTag, onEditTag, onDeleteTag, theme}} />}
      {organizeTab === "budgets" && <BudgetsPanel {...{categories, tags, budgets, transactions, onAddBudget, onEditBudget, onDeleteBudget, theme}} />}
      {organizeTab === "rules" && <RulesPanel {...{rules, categories, onAddRule, onEditRule, onDeleteRule, onMagicWand, theme}} />}
    </div>
  );
}
