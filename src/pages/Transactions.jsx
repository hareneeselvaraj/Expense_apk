import React from "react";
import { Ico } from "../components/ui/Ico.jsx";
import { Btn } from "../components/ui/Btn.jsx";
import { TxRow } from "../components/cards/TxRow.jsx";
import { fmtAmt, toISO, dateRange, stepDate, periodLabel } from "../utils/format.js";



/* ── component ───────────────────────────────────────────── */

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
  const dateRef = React.useRef(null);

  /* ── time scope state ──────────────────────────────────── */
  const [scope, setScope] = React.useState("month");        // "all" | "week" | "month" | "year"
  const [scopeDate, setScopeDate] = React.useState(new Date());

  /* ── apply time filter on top of filteredTx ────────────── */
  const timeTx = React.useMemo(() => {
    if (scope === "all") return filteredTx;
    const [from, to] = dateRange(scope, scopeDate);
    return filteredTx.filter(t => t.date >= from && t.date <= to);
  }, [filteredTx, scope, scopeDate]);

  /* ── period summary ────────────────────────────────────── */
  const summary = React.useMemo(() => {
    const inc = timeTx.filter(t => t.txType === "Income").reduce((s, t) => s + t.amount, 0);
    const exp = timeTx.filter(t => t.txType === "Expense").reduce((s, t) => s + t.amount, 0);
    const inv = timeTx.filter(t => t.txType === "Investment").reduce((s, t) => s + t.amount, 0);
    return { inc, exp, inv, net: inc - exp - inv };
  }, [timeTx]);

  /* ── group transactions by date ────────────────────────── */
  const grouped = React.useMemo(() => {
    const map = {};
    timeTx.forEach(t => {
      const key = t.date;
      if (!map[key]) map[key] = [];
      map[key].push(t);
    });
    return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0]));
  }, [timeTx]);

  const fmtGroupDate = iso => {
    try {
      const d = new Date(iso + "T00:00:00");
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (iso === toISO(today)) return "Today";
      if (iso === toISO(yesterday)) return "Yesterday";
      return d.toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short", year: "2-digit" });
    } catch { return iso; }
  };

  return (
    <div className="page-enter" style={{ padding: "16px 16px 100px 16px", display: "flex", flexDirection: "column", gap: 12 }}>

      {/* ── Search bar ─────────────────────────────────── */}
      <div style={{ display: "flex", gap: 8 }}>
        <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search description…" style={{ flex: 1, background: C.input, borderWidth: 1, borderStyle: "solid", borderColor: C.border, borderRadius: 10, padding: "9px 13px", color: C.text, fontSize: 14, outline: "none", fontFamily: "inherit" }} />
        <button onClick={onShowFilters} style={{ background: hasFilter ? C.primary + "22" : "transparent", border: `1px solid ${hasFilter ? C.primary : C.border}`, borderRadius: 10, padding: "9px 11px", color: hasFilter ? C.primary : C.sub, cursor: "pointer", display: "flex", alignItems: "center" }}>
          <Ico n="filter" sz={18} />
        </button>
      </div>

      {/* ── Time scope tabs ────────────────────────────── */}
      <div style={{ display: "flex", background: "rgba(255,255,255,0.03)", borderRadius: 20, padding: 4, border: `1px solid ${C.border}`, backdropFilter: "blur(24px)" }}>
        {["all", "week", "month", "year"].map(t => (
          <button key={t} onClick={() => { setScope(t); if (t !== "all") setScopeDate(new Date()); }} style={{
            flex: 1, padding: "10px", borderRadius: 16, border: "none", cursor: "pointer",
            fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: ".08em",
            background: scope === t ? C.primary : "transparent",
            color: scope === t ? "#000" : C.sub,
            boxShadow: scope === t ? `0 0 20px ${C.primary}66` : "none",
            transition: "all .4s cubic-bezier(0.16, 1, 0.3, 1)"
          }}>{t === "all" ? "All" : t}</button>
        ))}
      </div>

      {/* ── Period navigator ───────────────────────────── */}
      {scope !== "all" && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginTop: 2 }}>
          <button onClick={() => setScopeDate(stepDate(scope, scopeDate, -1))} style={{
            background: C.primaryDim, border: `1px solid ${C.primary}33`, borderRadius: "50%",
            padding: 8, color: C.primary, cursor: "pointer", display: "flex", transition: "transform .2s"
          }} onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
            <Ico n="chevronLeft" sz={16} />
          </button>

          <span 
            onClick={() => {
              try { dateRef.current?.showPicker(); } catch (e) {}
            }}
            style={{
              fontSize: 14, color: C.text, fontWeight: 800, minWidth: 180, textAlign: "center",
              letterSpacing: "-.02em", fontFamily: "'JetBrains Mono',monospace", position: "relative",
              display: "inline-block"
            }}
          >
            {periodLabel(scope, scopeDate)}
            <input 
              ref={dateRef}
              type="date"
              value={toISO(scopeDate)}
              onChange={(e) => {
                if (e.target.value) setScopeDate(new Date(e.target.value));
              }}
              style={{
                position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
                opacity: 0, cursor: "pointer"
              }}
            />
          </span>

          <button onClick={() => setScopeDate(stepDate(scope, scopeDate, 1))} style={{
            background: C.primaryDim, border: `1px solid ${C.primary}33`, borderRadius: "50%",
            padding: 8, color: C.primary, cursor: "pointer", display: "flex", transition: "transform .2s"
          }} onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
            <Ico n="chevronRight" sz={16} />
          </button>
        </div>
      )}

      {/* ── Period summary strip ───────────────────────── */}
      {scope !== "all" && (
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8
        }}>
          {[
            { label: "Income", value: summary.inc, color: C.income },
            { label: "Expense", value: summary.exp, color: C.expense },
            { label: "Net", value: summary.net, color: summary.net >= 0 ? C.income : C.expense }
          ].map(s => (
            <div key={s.label} style={{
              background: s.color + "0a", border: `1px solid ${s.color}22`, borderRadius: 16,
              padding: "10px 12px", textAlign: "center"
            }}>
              <div style={{ color: C.sub, fontSize: 9, fontWeight: 900, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 4 }}>{s.label}</div>
              <div style={{ color: s.color, fontSize: 14, fontWeight: 800, fontFamily: "'JetBrains Mono',monospace" }}>
                {s.label === "Net" && s.value >= 0 ? "+" : s.label === "Net" && s.value < 0 ? "−" : ""}{fmtAmt(Math.abs(s.value))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Quick CR/DR filter pills ───────────────────── */}
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

      {/* ── Stats strip ────────────────────────────────── */}
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 4, flexWrap: "wrap", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {timeTx.length > 0 && (
            <div onClick={() => {
              const allFilteredIds = timeTx.map(t => t.id);
              const isAllSelected = allFilteredIds.every(id => selectedTxIds.includes(id));
              if (isAllSelected) {
                setSelectedTxIds(selectedTxIds.filter(id => !allFilteredIds.includes(id)));
              } else {
                setSelectedTxIds([...new Set([...selectedTxIds, ...allFilteredIds])]);
              }
            }} style={{
              width: 20, height: 20, borderRadius: 6, border: `2px solid ${timeTx.every(t => selectedTxIds.includes(t.id)) ? C.primary : C.border}`,
              background: timeTx.every(t => selectedTxIds.includes(t.id)) ? C.primary : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all .2s"
            }}>
              {timeTx.every(t => selectedTxIds.includes(t.id)) && <Ico n="check" sz={12} c="#000" />}
            </div>
          )}
          <span style={{ color: C.sub, fontSize: 12, fontWeight: 700 }}>{timeTx.length} items</span>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Btn theme={C} v="ghost" sm icon="down" onClick={onExportCSV}>CSV</Btn>
          <Btn theme={C} v="ghost" sm icon="stars" onClick={onExportPDF}>PDF</Btn>
          <Btn theme={C} v="ghost" sm icon="upload" onClick={onShowUpload}>Import</Btn>
          <button onClick={onAdd} style={{
            background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`,
            border: "none", borderRadius: 10, padding: "6px 14px", color: "#000", fontSize: 12, fontWeight: 800,
            cursor: "pointer", display: "flex", alignItems: "center", gap: 5, fontFamily: "inherit",
            boxShadow: `0 4px 12px ${C.primaryDim}`, transition: "transform .2s"
          }} onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
            <Ico n="plus" sz={14} c="#000" /> Add
          </button>
        </div>
      </div>

      {/* ── Transaction list (grouped by date) ─────────── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {timeTx.length === 0 ? (
          <div style={{ padding: 60, textAlign: "center", color: C.sub, fontSize: 14 }}>
            {scope === "all" ? "No transactions match your filters." : `No transactions for ${periodLabel(scope, scopeDate)}.`}
          </div>
        ) : grouped.map(([date, txs]) => (
          <div key={date}>
            <div style={{
              fontSize: 11, fontWeight: 800, color: C.sub, textTransform: "uppercase",
              letterSpacing: ".08em", padding: "12px 4px 6px", display: "flex", alignItems: "center", gap: 8
            }}>
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: C.primary }} />
              {fmtGroupDate(date)}
              <div style={{ flex: 1, height: 1, background: C.border, marginLeft: 4 }} />
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: C.sub }}>
                {fmtAmt(txs.reduce((s, t) => s + (t.creditDebit === "Credit" ? t.amount : -t.amount), 0))}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {txs.map(t => (
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
          </div>
        ))}
      </div>

      {/* ── Bulk Actions Floating Bar ──────────────────── */}
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
