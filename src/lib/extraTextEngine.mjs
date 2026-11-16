function wordTokens(source) { return String(source).match(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu) || []; }

function graphemes(source) { return typeof Intl !== "undefined" && Intl.Segmenter ? [...new Intl.Segmenter(undefined, {granularity:"grapheme"}).segment(String(source))].map(x=>x.segment) : Array.from(String(source)); }

function syllablesEnglish(word) {
  const w = String(word).toLowerCase().normalize("NFD").replace(/\p{M}/gu,"").replace(/[^a-z]/g,"");
  if (!w) return 0;
  if (w.length<=3) return 1;
  let t = w.replace(/(?:[^l]e|ed|es)$/,"").replace(/^y/,"");
  let v=(t.match(/[aeiouy]{1,}/g)||[]).length;
  if(/(ia|riet|dien|iu|io|ii)/.test(w))v++;
  if(/[^aeiou]le$/.test(w))v++;
  return Math.max(1,v);
}

function splitConfig(input) {
 const i=String(input).indexOf("\n---\n");
 if(i<0)return {option:"",body:String(input)};
 return {option:String(input).slice(0,i).trim(),body:String(input).slice(i+5)};
}

function textSafety(input){const s=String(input??"");if(s.length>250000)throw Error("Maximum input is 250,000 characters.");if(!s.trim())throw Error("Paste or type text first.");return s;}

function validIpv6(value) {
 const s=value.toLowerCase();if(s.includes(".")||!/^[0-9a-f:]+$/.test(s)||s.includes(":::")||s.split("::").length>2)return false;
 const compressed=s.includes("::"); const parts=s.split("::");
 const left=parts[0]?parts[0].split(":"):[];const right=parts[1]?parts[1].split(":"):[];
 if([...left,...right].some(x=>!/^[0-9a-f]{1,4}$/.test(x)))return false;
 const n=left.length+right.length;return compressed?n<8:n===8;
}


const stopWords = new Set(["a","an","and","are","as","at","be","been","being","but","by","can","could","did","do","does","for","from","had","has","have","he","her","hers","him","his","how","i","if","in","into","is","it","its","just","may","me","might","my","no","nor","not","of","on","or","our","ours","out","over","she","should","so","some","such","than","that","the","their","them","there","these","they","this","those","through","to","too","under","up","us","very","was","we","were","what","when","where","which","while","who","why","will","with","would","you","your","yours"]);

