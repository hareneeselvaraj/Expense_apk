import { todayISO } from "../utils/format.js";

export const RULES = {
  SWIGGY:"Food & Dining",ZOMATO:"Food & Dining",BLINKIT:"Groceries",BIGBASKET:"Groceries",
  DOMINOS:"Food & Dining",MCDONALDS:"Food & Dining",KFC:"Food & Dining",
  AMAZON:"Shopping",FLIPKART:"Shopping",MYNTRA:"Shopping",MEESHO:"Shopping",AJIO:"Shopping",
  NETFLIX:"Entertainment",SPOTIFY:"Entertainment",HOTSTAR:"Entertainment",PRIME:"Entertainment",
  BOOKMYSHOW:"Entertainment",
  SALARY:"Salary",PAYROLL:"Salary",WAGES:"Salary",
  INTEREST:"Interest",DIVIDEND:"Interest",
  UBER:"Transport",OLA:"Transport",RAPIDO:"Transport",PETROL:"Transport",FUEL:"Transport",IRCTC:"Transport",
  ELECTRICITY:"Utilities",BROADBAND:"Utilities",JIO:"Utilities",AIRTEL:"Utilities",BSNL:"Utilities",
  HOSPITAL:"Healthcare",PHARMACY:"Healthcare",MEDICAL:"Healthcare",APOLLO:"Healthcare",
  SCHOOL:"Education",COLLEGE:"Education",UDEMY:"Education",COURSERA:"Education",
  ATM:"Cash",
  MUTUAL:"Investment",SIP:"Investment",ZERODHA:"Investment",GROWW:"Investment",
};

export const DEF_CATS = [
  {id:"c1",name:"Food & Dining",type:"Expense",color:"#ef4444",emoji:"🍔"},
  {id:"c2",name:"Groceries",type:"Expense",color:"#f97316",emoji:"🛒"},
  {id:"c3",name:"Shopping",type:"Expense",color:"#f59e0b",emoji:"🛍️"},
  {id:"c4",name:"Transport",type:"Expense",color:"#eab308",emoji:"🚗"},
  {id:"c5",name:"Entertainment",type:"Expense",color:"#a855f7",emoji:"🎬"},
  {id:"c6",name:"Healthcare",type:"Expense",color:"#ec4899",emoji:"🏥"},
  {id:"c7",name:"Utilities",type:"Expense",color:"#06b6d4",emoji:"⚡"},
  {id:"c8",name:"Education",type:"Expense",color:"#3b82f6",emoji:"🎓"},
  {id:"c9",name:"Salary",type:"Income",color:"#10b981",emoji:"💰"},
  {id:"c10",name:"Interest",type:"Income",color:"#34d399",emoji:"📈"},
  {id:"c14",name:"Refund",type:"Income",color:"#06b6d4",emoji:"💸"},
  {id:"c11",name:"Investment",type:"Investment",color:"#6366f1",emoji:"💎"},
  {id:"c12",name:"Cash",type:"Expense",color:"#64748b",emoji:"💵"},
  {id:"c13",name:"Others",type:"Expense",color:"#94a3b8",emoji:"📦"},
];

export const DEF_TAGS = [
  {id:"t1",name:"Vacation",color:"#f97316"},
  {id:"t2",name:"Birthday",color:"#ec4899"},
  {id:"t3",name:"Work",color:"#3b82f6"},
];

export const BLANK_TX = { description:"", amount:"", date:todayISO(), creditDebit:"Debit", txType:"Expense", category:"c13", tags:[], accountId:"", notes:"" };
