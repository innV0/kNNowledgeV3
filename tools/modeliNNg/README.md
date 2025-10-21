# Unified Business Modeling Tool

A comprehensive web application for business modeling that combines financial projections, business model documentation, and business modeling artifacts in a single unified interface.

Projections > https://lucascervera.github.io/kNNowledgeV3/tools/projections/


## Features

### Three Integrated Modules
- **📄 Document Tab**: Business model documentation and planning content
- **📊 Projections Tab**: Financial projections with real-time calculations and charts
- **🎨 Artifacts Tab**: Business modeling artifacts (Business Model Canvas, Lean Canvas, SWOT Analysis, etc.)

### Core Capabilities
- **Intuitive Data Entry**: Table-based input system with automatic interpolation
- **Drag & Drop**: Reorder metrics easily
- **Real-time Calculations**: Instant updates with formula dependencies
- **Interactive Charts**: Visualize projections with Chart.js
- **Unified Import/Export**: Share complete business models as Logseq Markdown files
- **Backward Compatibility**: Import existing JSON/Markdown files
- **Responsive Design**: Works on desktop and mobile devices

## Download and Local Usage

### Standalone Version (Recommended for Local Use)

For offline usage without installation, download the standalone version:

1. **Download**: Get the `singlefile-index.html` file from the repository
2. **Open**: Double-click the file to open it in your web browser
3. **Use**: The application runs completely offline with all features included

**Note**: If your browser blocks the file due to security restrictions, try:
- Dragging the file into your browser window
- Using Chrome with `--allow-file-access-from-files` flag
- Or run a local server: `npx serve .` and open `singlefile-index.html`

### Online Version

Access the live application at: https://lucascervera.github.io/kNNowledgeV3/tools/projections/

## Development

### Prerequisites
- Node.js 18+
- npm

### Installation
```bash
cd tools/projections
npm install
```

### Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Deploy to GitHub Pages
The application automatically deploys to GitHub Pages on every push to the main branch.

## Architecture

- **Framework**: Vue 3 with Composition API
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Charts**: Chart.js
- **Icons**: Font Awesome
- **Drag & Drop**: vue-draggable-next

## Data Model

### Unified Document Structure
The application works with unified Logseq Markdown documents containing three main sections:

```
# Document
Business model documentation and planning content...

# Projections
- tags:: [[business-modeling]]
- selectedMetricId:: metric-1
- viewMode:: monthly
- chartMetrics:: ["metric-1", "metric-2"]

## Business Metrics (Metrics Array)
- [[Revenue]]
  - id:: revenue-1
  - type:: variable
  - values::
    - 1-1:: 10000
    - 1-2:: 11000
  - format::
    - decimals:: 0
    - currency:: $
- [[Costs]]
  - id:: costs-1
  - type:: calculated
  - formula:: revenue * 0.3
  - format::
    - decimals:: 0
    - currency:: $

# Artifacts
## Business Model Canvas
### Key Partners
- Partner 1
- Partner 2
```

### Metrics
- **Variable Metrics**: Direct value input with interpolation
- **Calculated Metrics**: Formula-based calculations

### Value Storage
Values are stored in a year-month format:
```javascript
{
  "1-1": 100,    // Year 1, Month 1
  "1-2": 110,    // Year 1, Month 2
  "2-1": 120     // Year 2, Month 1
}
```

Missing values are automatically interpolated using linear interpolation.

### Artifacts Support
The application supports various business modeling artifacts:
- Business Model Canvas (9 blocks)
- Lean Canvas (startup-focused)
- SWOT Analysis
- Value Proposition Canvas
- Competitive Analysis tables

## Usage

### Getting Started

1. **Open the Application**: Double-click `singlefile-index.html` or visit the online version
2. **Import a Business Model**: Click "Import Logseq File" to load a complete business model document
3. **Navigate Between Tabs**: Use the Document, Projections, and Artifacts tabs to work with different aspects of your business model

### Working with Documents

The **Document Tab** displays your business model documentation:
- Import Logseq Markdown files with H1 sections (# Document, # Projections, # Artifacts)
- Content is rendered with basic Markdown formatting
- Export unified documents that combine all sections

### Creating Financial Projections

The **Projections Tab** provides financial modeling capabilities:

1. **Add Metrics**: Click "Add Metric" to create new business metrics
    - Choose between "Variable" (manual input) or "Calculated" (formula-based)
    - Variable metrics allow direct value entry
    - Calculated metrics use formulas referencing other metrics

2. **Enter Values**: Use the table to input specific values for any month/year
    - Click on any cell to edit values
    - Values are stored in year-month format (e.g., "1-1" for Year 1, Month 1)
    - Missing values are automatically interpolated

3. **Use Formulas**: For calculated metrics, enter formulas like:
    - `revenue * 0.3` (30% of revenue)
    - `SUM(previous_3_months)` (rolling 3-month sum)
    - `growth_rate * previous_value` (compound growth)

4. **View Charts**: Switch to "Chart View" to visualize projections
    - Toggle metrics on/off using the checkboxes
    - Charts update in real-time as you modify data
    - Supports line charts for trend analysis

### Business Modeling Artifacts

The **Artifacts Tab** displays business modeling artifacts extracted from Logseq files:
- **Business Model Canvas**: 9-block strategic tool
- **Lean Canvas**: Startup-focused business model
- **SWOT Analysis**: Strengths, Weaknesses, Opportunities, Threats
- **Value Proposition Canvas**: Customer value mapping
- **Competitive Analysis**: Feature comparison tables

### Data Management

**Import/Export Options**:
- **Unified Logseq Export**: Export complete business models as single Logseq Markdown files
- **Artifacts Export**: Export just the artifacts section to Logseq
- **JSON Export**: Export projections data as JSON (backward compatibility)
- **Import**: Load Logseq files, JSON files, or Markdown files
- All formulas, values, and settings are preserved

### Tips for Best Results

- Start with the Document tab to outline your business model
- Use consistent time periods for accurate projections
- Create artifacts in the Artifacts tab to visualize your business model
- Save your work frequently using unified export
- Test formulas with small datasets before scaling up

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this tool for your startup projections!