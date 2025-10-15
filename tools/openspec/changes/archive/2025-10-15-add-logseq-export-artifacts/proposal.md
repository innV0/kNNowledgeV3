## Why
The artifacts tool currently only supports JSON and Markdown export formats. Users who use Logseq as their knowledge management system need a way to import business modeling artifacts directly into their Logseq graphs. Logseq uses a specific Markdown format with properties and page references that differs from standard Markdown.

## What Changes
- Add Logseq-compatible Markdown export functionality to the artifacts tool
- Export business artifacts as individual Logseq pages with proper property syntax
- Include page references and tags for cross-linking between artifacts
- Maintain compatibility with existing JSON and Markdown exports

## Impact
- Affected specs: artifacts capability
- Affected code: artifacts generation script and export functions
- No breaking changes to existing functionality
- New export option will be available alongside existing formats