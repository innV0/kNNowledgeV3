# projections Specification

## Purpose
The projections capability provides a unified web application for business modeling and financial planning. It combines document management, financial projections, and business modeling artifacts into a single interface with tab-based navigation. The application supports Logseq Markdown format for comprehensive business model documentation and maintains backward compatibility with existing JSON and Markdown imports.
## Requirements
### Requirement: Unified Application Interface
The projections application SHALL provide a unified interface with three main tabs: Document, Projections, and Artifacts.

#### Scenario: Tab-based navigation
- **WHEN** user opens the application
- **THEN** three tabs are displayed: Document, Projections, Artifacts
- **AND** Document tab is selected by default
- **AND** each tab maintains its own state and functionality

#### Scenario: Document tab functionality
- **WHEN** user selects Document tab
- **THEN** displays the business model document content
- **AND** shows content from the beginning of the file up to "# Projections" heading
- **AND** provides read-only view with proper formatting

#### Scenario: Projections tab functionality
- **WHEN** user selects Projections tab
- **THEN** displays the financial projections interface
- **AND** shows metrics table, charts, and editing controls
- **AND** maintains all existing projections functionality

#### Scenario: Artifacts tab functionality
- **WHEN** user selects Artifacts tab
- **THEN** displays business modeling artifacts viewer
- **AND** shows all artifacts from the "# Artifacts" section of the document
- **AND** provides artifact visualization and export capabilities

### Requirement: Logseq Document Parsing
The application SHALL parse a single Logseq Markdown file with H1 sections and distribute content to appropriate tabs.

#### Scenario: H1 section parsing
- **WHEN** importing a Logseq Markdown file
- **THEN** identifies all H1 headings (# Heading) as section delimiters
- **AND** assigns content between H1 headings to corresponding tabs
- **AND** handles files with Document, Projections, and Artifacts sections

#### Scenario: Document tab content
- **WHEN** file contains content before first H1 or between H1 sections
- **THEN** displays this content in Document tab
- **AND** renders Logseq formatting (properties, links, etc.)
- **AND** provides read-only document view

#### Scenario: Projections section parsing
- **WHEN** encountering "# Projections" H1 heading
- **THEN** extracts all content until next H1 as projections data
- **AND** parses Logseq properties (* property:: value) for application state
- **AND** parses metrics array in Logseq nested format
- **AND** converts to internal projections data structures

#### Scenario: Artifacts section parsing
- **WHEN** encountering "# Artifacts" H1 heading
- **THEN** extracts all content until end of file as artifacts data
- **AND** converts Logseq properties to JSON artifact structure
- **AND** handles nested headings and bullet points as artifact components
- **AND** maintains artifact relationships and metadata

### Requirement: Backward Compatibility
The unified application SHALL maintain compatibility with existing import formats.

#### Scenario: JSON import support
- **WHEN** importing JSON files
- **THEN** converts to unified format
- **AND** populates appropriate tabs with converted data
- **AND** maintains all existing functionality

#### Scenario: Legacy Markdown import
- **WHEN** importing legacy Markdown files
- **THEN** processes as projections data
- **AND** leaves Document and Artifacts tabs empty or with defaults

### Requirement: Data Synchronization
Changes in one tab SHALL be reflected appropriately across the unified document.

#### Scenario: Projections to document sync
- **WHEN** user modifies projections data
- **THEN** updates the "# Projections" section in the document
- **AND** maintains Logseq formatting and properties

#### Scenario: Artifacts to document sync
- **WHEN** user modifies or adds artifacts
- **THEN** updates the "# Artifacts" section in the document
- **AND** maintains proper Logseq structure and properties

#### Scenario: Document export
- **WHEN** user exports the unified document
- **THEN** combines all sections into single Logseq Markdown file
- **AND** maintains proper heading hierarchy and formatting

