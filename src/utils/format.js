export const fmtAmt = n => new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",minimumFractionDigits:0}).format(Math.abs(n||0));

export const fmtDate = d => { try { return new Date(d).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"2-digit"}); } catch { return d||""; }};

export const todayISO = () => new Date().toISOString().split("T")[0];
