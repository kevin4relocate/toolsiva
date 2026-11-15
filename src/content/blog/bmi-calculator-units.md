---
title: "BMI Calculator: Convert Height and Weight into the Right Units"
description: "Calculate BMI using kilograms and centimetres, see a 70 kg and 170 cm example, and understand the limits of BMI screening."
slug: "bmi-calculator-units"
publishedDate: 2026-11-26
updatedDate: 2026-11-26
author: "Toolsiva Editorial"
primaryTool: "BMI Calculator"
primaryToolPath: "/tools/calculator/bmi-calculator/"
relatedTools: []
excerpt: "Calculate BMI using kilograms and centimetres, see a 70 kg and 170 cm example, and understand the limits of BMI screening."
featuredImage: "/blog/illustrations/bmi-calculator-units.svg"
imageAlt: "Visual walkthrough for bmi calculator: convert height and weight into the right units: 70 kg, 1.70 m, then BMI ≈ 24.2."
imageCaption: "BMI is a screening measure based on weight and height, not a diagnosis."
draft: true
aiAssisted: true
curatedSeries: true
---

Body mass index (BMI) is a ratio derived from weight and height. It is commonly used as one screening measure, but it does not directly measure body fat, fitness or medical risk for an individual.

Use the [BMI Calculator](/tools/calculator/bmi-calculator/) when you have a weight in kilograms and height in centimetres.

## Work through the units first

Suppose weight is **70 kg** and height is **170 cm**. Convert the height to metres: 170 cm becomes 1.70 m. Square the height in metres, giving 2.89. Divide 70 by 2.89:

**BMI = 70 / (1.70 × 1.70) ≈ 24.2**.

The order of operations matters. Dividing weight by height without squaring it produces a different quantity. Entering 1.70 into a field expecting centimetres also produces a wildly wrong result.

## How to check your entry

Read the labels before typing. The Toolsiva workspace asks for weight in kilograms and height in centimetres. If you measured your height in metres, multiply by 100 before entering it.

The calculator rejects zero or negative measurements. A value such as 0 cm has no meaningful BMI because height appears in the denominator.

## Interpret the number cautiously

Standard adult BMI category labels are useful for population-level screening and some routine discussions. They do not identify muscle mass, pregnancy-related changes, age-specific growth patterns or where body fat is distributed.

BMI interpretation may differ for children, adolescents and particular clinical populations. Do not use a web calculator alone to diagnose a condition, change medication or decide a treatment. Consult a qualified health professional for individual assessment.

## Watch for changing measurements

For trend tracking, use the same units and comparable measurement conditions each time. Differences in clothing, scales or measurement technique can affect small changes.

If you need a unit conversion first, use the [Length Converter](/tools/converter/length-converter/) or [Weight Converter](/tools/converter/weight-converter/). Check the destination unit before copying the value.

The calculation itself is simple; the important parts are correct units and responsible interpretation.

## Reproduce the calculation without mixing units

The safest way to check a BMI result is to write down the units beside every input. The [BMI Calculator](/tools/calculator/bmi-calculator/) accepts **Weight (kg)** and **Height (cm)**, not pounds and feet. The conversion from centimeters to meters happens inside the calculation.

| Weight | Height | Formula | Approximate BMI |
| --- | --- | --- | ---: |
| 70 kg | 170 cm | 70 ÷ 1.70² | **24.2** |
| 70 kg | 175 cm | 70 ÷ 1.75² | **22.9** |
| 70 kg | 180 cm | 70 ÷ 1.80² | **21.6** |

Notice that weight stays the same while the denominator changes: height is **squared**, so small input differences can affect the calculated value. Use actual measurements rather than guessing a height from memory when you need a consistent comparison.

If your measurements are imperial, convert them first. For example, **5 feet 7 inches = 67 inches ≈ 170.18 cm** and **154 pounds ≈ 69.85 kg**. These are approximate conversions, not an instruction to round the original measurements before entering them. You can check equivalent units with the [Length Converter](/tools/converter/length-converter/) and [Weight Converter](/tools/converter/weight-converter/).

## What the result label represents

The current tool uses commonly applied **adult BMI screening bands**:

| BMI value | Tool's adult label |
| --- | --- |
| Below 18.5 | Underweight |
| 18.5 to below 25 | Healthy range |
| 25 to below 30 | Overweight |
| 30 or higher | Obesity range |

These are broad statistical categories. A label does **not** measure muscle mass, nutritional adequacy, athletic performance, pregnancy-related changes or individual disease risk. For children and teens, age- and sex-specific growth references are used instead of applying the adult bands directly.

If a value appears close to a category cutoff, remember that weight, height and the displayed BMI can all involve rounding. A one-decimal display is useful for convenience, not a precise statement about someone's health.

## Troubleshooting unexpected values

**The result is unusually high.** Check that height was entered in **centimeters**. Typing `1.70` when you meant `170` makes the tool treat the number as 1.70 cm, not 1.70 m.

**The result is invalid.** Both measurements must be greater than zero. Blank, zero or negative inputs cannot produce a meaningful value.

**The value changed slightly from a previous check.** Confirm the same measurement units and similar measurement conditions. Scales, clothing and measuring technique can create differences that have nothing to do with a sudden health change.

## When to ask for individual assessment

BMI is one possible conversation starter with a qualified healthcare professional, alongside medical history, physical examination and any other measurements that may be appropriate. It is **not** a diagnosis or a target that everyone should attempt to reach. Do not change treatment, medication, eating patterns or an exercise plan solely because an online calculator places a number in one category.

The useful workflow is to calculate correctly, state the units and limitations, and avoid presenting the screening label as a medical conclusion.
