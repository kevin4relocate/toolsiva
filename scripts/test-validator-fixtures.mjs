import { parseAllDocuments } from "yaml";

const validYamlFixtures = [
  `# uneven but valid sequence indentation
company: spacelift
domain:
 - devops
 - devsecops
tutorial:
  - yaml:
      name: "YAML Ain't Markup Language"
      type: awesome
      born: 2001
  - json:
      name: JavaScript Object Notation
      type: great
      born: 2001
author: omkarbirade
published: true
`,
  `defaults: &defaults
  enabled: true
service:
  <<: *defaults
  ports: [80, 443]
`,
  `---
name: first
---
name: second
items:
- one
- two
`,
  `quoted: "value: with colon"
literal: |
  line one
  line two
folded: >
  this is
  one line
`,
];

const invalidYamlFixtures = [
  `name: test
  broken: indentation
`,
  `items:
  - one
  two: value
   three: value
`,
  `key: [one, two
`,
  `duplicate: one
duplicate: two
`,
];

function yamlErrors(source) {
  return parseAllDocuments(source, {
    prettyErrors: true,
    strict: true,
    uniqueKeys: true,
  }).flatMap((document) => document.errors);
}

for (const [index, source] of validYamlFixtures.entries()) {
  const errors = yamlErrors(source);
  if (errors.length > 0) {
    console.error(`Valid YAML fixture ${index + 1} was rejected:`);
    console.error(errors.map((error) => error.message).join("\n"));
    process.exit(1);
  }
}

for (const [index, source] of invalidYamlFixtures.entries()) {
  const errors = yamlErrors(source);
  if (errors.length === 0) {
    console.error(`Invalid YAML fixture ${index + 1} was accepted.`);
    process.exit(1);
  }
}

const validJson = [
  `{"name":"Toolsiva","items":[1,2,3]}`,
  ` { "nested" : { "ok" : true }, "empty" : null } `,
];

const invalidJson = [
  `{"name":"Toolsiva",}`,
  `{name:"Toolsiva"}`,
];

for (const source of validJson) JSON.parse(source);

for (const source of invalidJson) {
  let rejected = false;
  try {
    JSON.parse(source);
  } catch {
    rejected = true;
  }

  if (!rejected) {
    console.error(`Invalid JSON was accepted: ${source}`);
    process.exit(1);
  }
}

console.log("Validator fixtures passed: valid syntax accepted, invalid syntax rejected.");
