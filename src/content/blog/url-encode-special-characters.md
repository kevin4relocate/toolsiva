---
title: "URL Encoding Explained with Spaces and Ampersands"
description: "Understand percent-encoding for URL query values, including spaces and ampersands, without accidentally encoding a whole URL."
slug: "url-encode-special-characters"
publishedDate: 2026-12-06
updatedDate: 2026-12-06
author: "Toolsiva Editorial"
primaryTool: "URL Encode"
primaryToolPath: "/tools/developer/url-encode/"
relatedTools: []
excerpt: "Understand percent-encoding for URL query values, including spaces and ampersands, without accidentally encoding a whole URL."
featuredImage: "/blog/illustrations/url-encode-special-characters.svg"
imageAlt: "Visual walkthrough for url encoding explained with spaces and ampersands: red shoes & bags, Encode component, then Safe query value."
imageCaption: "Encode values separately so special characters do not change URL structure."
draft: true
aiAssisted: true
curatedSeries: true
---

A URL uses characters such as question marks, ampersands and equals signs to organize its structure. The same characters can also appear inside a search term or product name. Percent-encoding distinguishes data from separators.

Use the [URL Encode](/tools/developer/url-encode/) tool when you need to encode a value that will become part of a URL.

## Example: red shoes & bags

Suppose the value of a search parameter is:

    red shoes & bags

As a URL component it can be represented as:

    red%20shoes%20%26%20bags

The space becomes %20 and the ampersand becomes %26. If you leave the ampersand unencoded inside a query string, it may be interpreted as the start of another parameter.

## Encode the value, not the entire structure

Consider a URL shaped like a base address followed by a question mark and a named parameter. The application should normally preserve the URL's structural separators and encode each parameter value separately.

Encoding an entire already-formed URL as one component also encodes the colon and slashes, which is useful only when a complete URL must be nested as data inside another URL.

For building campaign links, the [UTM URL Generator](/tools/developer/utm-url-generator/) can handle named marketing parameters directly.

## Decode and inspect

Use the [URL Decode](/tools/developer/url-decode/) tool to reverse a valid percent-encoded component. Confirm that the decoded text matches the original, especially when it contains non-ASCII characters.

Some form-style query systems also represent spaces with plus signs; that is not identical to every generic component-encoding convention. Follow the expectations of the destination application.

## Avoid unsafe assumptions

URL encoding is not encryption. A visitor, browser, proxy or server may still read query parameters. Do not put API keys, passwords or personal secrets into a URL merely because they are encoded.

Invalid percent sequences may fail decoding. If a URL already contains encoded data, re-encoding it blindly can create double-encoding problems.

A robust workflow keeps a clear distinction between the URL structure and each data value inserted into it.

## A complete query-string example

Suppose you want a search page to receive the literal phrase **red shoes & bags**. If the base URL is `https://example.com/search`, the intended parameter is named `q`.

| Component | Value |
| --- | --- |
| Original data | `red shoes & bags` |
| Encoded value | `red%20shoes%20%26%20bags` |
| Final URL | `https://example.com/search?q=red%20shoes%20%26%20bags` |

In the [URL Encode](/tools/developer/url-encode/) tool, paste **only** `red shoes & bags`. The tool currently uses JavaScript's `encodeURIComponent`, which converts spaces to `%20` and the ampersand to `%26`.

If you encoded the entire URL as a single component, its colon, slashes, question mark and equals sign would also be encoded. That would be appropriate only if the *entire URL* were being carried inside another parameter; it would not be the intended final link.

## A safe way to construct URLs in application code

In browser JavaScript, use the `URL` and `URLSearchParams` APIs when assembling an actual URL. They handle the parameter boundaries so you do not need to join question marks and ampersands manually.

```javascript
const url = new URL("https://example.com/search");
url.searchParams.set("q", "red shoes & bags");
console.log(url.toString());
```

The output may represent spaces as **plus signs** instead of `%20`. That is expected for `URLSearchParams`' form-style serialization and still represents the same parameter value when decoded by a compatible parser.

**Do not percent-encode the result a second time.** For example, `%26` can become `%2526` if you blindly encode an already encoded component. A server decoding the parameter once would then see the literal characters `%26` rather than an ampersand.

## Test non-ASCII characters too

Percent encoding operates on bytes. Unicode text is first represented in UTF-8 in this workflow, then its bytes are encoded. For example, `café` becomes `caf%C3%A9`, not `caf%E9` in a UTF-8 component.

Try entering `café & tea`. Check the result with the [URL Decode](/tools/developer/url-decode/) tool, which reverses compatible percent encoding. A malformed sequence such as a bare `%ZZ` is not valid percent encoding and may cause the decoder to report an error.

## Choose the right operation for the job

- **One parameter value:** use URL Encode or `encodeURIComponent`.
- **A URL containing multiple named parameters:** use a URL-building API or the [UTM URL Generator](/tools/developer/utm-url-generator/) for its supported marketing fields.
- **An entire URL as data inside another URL:** encode that URL as a nested parameter value, leaving the outer URL's structure intact.
- **A private token or password:** do **not** put it in a query parameter merely because it is percent-encoded. The encoded data remains readable in logs, history or copied links.

Before publishing a link, open the finished address and inspect the parameters that the receiving application actually receives. The value of encoding is preserving structure and meaning—not hiding information.
