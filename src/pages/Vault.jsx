import React from "react";
import { Ico } from "../components/ui/Ico.jsx";
import { Btn } from "../components/ui/Btn.jsx";
import { fmtAmt } from "../utils/format.js";
import { getAccBal, getNetWorth } from "../utils/analytics.js";

export default function VaultPage({ accounts, transactions, onAddAcc, onDeleteAcc, theme }) {
  const C = theme;
  const netWorth = getNetWorth(accounts, transactions);

  return (
    <div className="page-enter" style={{padding:"16px 16px 100px 16px",display:"flex",flexDirection:"column",gap:20}}>
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <h2 style={{margin:0,fontSize:24,fontWeight:900,color:C.text,letterSpacing:"-0.02em"}}>Vault</h2>
          <p style={{margin:0,color:C.sub,fontSize:12,marginTop:2}}>{accounts.length} linked accounts</p>
        </div>
        <Btn theme={C} icon="plus" sm onClick={onAddAcc}>Add</Btn>
      </div>

      {/* Total Balance Summary */}
      {accounts.length > 0 && (
        <div style={{
          background:`linear-gradient(135deg, ${C.card}, ${C.surface})`, 
          borderWidth:1,borderStyle:"solid",borderColor:C.border,borderRadius:28,padding:24,
          backdropFilter:"blur(20px) saturate(150%)",boxShadow:`0 20px 40px ${C.primaryDim}`,
          position:"relative", overflow:"hidden"
        }}>
          <div style={{position:"absolute",top:-30,right:-30,width:100,height:100,background:C.primary,filter:"blur(50px)",opacity:0.2,borderRadius:"50%",animation:"pulse-neon 4s infinite"}}/>
          <div style={{color:C.sub,fontSize:11,fontWeight:800,textTransform:"uppercase",letterSpacing:".15em",marginBottom:8}}>Total Net Worth</div>
          <div style={{color:C.text,fontSize:32,fontWeight:900,fontFamily:"'JetBrains Mono',monospace", letterSpacing:"-0.05em"}}>
            <span style={{color:C.primary,marginRight:4}}>₹</span>{fmtAmt(netWorth)}
          </div>
        </div>
      )}

      {accounts.length===0 ? (
        <div style={{
          background:`linear-gradient(145deg, ${C.card}, ${C.surface})`,borderWidth:1,borderStyle:"solid",borderColor:C.border,
          borderRadius:28,padding:"60px 24px",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:20,
          boxShadow:`inset 0 0 40px ${C.primaryDim}`, position:"relative", overflow:"hidden"
        }}>
          <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:150,height:150,background:C.primary,filter:"blur(80px)",opacity:0.1,borderRadius:"50%",animation:"pulse-neon 3s infinite"}}/>
          <div style={{width:80,height:80,borderRadius:24,background:C.primary+"1a",display:"flex",alignItems:"center",justifyContent:"center",fontSize:40, border:`1px solid ${C.primary}33`, zIndex:1, backdropFilter:"blur(10px)"}}>🏦</div>
          <div style={{zIndex:1}}>
            <div style={{color:C.text,fontSize:20,fontWeight:900,marginBottom:8, letterSpacing:"-0.02em"}}>No Accounts Yet</div>
            <div style={{color:C.sub,fontSize:14,lineHeight:1.6,maxWidth:280, margin:"0 auto"}}>Add your bank accounts, wallets, and cards to track balances across all your finances.</div>
          </div>
          <div style={{zIndex:1, marginTop:8}}>
             <Btn theme={C} icon="plus" onClick={onAddAcc}>Add First Account</Btn>
          </div>
        </div>
      ) : (
        <div style={{display:"flex", flexDirection:"column", gap:14}}>
          {accounts.map((acc, i) => {
            const bal = getAccBal(accounts, transactions, acc.id);
            const txnsCount = transactions.filter(t => t.accountId === acc.id).length;
            return (
              <div key={acc.id} style={{
                background:C.card, border:`1px solid ${C.border}`, borderRadius:24, padding:20,
                display:"flex", flexDirection:"column", gap:14, transition:"all .4s cubic-bezier(0.16, 1, 0.3, 1)",
                backdropFilter:"blur(12px)", position:"relative", overflow:"hidden", boxShadow: C.cardGlow || "none",
                animation: `fadeInUp 0.4s ease forwards`, animationDelay: `${i * 0.05}s`, opacity:0, transform:"translateY(10px)"
              }} onMouseEnter={e=>{e.currentTarget.style.borderColor=C.primary;e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow=`0 15px 30px ${C.primaryDim}`;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow=C.cardGlow||"none";}}>
                <div style={{position:"absolute", top:-20, right:-20, width:80, height:80, background:C.primary, filter:"blur(40px)", opacity:0.1, transition:"opacity .3s"}} className="glow-target"/>
                
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start"}}>
                   <div style={{display:"flex", alignItems:"center", gap:12}}>
                     <div style={{width:44, height:44, borderRadius:14, background:`linear-gradient(135deg, ${C.primaryDim}, ${C.primary}11)`, display:"flex", alignItems:"center", justifyContent:"center", border:`1px solid ${C.primary}33`}}>
                       <Ico n={acc.type==="Credit Card"?"list":acc.type==="Wallet"?"archive":"bank"} sz={20} c={C.primary}/>
                     </div>
                     <div>
                       <div style={{color:C.text, fontSize:16, fontWeight:800, letterSpacing:"-0.01em"}}>{acc.name}</div>
                       <div style={{color:C.sub, fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:".05em", marginTop:2}}>{acc.type}</div>
                     </div>
                   </div>
                   <button onClick={()=>onDeleteAcc(acc.id)} style={{background:C.expense+"1a", border:`1px solid ${C.expense}33`, color:C.expense, cursor:"pointer", opacity:0.6, width:32, height:32, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", transition:"all .2s"}} onMouseEnter={e=>{e.currentTarget.style.opacity=1; e.currentTarget.style.background=C.expense; e.currentTarget.style.color="#fff";}} onMouseLeave={e=>{e.currentTarget.style.opacity=0.6; e.currentTarget.style.background=C.expense+"1a"; e.currentTarget.style.color=C.expense;}}><Ico n="trash" sz={14}/></button>
                </div>

                <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginTop:4, borderTop:`1px dashed ${C.border}`, paddingTop:16}}>
                   <div style={{color:C.sub, fontSize:11, fontWeight:700, display:"flex", alignItems:"center", gap:6}}><Ico n="swap" sz={12}/> {txnsCount} entries</div>
                   <div style={{textAlign:"right"}}>
                     <div style={{color:C.sub, fontSize:10, fontWeight:800, textTransform:"uppercase", letterSpacing:".1em", marginBottom:4}}>Balance</div>
                     <div style={{color:bal>=0?C.text:C.expense, fontSize:24, fontWeight:900, fontFamily:"'JetBrains Mono',monospace", letterSpacing:"-0.03em"}}>{fmtAmt(bal)}</div>
                   </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
