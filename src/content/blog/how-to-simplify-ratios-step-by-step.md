---
title: "How to Simplify Ratios Step by Step"
description: "Learn to simplify whole-number ratios using the greatest common divisor with clear worked examples and Toolsiva's ratio calculator."
slug: "how-to-simplify-ratios-step-by-step"
publishedDate: 2026-11-18
updatedDate: 2026-11-18
author: "Toolsiva Editorial"
primaryTool: "Ratio Calculator"
primaryToolPath: "/tools/calculator/ratio-calculator/"
relatedTools:
  - name: "Proportion Calculator"
    path: "/tools/calculator/proportion-calculator/"
  - name: "GCD and LCM Calculator"
    path: "/tools/calculator/gcd-lcm-calculator/"
keywords:
  - "simplify ratios"
  - "ratio calculator"
  - "greatest common divisor"
  - "12 18 ratio"
excerpt: "Learn why 12:18 reduces to 2:3, how the greatest common divisor works and when a ratio should not be simplified as a decimal."
draft: true
aiAssisted: true
reviewApproved: false
scheduledDate: 2026-11-18
heroImage: "/blog/simplify-ratios.svg"
heroImageAlt: "Educational ratio simplification showing twelve to eighteen divided by the greatest common divisor six to become two to three"
heroImageCaption: "Simplifying a ratio preserves the relationship: 12:18 becomes 2:3 after dividing both sides by 6."
heroImageWidth: 1200
heroImageHeight: 630
---

A ratio compares two quantities in a fixed order. If a design uses 12 red tiles and 18 blue tiles, the ratio of red to blue is **12:18**. The same relationship can be written **2:3**, which is easier to read and reuse.

Simplifying a ratio does **not** change the underlying proportion. It divides both numbers by the same common factor.

## What exactly does 12:18 mean?

The notation `12:18` means 12 units of the first quantity for every 18 units of the second. You could also write it as the fraction `12/18`, but the units and order matter: **12 red to 18 blue** is not the same as **18 red to 12 blue**.

To simplify, find the largest positive whole number that divides both values with no remainder—the **greatest common divisor**, or GCD.

The divisors of 12 include 1, 2, 3, 4, 6 and 12. The divisors of 18 include 1, 2, 3, 6, 9 and 18. The largest shared divisor is **6**.

Divide both terms:

`12 ÷ 6 = 2`  
`18 ÷ 6 = 3`

So `12:18 = 2:3`.

## Try it in the Toolsiva Ratio Calculator

Open the [Ratio Calculator](/tools/calculator/ratio-calculator/). Its **First value** and **Second value** fields accept whole-number values.

1. Enter `12` for the first value.
2. Enter `18` for the second value.
3. Read the simplified result: **2:3**.
4. Check the decimal comparison shown by the tool: `12 ÷ 18 ≈ 0.666667`.

The decimal is useful for comparing relative size, but **2:3** is usually the clearer way to communicate an exact ratio.

## Another example: scaling a recipe

Suppose a recipe combines 8 cups of one ingredient with 20 cups of another. The original ratio is **8:20**, and the GCD is 4. Dividing both values by 4 produces **2:5**.

If you keep that 2:5 ratio, you might use 4 cups of the first ingredient and 10 of the second. The amounts change; the relationship does not.

Ratios are commonly used for mixtures, inventory, classroom proportions and design spacing. Before scaling one, check that the quantities are measured in compatible units.

## Ratios, proportions and fractions are related but different

A **ratio** expresses a comparison: `2:5`.

A **proportion** states that two ratios are equal: `2/5 = 8/20`. To solve a missing fourth value in that kind of equation, use the [Proportion Calculator](/tools/calculator/proportion-calculator/).

A **fraction** often describes a part of a whole, while ratios may compare one part to another. For example, 2 red balls for every 3 blue balls is a red-to-blue ratio of 2:3, but red balls are 2/5 of the total 5 balls. That distinction prevents a common mistake.

## What inputs are valid?

The current Toolsiva ratio tool performs **exact integer simplification**. It rejects non-integer values rather than silently rounding them. If you start with decimal measurements such as 1.5 and 2.25, multiply both by a shared power of ten first: `1.5:2.25 → 150:225 → 2:3`.

A zero **second value** is not accepted because the associated decimal `a/b` would be undefined. A zero first value is possible, but think carefully about what that comparison means in your context.

Extremely large numbers can exceed JavaScript's exact integer range. For ordinary proportions, use manageable whole numbers and check that your original units are meaningful.

## A short verification checklist

- Did you keep the first and second quantities in their original order?
- Did you divide **both** by the same positive whole number?
- Are the simplified terms relatively prime—that is, is their GCD now 1?
- If you scaled the amounts, did you keep the same ratio?

The [GCD and LCM Calculator](/tools/calculator/gcd-lcm-calculator/) can help you inspect a shared divisor before reducing larger integer pairs. A correct simplified ratio is not just a smaller pair of numbers—it preserves the same comparison.
