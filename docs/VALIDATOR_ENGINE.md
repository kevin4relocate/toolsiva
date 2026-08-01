# Validator Engine Fix

## Validation rules

- JSON Validator uses the native standards-compliant `JSON.parse`.
- XML Validator uses the browser's XML `DOMParser` and checks parser errors.
- YAML Validator uses the `yaml` package's full document parser.
- Formatting quality is not validation.
- Valid but unusual indentation or compact formatting must be accepted.
- Invalid syntax must be rejected with the parser's actual error.

## YAML support

The parser supports nested mappings, sequences, comments, quoted and block scalars,
anchors, aliases, merge keys and multi-document YAML streams.
