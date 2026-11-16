function nums4(s,min=1){const parts=String(s).split(",").map(x=>x.trim());if(parts.length<min||parts.some(x=>x===""||!Number.isFinite(Number(x))))throw Error("Enter at least "+min+" valid comma-separated numbers.");return parts.map(Number);}

function number4(value,d=8){if(!Number.isFinite(value))throw Error("Result is not finite.");return +value.toFixed(d)+"";}

function median4(sorted){return sorted.length%2?sorted[(sorted.length-1)/2]:(sorted[sorted.length/2-1]+sorted[sorted.length/2])/2;}

function variance4(values){const avg=values.reduce((a,x)=>a+x,0)/values.length;const sum=values.reduce((a,x)=>a+(x-avg)**2,0);return {mean:avg,pop:sum/values.length,sample:values.length>1?sum/(values.length-1):null};}

export function math4(slug,input){const raw=String(input??"").trim();if(!raw)throw Error("Enter numeric input.");if(raw.length>100000)throw Error("Input too large.");switch(slug){
case "quartile-calculator":{const x=nums4(raw,2).sort((a,b)=>a-b),mid=Math.floor(x.length/2),q2=median4(x),q1=median4(x.slice(0,mid)),q3=median4(x.slice(x.length%2?mid+1:mid));return "Q1: "+number4(q1)+"\nMedian Q2: "+number4(q2)+"\nQ3: "+number4(q3)+"\nIQR: "+number4(q3-q1);}
case "percentile-calculator":{const [percent,values]=raw.split(/\r?\n---\r?\n/),p=Number(percent);if(!Number.isFinite(p)||p<0||p>100||values===undefined)throw Error("Use percentile 0–100, then ---, then comma-separated values.");const x=nums4(values).sort((a,b)=>a-b),pos=(x.length-1)*p/100,lo=Math.floor(pos),hi=Math.ceil(pos);return number4(x[lo]+(x[hi]-x[lo])*(pos-lo))+" (P"+p+")";}
case "variance-calculator":{const data=nums4(raw),v=variance4(data);return "Population variance: "+number4(v.pop)+"\nSample variance: "+(v.sample===null?"N/A (at least two values)":number4(v.sample));}
case "z-score-calculator":{const [x,mu,sd]=nums4(raw,3);if(sd<=0)throw Error("Standard deviation must be positive.");return number4((x-mu)/sd);}
case "coefficient-of-variation-calculator":{const vals=nums4(raw,2),v=variance4(vals);if(v.mean===0)throw Error("Mean must be nonzero.");return number4(Math.sqrt(v.pop)/Math.abs(v.mean)*100,4)+"% (population CV)";}
case "factorial-calculator":{const n=Number(raw);if(!Number.isSafeInteger(n)||n<0||n>500)throw Error("Enter an integer from 0 to 500.");let p=1n;for(let i=2;i<=n;i++)p*=BigInt(i);return p.toString();}
case "permutation-calculator":{const [n,r]=nums4(raw,2);if(!Number.isSafeInteger(n)||!Number.isSafeInteger(r)||n<0||n>500||r<0||r>n)throw Error("Use whole numbers with 0 ≤ r ≤ n ≤ 500.");let v=1n;for(let i=0;i<r;i++)v*=BigInt(n-i);return v.toString();}
case "combination-calculator":{const [n,r]=nums4(raw,2);if(!Number.isSafeInteger(n)||!Number.isSafeInteger(r)||n<0||n>500||r<0||r>n)throw Error("Use whole numbers with 0 ≤ r ≤ n ≤ 500.");let k=Math.min(r,n-r),value=1n;for(let i=1;i<=k;i++)value=value*BigInt(n-i+1)/BigInt(i);return value.toString();}
case "quadratic-equation-solver":{const [a,b,c]=nums4(raw,3);if(a===0)throw Error("a must not be zero.");const disc=b*b-4*a*c;if(!Number.isFinite(disc))throw Error("Coefficients are too large.");if(disc===0)return "One repeated real root: "+number4(-b/(2*a));if(disc>0){const d=Math.sqrt(disc),q=-(b+Math.sign(b||1)*d)/2;const x1=q/a,x2=c/q;return "Two real roots: "+number4(x1)+" and "+number4(x2);}const re=-b/(2*a),im=Math.sqrt(-disc)/(2*Math.abs(a));return "Complex roots: "+number4(re)+" + "+number4(im)+"i\n"+number4(re)+" - "+number4(im)+"i";}
case "pythagorean-theorem-calculator":{const [a,b]=nums4(raw,2);if(a<=0||b<=0)throw Error("Both sides must be positive.");return "Hypotenuse: "+number4(Math.hypot(a,b));}
default:return null;}}
