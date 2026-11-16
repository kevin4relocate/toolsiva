function data(input) {return String(input??"").split(",").map(x=>x.trim());}

function numbers(input,min=1){const parts=data(input);const values=parts.map(x=>x===""?NaN:Number(x));if(values.length<min||values.some(x=>!Number.isFinite(x)))throw Error("Enter "+min+" or more valid numbers separated by commas.");return values;}

function nice(n,d=8){if(!Number.isFinite(n))throw Error("Result is not finite. Check the input.");return Number(n.toFixed(Math.min(12,d))).toLocaleString("en-US",{maximumFractionDigits:d});}

function udate(value){const str=String(value).trim();if(!/^\d{4}-\d{2}-\d{2}$/.test(str))throw Error("Use YYYY-MM-DD.");const [y,m,d]=str.split("-").map(Number);const dt=new Date(Date.UTC(y,m-1,d));if(dt.getUTCFullYear()!==y||dt.getUTCMonth()+1!==m||dt.getUTCDate()!==d)throw Error("Invalid calendar date.");return dt;}

function daystring(dt){return dt.toISOString().slice(0,10);}

function hm(s){const m=String(s).trim().match(/^(\d{1,4}):([0-5]\d)$/);if(!m)throw Error("Use HH:MM.");return Number(m[1])*60+Number(m[2]);}

function fmtMinutes(min){const sign=min<0?"-":"";const v=Math.round(Math.abs(min));return sign+String(Math.floor(v/60)).padStart(2,"0")+":"+String(v%60).padStart(2,"0");}

function positiveInteger(x){const n=Number(String(x).trim());if(!Number.isSafeInteger(n)||n<1)throw Error("Enter a positive whole number.");return n;}

