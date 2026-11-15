---
title: "Base64 Encoding Is Not Encryption: A Practical Example"
description: "See why encoding Hi as SGk= is reversible and should never be mistaken for encryption or secure storage."
slug: "base64-encode-vs-encryption"
publishedDate: 2026-12-09
updatedDate: 2026-12-09
author: "Toolsiva Editorial"
primaryTool: "Base64 Encode"
primaryToolPath: "/tools/developer/base64-encode/"
relatedTools: []
excerpt: "See why encoding Hi as SGk= is reversible and should never be mistaken for encryption or secure storage."
featuredImage: "/blog/illustrations/base64-encode-vs-encryption.svg"
imageAlt: "Visual walkthrough for base64 encoding is not encryption: a practical example: Plain text: Hi, Encode bytes, then SGk=."
imageCaption: "Base64 is a reversible text representation; it does not keep secrets confidential."
draft: true
aiAssisted: true
curatedSeries: true
---

Base64 is a way to represent binary data with a restricted set of printable characters. Developers encounter it in API payloads, embedded data and some authentication formats. It is an encoding, not a method for keeping information secret.

Use the [Base64 Encode](/tools/developer/base64-encode/) tool to inspect the representation of ordinary text.

## A tiny example: Hi

The two ASCII characters H and i correspond to the bytes 0x48 and 0x69. Encoding those bytes as Base64 produces:

    SGk=

The equal sign is padding in this representation. Decode the string and you get the original two bytes again. Nothing about this process requires a secret password.

That reversibility is precisely why Base64 must not be described as encryption.

## When encoding helps

Some systems need to carry bytes through text-oriented channels. Base64 can provide a convenient representation that avoids many problematic raw byte values.

The trade-off is size: encoded data typically uses more characters than the original bytes. It is not a compression scheme.

## Text encoding happens first

Characters outside basic ASCII may occupy several bytes in UTF-8. Before comparing Base64 results between tools, establish which text-to-byte encoding was used. The same visible text can produce different byte sequences under different encodings.

A helpful test is to encode a short string, decode it with the [Base64 Decode](/tools/developer/base64-decode/) tool and compare the result with the original.

## Why security claims matter

Putting a password, API key or personal record into Base64 does not hide it. Anyone with the string can decode it using standard tools. For confidential data, use appropriate encryption with key management, not a reversible display encoding.

Some application protocols combine Base64 with other mechanisms, but security comes from those mechanisms, not from Base64 itself.

## Before using the output

Check whether the receiving system expects standard Base64, URL-safe Base64 or some other variant. Characters and padding conventions can differ.

Encoding correctly is valuable for compatibility. Treat the encoded content with the same sensitivity as the original input.

## Follow the bytes in a tiny example

The [Base64 Encode](/tools/developer/base64-encode/) tool turns a text string into **UTF-8 bytes**, then encodes those bytes in standard Base64. For the text `Hi`:

| Stage | Data |
| --- | --- |
| Original text | `Hi` |
| UTF-8 byte values | `48 69` in hexadecimal |
| Standard Base64 | `SGk=` |
| Decoded text | `Hi` |

Base64 divides a stream of bytes into groups that can be represented using a **64-character alphabet**. Padding marks such as `=` can be added when the byte length does not neatly fill a group.

There is no encryption key in that procedure. Anyone who has `SGk=` can decode it into `Hi`, and the same applies to encoded secrets.

## Test a non-ASCII word

UTF-8 represents many non-ASCII characters with more than one byte. For example, the character `é` has UTF-8 bytes `C3 A9`, so its standard Base64 representation is `w6k=`.

Enter `é` into Base64 Encode and check the result with [Base64 Decode](/tools/developer/base64-decode/). The decoder uses a strict UTF-8 interpretation for the resulting bytes. That means an arbitrary Base64 string representing **non-UTF-8 binary bytes** may fail to decode as text even though its Base64 syntax is valid.

For arbitrary binary files, use a byte-oriented conversion workflow instead of assuming a text input field can preserve every possible byte sequence.

## Size and alphabet differences

Base64 is usually **larger** than the original binary data: three input bytes are commonly represented by four characters. For long inputs, the expansion approaches roughly **one third** before transport-specific line wrapping or headers.

Standard Base64 uses symbols including `+` and `/`, while **Base64URL** substitutes `-` and `_` to avoid certain URL difficulties. Padding conventions can differ. A JWT uses Base64URL-formatted segments; those are not exactly the same alphabet and padding arrangement as every conventional Base64 string.

Do not automatically treat Base64, Base64URL and percent encoding as interchangeable formats. Each serves a different transport convention.

## Encoding, hashing and encryption answer different questions

- **Encoding:** changes representation so systems can store or transfer data; ordinary Base64 is trivially reversible.
- **Hashing:** computes a digest, often for checking integrity; it is not a way to recover plaintext.
- **Encryption:** protects confidentiality when paired with an appropriate algorithm and secret or public/private key system.

A password or API key does not become secure merely because it is Base64-encoded. Treat encoded sensitive content with the **same access controls** as the original.

## Check the receiving format

Before copying an encoded string into an API payload or configuration file, check whether the destination expects UTF-8 text, raw bytes, standard Base64, Base64URL, padding or a specific media type. A successful decode in the browser is useful, but protocol compatibility depends on matching the receiving system's rules.

The goal of Base64 is reliable representation—not confidentiality, compression or authentication.
