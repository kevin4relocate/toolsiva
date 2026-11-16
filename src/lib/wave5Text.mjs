function t5Input(input){const s=String(input??"").replace(/\r\n?/g,"\n");if(!s.trim())throw Error("Enter or paste text first.");if(s.length>250000)throw Error("Maximum input is 250,000 characters.");return s;}

function t5Split(input){const s=t5Input(input),i=s.indexOf("\n---\n");return i<0?{opt:"",body:s}:{opt:s.slice(0,i),body:s.slice(i+5)};}

function t5Words(s){return s.match(/[\p{L}\p{N}]+/gu)||[];}

export function t5TextA(slug,input){if(!["line-starts-with-filter","line-ends-with-filter","case-insensitive-line-deduplicator","indentation-depth-analyzer","insert-separator-between-lines","sort-lines-by-length","toggle-letter-case"].includes(slug))return null;const src=t5Input(input),{opt,body}=t5Split(src);switch(slug){
case "line-starts-with-filter":return body.split("\n").filter(x=>x.toLowerCase().startsWith(opt.trim().toLowerCase())).join("\n")||"No matching lines.";
case "line-ends-with-filter":return body.split("\n").filter(x=>x.toLowerCase().endsWith(opt.trim().toLowerCase())).join("\n")||"No matching lines.";
case "case-insensitive-line-deduplicator":{const set=new Set();return src.split("\n").filter(x=>{const k=x.toLocaleLowerCase();if(set.has(k))return false;set.add(k);return true;}).join("\n");}
case "indentation-depth-analyzer":return src.split("\n").map((line,i)=>{const prefix=line.match(/^[ \t]*/)?.[0]??"";const depth=[...prefix].reduce((n,c)=>n+(c==="\t"?4:1),0);return "Line "+(i+1)+": "+depth+" spaces";}).join("\n");
case "insert-separator-between-lines":return body.split("\n").join("\n"+opt+"\n");
case "sort-lines-by-length":return src.split("\n").sort((a,b)=>[...a].length-[...b].length).join("\n");
case "toggle-letter-case":return src.replace(/\p{L}/gu,ch=>ch===ch.toUpperCase()?ch.toLowerCase():ch.toUpperCase());
default:return null;}}

export function t5TextB(slug,input){if(!["acronym-builder","camel-case-to-words","snake-case-to-words","kebab-case-to-words","paragraph-numbering-tool"].includes(slug))return null;const s=t5Input(input),words=t5Words(s);switch(slug){
case "acronym-builder":return words.map(x=>[...x][0].toUpperCase()).join("");
case "camel-case-to-words":return s.replace(/([a-z0-9])([A-Z])/g,"$1 $2").replace(/([A-Z])([A-Z][a-z])/g,"$1 $2").replace(/\s+/g," ").trim();
case "snake-case-to-words":return s.replace(/_+/g," ").replace(/\s+/g," ").trim();
case "kebab-case-to-words":return s.replace(/-+/g," ").replace(/\s+/g," ").trim();
case "paragraph-numbering-tool":return s.split(/\n\s*\n/).filter(x=>x.trim()).map((x,i)=>(i+1)+". "+x.trim()).join("\n\n");
default:return null;}}
