function dateCheck3(s){const m=String(s).trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);if(!m)throw Error("Use YYYY-MM-DD.");const [y,mo,d]=m.slice(1).map(Number);const dt=new Date(0);dt.setUTCHours(0,0,0,0);dt.setUTCFullYear(y,mo-1,d);if(dt.getUTCFullYear()!==y||dt.getUTCMonth()!==mo-1||dt.getUTCDate()!==d)throw Error("Invalid calendar date.");return dt;}

function monthCheck3(s){const m=String(s).trim().match(/^(\d{4})-(\d{2})$/);if(!m||+m[2]<1||+m[2]>12)throw Error("Use a valid YYYY-MM month.");return [Number(m[1]),Number(m[2])];}

function dateFormat3(dt){const y=dt.getUTCFullYear();return String(y).padStart(4,"0")+"-"+String(dt.getUTCMonth()+1).padStart(2,"0")+"-"+String(dt.getUTCDate()).padStart(2,"0");}

function timeMinutes3(value){const m=String(value).trim().match(/^([01]?\d|2[0-3]):([0-5]\d)$/);if(!m)throw Error("Use 24-hour HH:MM.");return Number(m[1])*60+Number(m[2]);}

function timeString3(n){return String(Math.floor(n/60)).padStart(2,"0")+":"+String(n%60).padStart(2,"0");}

function splitSection3(s){const v=String(s??"").trim();if(!v)throw Error("Enter dates or time values first.");const n=v.indexOf("\n---\n");return n<0?{first:v,second:""}:{first:v.slice(0,n).trim(),second:v.slice(n+5).trim()};}

export function dateSlots3(slug,input){const {first,second}=splitSection3(input),parts=first.split(",").map(x=>x.trim());switch(slug){
case "day-of-week-finder":return new Intl.DateTimeFormat("en-US",{weekday:"long",timeZone:"UTC"}).format(dateCheck3(first));
case "days-in-month-calculator":{const [y,m]=monthCheck3(first);const dt=new Date(0);dt.setUTCFullYear(y,m,0);return String(dt.getUTCDate())+" days";}
case "date-range-list-generator":{const a=dateCheck3(parts[0]),b=dateCheck3(parts[1]||"");const n=Math.round((b-a)/86400000);if(n<0||n>365)throw Error("Range must be forward and no more than 366 dates.");return Array.from({length:n+1},(_,i)=>{const d=new Date(a);d.setUTCDate(d.getUTCDate()+i);return dateFormat3(d)}).join("\n");}
case "date-range-overlap-checker":{if(!second)throw Error("Enter two ranges separated by --- .");const x=first.split(",").map(s=>dateCheck3(s)),y=second.split(",").map(s=>dateCheck3(s));if(x.length!==2||y.length!==2||x[0]>x[1]||y[0]>y[1])throw Error("Each range must contain an ordered start and end date.");const start=new Date(Math.max(+x[0],+y[0])),end=new Date(Math.min(+x[1],+y[1]));return start<=end?`Overlap: ${dateFormat3(start)} to ${dateFormat3(end)} (inclusive)`:"No overlap.";}
case "next-weekday-calculator":{const d=dateCheck3(parts[0]),days=["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];const wanted=days.indexOf((parts[1]||"").toLowerCase());if(wanted<0)throw Error("Enter weekday name, e.g. Friday.");const shift=((wanted-d.getUTCDay()+6)%7)+1;d.setUTCDate(d.getUTCDate()+shift);return dateFormat3(d);}
case "add-business-days-calculator":{const d=dateCheck3(parts[0]),count=Number(parts[1]);if(!Number.isInteger(count)||count<0||count>5000)throw Error("Business days must be a whole number from 0 to 5000.");let n=0;while(n<count){d.setUTCDate(d.getUTCDate()+1);if(d.getUTCDay()!==0&&d.getUTCDay()!==6)n++;}return dateFormat3(d)+" (weekends excluded; holidays not considered)";}
case "quarter-of-year-finder":{const d=dateCheck3(first);return "Q"+(Math.floor(d.getUTCMonth()/3)+1)+" "+d.getUTCFullYear();}
case "month-end-date-calculator":{const [y,m]=monthCheck3(first),dt=new Date(0);dt.setUTCFullYear(y,m,0);return dateFormat3(dt);}
case "time-slot-generator":{const start=timeMinutes3(parts[0]),end=timeMinutes3(parts[1]),step=Number(parts[2]);if(end<=start||!Number.isInteger(step)||step<1||step>720)throw Error("Provide ascending times and a step of 1–720 minutes.");const result=[];for(let t=start;t<end;t+=step){if(result.length>100)throw Error("Maximum 100 slots.");result.push(timeString3(t));}return result.join("\n");}
case "time-interval-overlap-checker":{if(!second)throw Error("Enter two HH:MM intervals separated by --- .");const x=first.split(",").map(timeMinutes3),y=second.split(",").map(timeMinutes3);if(x.length!==2||y.length!==2||x[0]>=x[1]||y[0]>=y[1])throw Error("Both intervals must start before they end on the same day.");const start=Math.max(x[0],y[0]),end=Math.min(x[1],y[1]);return start<end?`Overlap: ${timeString3(start)}–${timeString3(end)} (${end-start} minutes)`:"No overlap.";}
default:return null;}}
