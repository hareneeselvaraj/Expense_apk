import { RULES } from "../constants/defaults.js";

export const autoCategory = (desc, cats) => {
  const up=(desc||"").toUpperCase();
  for(const [k,v] of Object.entries(RULES)){ if(up.includes(k)){const c=cats.find(x=>x.name===v);if(c)return c.id;} }
  return cats.find(x=>x.name==="Others")?.id||"c13";
};
