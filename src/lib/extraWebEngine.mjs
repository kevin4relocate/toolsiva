function requireInput(input){const s=String(input??"").trim();if(!s)throw Error("Enter text first.");if(s.length>250000)throw Error("Input exceeds 250,000 characters.");return s;}

function htmlEscape(value){return String(value).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}

function htmlDocument(source){if(typeof DOMParser==="undefined")throw Error("HTML parser requires a modern browser.");return new DOMParser().parseFromString(source,"text/html");}

function splitBody(text){const i=text.indexOf("\n---\n");return i<0?{options:"",body:text}:{options:text.slice(0,i).trim(),body:text.slice(i+5)};}

function cssSpecificity(selector){
 const input=selector.replace(/\/\*[\s\S]*?\*\//g,"");
 const list=input.split(",").map(s=>s.trim()).filter(Boolean);
 if(!list.length)throw Error("Enter one or more CSS selectors.");
 const out=[];
 for(const sel of list){let s=sel;
  let a=0,b=0,c=0;
  s=s.replace(/:where\([^()]*\)/g,"");
  s=s.replace(/\[[^\]]*\]/g,()=>{b++;return " ";});
  s=s.replace(/::[\w-]+/g,()=>{c++;return " ";});
  s=s.replace(/#[\w-]+/g,()=>{a++;return " ";});
  s=s.replace(/\.[\w-]+/g,()=>{b++;return " ";});
  s=s.replace(/:(?!:)[\w-]+(?:\([^)]*\))?/g,()=>{b++;return " ";});
  s=s.replace(/\*/g," ");
  s=s.replace(/(^|[\s>+~])([a-zA-Z][\w-]*)/g,(m,p,x)=>{c++;return p+" ";});
  out.push(sel+" → "+a+"-"+b+"-"+c+" (approximate)");
 }
 return out.join("\n")+"\nAdvanced selectors such as :is(), :not(), :has() and nesting may require full CSS parsing.";
}

function ipToInt(ip){const parts=ip.split(".");if(parts.length!==4||parts.some(p=>!/^\d{1,3}$/.test(p)||Number(p)>255||(p.length>1&&p[0]==="0")))throw Error("Invalid dotted-decimal IPv4 address.");return (((Number(parts[0])<<24)|(Number(parts[1])<<16)|(Number(parts[2])<<8)|Number(parts[3]))>>>0);}

function intToIp(n){return [n>>>24,(n>>>16)&255,(n>>>8)&255,n&255].join(".");}

