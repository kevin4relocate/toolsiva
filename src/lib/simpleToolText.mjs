function safeXml(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;");}

function safeHtml(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");}

function parseRows(s,delimiter=","){const rows=[],row=[];let val="",quoted=false;for(let i=0;i<s.length;i++){const c=s[i];if(c==='"'){if(quoted&&s[i+1]==='"'){val+='"';i++}else quoted=!quoted}else if(!quoted&&c===delimiter){row.push(val);val=""}else if(!quoted&&(c==="\n"||c==="\r")){if(c==="\r"&&s[i+1]==="\n")i++;row.push(val);val="";rows.push(row.splice(0))}else val+=c;}if(quoted)throw Error("Unterminated quoted CSV field.");if(val||row.length){row.push(val);rows.push(row)}const width=rows[0]?.length||0;if(rows.some(r=>r.length!==width))throw Error("Rows have different column counts.");return rows;}

function toCsv(rows){return rows.map(row=>row.map(cell=>{const s=String(cell??"");return /[",\r\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s}).join(",")).join("\n");}

function csvData(s){const rows=parseRows(s);if(rows.length<1)throw Error("Enter CSV with at least a header.");return rows;}

function htmlTagFormat(s){let depth=0;return s.replace(/>\s*</g,"><").replace(/(<[^>]+>|[^<]+)/g,"$1\n").split("\n").map(x=>x.trim()).filter(Boolean).map(x=>{const close=/^<\//.test(x),single=/^<(?:!|\?|br\b|hr\b|img\b|input\b|meta\b|link\b)/i.test(x)||/\/>$/.test(x);if(close)depth=Math.max(0,depth-1);const out="  ".repeat(depth)+x;if(/^<[^/!][^>]*>$/.test(x)&&!single)depth++;return out}).join("\n");}

function jsCompact(source){let out="",state="",escape=false,pendingSpace=false;for(let i=0;i<source.length;i++){let c=source[i],n=source[i+1];if(state==="line"){if(c==="\n"){state="";pendingSpace=true;}continue}if(state==="block"){if(c==="*"&&n==="/"){i++;state="";pendingSpace=true;}continue}if(state){out+=c;if(escape){escape=false;continue}if(c==="\\"){escape=true;continue}if(c===state)state="";continue}if(c==='"'||c==="'"||c==="`"){if(pendingSpace&&/[\w$]$/.test(out))out+=" ";pendingSpace=false;out+=c;state=c;continue}if(c==="/"&&n==="/"){state="line";i++;continue}if(c==="/"&&n==="*"){state="block";i++;continue}if(/\s/.test(c)){pendingSpace=true;continue}if(pendingSpace&&(/[\w$]$/.test(out)&&/[\w$]/.test(c)||/[+\/-]$/.test(out)&&/[+\/-]/.test(c)))out+=" ";pendingSpace=false;out+=c;}if(state&&state!=="line")throw Error("Unterminated comment or string.");return out;}

function prettyJs(src){let compact=jsCompact(src),out="",depth=0,quote="",esc=false;for(let i=0;i<compact.length;i++){const c=compact[i];if(quote){out+=c;if(esc)esc=false;else if(c==="\\")esc=true;else if(c===quote)quote="";continue}if("`'\"".includes(c)){quote=c;out+=c;continue}if(c==="{"){out+=" {\n";depth++;out+="  ".repeat(depth)}else if(c==="}"){depth=Math.max(0,depth-1);out=out.trimEnd()+"\n"+"  ".repeat(depth)+"}"}else if(c===";"){out+=";\n"+"  ".repeat(depth)}else out+=c;}return out.trim();}

function md5Pure(text){
 const bytes=new TextEncoder().encode(text),length=bytes.length*8;const n=(((bytes.length+8)>>6)+1)*64;const b=new Uint8Array(n);b.set(bytes);b[bytes.length]=128;const dv=new DataView(b.buffer);dv.setUint32(n-8,length>>>0,true);dv.setUint32(n-4,Math.floor(length/2**32),true);
 let a=0x67452301,bb=0xefcdab89,c=0x98badcfe,d=0x10325476;const K=Array.from({length:64},(_,i)=>Math.floor(Math.abs(Math.sin(i+1))*2**32)>>>0),S=[7,12,17,22,5,9,14,20,4,11,16,23,6,10,15,21];
 for(let off=0;off<n;off+=64){const m=Array.from({length:16},(_,i)=>dv.getUint32(off+i*4,true));let A=a,B=bb,C=c,D=d;for(let i=0;i<64;i++){let f,g,shift;if(i<16){f=(B&C)|(~B&D);g=i;shift=S[i%4]}else if(i<32){f=(D&B)|(~D&C);g=(5*i+1)%16;shift=S[4+i%4]}else if(i<48){f=B^C^D;g=(3*i+5)%16;shift=S[8+i%4]}else{f=C^(B|~D);g=(7*i)%16;shift=S[12+i%4]}const t=(A+f+K[i]+m[g])>>>0;A=D;D=C;C=B;B=(B+((t<<shift)|(t>>>(32-shift))))>>>0;}a=(a+A)>>>0;bb=(bb+B)>>>0;c=(c+C)>>>0;d=(d+D)>>>0;}
 return [a,bb,c,d].map(x=>[0,8,16,24].map(shift=>((x>>>shift)&255).toString(16).padStart(2,"0")).join("")).join("");
}

function xmlToObject(node){const obj={};if(node.attributes?.length)for(const a of node.attributes)obj["@"+a.name]=a.value;const elements=Array.from(node.children||[]);if(!elements.length){const t=node.textContent?.trim()||"";if(Object.keys(obj).length)obj["#text"]=t;else return t;}for(const child of elements){const value=xmlToObject(child);if(obj[child.nodeName]!==undefined){if(!Array.isArray(obj[child.nodeName]))obj[child.nodeName]=[obj[child.nodeName]];obj[child.nodeName].push(value)}else obj[child.nodeName]=value;}return obj;}

function parsePairs(s,delimiter="|"){return s.split(delimiter).map(x=>x.trim());}

function ensureUrl(s){const u=new URL(s);if(!["https:","http:"].includes(u.protocol))throw Error("Use http:// or https://.");return u;}

export function processTextTool(slug,input){
 const s=String(input??"").trim();if(!s)throw Error("Paste or type text first.");
 const parts=parsePairs(s),first=parts[0]||"",second=parts[1]||"",third=parts[2]||"";
 const escape=(x)=>safeHtml(x);
 const url=()=>ensureUrl(s);
 switch(slug){
 case "rot13-encoder":return s.replace(/[a-z]/gi,c=>String.fromCharCode((c<="Z"?65:97)+(c.toLowerCase().charCodeAt(0)-97+13)%26));
 case "caesar-cipher-tool":{const m=s.match(/^([\s\S]*)\|(-?\d+)$/),message=m?m[1]:s,shift=m?Number(m[2]):3;return message.replace(/[a-z]/gi,c=>String.fromCharCode((c<="Z"?65:97)+(c.toLowerCase().charCodeAt(0)-97+(shift%26)+26)%26));}
 case "unicode-escape-converter":return Array.from(s).map(c=>c.codePointAt(0)>127?"\\u{"+c.codePointAt(0).toString(16)+"}":c).join("");
 case "md5-checksum-generator":return md5Pure(s)+"\nMD5 is not collision resistant; do not use for security.";
 case "meta-title-length-checker":return `${s.length} characters · ${s.length>=30&&s.length<=60?"Common SEO length range (30–60)":"Review length (common guideline: 30–60 characters)"}\nGoogle may rewrite or truncate titles based on pixel width.`;
 case "meta-description-length-checker":return `${s.length} characters · ${s.length>=120&&s.length<=160?"Common SEO length range (120–160)":"Review length (common guideline: 120–160 characters)"}\nSearch snippets can vary.`;
 case "meta-tag-generator":return `<title>${escape(first)}</title>\n<meta name="description" content="${escape(second)}">\n${third?`<link rel="canonical" href="${escape(ensureUrl(third).href)}">`:""}`;
 case "open-graph-generator":return `<meta property="og:title" content="${escape(first)}">\n<meta property="og:description" content="${escape(second)}">\n${third?`<meta property="og:url" content="${escape(ensureUrl(third).href)}">`:""}\n<meta property="og:type" content="website">`;
 case "open-graph-preview":return `${first}\n${second}\n${third}\n(Approximate text preview. Real previews depend on the platform and image metadata.)`;
 case "twitter-card-generator":return `<meta name="twitter:card" content="summary">\n<meta name="twitter:title" content="${escape(first)}">\n<meta name="twitter:description" content="${escape(second)}">`;
 case "canonical-url-generator":{const u=url();u.hash="";for(const k of [...u.searchParams.keys()])if(/^utm_|^gclid$|^fbclid$/i.test(k))u.searchParams.delete(k);return u.toString();}
 case "hreflang-tag-generator":return s.split(/\r?\n/).filter(Boolean).map(line=>{const i=line.indexOf("=");if(i<1)throw Error("Use language=URL per line.");const lang=line.slice(0,i).trim(),link=line.slice(i+1).trim();if(!/^(?:[a-z]{2,3}(?:-[A-Za-z]{2,4})?|x-default)$/.test(lang))throw Error("Invalid language tag: "+lang);return `<link rel="alternate" hreflang="${escape(lang)}" href="${escape(ensureUrl(link).href)}">`}).join("\n");
 case "keyword-density-checker":{const key=first.toLowerCase(),body=parts.slice(1).join("|");if(!body||!key)throw Error("Use keyword|body text.");const terms=body.toLowerCase().match(/[\p{L}\p{N}]+/gu)||[];const target=key.match(/[\p{L}\p{N}]+/gu)||[];const t=target.join(" "),words=terms.join(" ");const count=t?words.split(t).length-1:0;return `${count} occurrences · ${terms.length} words · ${((count/Math.max(1,terms.length))*100).toFixed(2)}% phrase occurrence rate (approximate)`;}
 case "heading-structure-checker":{const matches=[...s.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)].map(m=>({level:+m[1],text:m[2].replace(/<[^>]+>/g,"").trim()}));if(!matches.length)return "No HTML heading tags found.";const warnings=[];if(matches.filter(x=>x.level===1).length!==1)warnings.push("Consider one main H1.");for(let i=1;i<matches.length;i++)if(matches[i].level>matches[i-1].level+1)warnings.push("Heading jump: H"+matches[i-1].level+" → H"+matches[i].level);return matches.map(x=>"  ".repeat(x.level-1)+"H"+x.level+": "+x.text).join("\n")+(warnings.length?"\nWarnings: "+warnings.join("; "):"");}
 case "robots-txt-generator":return "User-agent: *\nAllow: /\n"+(s.startsWith("http")?"\nSitemap: "+ensureUrl(s).href:"");
 case "robots-txt-tester":{const lines=s.split(/\r?\n/).map(x=>x.replace(/#.*/,"").trim()).filter(Boolean),rules=lines.filter(x=>/^(allow|disallow|user-agent|sitemap):/i.test(x));return `${rules.length} recognized directives\n`+rules.join("\n")+(rules.length!==lines.length?"\nSome unrecognized directives omitted.":"");}
 case "xml-sitemap-generator":{const links=s.split(/\s+/).filter(Boolean).map(link=>ensureUrl(link).href);if(links.length>200)throw Error("Maximum 200 URLs per input.");return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${links.map(link=>`  <url><loc>${safeXml(link)}</loc></url>`).join("\n")}\n</urlset>`;}
 case "xml-sitemap-validator":{if(typeof DOMParser==="undefined")throw Error("Requires a modern browser.");const doc=new DOMParser().parseFromString(s,"application/xml");if(doc.getElementsByTagName("parsererror").length)throw Error("Invalid XML syntax.");const links=[...doc.getElementsByTagName("loc")].map(n=>n.textContent?.trim()||"");for(const link of links)ensureUrl(link);return `Valid XML · ${links.length} URL locations found${doc.documentElement.localName==="urlset"?" · URL set":" · check root element"}`;}
 case "schema-faq-generator":{const main=s.split(/\r?\n/).map(x=>parsePairs(x)).filter(x=>x[0]&&x[1]).map(x=>({"@type":"Question",name:x[0],acceptedAnswer:{"@type":"Answer",text:x.slice(1).join("|")}}));if(!main.length)throw Error("Use question|answer per line.");return JSON.stringify({"@context":"https://schema.org","@type":"FAQPage",mainEntity:main},null,2);}
 case "schema-breadcrumb-generator":{const rows=s.split(/\r?\n/).map(x=>parsePairs(x)).filter(x=>x[0]&&x[1]);if(!rows.length)throw Error("Use name|URL per line.");return JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:rows.map((x,i)=>({"@type":"ListItem",position:i+1,name:x[0],item:ensureUrl(x[1]).href}))},null,2);}
 case "schema-article-generator":{if(!first||!second||!third)throw Error("Use Title|Author|URL.");return JSON.stringify({"@context":"https://schema.org","@type":"Article",headline:first,author:{"@type":"Person",name:second},mainEntityOfPage:ensureUrl(third).href},null,2);}
 case "redirect-rule-generator":return s.split(/\r?\n/).filter(Boolean).map(line=>{const v=line.trim().split(/\s+/);if(v.length!==3||!["301","302","307","308"].includes(v[2]))throw Error("Use /old /new 301 per line.");if(!v[0].startsWith("/")||!v[1].startsWith("/"))throw Error("Use local paths beginning with /.");return v.join(" ")}).join("\n");
 case "url-parser":{const u=url();return `Protocol: ${u.protocol}\nHost: ${u.hostname}\nPort: ${u.port||"(default)"}\nPath: ${u.pathname}\nQuery: ${u.search}\nHash: ${u.hash}\nParameters:\n`+[...u.searchParams.entries()].map(x=>`  ${x[0]} = ${x[1]}`).join("\n");}
 case "cron-expression-explainer":{const f=s.split(/\s+/);if(f.length!==5)throw Error("Enter a 5-field cron expression.");const labels=["Minute","Hour","Day of month","Month","Day of week"];for(let i=0;i<5;i++)if(!/^[\d*,\/\-]+$/.test(f[i]))throw Error("Unsupported cron token: "+f[i]);return f.map((x,i)=>labels[i]+": "+(x==="*"?"every":x)).join("\n")+"\nThis is a basic field explanation; it does not resolve all cron dialects.";}
 case "json-diff":{const bits=s.split(/\r?\n---\r?\n/);if(bits.length!==2)throw Error("Paste JSON A, line with ---, then JSON B.");const x=JSON.parse(bits[0]),y=JSON.parse(bits[1]),out=[];const visit=(a,b,path)=>{if(JSON.stringify(a)===JSON.stringify(b))return;if(a&&b&&typeof a==="object"&&typeof b==="object"&&!Array.isArray(a)&&!Array.isArray(b)){for(const k of new Set([...Object.keys(a),...Object.keys(b)]))visit(a[k],b[k],path+"."+k)}else out.push(`${path}: ${JSON.stringify(a)} → ${JSON.stringify(b)}`);};visit(x,y,"$");return out.join("\n")||"No differences.";}
 case "yaml-to-json":{if(typeof window==="undefined")throw Error("YAML parser available in browser build.");throw Error("YAML parser has not been loaded.");}
 case "xml-to-json":{if(typeof DOMParser==="undefined")throw Error("Requires modern browser.");const doc=new DOMParser().parseFromString(s,"application/xml");if(doc.getElementsByTagName("parsererror").length)throw Error("Invalid XML syntax.");return JSON.stringify({[doc.documentElement.nodeName]:xmlToObject(doc.documentElement)},null,2);}
 case "html-formatter":return htmlTagFormat(s);
 case "html-minifier":return s.replace(/>\s+</g,"><").trim();
 case "css-formatter":return s.replace(/\s*\{\s*/g," {\n  ").replace(/;\s*/g,";\n  ").replace(/\s*\}\s*/g,"\n}\n").replace(/\n  \n}/g,"\n}").trim();
 case "css-minifier":return s.replace(/\/\*[\s\S]*?\*\//g,"").replace(/\s*([{}:;,])\s*/g,"$1").trim();
 case "sql-formatter":return s.replace(/\s+/g," ").replace(/\b(SELECT|FROM|WHERE|GROUP BY|ORDER BY|HAVING|LIMIT|JOIN|LEFT JOIN|RIGHT JOIN|INNER JOIN|UPDATE|SET|INSERT INTO|VALUES)\b/gi,"\n$1").trim();
 case "sql-minifier":return s.replace(/\s+/g," ").trim();
 case "text-to-html":return "<p>"+s.split(/\r?\n/).map(escape).join("<br>")+"</p>";
 case "javascript-formatter":return prettyJs(s);
 case "javascript-minifier":return jsCompact(s);
 case "csv-to-json":{const rows=csvData(s),headers=rows.shift();if(headers.some((h,i)=>!h||headers.indexOf(h)!==i))throw Error("CSV headers must be unique and nonempty.");return JSON.stringify(rows.map(row=>Object.fromEntries(headers.map((h,i)=>[h,row[i]]))),null,2);}
 case "csv-viewer":{const rows=csvData(s);const widths=rows[0].map((_,i)=>Math.min(32,Math.max(...rows.map(row=>String(row[i]??"").length))));return rows.map((r,i)=>r.map((cell,j)=>String(cell).slice(0,32).padEnd(widths[j])).join(" | ")).join("\n");}
 case "csv-column-extractor":{const rows=csvData(s),headers=rows[0],idx=0;return rows.map(row=>row[idx]).join("\n")+"\n(First column; paste CSV with the desired column first.)";}
 case "csv-row-filter":{const rows=csvData(s),term=(rows[0][0]||"").toLowerCase();return toCsv([rows[0],...rows.slice(1).filter(row=>row.some(col=>col.toLowerCase().includes(term)))]);}
 case "csv-sorter":{const rows=csvData(s);return toCsv([rows[0],...rows.slice(1).sort((a,b)=>a[0].localeCompare(b[0],undefined,{numeric:true}))]);}
 case "csv-duplicate-remover":{const rows=csvData(s),set=new Set();return toCsv(rows.filter((r,i)=>{const key=JSON.stringify(r);if(i===0)return true;if(set.has(key))return false;set.add(key);return true}));}
 case "tsv-to-csv":return toCsv(parseRows(s,"\t"));
 case "checklist-generator":return s.split(/\r?\n/).filter(Boolean).map(x=>"- [ ] "+x.replace(/^- \[[ x]\]\s*/,"")).join("\n");
 case "simple-pomodoro-timer":{const minutes=Number(s);if(!Number.isFinite(minutes)||minutes<1||minutes>180)throw Error("Enter 1–180 minutes.");return `${minutes} minute focus session. Use Start/Pause/Reset to run a timer in this tab.`;}
 default:return null;
 }
}
