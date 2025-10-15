# artifacts Specification

## Purpose
TBD - created by archiving change add-logseq-export-artifacts. Update Purpose after archive.
## Requirements
### Requirement: Logseq Export Format
The artifacts tool SHALL support exporting business modeling artifacts in Logseq-compatible Markdown format as a single page containing all artifacts.

#### Scenario: Export business model as single Logseq page
- **WHEN** user selects "Logseq" as export format
- **THEN** system generates a single Markdown file with all artifacts
- **AND** file uses Logseq property syntax (::) for metadata
- **AND** page references use double brackets [[Page Name]] format for cross-references
- **AND** all artifacts are organized within one page with hierarchical structure

#### Scenario: Single page structure
- **WHEN** exporting all artifacts to Logseq format
- **THEN** creates page "[Project Name] Business Artifacts"
- **AND** includes top-level properties like:
  - type:: business-artifacts-collection
  - project:: [[Project Name]]
  - created:: [timestamp]
  - tags:: [[business-modeling]], [[artifacts]]
- **AND** each artifact type becomes a main heading
- **AND** artifact content is structured under each heading

#### Scenario: Business Model Canvas in single page
- **WHEN** including Business Model Canvas in Logseq export
- **THEN** creates heading "## Business Model Canvas"
- **AND** each canvas section becomes a sub-heading with content
- **AND** uses Logseq block properties for section metadata

#### Scenario: Value Proposition Canvas in single page
- **WHEN** including Value Proposition Canvas in Logseq export
- **THEN** creates heading "## Value Proposition Canvas"
- **AND** organizes customer jobs, pains, gains as structured lists
- **AND** uses Logseq properties for canvas elements

#### Scenario: SWOT Analysis in single page
- **WHEN** including SWOT Analysis in Logseq export
- **THEN** creates heading "## SWOT Analysis"
- **AND** organizes Strengths, Weaknesses, Opportunities, Threats as sub-headings
- **AND** uses bullet points with Logseq formatting

#### Scenario: Cross-references within single page
- **WHEN** artifacts reference each other within the single page
- **THEN** uses Logseq page references [[Artifact Section]]
- **AND** creates internal links using [[#Heading Name]] format
- **AND** enables navigation within the single page document

### Requirement: Logseq Page Properties
The exported Logseq page SHALL include comprehensive metadata using Logseq property syntax.

#### Scenario: Top-level page properties
- **WHEN** creating the Logseq export page
- **THEN** includes properties at the top:
  - project_name:: [Project Name]
  - export_format:: logseq
  - created_date:: [ISO timestamp]
  - artifact_count:: [number of artifacts]
  - tags:: [[business-modeling]], [[strategy]], [[artifacts]]

#### Scenario: Artifact-specific properties
- **WHEN** structuring each artifact section
- **THEN** includes properties under each main heading:
  - artifact_type:: [canvas/swot/etc]
  - last_modified:: [timestamp]
  - status:: complete