export function calcSimple(slug,input){
 const s=String(input??"").trim();if(!s)throw Error("Enter a value or paste text.");const a=data(s),p=()=>numbers(s), v=()=>numbers(s,2), num=()=>{const n=Number(s);if(!Number.isFinite(n))throw Error("Enter a valid number.");return n;};
 switch(slug){
 case "reading-time-calculator":{const w=(s.match(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu)||[]).length;return `${w} words · ${nice(w/200,2)} minutes at 200 words/minute`;}
 case "median-calculator":{const x=p().sort((a,b)=>a-b);return nice(x.length%2?x[(x.length-1)/2]:(x[x.length/2-1]+x[x.length/2])/2);}
 case "mode-calculator":{const x=p(),f=new Map();for(const n of x)f.set(n,(f.get(n)||0)+1);const m=Math.max(...f.values());return m===1?"No repeated mode":([...f].filter(y=>y[1]===m).map(y=>y[0]).join(", ")+` (frequency ${m})`);}
 case "square-root-calculator":{const n=num();if(n<0)throw Error("Enter a nonnegative number.");return nice(Math.sqrt(n));}
 case "exponent-calculator":{const [base,exp]=v();return nice(base**exp);}
 case "rounding-calculator":{const [n,places=0]=p();if(!Number.isInteger(places)||places<0||places>12)throw Error("Decimal places must be 0–12.");return n.toFixed(places);}
 case "prime-number-checker":{const n=positiveInteger(s);if(n<2)return "Not prime";for(let i=2;i*i<=n;i++)if(n%i===0)return "Not prime (divisible by "+i+")";return "Prime";}
 case "leap-year-checker":{const n=positiveInteger(s);return n%4===0&&(n%100!==0||n%400===0)?"Leap year (366 days)":"Common year (365 days)";}
 case "day-of-year-calculator":{const d=udate(s);return String(Math.round((d-Date.UTC(d.getUTCFullYear(),0,1))/864e5)+1);}
 case "bytes-to-bits":return nice(num()*8)+" bits";
 case "weighted-average-calculator":{const pairs=s.split(",").map(x=>x.trim().split(":").map(Number));if(pairs.some(z=>z.length!==2||z.some(n=>!Number.isFinite(n))||z[1]<0))throw Error("Use value:weight pairs, e.g. 90:3, 75:2.");const weight=pairs.reduce((a,z)=>a+z[1],0);if(!weight)throw Error("Total weight must be positive.");return nice(pairs.reduce((a,z)=>a+z[0]*z[1],0)/weight);}
 case "scientific-notation-converter":return num().toExponential(6);
 case "number-sequence-generator":{const [start,step,count]=numbers(s,3);if(!Number.isSafeInteger(count)||count<1||count>500)throw Error("Count must be 1–500.");return Array.from({length:count},(_,i)=>nice(start+step*i)).join(", ");}
 case "random-number-generator":{const [min,max,count=1]=p();if(![min,max,count].every(Number.isSafeInteger)||max<min||count<1||count>100||max-min>1e9)throw Error("Use integer min,max,count (count 1–100).");if(typeof crypto==="undefined"||!crypto.getRandomValues)throw Error("Secure random values unavailable.");const range=max-min+1;const cap=Math.floor(0x100000000/range)*range;const out=[];while(out.length<count){const z=new Uint32Array(1);crypto.getRandomValues(z);if(z[0]<cap)out.push(min+z[0]%range);}return out.join(", ");}
 case "uuid-validator":return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s)?"Valid RFC 4122-style UUID":"Invalid UUID";
 case "pixels-to-rem-converter":{const [px,base=16]=p();if(base<=0)throw Error("Base font size must be positive.");return nice(px/base)+" rem";}
 case "hours-to-decimal-converter":return nice(hm(s)/60,4)+" hours";
 case "decimal-to-hours-converter":return fmtMinutes(num()*60);
 case "standard-deviation-calculator":{const x=p(),mean=x.reduce((a,b)=>a+b,0)/x.length,ss=x.reduce((a,n)=>a+(n-mean)**2,0);return `Population: ${nice(Math.sqrt(ss/x.length))}\nSample: ${x.length>1?nice(Math.sqrt(ss/(x.length-1))):"N/A (requires 2+ values)"}`;}
 case "prime-factorization-calculator":{let n=positiveInteger(s);if(n>1e12)throw Error("Use values at most 1 trillion.");const out=[];for(let d=2;d*d<=n;d+=(d===2?1:2))while(n%d===0){out.push(d);n/=d}if(n>1)out.push(n);return out.join(" × ")||"1 has no prime factors";}
 case "sales-tax-calculator":{const [cost,rate]=v();if(cost<0||rate<0)throw Error("Use nonnegative values.");return `Tax: ${nice(cost*rate/100,2)}\nTotal: ${nice(cost*(1+rate/100),2)}`;}
 case "vat-calculator":{const [amount,rate]=v();if(amount<0||rate<0)throw Error("Use nonnegative values.");return `VAT inclusive: ${nice(amount*(1+rate/100),2)}\nVAT amount: ${nice(amount*rate/100,2)}\nVAT portion of an inclusive ${nice(amount,2)}: ${nice(amount*rate/(100+rate),2)}`;}
 case "roi-calculator":{const [final,initial]=v();if(initial<=0)throw Error("Initial investment must be positive.");return nice((final-initial)/initial*100,2)+"% ROI";}
 case "commission-calculator":{const [sales,rate]=v();return nice(sales*rate/100,2);}
 case "bill-split-calculator":{const [bill,people,tip=0]=p();if(!(people>0&&Number.isInteger(people))||bill<0||tip<0)throw Error("Enter nonnegative bill, positive integer people, tip percentage.");return `Per person: ${nice(bill*(1+tip/100)/people,2)}\nTotal: ${nice(bill*(1+tip/100),2)}`;}
 case "break-even-calculator":{const [fixed,price,variable]=numbers(s,3);if(fixed<0||price<=variable||variable<0)throw Error("Price must exceed variable cost, and costs must be nonnegative.");return `Break-even units: ${Math.ceil(fixed/(price-variable))}\nContribution/unit: ${nice(price-variable,2)}`;}
 case "hourly-to-salary-calculator":{const [rate,hours=40,weeks=52]=p();if(rate<0||hours<0||weeks<0)throw Error("Enter nonnegative values.");return nice(rate*hours*weeks,2)+" per year";}
 case "salary-to-hourly-calculator":{const [salary,hours=40,weeks=52]=p();if(!(hours>0&&weeks>0))throw Error("Hours and weeks must be positive.");return nice(salary/hours/weeks,2)+" per hour";}
 case "freelance-rate-calculator":{const [target,billable]=v();if(billable<=0)throw Error("Billable hours must be positive.");return nice(target/billable,2)+" per billable hour (before taxes/overhead)";}
 case "savings-goal-calculator":{const [goal,monthly,current=0]=p();if(monthly<=0||goal<0||current<0)throw Error("Enter positive savings/month and nonnegative goal/current.");return Math.max(0,Math.ceil((goal-current)/monthly))+" months (no interest assumed)";}
 case "inflation-calculator":{const [amount,rate,years]=numbers(s,3);if(years<0||rate<=-100)throw Error("Check rate and years.");return nice(amount*(1+rate/100)**years,2)+" future nominal amount";}
 case "add-days-to-date":case "subtract-days-from-date":{if(a.length<2)throw Error("Use YYYY-MM-DD, days.");const date=udate(a[0]),d=Number(a[1]);if(!Number.isSafeInteger(d)||Math.abs(d)>365000)throw Error("Days must be a whole number within range.");date.setUTCDate(date.getUTCDate()+(slug.startsWith("subtract")?-d:d));return daystring(date);}
 case "week-number-calculator":{const d=udate(s);d.setUTCHours(0,0,0,0);d.setUTCDate(d.getUTCDate()+4-(d.getUTCDay()||7));const y=d.getUTCFullYear();const start=new Date(Date.UTC(y,0,1));return `ISO week ${Math.ceil((((d-start)/864e5)+1)/7)} of ${y}`;}
 case "countdown-calculator":{const target=udate(s).getTime();const diff=Math.ceil((target-Date.now())/864e5);return diff<0?`${-diff} days ago`:`${diff} days remaining (UTC dates)`;}
 case "time-addition-calculator":case "time-subtraction-calculator":{const bits=data(s);if(bits.length<2)throw Error("Use HH:MM, HH:MM.");const x=hm(bits[0]),y=hm(bits[1]);return fmtMinutes(slug.startsWith("time-add")?x+y:x-y);}
 case "iso-date-converter":return udate(s).toISOString();
 case "business-days-calculator":{const [start,end]=a;const d=udate(start),e=udate(end);const diff=Math.round((e-d)/864e5);if(Math.abs(diff)>36525)throw Error("Date range cannot exceed 100 years.");let count=0;const step=diff<0?-1:1;while((step>0&&d<e)||(step<0&&d>e)){d.setUTCDate(d.getUTCDate()+step);if(d.getUTCDay()!==0&&d.getUTCDay()!==6)count+=step;}return `${count} weekdays (holidays excluded)`;}
 case "timezone-offset-calculator":{const [local,from,to]=a;const [date,time]=String(local||"").split("T");const dateObj=udate(date);const minutes=hm(time);const f=Number(from),t=Number(to);if(![f,t].every(Number.isFinite)||Math.abs(f)>14||Math.abs(t)>14)throw Error("Use valid UTC offsets -12 through +14.");const newDate=new Date(dateObj.getTime()+minutes*60000+(t-f)*3600000);return newDate.toISOString().slice(0,16).replace("T"," ")+" at UTC"+(t>=0?"+":"")+t+" (fixed offsets; DST not applied)";}
 case "calendar-generator":{const m=s.match(/^(\d{4})-(\d{2})$/);if(!m)throw Error("Use YYYY-MM.");const y=+m[1],mo=+m[2];if(mo<1||mo>12)throw Error("Invalid month.");const first=new Date(Date.UTC(y,mo-1,1)).getUTCDay(),days=new Date(Date.UTC(y,mo,0)).getUTCDate();let out="Su Mo Tu We Th Fr Sa\n",row="   ".repeat(first);for(let d=1;d<=days;d++){row+=String(d).padStart(2," ")+" ";if((first+d)%7===0){out+=row.trimEnd()+"\n";row=""}}return (out+row).trimEnd();}
 case "work-hours-calculator":{const [start,end,breaks="0"]=a;let mins=hm(end)-hm(start);if(mins<0)mins+=1440;const b=Number(breaks);if(!Number.isFinite(b)||b<0||b>mins)throw Error("Break minutes must be within work duration.");return `${nice((mins-b)/60,2)} hours (${mins-b} minutes)`;}
 case "number-base-converter":{const [value,from,to]=a;const f=Number(from),t=Number(to);if(![f,t].every(Number.isInteger)||f<2||f>36||t<2||t>36)throw Error("Bases must be 2–36.");const chars="0123456789abcdefghijklmnopqrstuvwxyz";let n=0n;for(const ch of String(value||"").toLowerCase()){const d=chars.indexOf(ch);if(d<0||d>=f)throw Error("Digit outside source base.");n=n*BigInt(f)+BigInt(d)}return n.toString(t);}
 case "binary-to-decimal":if(!/^[01]+$/.test(s))throw Error("Enter binary digits.");return BigInt("0b"+s).toString(10);
 case "hex-to-decimal":if(!/^[0-9a-f]+$/i.test(s))throw Error("Enter hexadecimal digits.");return BigInt("0x"+s).toString(10);
 case "roman-numeral-converter":{const table=[["M",1000],["CM",900],["D",500],["CD",400],["C",100],["XC",90],["L",50],["XL",40],["X",10],["IX",9],["V",5],["IV",4],["I",1]];if(/^\d+$/.test(s)){let n=positiveInteger(s);if(n>3999)throw Error("Roman numerals limited to 1–3999.");let out="";for(const [r,v]of table)while(n>=v){out+=r;n-=v}return out}const roman=s.toUpperCase();if(!/^[MDCLXVI]+$/.test(roman))throw Error("Invalid Roman numeral.");let value=0,i=0;for(const [r,v]of table)while(roman.startsWith(r,i)){value+=v;i+=r.length}if(i!==roman.length||calcSimple("roman-numeral-converter",String(value))!==roman)throw Error("Roman numeral uses invalid sequence.");return String(value);}
 default:return null;
 }
}
