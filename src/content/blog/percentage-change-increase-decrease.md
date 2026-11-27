---
title: "Percentage Change: Calculate Increases and Decreases Correctly"
description: "Measure relative growth and decline using the original value, with 100-to-125 and reverse-change examples."
slug: "percentage-change-increase-decrease"
publishedDate: 2026-11-27
updatedDate: 2026-11-27
author: "Toolsiva Editorial"
primaryTool: "Percentage Change Calculator"
primaryToolPath: "/tools/calculator/percentage-change-calculator/"
relatedTools: []
excerpt: "Measure relative growth and decline using the original value, with 100-to-125 and reverse-change examples."
featuredImage: "/blog/illustrations/percentage-change-increase-decrease.svg"
imageAlt: "Visual walkthrough for percentage change: calculate increases and decreases correctly: Original: 100, New: 125, then +25%."
imageCaption: "A percentage change uses the original value as its reference."
draft: false
aiAssisted: true
curatedSeries: true
---

A percentage change describes how far a new value moved relative to the original. It answers a different question from “What percentage of a number is this?” because the starting amount is part of the definition.

Use the [Percentage Change Calculator](/tools/calculator/percentage-change-calculator/) with an **original value** and a **new value**.

## A simple increase

Imagine a price changes from **100 to 125**. The difference is 25. Divide by the original 100 and multiply by 100: **+25%**. This tells you that the change represents one quarter of the original amount.

Now reverse the values. Going from 125 back to 100 is a decrease of 25 relative to 125, which equals **−20%**. A 25% rise followed by a 20% fall returns you to the same amount; equal absolute changes do not imply equal percentages.

## Why the reference value matters

If the starting value is small, the same absolute difference can represent a large percentage. Moving from 2 to 4 is an increase of 2 units but a **100% increase**. Moving from 200 to 202 changes by the same two units but only **1%**.

That is why comparing percentage changes across products or time periods should include the original amounts, not just the percentages.

## Using the calculator

1. Type the original figure in the first field.
2. Enter the new figure in the second.
3. Read the signed percentage and the increase/decrease label.
4. Recalculate with the values reversed if you want to understand the reverse movement.

Do not silently use zero as a starting amount: percentage change from zero is undefined in this formula. The calculator rejects that case.

## Negative starting values need context

The tool uses the absolute magnitude of the original value as the reference when calculating a signed change. That can be useful for some datasets but may not match conventions in financial reporting or certain scientific applications. State the formula when negative numbers are possible.

If you simply need 15% of an amount, use the [Percentage Calculator](/tools/calculator/percentage-calculator/).

The most useful reporting style combines the original, new value, absolute difference and percentage change so nobody has to guess what the percentage measures.

## Write down all four numbers in a report

A percentage change makes more sense when a reader can see the original value, the new value and the difference in ordinary units. The [Percentage Change Calculator](/tools/calculator/percentage-change-calculator/) implements:

`Percentage change = (new − original) ÷ |original| × 100`

For positive starting values, this is the familiar comparison relative to the original amount.

| Original | New | Absolute difference | Percentage change |
| ---: | ---: | ---: | ---: |
| 100 | 125 | +25 | **+25%** |
| 125 | 100 | −25 | **−20%** |
| 80 | 100 | +20 | **+25%** |
| 200 | 202 | +2 | **+1%** |

Compare the first two rows. Both have a difference of 25 units, but the base amount changes, which changes the percentage. That is why a 25% increase followed by a 25% decrease does **not** usually return to the starting value. If 100 rises 25% to 125, falling 25% from 125 produces **93.75**, not 100.

## Distinguish percentage change from percentage points

Suppose a conversion rate changes from **4% to 5%**. The difference is **1 percentage point**, but the relative percentage increase is:

`(5 − 4) ÷ 4 × 100 = 25%`

Both statements can be correct, but they describe different measurements. If you write "conversion improved by 1%," readers may not know whether you mean a one-percentage-point change or a 1% relative increase. State the starting and ending rates so the meaning is unambiguous.

For a separate question such as "What is 15% of 80?" use the [Percentage Calculator](/tools/calculator/percentage-calculator/) rather than a change calculator.

## The special case of a negative original value

This specific Toolsiva implementation divides by the **absolute value** of the original. For example:

`Original = −50; New = −30; Difference = +20`

`20 ÷ |−50| × 100 = +40%`

That numerical result says the value moved upward by 20 units relative to a 50-unit baseline magnitude. It does **not** automatically mean that a business's losses, debt or risk "grew 40%" in the ordinary sense. Reporting conventions can differ for signed values, so include the equation or prefer the absolute difference when the sign may confuse the audience.

If the original is **zero**, the ratio is undefined; the tool rejects it. Do not replace that undefined result with "100%" or "infinite growth" without a domain-specific definition.

## Common checks before presenting a trend

1. Confirm that the two values use the same currency, measurement unit and population.
2. Verify that the dates or time periods are comparable.
3. If the original is negative, explain which formula you used.
4. Keep absolute differences alongside percentages when small baselines produce dramatic rates.
5. Don't confuse a percentage change with a prediction of what happens next.

A formula can compute a number accurately while the interpretation is still misleading. Good reporting shows the reference point, not just the percent sign.
