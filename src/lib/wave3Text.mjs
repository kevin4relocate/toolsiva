function thirdSplit(src){const s=String(src??"");if(!s.trim())throw Error("Enter text first.");if(s.length>250000)throw Error("Maximum input length is 250,000 characters.");const i=s.indexOf("\n---\n");return i<0?{options:"",body:s}:{options:s.slice(0,i).trim(),body:s.slice(i+5)};}

function thirdSentences(src){return (String(src).match(/[^.!?]+(?:[.!?]+|$)/g)||[]).map(s=>s.trim()).filter(Boolean);}

function thirdCodeBlocks(src){const re=/(^|\n)(`{3,}|~{3,})([^\n]*)\n([\s\S]*?)\n\2[ \t]*(?=\n|$)/g;return [...String(src).matchAll(re)].map(m=>({language:m[3].trim(),code:m[4]}));}

export function thirdText(slug,input){const {options,body}=thirdSplit(input),text=String(input);switch(slug){
case "text-line-includes-filter":{if(!options)throw Error("Put the keyword before --- and lines after it.");return body.split(/\r?\n/).filter(x=>x.toLocaleLowerCase().includes(options.toLocaleLowerCase())).join("\n")||"No matching lines.";}
case "text-line-excludes-filter":{if(!options)throw Error("Put the keyword before --- and lines after it.");return body.split(/\r?\n/).filter(x=>!x.toLocaleLowerCase().includes(options.toLocaleLowerCase())).join("\n")||"No remaining lines.";}
case "text-between-delimiters-extractor":{const [start,end]=options.split("|");if(!start||!end)throw Error("Enter start|end before --- and the text after it.");const matches=[];let offset=0;while(offset<body.length&&matches.length<1000){const from=body.indexOf(start,offset);if(from<0)break;const to=body.indexOf(end,from+start.length);if(to<0)break;matches.push(body.slice(from+start.length,to));offset=to+end.length;}return matches.join("\n")||"No matching delimiter pairs.";}
case "duplicate-sentence-remover":{const lines=thirdSentences(text),seen=new Set(),out=[];for(const sentence of lines){const norm=sentence.toLocaleLowerCase().replace(/\s+/g," ");if(!seen.has(norm)){seen.add(norm);out.push(sentence)}}return out.join(" ");}
case "sentence-alphabetical-sorter":return thirdSentences(text).sort((a,b)=>a.localeCompare(b,undefined,{sensitivity:"base"})).join("\n");
case "markdown-link-extractor":{const links=[...text.matchAll(/(?<!!)\[([^\]\n]+)\]\((<?[^)\n]+>?)\)/g)];return links.map(x=>`${x[1]} → ${x[2].replace(/^<|>$/g,"")}`).join("\n")||"No inline Markdown links found.";}
case "markdown-heading-outline-generator":{const stripped=text.replace(/(^|\n)(`{3,}|~{3,})[^\n]*\n[\s\S]*?\n\2[ \t]*(?=\n|$)/g,"\n");const headings=[];for(const row of stripped.split(/\r?\n/)){const m=row.match(/^\s{0,3}(#{1,6})\s+(.+?)\s*#*\s*$/);if(m)headings.push("  ".repeat(m[1].length-1)+m[2]);}return headings.join("\n")||"No Markdown ATX headings found.";}
case "markdown-code-block-extractor":{const blocks=thirdCodeBlocks(text);return blocks.map((b,i)=>`Block ${i+1}${b.language?" ("+b.language+")":""}:\n${b.code}`).join("\n\n")||"No fenced code blocks found.";}
case "markdown-checklist-progress-calculator":{const entries=[...text.matchAll(/^\s*[-*+]\s+\[([xX ])\]\s+.*$/gm)],done=entries.filter(m=>m[1].toLowerCase()==="x").length;return `Total tasks: ${entries.length}\nCompleted: ${done}\nRemaining: ${entries.length-done}\nProgress: ${entries.length?(done/entries.length*100).toFixed(1):"0.0"}%`;}
case "markdown-special-character-escaper":return text.replace(/([\\`*_{}\[\]()#+\-.!|>])/g,"\\$1");
default:return null;
}}
