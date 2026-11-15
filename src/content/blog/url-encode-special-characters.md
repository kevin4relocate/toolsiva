---
title: "URL Encoding Explained with Spaces and Ampersands"
description: "Understand percent-encoding for URL query values, including spaces and ampersands, without accidentally encoding a whole URL."
slug: "url-encode-special-characters"
publishedDate: 2026-12-06
updatedDate: 2026-12-06
author: "Toolsiva Editorial"
primaryTool: "URL components"
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
