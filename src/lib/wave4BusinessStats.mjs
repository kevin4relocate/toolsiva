function n4Values(source,min=1){const s=String(source??"").trim();if(!s||s.length>100000)throw Error("Enter numeric values (up to 100,000 characters).");const items=s.split(",").map(x=>x.trim());if(items.length<min||items.length>5000||items.some(x=>!x||!Number.isFinite(Number(x))))throw Error("Enter at least "+min+" valid finite comma-separated numbers, up to 5,000.");return items.map(Number);}

function n4Format(x){if(!Number.isFinite(x))throw Error("Result is not finite.");return Number(x.toFixed(8)).toLocaleString("en-US",{maximumFractionDigits:8});}

function n4Percent(top,bottom,unit="%"){if(top<0||bottom<=0)throw Error("Numerator must be nonnegative and denominator positive.");return n4Format(top/bottom*100)+unit;}

function n4Pairs(source){const s=String(source??"").trim();if(!s||s.length>100000)throw Error("Enter X,Y pairs.");const pairs=s.split(/[;\n]+/).map(x=>x.trim()).filter(Boolean).map(x=>x.split(",").map(v=>Number(v.trim())));if(pairs.length<2||pairs.length>5000||pairs.some(pair=>pair.length!==2||pair.some(x=>!Number.isFinite(x))))throw Error("Use at least two finite X,Y pairs separated by semicolons.");return pairs;}

function n4Median(sorted){const n=sorted.length;if(!n)throw Error("No data points.");return n%2?sorted[(n-1)/2]:(sorted[n/2-1]+sorted[n/2])/2;}

function positive4(x){if(x<=0)throw Error("Denominator must be positive.");return x;}

export function n4Buss(slug,input){const x=n4Values(input,2);switch(slug){
case "average-order-value-calculator":{const [revenue,orders]=x;return n4Format(revenue/positive4(orders))+" revenue per order";}
case "revenue-per-visitor-calculator":{const [revenue,visitors]=x;return n4Format(revenue/positive4(visitors))+" revenue per visitor";}
case "gross-profit-calculator":{const [revenue,cogs]=x;if(revenue<0||cogs<0)throw Error("Amounts must be nonnegative.");return "Gross profit: "+n4Format(revenue-cogs);}
case "net-profit-calculator":{if(x.length<3)throw Error("Enter revenue, costs, taxes.");const [revenue,costs,taxes]=x;if(revenue<0||costs<0||taxes<0)throw Error("Amounts must be nonnegative.");return "Net profit: "+n4Format(revenue-costs-taxes);}
case "operating-margin-calculator":{const [operatingIncome,revenue]=x;return n4Format(operatingIncome/positive4(revenue)*100)+"% operating margin";}
case "inventory-turnover-calculator":{const [cogs,avgInventory]=x;return n4Format(cogs/positive4(avgInventory))+" inventory turns";}
case "days-sales-outstanding-calculator":{if(x.length<3)throw Error("Enter receivables, credit sales, days.");const [receivables,sales,days]=x;if(receivables<0||days<=0)throw Error("Receivables and days must be nonnegative/positive.");return n4Format(receivables/positive4(sales)*days)+" days sales outstanding";}
case "email-open-rate-calculator":{const [opens,delivered]=x;if(opens>delivered)throw Error("Unique opens cannot exceed delivered emails in this model.");return n4Percent(opens,delivered)+" unique email open rate";}
case "email-click-to-open-rate-calculator":{const [clicks,opens]=x;if(clicks>opens)throw Error("Unique clicks cannot exceed unique opens in this model.");return n4Percent(clicks,opens)+" click-to-open rate";}
case "email-bounce-rate-calculator":{const [bounced,sent]=x;if(bounced>sent)throw Error("Bounces cannot exceed attempted sends.");return n4Percent(bounced,sent)+" email bounce rate";}
default:return null;}}

export function n4Stats(slug,input){const s=String(input??"");switch(slug){
case "geometric-mean-calculator":{const x=n4Values(s);if(x.some(v=>v<=0))throw Error("Geometric mean requires positive values.");return n4Format(Math.exp(x.reduce((a,v)=>a+Math.log(v),0)/x.length));}
case "harmonic-mean-calculator":{const x=n4Values(s);if(x.some(v=>v<=0))throw Error("Harmonic mean requires positive values.");return n4Format(x.length/x.reduce((a,v)=>a+1/v,0));}
case "data-range-calculator":{const x=n4Values(s),min=Math.min(...x),max=Math.max(...x);return "Min: "+n4Format(min)+"\nMax: "+n4Format(max)+"\nRange: "+n4Format(max-min);}
case "iqr-outlier-detector":{const sorted=n4Values(s,4).sort((a,b)=>a-b),half=Math.floor(sorted.length/2);const q1=n4Median(sorted.slice(0,half)),q3=n4Median(sorted.slice(sorted.length%2?half+1:half));const iqr=q3-q1,lo=q1-1.5*iqr,hi=q3+1.5*iqr;const out=sorted.filter(x=>x<lo||x>hi);return "Q1: "+n4Format(q1)+"\nQ3: "+n4Format(q3)+"\nIQR: "+n4Format(iqr)+"\nLower fence: "+n4Format(lo)+"\nUpper fence: "+n4Format(hi)+"\nOutliers ("+out.length+"): "+(out.map(n4Format).join(", ")||"none");}
case "pearson-correlation-calculator":case "covariance-calculator":case "linear-regression-calculator":{const pairs=n4Pairs(s),n=pairs.length,mx=pairs.reduce((a,p)=>a+p[0],0)/n,my=pairs.reduce((a,p)=>a+p[1],0)/n;let sxx=0,syy=0,sxy=0;for(const [a,b]of pairs){sxx+=(a-mx)**2;syy+=(b-my)**2;sxy+=(a-mx)*(b-my);}if(slug==="covariance-calculator")return "Population covariance: "+n4Format(sxy/n)+"\nSample covariance: "+n4Format(sxy/(n-1));if(sxx<=0||syy<=0){if(slug==="pearson-correlation-calculator")throw Error("Both variables must vary for Pearson correlation.");if(sxx<=0)throw Error("X values must vary for regression.");}if(slug==="pearson-correlation-calculator")return "Pearson r: "+n4Format(sxy/Math.sqrt(sxx*syy));const slope=sxy/sxx,intercept=my-slope*mx,r2=syy>0?(sxy*sxy/(sxx*syy)):1;return "Slope: "+n4Format(slope)+"\nIntercept: "+n4Format(intercept)+"\nEquation: y = "+n4Format(intercept)+" + "+n4Format(slope)+"x\nR²: "+n4Format(r2);}
case "mean-absolute-deviation-calculator":{const vals=n4Values(s),mu=vals.reduce((a,b)=>a+b,0)/vals.length;return "Mean absolute deviation: "+n4Format(vals.reduce((a,x)=>a+Math.abs(x-mu),0)/vals.length);}
case "root-mean-square-calculator":{const vals=n4Values(s);return "RMS: "+n4Format(Math.sqrt(vals.reduce((a,x)=>a+x*x,0)/vals.length));}
case "number-sign-distribution-calculator":{const vals=n4Values(s);return "Positive: "+vals.filter(x=>x>0).length+"\nNegative: "+vals.filter(x=>x<0).length+"\nZero: "+vals.filter(x=>x===0).length+"\nTotal: "+vals.length;}
default:return null;}}
