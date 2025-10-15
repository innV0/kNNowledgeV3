# Business Modeling Artifacts Generator

This tool acts as a business modeling specialist, taking user-provided information about a business and generating a comprehensive set of business modeling artifacts in three different formats: JSON, Markdown, and HTML.

## How it Works

1.  **User Input**: The tool prompts the user to provide detailed information about their business, including its name, activity description, business model summary, problem solved, products/services, market description, marketing strategy, competition, and competitive advantages.
2.  **Artifact Generation**: Based on the input, the tool generates the following business modeling artifacts:
    *   Business Model Canvas
    *   Lean Canvas
    *   Sales Funnel
    *   Customer Journey Map
    *   Buyer Persona
    *   Empathy Map
    *   Value Proposition Canvas
    *   SWOT Analysis
    *   PESTEL Analysis
    *   Porter's Five Forces
    *   Ansoff Matrix
    *   RACI Matrix
    *   User Stories
    *   Product Roadmap
    *   Competitive Analysis
    *   OKR Framework
    *   Golden Circle
    *   Jobs to be Done (JTBD)

## Output Files

For each business modeled, two files are generated, both named after the project (e.g., `ecommerce_zapatillas.json`, `ecommerce_zapatillas.md`):

### 1. JSON File (`.json`)

This file contains the structured data for all the generated business artifacts. The JSON schema is designed to be easily parseable and consumable by other applications or for data analysis. The top-level keys correspond to each business artifact, with nested objects and arrays holding the specific details. An example of the structure can be inferred from the `artifacts.html` file, which uses this JSON format for rendering.

### 2. Markdown File (`.md`)

This file presents all the business modeling artifacts in a human-readable Markdown format. It's suitable for documentation, easy sharing, and integration into other Markdown-compatible platforms.

## Viewing Artifacts (HTML Viewer)

A universal HTML viewer, `artifacts.html` (formerly `Ghostbusters_Dynamic.html`), is provided to visually display the generated JSON data. This viewer utilizes:
*   **Tailwind CSS**: For modern and responsive styling.
*   **Emojis**: To enhance visual appeal and clarity.
*   **Mermaid.js**: For rendering diagrams like the Sales Funnel, providing a visual and structured overview of processes.

To view the artifacts for a specific project:
1.  Open `artifacts.html` in your web browser.
2.  Use the "Load Artifacts" button and select the `[project_name].json` file that was generated for your business.

## Usage

To use this tool, simply provide the requested information about your business. The tool will then automatically generate the JSON and Markdown output files in the current working directory.

## Loading Artifacts

The artifacts viewer supports loading both JSON and Logseq Markdown files:

1. **Load JSON files**: Click "Load Artifacts" and select a `.json` file
2. **Load Logseq files**: Click "Load Artifacts" and select a `.md` file exported from Logseq
3. **Export to Logseq**: After loading, click "Export to Logseq" to download a Logseq-compatible version

## Logseq Export

The artifacts viewer now supports exporting business modeling artifacts in Logseq-compatible Markdown format:

1. **Load Artifacts**: Open `artifacts.html` in your browser and load a JSON file using the "Load Artifacts" button
2. **Export to Logseq**: Click the "Export to Logseq" button that appears after loading
3. **Import to Logseq**: The downloaded `.md` file can be imported directly into your Logseq graph

### Logseq Export Features

- **Single Page Format**: All artifacts are exported to a single Markdown page with hierarchical structure
- **Page Properties**: Includes Logseq properties like `project_name::`, `export_format:: logseq`, `created_date::`, etc.
- **Artifact Sections**: Each business artifact becomes a main heading (## Business Model Canvas, ## SWOT Analysis, etc.)
- **Structured Content**: Lists and tables are properly formatted for Logseq rendering
- **Cross-references**: Internal page references using Logseq's linking syntax

### Example Logseq Page Structure

```
project_name:: My Business Project
export_format:: logseq
created_date:: 2025-10-15T19:13:37.000Z
tags:: [[business-modeling]], [[artifacts]]

## Business Model Canvas

artifact_type:: business-model-canvas
last_modified:: 2025-10-15T19:13:37.000Z

### Key Partners
- Local government agencies
- Strategic partners

### Key Activities
- Service delivery
- Customer support

[... continues with all artifacts ...]
```