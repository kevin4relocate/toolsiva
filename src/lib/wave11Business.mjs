import {w11Parse,w11Format,w11Result} from "./wave11Core.mjs";
export function w11Business(slug,input){switch(slug){
 case "cost-of-goods-sold-inventory-flow": {
    const a=w11Parse(input,3,"Cost of Goods Sold from Inventory Flow");
    if(!(a.every(x=>x>=0)&&a[2]<=a[0]+a[1]))throw Error("Cost of Goods Sold from Inventory Flow input out of domain. Expected opening inventory | purchases | closing inventory");
    const value=a[0]+a[1]-a[2];
    return w11Result("Cost of Goods Sold from Inventory Flow",value,"currency units");
  }
 case "inventory-days-on-hand-from-value": {
    const a=w11Parse(input,3,"Inventory Days on Hand from Value");
    if(!(a[0]>=0&&a[1]>0&&Number.isSafeInteger(a[2])&&a[2]>0))throw Error("Inventory Days on Hand from Value input out of domain. Expected average inventory value | period COGS | days in period");
    const value=a[0]/a[1]*a[2];
    return w11Result("Inventory Days on Hand from Value",value,"days");
  }
 case "receivables-turnover-calculator": {
    const a=w11Parse(input,2,"Accounts Receivable Turnover");
    if(!(a[0]>=0&&a[1]>0))throw Error("Accounts Receivable Turnover input out of domain. Expected net credit sales | average accounts receivable");
    const value=a[0]/a[1];
    return w11Result("Accounts Receivable Turnover",value,"times per period");
  }
 case "payables-days-outstanding": {
    const a=w11Parse(input,3,"Days Payable Outstanding");
    if(!(a[0]>=0&&a[1]>0&&Number.isSafeInteger(a[2])&&a[2]>0))throw Error("Days Payable Outstanding input out of domain. Expected average accounts payable | period COGS | days in period");
    const value=a[0]/a[1]*a[2];
    return w11Result("Days Payable Outstanding",value,"days");
  }
 case "return-on-capital-employed": {
    const a=w11Parse(input,3,"Return on Capital Employed");
    if(!(a[1]>a[2]&&a[2]>=0))throw Error("Return on Capital Employed input out of domain. Expected EBIT | total assets | current liabilities");
    const value=100*a[0]/(a[1]-a[2]);
    return w11Result("Return on Capital Employed",value,"percent");
  }
 case "debt-to-equity-calculator": {
    const a=w11Parse(input,2,"Debt to Equity Ratio");
    if(!(a[0]>=0&&a[1]>0))throw Error("Debt to Equity Ratio input out of domain. Expected total debt | shareholders equity");
    const value=a[0]/a[1];
    return w11Result("Debt to Equity Ratio",value,"ratio");
  }
 case "current-liquidity-ratio": {
    const a=w11Parse(input,2,"Current Liquidity Ratio");
    if(!(a[0]>=0&&a[1]>0))throw Error("Current Liquidity Ratio input out of domain. Expected current assets | current liabilities");
    const value=a[0]/a[1];
    return w11Result("Current Liquidity Ratio",value,"ratio");
  }
 case "quick-liquidity-ratio": {
    const a=w11Parse(input,4,"Quick Liquidity Ratio");
    if(!(a[0]>=a[1]+a[2]&&a[1]>=0&&a[2]>=0&&a[3]>0))throw Error("Quick Liquidity Ratio input out of domain. Expected current assets | inventory | prepaid | current liabilities");
    const value=(a[0]-a[1]-a[2])/a[3];
    return w11Result("Quick Liquidity Ratio",value,"ratio");
  }
 case "cash-liquidity-ratio": {
    const a=w11Parse(input,3,"Cash Liquidity Ratio");
    if(!(a[0]>=0&&a[1]>=0&&a[2]>0))throw Error("Cash Liquidity Ratio input out of domain. Expected cash | cash equivalents | current liabilities");
    const value=(a[0]+a[1])/a[2];
    return w11Result("Cash Liquidity Ratio",value,"ratio");
  }
 case "interest-coverage-ratio": {
    const a=w11Parse(input,2,"EBIT Interest Coverage Ratio");
    if(!(a[1]>0))throw Error("EBIT Interest Coverage Ratio input out of domain. Expected EBIT | interest expense");
    const value=a[0]/a[1];
    return w11Result("EBIT Interest Coverage Ratio",value,"times");
  }
 case "operating-cashflow-margin": {
    const a=w11Parse(input,2,"Operating Cash Flow Margin");
    if(!(a[1]>0))throw Error("Operating Cash Flow Margin input out of domain. Expected operating cash flow | revenue");
    const value=100*a[0]/a[1];
    return w11Result("Operating Cash Flow Margin",value,"percent");
  }
 case "warranty-claim-incidence": {
    const a=w11Parse(input,2,"Warranty Claim Rate");
    if(!(a[0]>=0&&a[1]>0&&a[0]<=a[1]))throw Error("Warranty Claim Rate input out of domain. Expected eligible units with claims | eligible units sold");
    const value=100*a[0]/a[1];
    return w11Result("Warranty Claim Rate",value,"percent");
  }
 case "service-order-fill-rate": {
    const a=w11Parse(input,2,"Service Order Fill Rate");
    if(!(a[0]>=0&&a[1]>0&&a[0]<=a[1]))throw Error("Service Order Fill Rate input out of domain. Expected orders fulfilled in full | total orders");
    const value=100*a[0]/a[1];
    return w11Result("Service Order Fill Rate",value,"percent");
  }
 case "hotel-room-occupancy-percentage": {
    const a=w11Parse(input,2,"Hotel Room Occupancy Rate");
    if(!(a[0]>=0&&a[1]>0&&a[0]<=a[1]))throw Error("Hotel Room Occupancy Rate input out of domain. Expected rooms sold | room nights available");
    const value=100*a[0]/a[1];
    return w11Result("Hotel Room Occupancy Rate",value,"percent");
  }
 case "restaurant-food-cost-percentage": {
    const a=w11Parse(input,2,"Restaurant Food Cost Percentage");
    if(!(a[0]>=0&&a[1]>0))throw Error("Restaurant Food Cost Percentage input out of domain. Expected food ingredients cost | food sales revenue");
    const value=100*a[0]/a[1];
    return w11Result("Restaurant Food Cost Percentage",value,"percent");
  }
 case "labor-output-per-hour": {
    const a=w11Parse(input,2,"Labor Output per Person Hour");
    if(!(a[0]>=0&&a[1]>0))throw Error("Labor Output per Person Hour input out of domain. Expected good units produced | total person hours");
    const value=a[0]/a[1];
    return w11Result("Labor Output per Person Hour",value,"units per person hour");
  }
 case "net-working-capital-calculator": {
    const a=w11Parse(input,2,"Net Working Capital");
    if(!(a.every(x=>x>=0)))throw Error("Net Working Capital input out of domain. Expected current assets | current liabilities");
    const value=a[0]-a[1];
    return w11Result("Net Working Capital",value,"currency units");
  }
 case "inventory-shrinkage-percentage": {
    const a=w11Parse(input,2,"Inventory Shrinkage Percentage");
    if(!(a[0]>0&&a[1]>=0&&a[1]<=a[0]))throw Error("Inventory Shrinkage Percentage input out of domain. Expected book inventory units | physical inventory units");
    const value=100*(a[0]-a[1])/a[0];
    return w11Result("Inventory Shrinkage Percentage",value,"percent");
  }
 case "two-period-weighted-absolute-error": {
    const a=w11Parse(input,4,"Two Period Weighted Absolute Percentage Error");
    if(!(Math.abs(a[0])+Math.abs(a[2])>0))throw Error("Two Period Weighted Absolute Percentage Error input out of domain. Expected actual 1 | forecast 1 | actual 2 | forecast 2");
    const value=100*(Math.abs(a[0]-a[1])+Math.abs(a[2]-a[3]))/(Math.abs(a[0])+Math.abs(a[2]));
    return w11Result("Two Period Weighted Absolute Percentage Error",value,"percent");
  }
 case "kanban-replenishment-cards": {
    const a=w11Parse(input,4,"Kanban Replenishment Cards");
    if(!(a[0]>=0&&a[1]>=0&&a[2]>0&&a[3]>=0&&a[3]<=10))throw Error("Kanban Replenishment Cards input out of domain. Expected demand units/day | lead time days | units per card | fractional safety stock");
    const value=Math.ceil(Number((a[0]*a[1]*(1+a[3])/a[2]).toPrecision(13)));
    return w11Result("Kanban Replenishment Cards",value,"cards");
  }
 default:return null;
}}
