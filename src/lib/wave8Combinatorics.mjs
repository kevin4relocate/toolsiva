import { w7Input,w7Fmt } from "./wave7Common.mjs";

function w8CombInt(s,max=300){const n=Number(String(s??"").trim());if(!Number.isInteger(n)||n<0||n>max)throw Error("Use an integer 0–"+max+".");return n;}

function w8CombChoose(n,k){if(k<0||k>n)return 0n;k=Math.min(k,n-k);let v=1n;for(let i=1;i<=k;i++)v=v*BigInt(n-k+i)/BigInt(i);return v;}

function w8CombFactorial(n){let a=1n;for(let i=2;i<=n;i++)a*=BigInt(i);return a;}

export function w8Combinatorics(slug,input){const names=["catalan-number-calculator","stirling-second-kind-calculator","bell-number-calculator","derangement-count-calculator","integer-partition-count-calculator","pascal-triangle-row-generator","multinomial-coefficient-calculator","birthday-match-probability-calculator","coupon-collector-expected-draws-calculator","three-set-inclusion-exclusion-calculator"];if(!names.includes(slug))return null;const s=w7Input(input,20000).trim();switch(slug){
case "catalan-number-calculator":{const n=w8CombInt(s,150);return "Catalan C"+n+" = "+w8CombChoose(2*n,n)/BigInt(n+1);}
case "stirling-second-kind-calculator":{const p=s.split("|");if(p.length!==2)throw Error("Use n|k.");const n=w8CombInt(p[0],120),k=w8CombInt(p[1],120);let row=Array(k+1).fill(0n);row[0]=1n;for(let i=1;i<=n;i++){const next=Array(k+1).fill(0n);for(let j=1;j<=Math.min(i,k);j++)next[j]=BigInt(j)*row[j]+row[j-1];row=next;}return "Stirling S("+n+","+k+") = "+(row[k]||0n);}
case "bell-number-calculator":{const n=w8CombInt(s,120);let row=Array(n+1).fill(0n);row[0]=1n;for(let i=1;i<=n;i++){const next=Array(n+1).fill(0n);for(let j=1;j<=i;j++)next[j]=BigInt(j)*row[j]+row[j-1];row=next;}return "Bell B"+n+" = "+row.reduce((a,b)=>a+b,0n);}
case "derangement-count-calculator":{const n=w8CombInt(s,250);let a=1n,b=0n;if(n===0)return "Derangements !0 = 1";for(let i=2;i<=n;i++){const v=BigInt(i-1)*(b+a);a=b;b=v;}return "Derangements !"+n+" = "+b;}
case "integer-partition-count-calculator":{const n=w8CombInt(s,500),dp=Array(n+1).fill(0n);dp[0]=1n;for(let k=1;k<=n;k++)for(let j=k;j<=n;j++)dp[j]+=dp[j-k];return "Integer partitions p("+n+") = "+dp[n];}
case "pascal-triangle-row-generator":{const n=w8CombInt(s,250);return "Pascal row "+n+": "+Array.from({length:n+1},(_,i)=>w8CombChoose(n,i).toString()).join(", ");}
case "multinomial-coefficient-calculator":{const groups=s.split(",").map(x=>w8CombInt(x,250));if(groups.length<2||groups.length>100)throw Error("Enter 2–100 nonnegative group sizes.");const n=groups.reduce((a,b)=>a+b,0);if(n>300)throw Error("Sum of group sizes must not exceed 300.");let value=w8CombFactorial(n);for(const k of groups)value/=w8CombFactorial(k);return "Multinomial coefficient: "+value;}
case "birthday-match-probability-calculator":{const p=s.split("|");if(p.length!==2)throw Error("Use numberOfPeople|possibleBirthdays.");const people=w8CombInt(p[0],100000),days=w8CombInt(p[1],100000);if(days<1)throw Error("Possible birthdays must exceed zero.");let unique=1;if(people>days)unique=0;else for(let i=0;i<people;i++)unique*=1-i/days;return "At least one shared birthday: "+w7Fmt(100*(1-unique))+"%\nAssumes independently uniformly distributed birthdays.";}
case "coupon-collector-expected-draws-calculator":{const n=w8CombInt(s,1000000);if(n<1)throw Error("Coupon count must be >=1.");let harmonic=0;for(let i=1;i<=n;i++)harmonic+=1/i;return "Expected draws: "+w7Fmt(n*harmonic)+"\nAssumes all "+n+" coupons are equally likely and draws independent.";}
case "three-set-inclusion-exclusion-calculator":{const parts=s.split("|").map(x=>w8CombInt(x,1000000000));if(parts.length!==7)throw Error("Use A|B|C|AB|AC|BC|ABC intersection counts.");const [a,b,c,ab,ac,bc,abc]=parts;if(ab>Math.min(a,b)||ac>Math.min(a,c)||bc>Math.min(b,c)||abc>Math.min(ab,ac,bc))throw Error("Intersections must not exceed their component sets.");const union=a+b+c-ab-ac-bc+abc;if(union<Math.max(a,b,c))throw Error("Inconsistent intersection counts.");return "Three-set union size: "+union+"\nFormula: A+B+C−AB−AC−BC+ABC.";}
default:return null;}}