export function runExtraText(slug,input){
 const s=textSafety(input), words=()=>wordTokens(s), sections=()=>splitConfig(s);
 switch(slug) {
 case "speaking-time-calculator": { const {option,body}=sections(),rate=option?Number(option):130; if(!Number.isFinite(rate)||rate<50||rate>300)throw Error("Speaking rate must be 50–300 words per minute.");const n=wordTokens(body).length,seconds=Math.ceil(n/rate*60);return n+" words · approximately "+Math.floor(seconds/60)+"m "+String(seconds%60).padStart(2,"0")+"s at "+rate+" wpm."; }
 case "readability-score-checker": {const t=words().filter(w=>/[a-z]/i.test(w)),sent=s.split(/[.!?]+/).filter(x=>wordTokens(x).length).length||1;if(t.length<3)throw Error("Provide at least three English words.");const syl=t.reduce((a,w)=>a+syllablesEnglish(w),0),score=206.835-1.015*t.length/sent-84.6*syl/t.length,grade=0.39*t.length/sent+11.8*syl/t.length-15.59;return "Flesch Reading Ease (estimated): "+score.toFixed(1)+"\nFlesch–Kincaid grade (estimated): "+Math.max(0,grade).toFixed(1)+"\nWords: "+t.length+" | Sentences: "+sent+" | Estimated syllables: "+syl+"\nEnglish-language heuristic; interpret scores as guidance."; }
 case "syllable-counter": {const t=words(),counts=t.map(w=>[w,syllablesEnglish(w)]),total=counts.reduce((a,r)=>a+r[1],0);return "Estimated syllables: "+total+"\nWords: "+t.length+"\n"+counts.slice(0,60).map(r=>r[0]+": "+r[1]).join("\n")+(counts.length>60?"\n… "+(counts.length-60)+" additional words":"");}
 case "long-sentence-finder": {const {option,body}=sections(),threshold=option?Number(option):25;if(!Number.isSafeInteger(threshold)||threshold<3||threshold>200)throw Error("Threshold must be an integer from 3 to 200.");const sentences=body.split(/(?<=[.!?])\s+|\n+/).map(x=>x.trim()).filter(Boolean),long=sentences.map((x,i)=>({index:i+1,text:x,count:wordTokens(x).length})).filter(x=>x.count>threshold);return long.length+" sentences longer than "+threshold+" words (of "+sentences.length+" total).\n"+(long.length?long.slice(0,50).map(x=>"#"+x.index+" ("+x.count+" words): "+x.text).join("\n"):"No long sentences found.");}
 case "repeated-word-detector": {const matches=[...s.matchAll(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu)],hits=[];for(let i=1;i<matches.length;i++)if(matches[i][0].toLocaleLowerCase()===matches[i-1][0].toLocaleLowerCase()&&/^\s+$/.test(s.slice(matches[i-1].index+matches[i-1][0].length,matches[i].index))){const line=s.slice(0,matches[i].index).split("\n").length;hits.push("Line "+line+": \""+matches[i][0]+"\"");}return hits.length+" adjacent repeated words found.\n"+(hits.join("\n")||"No adjacent repeated words detected.");}
 case "character-frequency-analyzer": {const f=new Map();for(const c of graphemes(s))f.set(c,(f.get(c)||0)+1);return [...f].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])).slice(0,100).map(([ch,n])=>JSON.stringify(ch)+" : "+n).join("\n")+"\nDistinct characters: "+f.size;}
 case "word-length-distribution": {const f=new Map();for(const w of words()){const n=graphemes(w).length;f.set(n,(f.get(n)||0)+1);}return [...f].sort((a,b)=>a[0]-b[0]).map(([n,c])=>n+" character"+(n===1?"":"s")+" : "+c).join("\n");}
 case "palindrome-checker": {const normalized=s.normalize("NFD").replace(/\p{M}/gu,"").toLocaleLowerCase().replace(/[^\p{L}\p{N}]/gu,"");if(!normalized)throw Error("Enter at least one letter or digit.");const chars=Array.from(normalized);return chars.every((c,i)=>c===chars[chars.length-1-i])?"Palindrome (ignoring punctuation, accents and case).":"Not a palindrome (after normalization).";}
 case "n-gram-generator": {const {option,body}=sections(),n=option?Number(option):2;if(!Number.isSafeInteger(n)||n<1||n>5)throw Error("N-gram size must be 1–5.");const w=wordTokens(body).map(x=>x.toLocaleLowerCase()),freq=new Map();for(let i=0;i+n<=w.length;i++){const part=w.slice(i,i+n).join(" ");freq.set(part,(freq.get(part)||0)+1);}return [...freq].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])).slice(0,100).map(x=>x[0]+" : "+x[1]).join("\n")||"Not enough words for this n-gram length.";}
 case "stop-word-remover": {const tokens=s.match(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu)||[];const kept=tokens.filter(w=>!stopWords.has(w.toLocaleLowerCase()));return kept.join(" ")+"\n\nRemoved "+(tokens.length-kept.length)+" common English stop words.";}
 case "invisible-unicode-detector": {const names=new Map([[0x200B,"ZERO WIDTH SPACE"],[0x200C,"ZERO WIDTH NON-JOINER"],[0x200D,"ZERO WIDTH JOINER"],[0x2060,"WORD JOINER"],[0xFEFF,"BYTE ORDER MARK / ZERO WIDTH NO-BREAK SPACE"],[0x00AD,"SOFT HYPHEN"],[0x00A0,"NO-BREAK SPACE"],[0x202F,"NARROW NO-BREAK SPACE"],[0x00,"NULL"],[9,"TAB"],[10,"LINE FEED"],[13,"CARRIAGE RETURN"]]),hits=[];let i=0;for(const ch of Array.from(s)){const cp=ch.codePointAt(0);if(names.has(cp)||cp<32||cp===127)hits.push("Position "+(i+1)+": U+"+cp.toString(16).toUpperCase().padStart(4,"0")+" "+(names.get(cp)||"CONTROL CHARACTER"));i++;}return hits.length+" invisible or control characters found.\n"+(hits.slice(0,100).join("\n")||"No unusual invisible characters detected.");}
 case "zero-width-character-remover": {const result=s.replace(/[\u200B-\u200D\u2060\uFEFF\u00AD]/g,"");return result+"\n\nRemoved "+(s.length-result.length)+" zero-width/soft-hyphen characters.";}
 case "unicode-code-point-inspector": {return graphemes(s).slice(0,150).map((g,i)=>"#"+(i+1)+" "+JSON.stringify(g)+" → "+Array.from(g).map(c=>"U+"+c.codePointAt(0).toString(16).toUpperCase().padStart(4,"0")).join(" + ")).join("\n");}
 case "diacritics-remover": return s.normalize("NFD").replace(/\p{M}/gu,"");
 case "emoji-remover": return s.replace(/\p{Regional_Indicator}{2}/gu,"").replace(/[0-9#*]\uFE0F?\u20E3/gu,"").replace(/\p{Extended_Pictographic}(?:\uFE0F|\uFE0E)?(?:\p{Emoji_Modifier})?(?:\u200D\p{Extended_Pictographic}(?:\uFE0F)?(?:\p{Emoji_Modifier})?)*/gu,"");
 case "non-ascii-character-remover": return Array.from(s).filter(c=>c.codePointAt(0)<=127).join("");
 case "text-truncator": {const {option,body}=sections(),limit=Number(option);if(!Number.isSafeInteger(limit)||limit<1||limit>10000)throw Error("Use a positive maximum length (1–10000) followed by --- and your text.");const ch=graphemes(body);if(ch.length<=limit)return body;return ch.slice(0,Math.max(0,limit-1)).join("")+"…";}
 case "word-wrap-formatter": {const {option,body}=sections(),width=Number(option);if(!Number.isSafeInteger(width)||width<5||width>500)throw Error("Use width 5–500 followed by --- and text.");return body.split(/\r?\n/).map(par=>{const tokens=par.trim().split(/\s+/).filter(Boolean);const rows=[];let row="";for(const t of tokens){if(!row)row=t;else if(graphemes(row).length+1+graphemes(t).length<=width)row+=" "+t;else{rows.push(row);row=t;}}if(row)rows.push(row);return rows.join("\n")}).join("\n");}
 case "string-padder": {const {option,body}=sections(),config=option.split("|"),width=Number(config[0]),align=config[1]||"right",fill=config[2]||" ";if(!Number.isSafeInteger(width)||width<1||width>2000||!["left","right","center"].includes(align)||graphemes(fill).length!==1)throw Error("Use width|left/right/center|single character followed by --- and text.");return body.split(/\r?\n/).map(line=>{const diff=Math.max(0,width-graphemes(line).length);const l=align==="left"?0:align==="center"?Math.floor(diff/2):diff;return fill.repeat(l)+line+fill.repeat(diff-l)}).join("\n");}
 case "line-length-checker": {const lines=s.split(/\r?\n/),counts=lines.map(x=>graphemes(x).length),longest=Math.max(...counts);return "Lines: "+lines.length+"\nLongest: "+longest+" characters (line "+(counts.indexOf(longest)+1)+")\n"+counts.slice(0,150).map((n,i)=>"Line "+(i+1)+": "+n).join("\n");}
 case "phone-number-extractor": {const out=[];for(const line of s.split(/\r?\n/))for(const m of line.matchAll(/(?<![\w])\+?\d(?:[\d ().-]{4,})\d(?![\w])/g)){const val=m[0].trim(),digits=val.replace(/\D/g,"");if(digits.length>=7&&digits.length<=15)out.push(val);}return [...new Set(out)].join("\n")||"No phone-like numbers found.";}
 case "ipv4-address-extractor": {const out=[];for(const m of s.matchAll(/(?<![\d.])(?:\d{1,3}\.){3}\d{1,3}(?![\d.])/g)){const v=m[0];if(v.split(".").every(p=>+p<=255&&(p==="0"||!p.startsWith("0"))))out.push(v);}return [...new Set(out)].join("\n")||"No valid IPv4 addresses found.";}
 case "ipv6-address-extractor": {const out=[];for(const m of s.matchAll(/(?<![\w:])(?:[0-9A-Fa-f]{0,4}:){2,}[0-9A-Fa-f]{0,4}(?![\w:])/g))if(validIpv6(m[0]))out.push(m[0]);return [...new Set(out)].join("\n")||"No valid IPv6 addresses found.";}
 case "hashtag-extractor": {const tags=[...s.matchAll(/(?<![\p{L}\p{N}_])#[\p{L}\p{N}_]+/gu)].map(m=>m[0]);return [...new Set(tags)].join("\n")||"No hashtags found.";}
 case "social-mention-extractor": {const mentions=[...s.matchAll(/(?<![\p{L}\p{N}_@.])@[\p{L}\p{N}_]{2,30}/gu)].map(m=>m[0]);return [...new Set(mentions)].join("\n")||"No social mentions found.";}
 case "number-extractor": {const nums=[...s.matchAll(/(?<![\w])[-+]?(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?(?:e[-+]?\d+)?(?![\w])/gi)].map(m=>m[0]);return nums.join("\n")||"No numbers found.";}
 case "date-pattern-extractor": {const iso=[...s.matchAll(/\b\d{4}-\d{1,2}-\d{1,2}\b/g)].map(m=>m[0]),slash=[...s.matchAll(/\b\d{1,2}\/\d{1,2}\/\d{4}\b/g)].map(m=>m[0]);return [...new Set([...iso,...slash])].join("\n")||"No common date patterns found.";}
 case "quoted-text-extractor": {const q=[...s.matchAll(/"((?:\\.|[^"\\])*)"|'((?:\\.|[^'\\])*)'/g)].map(m=>m[1]??m[2]);return q.join("\n")||"No quoted strings found.";}
 case "domain-name-extractor": {const matches=[...s.matchAll(/(?:https?:\/\/)?(?:www\.)?(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}\b/gi)].map(m=>m[0].replace(/^https?:\/\//i,"").replace(/^www\./i,"").toLowerCase());return [...new Set(matches)].join("\n")||"No domain names found.";}
 case "email-domain-counter": {const freq=new Map();for(const m of s.matchAll(/[a-z0-9._%+-]+@((?:[a-z0-9-]+\.)+[a-z]{2,63})/gi)){const domain=m[1].toLowerCase();freq.set(domain,(freq.get(domain)||0)+1);}return [...freq].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])).map(([d,n])=>d+" : "+n).join("\n")||"No email domains found.";}
 default:return null;
 }
}
