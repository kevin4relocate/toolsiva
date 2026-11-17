// Strict, side-effect-free helpers for Wave 11.
export function w11Parse(input,count,label){
 const s=String(input??"").trim();
 if(!s||s.length>4000)throw Error("Enter numerical values, up to 4,000 characters.");
 const p=s.split("|").map(x=>x.trim());
 if(p.length!==count||p.some(x=>x===""||!Number.isFinite(Number(x))))throw Error(label+": enter exactly "+count+" finite numbers separated by |.");
 return p.map(Number);
}
export function w11Format(x){
 if(!Number.isFinite(x))throw Error("Nonfinite calculation. Check inputs and magnitudes.");
 if(x===0)return "0";
 const abs=Math.abs(x);
 if(abs<1e-5||abs>=1e12)return x.toExponential(8);
 return Number(x.toPrecision(12)).toLocaleString("en-US",{maximumFractionDigits:10});
}
export function w11Result(label,x,unit){return label+": "+w11Format(x)+(unit?" "+unit:"");}
