import React, { useEffect, useState } from "react";
import { Ico } from "./Ico.jsx";

export const Toast = ({ toast, theme }) => {
  const [visible, setVisible] = useState(false);
  const C = theme;

  useEffect(() => {
    if (toast) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 2800);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  if (!toast) return null;

  const isErr = toast.type === "error";
  const accent = isErr ? C.expense : C.income;
  const bg = isErr ? "rgba(42, 10, 16, 0.9)" : "rgba(8, 32, 24, 0.9)";

  return (
    <div style={{
      position: "fixed", bottom: 90, left: "50%", transform: `translateX(-50%) translateY(${visible ? 0 : 20}px)`,
      opacity: visible ? 1 : 0, zIndex: 1000, transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      pointerEvents: "none", width: "100%", maxWidth: 320, padding: "0 20px"
    }}>
      <div style={{
        background: bg, backdropFilter: "blur(20px) saturate(180%)",
        border: `1px solid ${accent}`, borderRadius: 16, padding: "14px 20px",
        display: "flex", alignItems: "center", gap: 12, boxShadow: `0 12px 40px rgba(0,0,0,0.5), 0 0 20px ${accent}22`,
        position: "relative", overflow: "hidden"
      }}>
        <div style={{
          width: 24, height: 24, borderRadius: "50%", background: accent,
          display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 10px ${accent}44`
        }}>
          <Ico n={isErr ? "info" : "check"} sz={14} c="#fff" />
        </div>
        
        <div style={{flex: 1}}>
          <span style={{color: "#fff", fontSize: 13, fontWeight: 700, letterSpacing: "-0.01em"}}>{toast.msg}</span>
        </div>

        {/* Progress timer bar */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, height: 3, background: accent,
          width: visible ? "100%" : "0%", transition: "width 2.8s linear"
        }} />
      </div>
    </div>
  );
};
