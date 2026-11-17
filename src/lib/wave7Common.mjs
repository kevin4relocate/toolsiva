export function w7Input(input,max=150000){const s=String(input??"").replace(/\r\n?/g,"\n");if(!s.trim())throw Error("Enter or paste input values.");if(s.length>max)throw Error("Input too large (maximum "+max+" characters).");return s;}

export function w7Pair(input){const s=w7Input(input),at=s.indexOf("\n---\n");if(at<0)throw Error("Separate the two inputs with a line containing ---");return [s.slice(0,at).trim(),s.slice(at+5).trim()];}

export function w7Num(v,name="number"){if(v==null||String(v).trim()===""||!Number.isFinite(Number(v)))throw Error("Invalid "+name+": enter a finite number.");return Number(v);}

export function w7Numbers(s,sep="|"){return String(s??"").trim().split(sep).map((v,i)=>w7Num(v,"number "+(i+1)));}

export function w7CsvParse(raw){const s=w7Input(raw,250000);let rows=[],row=[],value="",quoted=false,justClosed=false;for(let i=0;i<s.length;i++){const c=s[i];if(quoted){if(c==='"'&&s[i+1]==='"'){value+='"';i++;}else if(c==='"'){quoted=false;justClosed=true;}else value+=c;}else if(c==='"'){if(value!==""||justClosed)throw Error("Unexpected CSV quote at character "+(i+1));quoted=true;}else if(c===","||c==="\n"){row.push(value);value="";justClosed=false;if(c==="\n"){rows.push(row);row=[];}}else{if(justClosed&&c!==" ")throw Error("Unexpected character following CSV quote.");value+=c;}}if(quoted)throw Error("Unclosed CSV quoted cell.");if(row.length||value!==""||justClosed){row.push(value);rows.push(row);}if(!rows.length||!rows[0].length||rows.length>10000||rows[0].length>150||rows.some(r=>r.length!==rows[0].length))throw Error("CSV must be rectangular, with at most 10,000 rows and 150 columns.");if(rows[0].some(x=>!x.trim())||new Set(rows[0]).size!==rows[0].length)throw Error("CSV headers must be nonempty and unique.");return rows;}

export function w7CsvWrite(rows){return rows.map(row=>row.map(x=>{const s=String(x??"");return /[",\n\r]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;}).join(",")).join("\n");}

export function w7CsvColumn(rows,name){const i=rows[0].indexOf(String(name??"").trim());if(i<0)throw Error("CSV column not found: "+name);return i;}

export function w7Date(s){const m=String(s??"").trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);if(!m)throw Error("Enter a YYYY-MM-DD date.");const d=new Date(0);d.setUTCHours(0,0,0,0);d.setUTCFullYear(+m[1],+m[2]-1,+m[3]);if(d.getUTCFullYear()!==+m[1]||d.getUTCMonth()!==+m[2]-1||d.getUTCDate()!==+m[3])throw Error("Invalid calendar date "+s);return d;}

export function w7DateFmt(d){return String(d.getUTCFullYear()).padStart(4,"0")+"-"+String(d.getUTCMonth()+1).padStart(2,"0")+"-"+String(d.getUTCDate()).padStart(2,"0");}

export function w7Mean(v){if(!v.length)throw Error("At least one data point required.");return v.reduce((a,b)=>a+b,0)/v.length;}

export function w7Quantile(values,p){if(!values.length||p<0||p>1)throw Error("Quantile requires nonempty data and probability 0–1.");const s=[...values].sort((a,b)=>a-b),x=(s.length-1)*p,lo=Math.floor(x),hi=Math.ceil(x);return lo===hi?s[lo]:s[lo]*(hi-x)+s[hi]*(x-lo);}

export function w7Rank(v){const pairs=v.map((x,i)=>({x,i})).sort((a,b)=>a.x-b.x),out=Array(v.length).fill(0);for(let i=0;i<pairs.length;){let j=i+1;while(j<pairs.length&&pairs[i].x===pairs[j].x)j++;const rank=(i+j+1)/2;for(let k=i;k<j;k++)out[pairs[k].i]=rank;i=j;}return out;}

export function w7Fmt(v){if(!Number.isFinite(v))throw Error("Calculation resulted in a non-finite number.");return Number(v.toPrecision(12)).toString();}
