# Startup Financial Projections Tool

A modern, simplified web application for creating and visualizing financial projections for startup businesses.


Projections: https://lucascervera.github.io/kNNowledgeV3/tools/projections/

## Features

- **Intuitive Data Entry**: Table-based input system with automatic interpolation
- **Drag & Drop**: Reorder metrics easily
- **Real-time Calculations**: Instant updates with formula dependencies
- **Interactive Charts**: Visualize projections with Chart.js
- **Import/Export**: Share models as JSON files
- **Responsive Design**: Works on desktop and mobile devices

## Live Demo

Access the live application at: [GitHub Pages URL]

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

1. **Add Metrics**: Click "Add Metric" to create new business metrics
2. **Enter Values**: Use the table to input specific values for any month/year
3. **View Charts**: Toggle metrics on/off in the chart view
4. **Export Data**: Save your model as a JSON file for sharing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this tool for your startup projections!