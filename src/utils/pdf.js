import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { todayISO } from "./format.js";

export const exportTransactionsPDF = (filteredTx, categories, accounts, notify) => {
    const doc = new jsPDF();
    const accent = [0, 229, 255]; // Primary neon
    
    // Header
    doc.setFillColor(15, 23, 42); // Dark surface
    doc.rect(0, 0, 210, 40, "F");
    
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text("EXPENSE TRACKER", 15, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(accent[0], accent[1], accent[2]);
    doc.text(`TRANSACTION LEDGER — ${filteredTx.length} RECORDS`, 15, 28);
    
    doc.setTextColor(150, 150, 150);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 195, 20, { align: "right" });

    // Summary Boxes
    const inc = filteredTx.filter(t=>t.txType==="Income").reduce((s,t)=>s+t.amount,0);
    const exp = filteredTx.filter(t=>t.txType==="Expense").reduce((s,t)=>s+t.amount,0);
    const net = inc - exp;

    doc.setFillColor(248, 250, 252);
    doc.roundedRect(15, 45, 58, 22, 3, 3, "F");
    doc.roundedRect(76, 45, 58, 22, 3, 3, "F");
    doc.roundedRect(137, 45, 58, 22, 3, 3, "F");
    
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text("TOTAL INCOME", 20, 51);
    doc.text("TOTAL EXPENSE", 81, 51);
    doc.text("NET FLOW", 142, 51);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 180, 100); // Income
    doc.text(`Rs. ${inc.toLocaleString()}`, 20, 60);
    doc.setTextColor(220, 50, 50); // Expense
    doc.text(`Rs. ${exp.toLocaleString()}`, 81, 60);
    doc.setTextColor(net >= 0 ? 0 : 220, net >= 0 ? 180 : 50, net >= 0 ? 100 : 50);
    doc.text(`Rs. ${net.toLocaleString()}`, 142, 60);

    // Transactions Table
    const txRows = filteredTx.map(t => [
      t.date, 
      (t.description || "").substring(0, 40), 
      categories.find(c=>c.id===t.category)?.name || "Other",
      t.creditDebit, 
      `Rs. ${t.amount.toLocaleString()}`
    ]);

    autoTable(doc, {
      startY: 75,
      head: [["Date", "Description", "Category", "Type", "Amount"]],
      body: txRows,
      theme: "grid",
      headStyles: { fillColor: [15, 23, 42], textColor: 255 },
      columnStyles: {
        4: { halign: "right", fontStyle: "bold" }
      },
      margin: { left: 15, right: 15 },
      styles: { fontSize: 9 }
    });
    
    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
       doc.setPage(i);
       doc.setFontSize(8);
       doc.setTextColor(150);
       doc.text(`Page ${i} of ${pageCount} — Verified Report`, 105, 290, { align: "center" });
    }
    
    doc.save(`Ledger_${todayISO()}.pdf`);
    if(notify) notify(`✓ PDF Exported: ${filteredTx.length} records`);
};
