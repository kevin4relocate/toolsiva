function partitionInput(input){const s=String(input??"");const split=s.indexOf("\n---\n");return split<0?{option:"",data:s}:{option:s.slice(0,split).trim(),data:s.slice(split+5)};}

function readJson(raw){if(raw.length>250000)throw Error("JSON input exceeds 250,000 characters.");try{return JSON.parse(raw)}catch(e){throw Error("Invalid JSON: "+e.message)}}

function pointerPart(name){return String(name).replace(/~/g,"~0").replace(/\//g,"~1");}

function fromPointer(name){if(/~(?![01])/.test(name))throw Error("Invalid JSON Pointer escape.");return name.replace(/~1/g,"/").replace(/~0/g,"~");}

function walkTree(value,visit,path="",depth=0){if(depth>80)throw Error("JSON nesting is too deep (max 80 levels).");visit(value,path,depth);if(value&&typeof value==="object"){for(const [key,next]of Object.entries(value))walkTree(next,visit,path+"/"+pointerPart(key),depth+1);}}

function pickField(item,path){if(!path)return item;return path.split(".").reduce((x,key)=>x!=null&&typeof x==="object"&&Object.hasOwn(x,key)?x[key]:undefined,item);}

function stableJson(v){if(Array.isArray(v))return "["+v.map(stableJson).join(",")+"]";if(v&&typeof v==="object")return "{"+Object.keys(v).sort().map(k=>JSON.stringify(k)+":"+stableJson(v[k])).join(",")+"}";return JSON.stringify(v);}

function parseCsvRows(s) {
 const rows=[];let row=[],cell="",quoted=false,started=false;
 for(let i=0;i<s.length;i++){
  const c=s[i];
  if(c==='"'){if(quoted&&s[i+1]==='"'){cell+='"';i++;}else if(!quoted&&!cell){quoted=true;}else if(quoted){quoted=false;}else throw Error("Unexpected quotation mark in CSV.");}
  else if(c===","&&!quoted){row.push(cell);cell="";started=true;}
  else if((c==="\n"||c==="\r")&&!quoted){if(c==="\r"&&s[i+1]==="\n")i++;if(row.length||cell||started){row.push(cell);rows.push(row);}row=[];cell="";started=false;}
  else{cell+=c;started=true;}
 }
 if(quoted)throw Error("CSV field has an unterminated quote.");
 if(row.length||cell||started){row.push(cell);rows.push(row);}
 if(!rows.length)throw Error("CSV input contains no rows.");
 if(rows.some(row=>row.length!==rows[0].length))throw Error("CSV rows have inconsistent field counts.");
 if(rows.length>20000)throw Error("Maximum 20,000 CSV rows.");
 return rows;
}

function statsOf(vals){const n=vals.length;if(!n)return null;const sorted=[...vals].sort((a,b)=>a-b),sum=vals.reduce((a,b)=>a+b,0);return {count:n,min:sorted[0],max:sorted[n-1],mean:sum/n,median:n%2?sorted[(n-1)/2]:(sorted[n/2-1]+sorted[n/2])/2};}

export function runExtraData(slug,input){
 const s=String(input??"").trim();if(!s)throw Error("Paste structured data first.");const {option,data}=partitionInput(s);
 switch(slug){
 case "json-key-extractor": {const j=readJson(s),keys=[];walkTree(j,(v,p)=>{if(p&&keys.length<1000)keys.push(p)});return keys.join("\n")||"No nested keys found.";}
 case "json-flatten": {const j=readJson(s),output=Object.create(null);const visit=(v,p,depth)=>{if(depth>80)throw Error("JSON nesting exceeds 80 levels.");if(v!==null&&typeof v==="object"&&Object.keys(v).length){for(const [key,val]of Object.entries(v))visit(val,p+"/"+pointerPart(key),depth+1);}else output[p]=v;};visit(j,"",0);return JSON.stringify(output,null,2);}
 case "json-unflatten": {
  const source=readJson(s);if(!source||typeof source!=="object"||Array.isArray(source))throw Error("Expected an object mapping JSON Pointer paths to values.");
  const entries=Object.entries(source);let root;
  for(const [ptr,value]of entries){
   if(ptr===""){if(entries.length!==1)throw Error("Root pointer cannot be combined with other paths.");root=value;continue;}
   if(!ptr.startsWith("/"))throw Error("Paths must begin with /.");
   const parts=ptr.slice(1).split("/").map(fromPointer);
   if(parts.length>80)throw Error("Too many JSON Pointer levels.");
   if(root===undefined)root=/^(0|[1-9]\d*)$/.test(parts[0])?[]:Object.create(null);
   let node=root;
   for(let i=0;i<parts.length;i++){const key=parts[i],last=i===parts.length-1,index=/^(0|[1-9]\d*)$/.test(key);
    if(Array.isArray(node)&&(!index||Number(key)>10000))throw Error("Invalid array index: "+key);
    if(node===null||typeof node!=="object")throw Error("Conflicting pointer: "+ptr);
    if(last){if(Object.hasOwn(node,key))throw Error("Duplicate or conflicting pointer: "+ptr);node[key]=value;}
    else {const wantArray=/^(0|[1-9]\d*)$/.test(parts[i+1]);if(!Object.hasOwn(node,key))node[key]=wantArray?[]:Object.create(null);else if(node[key]===null||typeof node[key]!=="object"||Array.isArray(node[key])!==wantArray)throw Error("Conflicting JSON Pointer: "+ptr);node=node[key];}
   }
  }
  if(root===undefined)throw Error("No JSON Pointer values supplied.");return JSON.stringify(root,null,2);
 }
 case "json-array-sorter": {
  const arr=readJson(data);if(!Array.isArray(arr))throw Error("Paste a JSON array.");const [field="",dir="asc"]=option.split("|").map(x=>x.trim());if(!["asc","desc"].includes(dir))throw Error("Direction must be asc or desc.");const sign=dir==="desc"?-1:1;
  return JSON.stringify(arr.map((value,index)=>({value,index})).sort((a,b)=>{const x=pickField(a.value,field),y=pickField(b.value,field);if(x===undefined)return y===undefined?a.index-b.index:1;if(y===undefined)return -1;const result=typeof x==="number"&&typeof y==="number"?x-y:String(x).localeCompare(String(y),undefined,{numeric:true});return sign*result||a.index-b.index;}).map(x=>x.value),null,2);
 }
 case "json-array-filter": {
  const arr=readJson(data);if(!Array.isArray(arr))throw Error("Paste a JSON array.");const i=option.indexOf("=");if(i<1)throw Error("Enter field=value before the --- separator.");const field=option.slice(0,i).trim(),needle=option.slice(i+1).trim();return JSON.stringify(arr.filter(v=>{const x=pickField(v,field);return x!==undefined&&(typeof x==="object"?JSON.stringify(x):String(x))===needle;}),null,2);
 }
 case "json-array-deduplicator": {const arr=readJson(s);if(!Array.isArray(arr))throw Error("Expected a JSON array.");const seen=new Set(),result=[];for(const v of arr){const key=stableJson(v);if(!seen.has(key)){seen.add(key);result.push(v)}}return JSON.stringify(result,null,2);}
 case "json-key-renamer": {
  const j=readJson(data),[from="",to=""]=option.split("|");if(!from||!to)throw Error("Enter oldKey|newKey then --- then JSON.");if(from===to)return JSON.stringify(j,null,2);
  const rename=(v,depth)=>{if(depth>80)throw Error("JSON nesting exceeds 80 levels.");if(Array.isArray(v))return v.map(x=>rename(x,depth+1));if(v&&typeof v==="object"){const out=Object.create(null);for(const [key,val]of Object.entries(v)){const k=key===from?to:key;if(Object.hasOwn(out,k))throw Error("Key collision while renaming to "+to);out[k]=rename(val,depth+1);}return out;}return v;};
  return JSON.stringify(rename(j,0),null,2);
 }
 case "json-value-searcher": {const j=readJson(data),query=option.toLocaleLowerCase(),found=[];if(!query)throw Error("Enter a search string before --- separator.");walkTree(j,(v,p)=>{if(found.length<100&&(v===null||typeof v!=="object")&&String(v).toLocaleLowerCase().includes(query))found.push((p||"/")+" = "+JSON.stringify(v));});return found.join("\n")||"No values found.";}
 case "json-structure-summary": {const j=readJson(s),counts={objects:0,arrays:0,keys:0,strings:0,numbers:0,booleans:0,nulls:0,deepest:0};walkTree(j,(v,p,d)=>{counts.deepest=Math.max(counts.deepest,d);if(v===null)counts.nulls++;else if(Array.isArray(v))counts.arrays++;else if(typeof v==="object"){counts.objects++;counts.keys+=Object.keys(v).length;}else if(typeof v==="string")counts.strings++;else if(typeof v==="number")counts.numbers++;else if(typeof v==="boolean")counts.booleans++;});return "Objects: "+counts.objects+"\nArrays: "+counts.arrays+"\nObject keys: "+counts.keys+"\nStrings: "+counts.strings+"\nNumbers: "+counts.numbers+"\nBooleans: "+counts.booleans+"\nNulls: "+counts.nulls+"\nMaximum depth: "+counts.deepest;}
 case "csv-column-statistics": {
  const rows=parseCsvRows(data),headers=rows[0],index=option?headers.indexOf(option):0;if(index<0)throw Error("Column not found: "+option);if(rows.length<2)throw Error("CSV needs header and data rows.");const cells=rows.slice(1).map(r=>r[index]),numbers=cells.filter(x=>x.trim()!=="").map(Number).filter(Number.isFinite),stats=statsOf(numbers),unique=new Set(cells).size,empty=cells.filter(x=>!x.trim()).length;
  return "Column: "+headers[index]+"\nRows: "+cells.length+"\nEmpty: "+empty+"\nDistinct values: "+unique+"\nNumeric cells: "+numbers.length+(stats?"\nMin: "+stats.min+"\nMax: "+stats.max+"\nMean: "+stats.mean.toFixed(3)+"\nMedian: "+stats.median:"\nNo numeric cells");
 }
 default:return null;
 }
}