const httpCodes = {
  "100": [
    "Continue",
    "Request headers received; client may continue."
  ],
  "101": [
    "Switching Protocols",
    "Protocol switch was accepted."
  ],
  "102": [
    "Processing",
    "The server is processing the request."
  ],
  "103": [
    "Early Hints",
    "Preliminary response hints for resource loading."
  ],
  "200": [
    "OK",
    "Request succeeded."
  ],
  "201": [
    "Created",
    "A resource was created."
  ],
  "202": [
    "Accepted",
    "Request accepted; processing may be pending."
  ],
  "203": [
    "Non-Authoritative Information",
    "Metadata came from a transforming proxy."
  ],
  "204": [
    "No Content",
    "Request succeeded; no response body."
  ],
  "205": [
    "Reset Content",
    "Client should reset the document view."
  ],
  "206": [
    "Partial Content",
    "A requested range of data was returned."
  ],
  "207": [
    "Multi-Status",
    "Multiple resource statuses are represented."
  ],
  "208": [
    "Already Reported",
    "Previously reported members need not be repeated."
  ],
  "226": [
    "IM Used",
    "Delta encoding was applied."
  ],
  "300": [
    "Multiple Choices",
    "Several representations are available."
  ],
  "301": [
    "Moved Permanently",
    "Resource moved permanently to another URL."
  ],
  "302": [
    "Found",
    "Temporary redirection to another URL."
  ],
  "303": [
    "See Other",
    "Retrieve the response from another URI using GET."
  ],
  "304": [
    "Not Modified",
    "Cached representation is still valid."
  ],
  "307": [
    "Temporary Redirect",
    "Repeat the original method at a temporary URL."
  ],
  "308": [
    "Permanent Redirect",
    "Repeat the original method at the new permanent URL."
  ],
  "400": [
    "Bad Request",
    "Request syntax or content is invalid."
  ],
  "401": [
    "Unauthorized",
    "Authentication is required or invalid."
  ],
  "402": [
    "Payment Required",
    "Reserved for future or application-specific use."
  ],
  "403": [
    "Forbidden",
    "Server refuses access."
  ],
  "404": [
    "Not Found",
    "Requested resource was not found."
  ],
  "405": [
    "Method Not Allowed",
    "HTTP method is not supported for this resource."
  ],
  "406": [
    "Not Acceptable",
    "No acceptable representation is available."
  ],
  "407": [
    "Proxy Authentication Required",
    "Proxy authentication is needed."
  ],
  "408": [
    "Request Timeout",
    "Server timed out waiting for the request."
  ],
  "409": [
    "Conflict",
    "Request conflicts with current resource state."
  ],
  "410": [
    "Gone",
    "Resource is intentionally no longer available."
  ],
  "411": [
    "Length Required",
    "Content length must be supplied."
  ],
  "412": [
    "Precondition Failed",
    "Request preconditions failed."
  ],
  "413": [
    "Content Too Large",
    "Payload exceeds the server limit."
  ],
  "414": [
    "URI Too Long",
    "Request URI is too long."
  ],
  "415": [
    "Unsupported Media Type",
    "Request body media type is not supported."
  ],
  "416": [
    "Range Not Satisfiable",
    "Requested byte range is not available."
  ],
  "417": [
    "Expectation Failed",
    "Expect header cannot be met."
  ],
  "418": [
    "I'm a teapot",
    "Humorous status originally defined in RFC 2324."
  ],
  "421": [
    "Misdirected Request",
    "The server is not the intended target."
  ],
  "422": [
    "Unprocessable Content",
    "Valid syntax but semantically invalid content."
  ],
  "423": [
    "Locked",
    "Target resource is locked."
  ],
  "424": [
    "Failed Dependency",
    "Dependent action failed."
  ],
  "425": [
    "Too Early",
    "Server declines a potentially replayable request."
  ],
  "426": [
    "Upgrade Required",
    "Client must change protocol."
  ],
  "428": [
    "Precondition Required",
    "A conditional request is required."
  ],
  "429": [
    "Too Many Requests",
    "Rate limit reached."
  ],
  "431": [
    "Request Header Fields Too Large",
    "Request headers are too large."
  ],
  "451": [
    "Unavailable For Legal Reasons",
    "Resource unavailable due to legal restrictions."
  ],
  "500": [
    "Internal Server Error",
    "An unexpected server error occurred."
  ],
  "501": [
    "Not Implemented",
    "Server lacks support for the requested functionality."
  ],
  "502": [
    "Bad Gateway",
    "Upstream server supplied an invalid response."
  ],
  "503": [
    "Service Unavailable",
    "Server is temporarily unavailable."
  ],
  "504": [
    "Gateway Timeout",
    "Upstream server did not respond in time."
  ],
  "505": [
    "HTTP Version Not Supported",
    "Server does not support this HTTP version."
  ],
  "506": [
    "Variant Also Negotiates",
    "Content negotiation configuration error."
  ],
  "507": [
    "Insufficient Storage",
    "Server cannot store the representation."
  ],
  "508": [
    "Loop Detected",
    "Processing loop was detected."
  ],
  "510": [
    "Not Extended",
    "Additional extensions are needed."
  ],
  "511": [
    "Network Authentication Required",
    "Network access requires authentication."
  ]
};

const mimeMap = {
  "html": "text/html",
  "htm": "text/html",
  "css": "text/css",
  "js": "text/javascript",
  "mjs": "text/javascript",
  "json": "application/json",
  "jsonld": "application/ld+json",
  "xml": "application/xml",
  "txt": "text/plain",
  "md": "text/markdown",
  "csv": "text/csv",
  "tsv": "text/tab-separated-values",
  "yaml": "application/yaml",
  "yml": "application/yaml",
  "svg": "image/svg+xml",
  "png": "image/png",
  "jpg": "image/jpeg",
  "jpeg": "image/jpeg",
  "gif": "image/gif",
  "webp": "image/webp",
  "avif": "image/avif",
  "ico": "image/x-icon",
  "woff": "font/woff",
  "woff2": "font/woff2",
  "ttf": "font/ttf",
  "otf": "font/otf",
  "mp3": "audio/mpeg",
  "wav": "audio/wav",
  "ogg": "audio/ogg",
  "mp4": "video/mp4",
  "webm": "video/webm",
  "wasm": "application/wasm",
  "zip": "application/zip",
  "gz": "application/gzip",
  "br": "application/octet-stream",
  "pdf": "application/pdf",
  "webmanifest": "application/manifest+json",
  "map": "application/json",
  "ics": "text/calendar"
};

