import type { ToolDefinition, ToolFaq } from "@/types/tool";

const sensitiveTools = new Set([
  "password-generator",
  "passphrase-generator",
  "random-string-generator",
  "secure-token-generator",
  "password-strength-checker",
  "sha256-hash-generator",
  "sha512-hash-generator",
  "hmac-generator",
  "basic-auth-generator",
  "hash-compare",
  "jwt-decoder",
  "qr-wifi-generator",
  "qr-vcard-generator",
  "qr-email-generator",
  "qr-sms-generator",
  "qr-whatsapp-generator",
]);

const normalize = (value: string) => value.trim().toLowerCase();

const isGenericFaq = (question: string) => {
  const value = normalize(question);

  return (
    value === "does toolsiva store my text?" ||
    value === "does toolsiva store my input?" ||
    value === "does this tool work on mobile devices?" ||
    value === "does it work on mobile?" ||
    /^is .+ free\??$/.test(value) ||
    /^is (my|the) (input|text|data|list|url|table|translation) uploaded\??$/.test(value)
  );
};

const sentence = (value: string) => {
  const clean = value.trim();
  return /[.!?]$/.test(clean) ? clean : `${clean}.`;
};

const categoryFaqs = (tool: ToolDefinition): ToolFaq[] => {
  const name = tool.name;
  const purpose = sentence(tool.shortDescription);

  switch (tool.category) {
    case "text":
      return [
        {
          question: `What can I use ${name} for?`,
          answer: purpose,
        },
        {
          question: `Will ${name} overwrite my original text?`,
          answer:
            "No. The result is displayed separately, so your original text outside the workspace is not changed.",
        },
        {
          question: `Can ${name} process multiple lines or paragraphs?`,
          answer:
            "Yes. When the workspace accepts text, it can process multiline content directly in your browser.",
        },
      ];

    case "developer":
      return [
        {
          question: `What input does ${name} expect?`,
          answer: `Use the format shown by the workspace fields and examples. ${purpose}`,
        },
        {
          question: `What happens when ${name} receives invalid input?`,
          answer:
            "The tool displays validation feedback or an error instead of silently returning an unreliable result.",
        },
        {
          question: `Can I copy the result from ${name}?`,
          answer:
            "Yes. When the tool produces output, you can copy it from the result area.",
        },
      ];

    case "security":
      return [
        {
          question: `What is ${name} designed to do?`,
          answer: purpose,
        },
        {
          question: `Is the output from ${name} a complete security guarantee?`,
          answer:
            "No. Treat it as a browser utility and apply the security review and policies required by your own system.",
        },
        {
          question: `Should I use production secrets with ${name}?`,
          answer:
            "Use test or non-production values whenever possible, especially on shared or untrusted devices.",
        },
      ];

    case "qr":
      return [
        {
          question: `What information can ${name} encode?`,
          answer: purpose,
        },
        {
          question: `Why might a QR code from ${name} be difficult to scan?`,
          answer:
            "Low contrast, glare, image compression, insufficient quiet space or a very small display size can reduce scan reliability.",
        },
        {
          question: `Can I customize and download the QR code from ${name}?`,
          answer:
            "Yes. You can choose foreground and background colors with safe contrast and download a high-resolution PNG.",
        },
      ];

    case "calculator":
      return [
        {
          question: `How does ${name} determine the result?`,
          answer: `It applies the calculation represented by the fields in the workspace. ${purpose}`,
        },
        {
          question: `Why might ${name} display a rounded value?`,
          answer:
            "Some calculations produce long or repeating decimals, so results may be rounded for readability.",
        },
        {
          question: `Can ${name} calculate decimal values?`,
          answer:
            "Yes. Decimal inputs are supported wherever they are meaningful for the calculation.",
        },
      ];

    case "converter":
      return [
        {
          question: `What does ${name} convert?`,
          answer: purpose,
        },
        {
          question: `Does ${name} change the underlying quantity?`,
          answer:
            "No. It expresses the same quantity in another unit using the appropriate conversion factor.",
        },
        {
          question: `Why can results from ${name} contain decimals?`,
          answer:
            "Different units often do not convert into exact whole numbers, so decimal results are normal.",
        },
      ];
  }
};

const privacyFaq = (tool: ToolDefinition): ToolFaq => ({
  question: `Is sensitive input stored when I use ${tool.name}?`,
  answer:
    "The workspace is designed to process its input in your browser. Avoid entering production secrets on shared or untrusted devices.",
});

export const buildToolFaqs = (tool: ToolDefinition): ToolFaq[] => {
  const existingSpecific = tool.faq.filter(
    (item) => !isGenericFaq(item.question),
  );

  const candidates = [
    ...existingSpecific,
    ...categoryFaqs(tool),
    ...(sensitiveTools.has(tool.slug) ? [privacyFaq(tool)] : []),
  ];

  const seen = new Set<string>();
  const result: ToolFaq[] = [];

  for (const faq of candidates) {
    const key = normalize(faq.question);
    if (!key || seen.has(key)) continue;

    seen.add(key);
    result.push({
      question: faq.question.trim(),
      answer: sentence(faq.answer),
    });
  }

  return result.slice(0, sensitiveTools.has(tool.slug) ? 4 : 3);
};
