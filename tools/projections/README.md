# Startup Financial Projections Tool

A modern, simplified web application for creating and visualizing financial projections for startup businesses.

Projections > https://lucascervera.github.io/kNNowledgeV3/tools/projections/


## Features

- **Intuitive Data Entry**: Table-based input system with automatic interpolation
- **Drag & Drop**: Reorder metrics easily
- **Real-time Calculations**: Instant updates with formula dependencies
- **Interactive Charts**: Visualize projections with Chart.js
- **Import/Export**: Share models as JSON files
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

## Usage

### Getting Started

1. **Open the Application**: Double-click `singlefile-index.html` or visit the online version
2. **Load Sample Data** (Optional): Click "Load Sample Data" to see example projections

### Creating Your Financial Model

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

### Visualizing Data

4. **View Charts**: Switch to "Chart View" to visualize projections
   - Toggle metrics on/off using the checkboxes
   - Charts update in real-time as you modify data
   - Supports line charts for trend analysis

### Data Management

5. **Import/Export**: Share your financial models
   - **Export**: Click "Export Data" to download your model as JSON
   - **Import**: Click "Import Data" and select a previously exported JSON file
   - All formulas, values, and settings are preserved

### Tips for Best Results

- Start with high-level metrics (Revenue, Costs) before detailed breakdowns
- Use consistent time periods for accurate projections
- Save your work frequently using Export
- Test formulas with small datasets before scaling up

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this tool for your startup projections!