export function runExtraWeb(slug,input){
 const s=requireInput(input),{options,body}=splitBody(s);
 switch(slug){
 case "css-specificity-calculator":return cssSpecificity(s);
 case "html-tag-counter":{const doc=htmlDocument(s),count=new Map();for(const el of doc.body.querySelectorAll("*")){const tag=el.tagName.toLowerCase();count.set(tag,(count.get(tag)||0)+1);}return [...count].sort((a,b)=>b[1]-a[1]).map(([tag,n])=>"<"+tag+"> : "+n).join("\n")||"No HTML elements detected.";}
 case "html-link-extractor":{const doc=htmlDocument(s),links=[...doc.querySelectorAll("a[href]")];return links.map((a,i)=>(i+1)+". "+a.getAttribute("href")+" — "+(a.textContent||"").trim()).join("\n")||"No links found.";}
 case "html-attribute-extractor":{const name=options.toLowerCase();if(!/^[a-z_][a-z0-9_:-]*$/.test(name))throw Error("Enter an attribute name before --- and paste HTML after it.");const doc=htmlDocument(body),out=[...doc.body.querySelectorAll("*")].filter(el=>el.hasAttribute(name));return out.map((el,i)=>(i+1)+". <"+el.tagName.toLowerCase()+"> "+name+"="+JSON.stringify(el.getAttribute(name))).join("\n")||"No matching attributes found.";}
 case "http-status-code-lookup":{const n=Number(s);if(!Number.isInteger(n)||n<100||n>599)throw Error("Enter an HTTP status between 100 and 599.");const data=httpCodes[n],category=Math.floor(n/100),categories=["","Informational","Success","Redirection","Client error","Server error"];return n+" — "+(data?.[0]||"Unassigned or uncommon status")+"\nClass: "+categories[category]+"\n"+(data?.[1]||"Not in the built-in reference table.");}
 case "mime-type-lookup":{const raw=s.toLowerCase().split(/[?#]/,1)[0].trim(),ext=raw.replace(/^\./,"").split(".").pop();if(!/^[a-z0-9-]{1,30}$/.test(ext))throw Error("Enter a file extension as text, e.g. .html.");const mime=mimeMap[ext];return mime?"."+ext+" → "+mime+"\nThis is a lookup only; no file is opened.":"No common MIME mapping found for ."+ext+".";}
 case "meta-robots-generator":{const directives=s.split(",").map(x=>x.trim().toLowerCase()).filter(Boolean),known=/^(?:index|noindex|follow|nofollow|noarchive|nosnippet|noimageindex|notranslate|indexifembedded|max-snippet:-?\d+|max-image-preview:(?:none|standard|large)|max-video-preview:-?\d+)$/;if(!directives.length||directives.some(x=>!known.test(x)))throw Error("Unsupported meta robots directive.");if(directives.includes("index")&&directives.includes("noindex")||directives.includes("follow")&&directives.includes("nofollow"))throw Error("Conflicting index/follow directives.");return '<meta name="robots" content="'+htmlEscape([...new Set(directives)].join(", "))+'">';}
 case "cache-control-header-generator":{const rules=s.split(",").map(x=>x.trim().toLowerCase()).filter(Boolean),known=/^(public|private|no-cache|no-store|must-revalidate|proxy-revalidate|immutable|no-transform|max-age=\d+|s-maxage=\d+|stale-while-revalidate=\d+|stale-if-error=\d+)$/;if(!rules.length||rules.some(x=>!known.test(x)))throw Error("Unsupported Cache-Control directive.");if(rules.includes("public")&&rules.includes("private"))throw Error("Cannot use public and private together.");return "Cache-Control: "+[...new Set(rules)].join(", ");}
 case "url-query-parameter-builder":{if(!options)throw Error("Enter a full HTTP URL before a --- separator, then one key=value per line.");let url;try{url=new URL(options)}catch{throw Error("Invalid URL.");}if(!["http:","https:"].includes(url.protocol))throw Error("Only HTTP and HTTPS URLs are supported.");for(const line of body.split(/\r?\n/).filter(Boolean)){const index=line.indexOf("=");if(index<=0)throw Error("Each line must contain key=value.");const key=line.slice(0,index).trim(),value=line.slice(index+1).trim();if(!key)throw Error("Query key cannot be empty.");url.searchParams.set(key,value);}return url.toString();}
 case "ipv4-subnet-calculator":{const parts=s.split("/");if(parts.length!==2)throw Error("Use IPv4/prefix, e.g. 192.168.1.10/24.");const ip=ipToInt(parts[0]),prefix=Number(parts[1]);if(!Number.isInteger(prefix)||prefix<0||prefix>32)throw Error("Prefix must be 0–32.");const mask=prefix===0?0:(0xFFFFFFFF<<(32-prefix))>>>0,network=(ip&mask)>>>0,broadcast=(network|(~mask))>>>0,block=2**(32-prefix),usable=prefix>=31?block:block-2,first=prefix>=31?network:network+1,last=prefix>=31?broadcast:broadcast-1;return "Network: "+intToIp(network)+"/"+prefix+"\nSubnet mask: "+intToIp(mask)+"\nBroadcast: "+intToIp(broadcast)+"\nAddresses: "+block+"\nConventional usable hosts: "+usable+"\nHost range: "+intToIp(first)+" – "+intToIp(last)+"\n/31 and /32 use point-to-point/host-route conventions.";}
 default:return null;
 }
}
