---
title: "Create a vCard QR Code for a Contact Card"
description: "Create a contact-card QR using vCard 3.0 and test how names, phone numbers and organizations appear on a phone."
slug: "vcard-qr-contact-card"
publishedDate: 2026-12-10
updatedDate: 2026-12-10
author: "Toolsiva Editorial"
primaryTool: "Contact QR"
primaryToolPath: "/tools/qr/qr-vcard-generator/"
relatedTools: []
excerpt: "Create a contact-card QR using vCard 3.0 and test how names, phone numbers and organizations appear on a phone."
featuredImage: "/blog/illustrations/vcard-qr-contact-card.svg"
imageAlt: "Visual walkthrough for create a vcard qr code for a contact card: Name, Phone + email, then Import contact."
imageCaption: "A vCard encodes contact details that a compatible scanner can offer to save."
draft: true
aiAssisted: true
curatedSeries: true
---

A contact QR code is useful on an event badge, a small business card or an information display. Rather than asking someone to type a phone number, it lets compatible phone applications import a structured contact.

The [vCard QR Generator](/tools/qr/qr-vcard-generator/) encodes details in a vCard 3.0-style payload.

## Choose what information to share

Begin with a name. Add a phone number, email and organization only if you want those fields distributed. A QR code that is easy to scan is also easy to copy, photograph or forward.

For a public event, consider whether you want to share a personal mobile number or a dedicated business contact address instead.

## Test a sample contact

Use a fictional name such as Alex Smith and a test phone number. Generate the QR and scan it with a different phone or contact application. Verify the name and available fields before importing.

An application may offer to save the contact, show the raw text or ignore fields it does not recognize. That variation is why a real-device test is necessary before printing a large batch.

## Formatting matters

vCard uses line-based fields and escape conventions for punctuation and line breaks. A comma in a name or a semicolon in an organization name should be encoded as part of the field value rather than accidentally treated as syntax.

The generator handles escaping for supported fields. It also checks that optional phone and email fields have plausible formats when provided. This is not proof that a mailbox exists or that a number belongs to the intended person.

## Avoid overloading the image

More fields mean more content in the QR, which can make the symbol denser. For printed cards, ensure sufficient size, contrast and quiet space around the code.

If the intended action is simply to open a website, the [URL QR Generator](/tools/qr/qr-url-generator/) may be easier to scan than a full contact card.

## Final verification

Scan the actual printed or exported version under ordinary lighting. Confirm that the displayed contact information is correct and that the device offers the expected import action.

A successful image preview is not a substitute for checking the receiving app.
