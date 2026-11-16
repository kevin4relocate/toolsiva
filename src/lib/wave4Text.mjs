function t4Input(input){const s=String(input??"").replace(/\r\n?/g,"\n");if(!s.trim())throw Error("Enter or paste text first.");if(s.length>250000)throw Error("Maximum input is 250,000 characters.");return s;}

function t4Split(input){const s=t4Input(input),idx=s.indexOf("\n---\n");return idx<0?{a:"",b:s}:{a:s.slice(0,idx).trim(),b:s.slice(idx+5)};}

function t4Lines(s){return String(s).split("\n").filter(x=>x.length>0);}

function t4Tokens(s){return String(s).match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu)||[];}

function t4Sentences(s){return (String(s).match(/[^.!?]+[.!?]+|[^.!?]+$/g)||[]).map(x=>x.trim()).filter(Boolean);}

export function t4A(slug,input){const s=t4Input(input),{a,b}=t4Split(s);switch(slug){
case "line-intersection-finder":{if(!a)throw Error("Enter first line list, ---, then second list.");const set=new Set(t4Lines(b));return [...new Set(t4Lines(a))].filter(x=>set.has(x)).join("\n")||"No shared lines found.";}
case "line-difference-finder":{if(!a)throw Error("Enter first list, ---, then second list.");const set=new Set(t4Lines(b));return [...new Set(t4Lines(a))].filter(x=>!set.has(x)).join("\n")||"No unique left-side lines found.";}
case "line-frequency-counter":{const m=new Map();for(const line of t4Lines(s))m.set(line,(m.get(line)||0)+1);return [...m].sort((x,y)=>y[1]-x[1]||x[0].localeCompare(y[0])).map(x=>JSON.stringify(x[0])+" : "+x[1]).join("\n");}
case "line-shuffler":{const lines=s.split("\n");if(lines.length>10000)throw Error("Maximum 10,000 lines.");const output=lines.slice();for(let i=output.length-1;i>0;i--){const v=new Uint32Array(1);crypto.getRandomValues(v);const j=v[0]%(i+1);[output[i],output[j]]=[output[j],output[i]];}return output.join("\n");}
case "line-chunker":{const size=Number(a);if(!Number.isInteger(size)||size<1||size>10000)throw Error("Enter chunk size 1–10000, then ---, then lines.");const lines=b.split("\n");if(lines.length>10000)throw Error("Maximum 10,000 lines.");const out=[];for(let i=0;i<lines.length;i+=size)out.push("Chunk "+(Math.floor(i/size)+1)+":\n"+lines.slice(i,i+size).join("\n"));return out.join("\n\n");}
case "delimited-text-column-extractor":{const [num,delimiter=","]=a.split("|"),idx=Number(num)-1;if(!Number.isInteger(idx)||idx<0||idx>9999||!delimiter)throw Error("Use 1-based-column|delimiter then --- and rows.");return b.split("\n").map((line,i)=>{const parts=line.split(delimiter);if(idx>=parts.length)throw Error("Missing column at line "+(i+1));return parts[idx]}).join("\n");}
case "keyword-context-snippet-extractor":{const [keyword,radiusStr="30"]=a.split("|"),radius=Number(radiusStr);if(!keyword||!Number.isInteger(radius)||radius<5||radius>500)throw Error("Use keyword|contextLength(5–500), then ---, then text.");const out=[],src=b.toLocaleLowerCase(),key=keyword.toLocaleLowerCase();let at=0;while(out.length<100){const i=src.indexOf(key,at);if(i<0)break;out.push("…"+b.slice(Math.max(0,i-radius),Math.min(b.length,i+keyword.length+radius))+"…");at=i+keyword.length;}return out.join("\n")||"Keyword not found.";}
case "word-position-finder":{if(!a)throw Error("Enter target word, ---, then text.");const needle=a.toLocaleLowerCase(),wordList=t4Tokens(b),matches=[];for(let i=0;i<wordList.length;i++)if(wordList[i].toLocaleLowerCase()===needle)matches.push(i+1);return matches.length+" matches in "+wordList.length+" words\nPositions: "+(matches.join(", ")||"(none)");}
case "sentence-length-statistics":{const sentences=t4Sentences(s),counts=sentences.map(x=>t4Tokens(x).length);if(!counts.length)throw Error("No sentence content.");const n=counts.length,total=counts.reduce((x,y)=>x+y,0);return "Sentences: "+n+"\nWords: "+total+"\nShortest: "+Math.min(...counts)+" words\nLongest: "+Math.max(...counts)+" words\nAverage: "+(total/n).toFixed(2)+" words";}
default:return null;}}

export function t4B(slug,input){const s=t4Input(input),{a,b}=t4Split(s);switch(slug){
case "surround-words-formatter":{const [prefix="",suffix=""]=a.split("|");if(!a)throw Error("Enter prefix|suffix, ---, then text.");return b.trim().split(/\s+/).filter(Boolean).map(x=>prefix+x+suffix).join(" ");}
case "reverse-sentence-order-tool":return t4Sentences(s).reverse().join(" ");
case "paragraph-alphabetical-sorter":return s.trim().split(/\n\s*\n/).map(x=>x.trim()).filter(Boolean).sort((x,y)=>x.localeCompare(y,undefined,{sensitivity:"base"})).join("\n\n");
case "duplicate-paragraph-remover":{const seen=new Set(),out=[];for(const part of s.trim().split(/\n\s*\n/)){const key=part.trim().toLocaleLowerCase().replace(/\s+/g," ");if(key&&!seen.has(key)){seen.add(key);out.push(part.trim())}}return out.join("\n\n");}
case "sentence-numberer":return t4Sentences(s).map((x,i)=>(i+1)+". "+x).join("\n");
case "question-sentence-extractor":return t4Sentences(s).filter(x=>x.endsWith("?")).join("\n")||"No question-mark sentences found.";
case "exclamation-sentence-extractor":return t4Sentences(s).filter(x=>x.endsWith("!")).join("\n")||"No exclamation-mark sentences found.";
case "bracket-content-extractor":{const values=[...s.matchAll(/\(([^()]*)\)|\[([^[\]]*)\]|\{([^{}]*)\}/g)].map(m=>m[1]??m[2]??m[3]);return values.join("\n")||"No simple bracketed content found.";}
default:return null;}}
