import React from "react";
import { Ico } from "../components/ui/Ico.jsx";
import { Btn } from "../components/ui/Btn.jsx";
import { TxRow } from "../components/cards/TxRow.jsx";
import { fmtAmt } from "../utils/format.js";

export default function TransactionsPage({
  transactions,
  filteredTx,
  categories,
  tags,
  accounts,
  searchQ,
  setSearchQ,
  filters,
  setFilters,
  hasFilter,
  onShowFilters,
  onShowUpload,
  onExportCSV,
  onExportPDF,
  onEditTx,
  selectedTxIds,
  setSelectedTxIds,
  onDeleteBulk,
  onAdd,
  theme
}) {
  const C = theme;
  const [confirmBulkDelete, setConfirmBulkDelete] = React.useState(false);

  return (
    <div className="page-enter" style={{ padding: "16px 16px 100px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Search bar */}
      <div style={{ display: "flex", gap: 8 }}>
        <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search description…" style={{ flex: 1, background: C.input, borderWidth: 1, borderStyle: "solid", borderColor: C.border, borderRadius: 10, padding: "9px 13px", color: C.text, fontSize: 14, outline: "none", fontFamily: "inherit" }} />
        <button onClick={onShowFilters} style={{ background: hasFilter ? C.primary + "22" : "transparent", border: `1px solid ${hasFilter ? C.primary : C.border}`, borderRadius: 10, padding: "9px 11px", color: hasFilter ? C.primary : C.sub, cursor: "pointer", display: "flex", alignItems: "center" }}>
          <Ico n="filter" sz={18} />
        </button>
      </div>

      {/* Quick CR/DR filter pills */}
      <div style={{ display: "flex", gap: 7, overflowX: "auto", paddingBottom: 2 }}>
        {["", "Credit", "Debit", "Income", "Expense", "Investment"].map(opt => {
          const active = opt === "" ? (filters.cd === "" && filters.type === "") : (filters.cd === opt || filters.type === opt);
          const col = opt === "Credit" ? C.income : opt === "Debit" ? C.expense : opt === "Income" ? C.income : opt === "Expense" ? C.expense : opt === "Investment" ? C.invest : C.primary;
          return (
            <button key={opt} onClick={() => {
              if (opt === "") setFilters(p => ({ ...p, cd: "", type: "" }));
              else if (opt === "Credit" || opt === "Debit") setFilters(p => ({ ...p, cd: p.cd === opt ? "" : opt, type: "" }));
              else setFilters(p => ({ ...p, type: p.type === opt ? "" : opt, cd: "" }));
            }} style={{
              background: active ? col + "22" : "transparent", border: `1px solid ${active ? col : C.border}`, borderRadius: 99,
              padding: "5px 13px", color: active ? col : C.sub, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", flexShrink: 0
            }}>{opt || "All"}</button>
          );
        })}
      </div>

      {/* Stats strip */}
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 4 }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
          {filteredTx.length > 0 && (
            <div onClick={() => {
              const allFilteredIds = filteredTx.map(t => t.id);
              const isAllSelected = allFilteredIds.every(id => selectedTxIds.includes(id));
              if (isAllSelected) {
                setSelectedTxIds(selectedTxIds.filter(id => !allFilteredIds.includes(id)));
              } else {
                setSelectedTxIds([...new Set([...selectedTxIds, ...allFilteredIds])]);
              }
            }} style={{
              width: 20, height: 20, borderRadius: 6, border: `2px solid ${filteredTx.every(t => selectedTxIds.includes(t.id)) ? C.primary : C.border}`,
              background: filteredTx.every(t => selectedTxIds.includes(t.id)) ? C.primary : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all .2s"
            }}>
              {filteredTx.every(t => selectedTxIds.includes(t.id)) && <Ico n="check" sz={12} c="#000" />}
            </div>
          )}
          <span style={{ color: C.sub, fontSize: 12, fontWeight: 700 }}>{filteredTx.length} transactions</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn theme={C} v="ghost" sm icon="down" onClick={onExportCSV}>CSV</Btn>
          <Btn theme={C} v="ghost" sm icon="stars" onClick={onExportPDF}>PDF</Btn>
          <Btn theme={C} v="ghost" sm icon="upload" onClick={onShowUpload}>Import</Btn>
          <button onClick={onAdd} style={{
            background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})`,
            border:"none", borderRadius:10, padding:"6px 14px", color:"#000", fontSize:12, fontWeight:800,
            cursor:"pointer", display:"flex", alignItems:"center", gap:5, fontFamily:"inherit",
            boxShadow:`0 4px 12px ${C.primaryDim}`, transition:"transform .2s"
          }} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.05)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
            <Ico n="plus" sz={14} c="#000"/> Add
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filteredTx.length === 0 ? (
          <div style={{ padding: 60, textAlign: "center", color: C.sub, fontSize: 14 }}>No transactions match your filters.</div>
        ) : filteredTx.map(t => (
          <TxRow
            key={t.id}
            t={t}
            categories={categories}
            tags={tags}
            accounts={accounts}
            onClick={() => onEditTx(t)}
            selected={selectedTxIds.includes(t.id)}
            onSelect={(isSel) => setSelectedTxIds(isSel ? [...selectedTxIds, t.id] : selectedTxIds.filter(x => x !== t.id))}
            theme={C}
          />
        ))}
      </div>

      {/* Bulk Actions Floating Bar */}
      {selectedTxIds.length > 0 && (
        <div style={{
          position: "fixed", bottom: 100, left: "50%", transform: "translateX(-50%)", width: "calc(100% - 40px)", maxWidth: 500,
          background: C.primary, color: "#000", borderRadius: 20, padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between",
          boxShadow: "0 12px 40px rgba(0,0,0,0.5)", zIndex: 400, animation: "fadeIn 0.3s ease"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ background: "#000", color: C.primary, width: 28, height: 28, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 900, fontFamily: "'JetBrains Mono',monospace" }}>
              {selectedTxIds.length}
            </div>
            <span style={{ fontSize: 14, fontWeight: 800 }}>Selected</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {confirmBulkDelete ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 900, textTransform: "uppercase", color: "#000" }}>DELETE?</span>
                <button onClick={() => { onDeleteBulk(); setConfirmBulkDelete(false); }} style={{ background: "#000", border: "none", borderRadius: 10, padding: "8px 16px", color: C.expense, fontSize: 12, fontWeight: 800, cursor: "pointer", transition: "transform .2s" }}>YES</button>
                <button onClick={() => setConfirmBulkDelete(false)} style={{ background: "rgba(0,0,0,0.1)", border: "none", borderRadius: 10, padding: "8px 16px", color: "#000", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>NO</button>
              </div>
            ) : (
              <>
                <button onClick={() => setSelectedTxIds([])} style={{ background: "rgba(0,0,0,0.1)", border: "none", borderRadius: 10, padding: "8px 14px", color: "#000", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Clear</button>
                <button onClick={() => setConfirmBulkDelete(true)} style={{ background: "#000", border: "none", borderRadius: 10, padding: "8px 14px", color: C.expense, fontSize: 12, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, transition: "transform .2s" }} onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
                  <Ico n="trash" sz={14} c={C.expense} /> Delete
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
