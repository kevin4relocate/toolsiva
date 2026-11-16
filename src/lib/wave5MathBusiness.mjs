function n5Input(input){const s=String(input??"").trim();if(!s)throw Error("Enter numbers.");if(s.length>20000)throw Error("Input exceeds 20,000 characters.");return s;}

function n5Parts(input){const a=n5Input(input).split("|").map(x=>x.trim());if(a.some(x=>x===""||!Number.isFinite(Number(x))))throw Error("Enter valid numbers separated by |.");return a.map(Number);}

function n5Num(x){if(!Number.isFinite(x))throw Error("Calculation overflowed; use smaller values.");return String(Number(x.toPrecision(13)));}

function n5Nonnegative(...vals){if(vals.some(x=>x<0))throw Error("All dimensions or amounts must be nonnegative.");}

export function n5Math(slug,input){if(!["arithmetic-series-sum","geometric-series-sum","fibonacci-number-finder","fibonacci-sequence-generator","triangle-area-from-base-height","circle-area-from-radius","circle-circumference-from-radius","rectangle-perimeter-calculator","trapezoid-area-calculator","cylinder-volume-calculator"].includes(slug))return null;const x=n5Parts(input);switch(slug){
case "arithmetic-series-sum":{if(x.length!==3||!Number.isSafeInteger(x[2])||x[2]<1||x[2]>1000000)throw Error("Use first|difference|termCount (1 to 1,000,000).");return "Sum: "+n5Num(x[2]*(2*x[0]+(x[2]-1)*x[1])/2);}
case "geometric-series-sum":{if(x.length!==3||!Number.isSafeInteger(x[2])||x[2]<1||x[2]>10000)throw Error("Use first|ratio|termCount (1 to 10,000).");const [a,r,n]=x;return "Sum: "+n5Num(r===1?a*n:a*(1-r**n)/(1-r));}
case "fibonacci-number-finder":{if(x.length!==1||!Number.isSafeInteger(x[0])||x[0]<0||x[0]>2000)throw Error("Index must be an integer from 0 to 2000.");let a=0n,b=1n;for(let i=0;i<x[0];i++)[a,b]=[b,a+b];return "F("+x[0]+") = "+a;}
case "fibonacci-sequence-generator":{if(x.length!==1||!Number.isSafeInteger(x[0])||x[0]<1||x[0]>100)throw Error("Count must be an integer 1–100.");let a=0n,b=1n;const list=[];for(let i=0;i<x[0];i++){list.push(String(a));[a,b]=[b,a+b]}return list.join(", ");}
case "triangle-area-from-base-height":{if(x.length!==2)throw Error("Use base|height.");n5Nonnegative(...x);return "Area: "+n5Num(x[0]*x[1]/2);}
case "circle-area-from-radius":{if(x.length!==1)throw Error("Enter radius.");n5Nonnegative(...x);return "Area: "+n5Num(Math.PI*x[0]**2);}
case "circle-circumference-from-radius":{if(x.length!==1)throw Error("Enter radius.");n5Nonnegative(...x);return "Circumference: "+n5Num(2*Math.PI*x[0]);}
case "rectangle-perimeter-calculator":{if(x.length!==2)throw Error("Use width|height.");n5Nonnegative(...x);return "Perimeter: "+n5Num(2*(x[0]+x[1]));}
case "trapezoid-area-calculator":{if(x.length!==3)throw Error("Use base1|base2|height.");n5Nonnegative(...x);return "Area: "+n5Num((x[0]+x[1])*x[2]/2);}
case "cylinder-volume-calculator":{if(x.length!==2)throw Error("Use radius|height.");n5Nonnegative(...x);return "Volume: "+n5Num(Math.PI*x[0]**2*x[1]);}
default:return null;}}

export function n5Business(slug,input){if(!["net-profit-margin-calculator","contribution-margin-calculator","contribution-margin-ratio-calculator","investment-payback-period-calculator","customer-retention-rate-calculator","repeat-purchase-rate-calculator","cart-abandonment-rate-calculator","session-bounce-rate-calculator","monthly-recurring-revenue-calculator","annual-recurring-revenue-calculator"].includes(slug))return null;const x=n5Parts(input);const ratio=(n,d)=>{if(d<=0)throw Error("Denominator must be positive.");return n5Num(n/d*100)+"%";};switch(slug){
case "net-profit-margin-calculator":{if(x.length!==2)throw Error("Use netProfit|revenue.");if(x[1]<=0)throw Error("Revenue must be positive.");return "Net profit margin: "+ratio(x[0],x[1]);}
case "contribution-margin-calculator":{if(x.length!==2)throw Error("Use sellingPrice|variableCost.");n5Nonnegative(...x);return "Unit contribution margin: "+n5Num(x[0]-x[1]);}
case "contribution-margin-ratio-calculator":{if(x.length!==2)throw Error("Use sellingPrice|variableCost.");n5Nonnegative(...x);return "Contribution margin ratio: "+ratio(x[0]-x[1],x[0]);}
case "investment-payback-period-calculator":{if(x.length!==2)throw Error("Use investment|annualCashFlow.");n5Nonnegative(...x);if(x[1]===0)throw Error("Annual cash flow must be positive.");return "Simple payback: "+n5Num(x[0]/x[1])+" years";}
case "customer-retention-rate-calculator":{if(x.length!==3)throw Error("Use ending|starting|new.");const [end,start,newCustomers]=x;n5Nonnegative(...x);if(start===0||end<newCustomers||end-newCustomers>start)throw Error("Counts must satisfy 0 ≤ ending-new ≤ starting and starting > 0.");return "Retention: "+ratio(end-newCustomers,start);}
case "repeat-purchase-rate-calculator":{if(x.length!==2)throw Error("Use repeatCustomers|totalCustomers.");n5Nonnegative(...x);if(x[0]>x[1])throw Error("Repeat buyers cannot exceed total buyers.");return "Repeat purchase rate: "+ratio(x[0],x[1]);}
case "cart-abandonment-rate-calculator":{if(x.length!==2)throw Error("Use completedOrders|initiatedCheckouts.");n5Nonnegative(...x);if(x[0]>x[1])throw Error("Orders cannot exceed initiated checkouts.");return "Cart abandonment: "+ratio(x[1]-x[0],x[1]);}
case "session-bounce-rate-calculator":{if(x.length!==2)throw Error("Use bouncedSessions|totalSessions.");n5Nonnegative(...x);if(x[0]>x[1])throw Error("Bounced sessions cannot exceed total sessions.");return "Bounce rate: "+ratio(x[0],x[1]);}
case "monthly-recurring-revenue-calculator":{if(x.length<2||x.length%2)throw Error("Use count|monthlyPrice pairs (even number of values).");let sum=0;for(let i=0;i<x.length;i+=2){if(!Number.isSafeInteger(x[i])||x[i]<0||x[i+1]<0)throw Error("Counts must be nonnegative integers; prices nonnegative.");sum+=x[i]*x[i+1];}return "MRR: "+n5Num(sum);}
case "annual-recurring-revenue-calculator":{if(x.length!==1||x[0]<0)throw Error("Enter nonnegative monthly recurring revenue.");return "ARR: "+n5Num(x[0]*12);}
default:return null;}}
