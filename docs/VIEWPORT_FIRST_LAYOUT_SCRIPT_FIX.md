# Viewport-First Layout Script Fix

Corrects invalid JavaScript comments in the original installer.

The installer is also idempotent:

- already-applied replacements are skipped;
- missing expected source causes a clear error;
- running the installer twice does not duplicate changes.
