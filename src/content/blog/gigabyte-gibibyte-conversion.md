---
title: "GB vs GiB: Understand Decimal and Binary Storage Units"
description: "Understand the difference between GB and GiB, with a 1 GiB example and advice for comparing storage labels."
slug: "gigabyte-gibibyte-conversion"
publishedDate: 2026-12-15
updatedDate: 2026-12-15
author: "Toolsiva Editorial"
primaryTool: "Data Storage Converter"
primaryToolPath: "/tools/converter/data-storage-converter/"
relatedTools: []
excerpt: "Understand the difference between GB and GiB, with a 1 GiB example and advice for comparing storage labels."
featuredImage: "/blog/illustrations/gigabyte-gibibyte-conversion.svg"
imageAlt: "Visual walkthrough for gb vs gib: understand decimal and binary storage units: 1 GiB, 1,073,741,824 B, then ≈ 1,073.74 MB."
imageCaption: "Decimal GB and binary GiB use different base multipliers."
draft: true
aiAssisted: true
curatedSeries: true
---

Storage capacity labels often use similar-looking units that represent different numbers of bytes. The difference between a gigabyte and a gibibyte is not a rounding error; they are based on different multipliers.

Use the [Data Storage Converter](/tools/converter/data-storage-converter/) to compare decimal and binary storage units.

## Decimal versus binary units

A **gigabyte (GB)** commonly means 1,000,000,000 bytes in the decimal SI convention. A **gibibyte (GiB)** means 1,073,741,824 bytes, or 1024 cubed bytes.

Therefore, **1 GiB ≈ 1.073741824 GB**. When expressed in decimal megabytes, one gibibyte is about **1,073.74 MB**.

The values are close enough to confuse people but different enough to matter for large disks and memory measurements.

## Why labels look inconsistent

A storage device might be advertised using decimal gigabytes, while an operating system or utility may display a binary-derived quantity under a label that looks similar. Before concluding that capacity has disappeared, inspect which unit convention each display uses.

File systems, partitions, formatting overhead and reserved space may also affect the amount available for user files. Unit conversion alone does not explain every difference between advertised and usable storage.

## Compare values correctly

1. Find the original unit label, such as GB or GiB.
2. Enter the numeric capacity in the converter.
3. Select the matching source unit.
4. Select the desired target unit.
5. Confirm the output and keep the unit label beside the number.

Do not compare a number expressed in MB directly with one in MiB without conversion.

## Bits are not bytes

A lowercase b often stands for bits, while an uppercase B stands for bytes. Data-transfer rates are commonly written in bits per second, but storage capacities are usually expressed in bytes.

For transfer-rate comparisons, use the [Data Transfer Rate Converter](/tools/converter/data-transfer-rate-converter/) and keep the distinction explicit.

## A practical reporting habit

Write both the value and unit, such as “500 GB decimal capacity” or “about 465.7 GiB.” This avoids ambiguity and helps another person reproduce the calculation.

Consistent units are more useful than choosing whichever number looks larger.

## Make the byte counts explicit

The [Data Storage Converter](/tools/converter/data-storage-converter/) supports both decimal units (**B**, **KB**, **MB**, **GB**, **TB**) and binary units (**KiB**, **MiB**, **GiB**).

The underlying definitions are:

| Unit | Number of bytes | Base |
| --- | ---: | --- |
| 1 KB | 1,000 | Decimal, 10³ |
| 1 MB | 1,000,000 | Decimal, 10⁶ |
| 1 GB | 1,000,000,000 | Decimal, 10⁹ |
| 1 KiB | 1,024 | Binary, 2¹⁰ |
| 1 MiB | 1,048,576 | Binary, 2²⁰ |
| 1 GiB | 1,073,741,824 | Binary, 2³⁰ |

These units all describe **bytes**. They are not inherently measures of speed or throughput.

## Compare both directions

One gibibyte contains more bytes than one decimal gigabyte:

`1 GiB = 1,073,741,824 bytes = 1.073741824 GB`

In the reverse direction:

`1 GB = 1,000,000,000 bytes ≈ 0.931322575 GiB`

That is why a capacity advertised as **500 GB** corresponds to approximately **465.66 GiB** in a binary display, before taking account of file system overhead or reserved space.

| Starting value | Destination unit | Approximate result |
| --- | --- | ---: |
| 1 GiB | GB | **1.07374 GB** |
| 1 GiB | MB | **1,073.74 MB** |
| 1 GB | GiB | **0.93132 GiB** |
| 500 GB | GiB | **465.66 GiB** |

The converter works by changing the quantity into a common underlying number of bytes, then into the requested destination unit. It does not simply replace the unit label.

## How to reproduce the values

1. Open the [Data Storage Converter](/tools/converter/data-storage-converter/).
2. Enter **1** as the source value.
3. Select **GiB** as the source unit and **GB** as the destination.
4. Confirm that the result is about **1.07374**.
5. Swap the units and repeat for the reverse conversion.

Be attentive to **case**: `GB` means gigabytes, while lowercase `Gb` conventionally means gigabits. The converter lists storage capacity in bytes and larger byte units. A transfer speed such as **100 Mbps** is a different quantity entirely.

For a speed comparison, use the [Data Transfer Rate Converter](/tools/converter/data-transfer-rate-converter/). That tool includes values such as bits per second and bytes per second.

## Why two devices can display different capacity

Manufacturers, operating systems and third-party utilities may choose different labeling conventions. A displayed number can also change after partitions are created, a file system is formatted, a recovery partition is reserved or other files occupy the storage.

The GB-to-GiB conversion explains **one** common difference but does not explain all differences between advertised and available capacity. If you are investigating missing storage, examine the file system, partitions and actual free space separately.

The converter does not estimate compression ratios, file-system metadata or reserved blocks, and it cannot infer the real usable capacity of a particular drive.

## A useful notation habit

When communicating technical capacity, write the full label: **500 GB (decimal)** or **approximately 465.66 GiB (binary)**. If the audience is nontechnical, explicitly state the definition in bytes at least once.

The goal is to compare equivalent quantities—not to make a device seem larger or smaller by choosing a more flattering unit.
