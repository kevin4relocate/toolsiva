import {w11Parse,w11Format,w11Result} from "./wave11Core.mjs";
export function w11Statistics(slug,input){switch(slug){
 case "standard-error-of-mean": {
    const a=w11Parse(input,2,"Standard Error of Sample Mean");
    if(!(a[0]>=0&&Number.isSafeInteger(a[1])&&a[1]>=2))throw Error("Standard Error of Sample Mean input out of domain. Expected sample standard deviation | sample size");
    const value=a[0]/Math.sqrt(a[1]);
    return w11Result("Standard Error of Sample Mean",value,"data units");
  }
 case "normal-mean-confidence-bounds": {
    const a=w11Parse(input,4,"Normal Mean Confidence Bounds");
    if(!(a[1]>=0&&Number.isSafeInteger(a[2])&&a[2]>=2&&a[3]>0))throw Error("Normal Mean Confidence Bounds input out of domain. Expected sample mean | standard deviation | sample size | normal z critical value");
    const value=a[3]*a[1]/Math.sqrt(a[2]);
    return "Normal Mean Confidence Bounds:\\nLower: "+w11Format(a[0]-value)+"\\nUpper: "+w11Format(a[0]+value)+"\\nMargin of error: "+w11Format(value);
  }
 case "adjusted-r-squared-calculator": {
    const a=w11Parse(input,3,"Adjusted R Squared");
    if(!(a[0]>=0&&a[0]<=1&&Number.isSafeInteger(a[1])&&Number.isSafeInteger(a[2])&&a[2]>=1&&a[1]>a[2]+1))throw Error("Adjusted R Squared input out of domain. Expected ordinary R² | sample size | predictor count");
    const value=1-(1-a[0])*(a[1]-1)/(a[1]-a[2]-1);
    return w11Result("Adjusted R Squared",value,"ratio");
  }
 case "one-sample-t-statistic": {
    const a=w11Parse(input,4,"One Sample t Statistic");
    if(!(a[2]>0&&Number.isSafeInteger(a[3])&&a[3]>=2))throw Error("One Sample t Statistic input out of domain. Expected sample mean | null mean | sample sd | sample size");
    const value=(a[0]-a[1])/(a[2]/Math.sqrt(a[3]));
    return w11Result("One Sample t Statistic",value,"t statistic");
  }
 case "welch-two-sample-t-statistic": {
    const a=w11Parse(input,6,"Welch Two Sample t Statistic");
    if(!(a[2]>=0&&a[3]>=0&&(a[2]>0||a[3]>0)&&Number.isSafeInteger(a[4])&&Number.isSafeInteger(a[5])&&a[4]>=2&&a[5]>=2))throw Error("Welch Two Sample t Statistic input out of domain. Expected mean1 | mean2 | sd1 | sd2 | n1 | n2");
    const value=(a[0]-a[1])/Math.sqrt(a[2]**2/a[4]+a[3]**2/a[5]);
    return w11Result("Welch Two Sample t Statistic",value,"t statistic");
  }
 case "pooled-two-sample-variance": {
    const a=w11Parse(input,4,"Pooled Two Sample Variance");
    if(!(a[0]>=0&&a[1]>=0&&Number.isSafeInteger(a[2])&&Number.isSafeInteger(a[3])&&a[2]>=2&&a[3]>=2))throw Error("Pooled Two Sample Variance input out of domain. Expected sd1 | sd2 | n1 | n2");
    const value=((a[2]-1)*a[0]**2+(a[3]-1)*a[1]**2)/(a[2]+a[3]-2);
    return w11Result("Pooled Two Sample Variance",value,"data units squared");
  }
 case "beta-distribution-expectation": {
    const a=w11Parse(input,2,"Beta Distribution Expected Value");
    if(!(a.every(x=>x>0)))throw Error("Beta Distribution Expected Value input out of domain. Expected alpha shape | beta shape");
    const value=a[0]/(a[0]+a[1]);
    return w11Result("Beta Distribution Expected Value",value,"ratio");
  }
 case "beta-distribution-variance": {
    const a=w11Parse(input,2,"Beta Distribution Variance");
    if(!(a.every(x=>x>0)))throw Error("Beta Distribution Variance input out of domain. Expected alpha shape | beta shape");
    const value=a[0]*a[1]/((a[0]+a[1])**2*(a[0]+a[1]+1));
    return w11Result("Beta Distribution Variance",value,"variance");
  }
 case "gamma-distribution-expected-value": {
    const a=w11Parse(input,2,"Gamma Distribution Expected Value");
    if(!(a.every(x=>x>0)))throw Error("Gamma Distribution Expected Value input out of domain. Expected shape k | scale theta");
    const value=a[0]*a[1];
    return w11Result("Gamma Distribution Expected Value",value,"data units");
  }
 case "gamma-distribution-variance": {
    const a=w11Parse(input,2,"Gamma Distribution Variance");
    if(!(a.every(x=>x>0)))throw Error("Gamma Distribution Variance input out of domain. Expected shape k | scale theta");
    const value=a[0]*a[1]**2;
    return w11Result("Gamma Distribution Variance",value,"squared data units");
  }
 case "lognormal-distribution-median": {
    const a=w11Parse(input,2,"Lognormal Distribution Median");
    if(!(a[1]>=0))throw Error("Lognormal Distribution Median input out of domain. Expected log scale mean mu | log scale sd sigma");
    const value=Math.exp(a[0]);
    return w11Result("Lognormal Distribution Median",value,"data units");
  }
 case "lognormal-distribution-mean": {
    const a=w11Parse(input,2,"Lognormal Distribution Mean");
    if(!(a[1]>=0))throw Error("Lognormal Distribution Mean input out of domain. Expected log scale mean mu | log scale sd sigma");
    const value=Math.exp(a[0]+a[1]**2/2);
    return w11Result("Lognormal Distribution Mean",value,"data units");
  }
 case "lognormal-distribution-variance": {
    const a=w11Parse(input,2,"Lognormal Distribution Variance");
    if(!(a[1]>=0))throw Error("Lognormal Distribution Variance input out of domain. Expected log scale mean mu | log scale sd sigma");
    const value=(Math.exp(a[1]**2)-1)*Math.exp(2*a[0]+a[1]**2);
    return w11Result("Lognormal Distribution Variance",value,"squared data units");
  }
 case "continuous-uniform-distribution-mean": {
    const a=w11Parse(input,2,"Continuous Uniform Mean");
    if(!(a[1]>a[0]))throw Error("Continuous Uniform Mean input out of domain. Expected minimum bound | maximum bound");
    const value=(a[0]+a[1])/2;
    return w11Result("Continuous Uniform Mean",value,"data units");
  }
 case "continuous-uniform-distribution-variance": {
    const a=w11Parse(input,2,"Continuous Uniform Variance");
    if(!(a[1]>a[0]))throw Error("Continuous Uniform Variance input out of domain. Expected minimum bound | maximum bound");
    const value=(a[1]-a[0])**2/12;
    return w11Result("Continuous Uniform Variance",value,"squared data units");
  }
 case "triangular-distribution-mean": {
    const a=w11Parse(input,3,"Triangular Distribution Mean");
    if(!(a[0]<a[2]&&a[1]>=a[0]&&a[1]<=a[2]))throw Error("Triangular Distribution Mean input out of domain. Expected minimum a | mode c | maximum b");
    const value=(a[0]+a[1]+a[2])/3;
    return w11Result("Triangular Distribution Mean",value,"data units");
  }
 case "triangular-distribution-variance": {
    const a=w11Parse(input,3,"Triangular Distribution Variance");
    if(!(a[0]<a[2]&&a[1]>=a[0]&&a[1]<=a[2]))throw Error("Triangular Distribution Variance input out of domain. Expected minimum a | mode c | maximum b");
    const value=(a[0]**2+a[1]**2+a[2]**2-a[0]*a[1]-a[0]*a[2]-a[1]*a[2])/18;
    return w11Result("Triangular Distribution Variance",value,"squared data units");
  }
 case "geometric-distribution-expected-trials": {
    const a=w11Parse(input,1,"Geometric Distribution Expected Trials");
    if(!(a[0]>0&&a[0]<=1))throw Error("Geometric Distribution Expected Trials input out of domain. Expected success probability p");
    const value=1/a[0];
    return w11Result("Geometric Distribution Expected Trials",value,"trials");
  }
 case "geometric-distribution-trials-variance": {
    const a=w11Parse(input,1,"Geometric Distribution Trials Variance");
    if(!(a[0]>0&&a[0]<=1))throw Error("Geometric Distribution Trials Variance input out of domain. Expected success probability p");
    const value=(1-a[0])/a[0]**2;
    return w11Result("Geometric Distribution Trials Variance",value,"trials squared");
  }
 case "binomial-distribution-expected-successes": {
    const a=w11Parse(input,2,"Binomial Expected Successes");
    if(!(Number.isSafeInteger(a[0])&&a[0]>=0&&a[0]<=1000000000&&a[1]>=0&&a[1]<=1))throw Error("Binomial Expected Successes input out of domain. Expected number of independent trials n | success probability p");
    const value=a[0]*a[1];
    return w11Result("Binomial Expected Successes",value,"successes");
  }
 default:return null;
}}
