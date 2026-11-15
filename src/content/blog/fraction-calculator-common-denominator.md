---
title: "Add Fractions with Unlike Denominators Step by Step"
description: "Add fractions with unlike denominators using 1/2 plus 1/3, and understand why dividing by zero is invalid."
slug: "fraction-calculator-common-denominator"
publishedDate: 2026-12-01
updatedDate: 2026-12-01
author: "Toolsiva Editorial"
primaryTool: "Fraction Calculator"
primaryToolPath: "/tools/calculator/fraction-calculator/"
relatedTools: []
excerpt: "Add fractions with unlike denominators using 1/2 plus 1/3, and understand why dividing by zero is invalid."
featuredImage: "/blog/illustrations/fraction-calculator-common-denominator.svg"
imageAlt: "Visual walkthrough for add fractions with unlike denominators step by step: 1/2 + 1/3, Common sixths, then 5/6."
imageCaption: "Equivalent denominators show why one half plus one third equals five sixths."
draft: true
aiAssisted: true
curatedSeries: true
---

Fractions represent parts of a whole, but adding the numerators and denominators directly is not the correct way to add fractions. You first need a common denominator or an equivalent cross-multiplication formula.

Use the [Fraction Calculator](/tools/calculator/fraction-calculator/) to check addition, subtraction, multiplication and division.

## Why 1/2 + 1/3 equals 5/6

One half is the same as three sixths: 1/2 = 3/6. One third is the same as two sixths: 1/3 = 2/6. Add the numerators when the denominators now match:

**3/6 + 2/6 = 5/6**.

You can verify the decimal approximation: 0.5 + about 0.333333 equals about 0.833333.

The incorrect expression 2/5 comes from adding the original numerators and denominators separately. That operation does not preserve the quantities represented.

## Multiplying fractions uses a different rule

For multiplication, multiply numerators together and denominators together. For example, one half multiplied by one third becomes one sixth. For division, multiply by the reciprocal of the second fraction, provided that fraction is not zero.

These are distinct operations, so choose the operator carefully in the workspace.

## Input requirements

Enter whole-number numerators and nonzero whole-number denominators. The tested calculator rejects fractional entries in its exact fraction fields, because an expression such as 1.5/2 requires a different representation.

A denominator of zero is undefined. Dividing by a fraction whose numerator is zero also causes division by zero; that operation has no finite result.

## Simplify after calculation

A fraction such as 4/8 can be reduced to 1/2 by dividing the numerator and denominator by their greatest common divisor. The [GCD/LCM Calculator](/tools/calculator/gcd-lcm-calculator/) helps explore that idea.

The calculator displays a simplified fraction and a decimal approximation. Use the exact fraction when precision matters; rounding a repeating decimal may lose information.

## A quick reasonableness check

Adding two positive fractions less than one should give a positive result. Comparing rough decimal values helps catch mistaken operators or inverted inputs before the output goes into a report or worksheet.

## Two ways to find a common denominator

For **1/2 + 1/3**, the denominators 2 and 3 have a least common multiple of 6, so sixths make the calculation intuitive:

\`1/2 = 3/6\`

\`1/3 = 2/6\`

\`3/6 + 2/6 = 5/6\`

For other pairs, you can use the general formula instead:

\`a/b + c/d = (a×d + c×b) / (b×d)\`

Take **3/4 + 2/5**:

\`(3×5 + 2×4) / (4×5) = 23/20\`

That is an **improper fraction**, greater than one. It can also be expressed as the mixed number **1 3/20** or decimal **1.15**. Toolsiva displays the simplified fractional form, so expect \`23/20\`, not a mixed-number display.

## Enter the operation in Toolsiva

The [Fraction Calculator](/tools/calculator/fraction-calculator/) provides fields for **Numerator 1**, **Denominator 1**, an **Operation** selector, **Numerator 2** and **Denominator 2**.

| Input | Enter for 1/2 + 1/3 |
| --- | --- |
| Numerator 1 | 1 |
| Denominator 1 | 2 |
| Operation | + |
| Numerator 2 | 1 |
| Denominator 2 | 3 |
| Result | **5/6** |

Use the operation selector to compare adding, subtracting, multiplying and dividing. These operations follow different rules; for example, \`1/2 × 1/3 = 1/6\`, while \`1/2 ÷ 1/3 = 3/2\`.

The tool simplifies the result by dividing the numerator and denominator by their greatest common divisor. If the calculated denominator is negative, it normalizes the sign so the denominator is positive.

## Division by zero and exact integer limits

A denominator of **zero** makes an input fraction undefined. Division by a fraction equal to zero is also undefined. For example, dividing \`1/2\` by \`0/3\` fails because the second fraction represents zero.

The calculator uses **whole-number numerators and denominators**. Typing \`1.5\` as a numerator is not the same as entering an exact fraction with an integer numerator; the tool rejects it. Convert the decimal into an integer fraction first if exact arithmetic is your goal.

Behind the scenes, the calculator uses JavaScript's safe-integer limits for exact products and sums. Extremely large values may be rejected rather than silently producing a precise-looking but unreliable fraction.

## Check the answer using a rough estimate

Before copying a result, compare its magnitude with the inputs:

- \`1/2 + 1/3\` should be between **1/2** and **1**, since both terms are positive and their sum is less than one.
- \`3/4 + 2/5\` should exceed **1**, because 0.75 + 0.40 = 1.15.
- Multiplying two positive fractions less than one usually produces a smaller positive result than either input.

These checks do not replace exact arithmetic but catch operator mistakes and reversed fractions. If you need to inspect common denominators directly, the [GCD/LCM Calculator](/tools/calculator/gcd-lcm-calculator/) can help show why different fractions can be expressed in the same-sized parts.

When accuracy matters, keep the exact simplified fraction for as long as possible and round only a final decimal representation.
