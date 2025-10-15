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