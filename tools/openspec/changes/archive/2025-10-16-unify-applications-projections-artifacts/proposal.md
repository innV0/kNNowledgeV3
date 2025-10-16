## Why
Currently there are two separate applications: one for business modeling artifacts (in `artifacts/` folder) and one for financial projections (in `projections/` folder). This creates maintenance overhead and user confusion. Users need to switch between applications to work on both business modeling and financial planning.

## What Changes
- **BREAKING**: Merge the artifacts application into the projections application
- Create a unified application with three tabs: Document, Projections, and Artifacts
- The Document tab shows the business model document (first part of the file)
- The Projections tab shows the financial projections interface
- The Artifacts tab shows the business modeling artifacts viewer
- Import functionality will parse the Logseq Markdown file and extract artifacts from the "# Artifacts" section
- Maintain backward compatibility for existing JSON/Markdown imports

## Impact
- Affected specs: projections capability (new unified application)
- Affected code: projections/src/App.vue, artifacts/ folder structure
- **BREAKING**: artifacts/ folder will be removed after migration
- New unified user experience with seamless navigation between business modeling and financial planning