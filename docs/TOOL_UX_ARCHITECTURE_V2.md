# Tool UX Architecture v2

## Brand system
- Keep the existing dark background and violet brand color.
- Violet is reserved for primary actions, focus and active navigation.
- Success, error, warning and information use semantic colors.

## Interaction patterns
- Case Converter uses one editable field with direct conversion buttons and undo.
- Text transformations use responsive two-column input/result layouts.
- Developer converters use responsive two-column layouts.
- Text Compare uses a colored side-by-side visual diff with line numbers and summary cards.
- JSON, XML and YAML validators use semantic validation cards.
- Validation errors report line and column when available, show an excerpt and provide Go to error.
- Random generators keep explicit, correctly named Generate actions.
- No generic Process buttons are used.
