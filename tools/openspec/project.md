# Project Context

## Purpose
This project is a comprehensive toolkit for business analysis and planning, consisting of two main components:

1. **Business Modeling Artifacts Generator** (`artifacts/`): A tool that generates business modeling artifacts (Business Model Canvas, Lean Canvas, SWOT Analysis, etc.) in JSON, Markdown, and HTML formats based on user-provided business information.

2. **Startup Financial Projections Tool** (`projections/`): A modern web application for creating and visualizing financial projections for startup businesses, featuring real-time calculations, interactive charts, and drag-and-drop functionality.

The project aims to help entrepreneurs and business analysts create comprehensive business plans and financial models efficiently.

## Tech Stack
### Frontend/Web Applications
- **Vue 3** with Composition API - Primary framework for the projections tool
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Chart.js** - Charting library for data visualization
- **Font Awesome** - Icon library
- **vue-draggable-next** - Drag and drop functionality

### Development Tools
- **Node.js 18+** - Runtime environment
- **npm** - Package management
- **GitHub Pages** - Deployment platform for the projections tool

### File Formats
- **JSON** - Structured data storage for business artifacts
- **Markdown** - Human-readable documentation format
- **HTML** - Web-based artifact viewer with interactive features

## Project Conventions

### Code Style
- **Vue 3 Composition API** - Preferred over Options API for new components
- **ES6+ JavaScript** features extensively used (modules, arrow functions, destructuring)
- **Tailwind CSS** utility classes for styling (no custom CSS unless necessary)
- **Component naming**: PascalCase for Vue components (e.g., `MetricTable.vue`)
- **File naming**: kebab-case for multi-word files (e.g., `formula-parser.js`)

### Architecture Patterns
- **Component-based architecture** in Vue applications
- **Composition functions** for reusable logic (e.g., `useMetrics.js`, `useProjections.js`)
- **Single-file components** (.vue files) containing template, script, and styles
- **Separation of concerns**: Business logic in composables, UI in components
- **Modular design**: Each tool (artifacts, projections) operates independently
- **Data-driven approach**: JSON as primary data format for artifacts

### Testing Strategy
- **Manual testing** currently used for both tools
- **User acceptance testing** through direct usage and feedback
- **Cross-browser testing** for web applications (Chrome, Firefox, Safari)
- **Data validation testing** for import/export functionality

### Git Workflow
- **Main branch deployment**: Automatic deployment to GitHub Pages on push to main
- **Feature branches**: Create branches for new features or changes
- **OpenSpec workflow**: Use OpenSpec for managing changes and specifications
- **Commit conventions**: Descriptive commits with context about changes

## Domain Context
This project operates in the **business analysis and startup planning domain**. Key concepts include:

- **Business Model Canvas**: Strategic management template for developing new business models
- **Lean Canvas**: Adaptation of Business Model Canvas for startups
- **Financial Projections**: Forward-looking financial statements for planning
- **Value Proposition**: Clear statement of the benefits a product/service provides
- **Customer Journey**: Visualization of customer experience with a product/service
- **SWOT Analysis**: Strategic planning technique for identifying Strengths, Weaknesses, Opportunities, Threats

AI assistants should understand startup terminology, financial modeling concepts, and business strategy frameworks.

## Important Constraints
- **Browser-based execution**: Tools must run in web browsers without server-side dependencies
- **Offline capability**: Single-file HTML versions must work without internet connection
- **Data portability**: All business models and projections must be exportable as JSON
- **Performance**: Real-time calculations must handle datasets up to 5 years of monthly data
- **Mobile responsiveness**: Web applications must work on mobile devices
- **No backend services**: All processing happens client-side for simplicity

## External Dependencies
- **Chart.js**: MIT-licensed charting library for data visualization
- **Tailwind CSS**: MIT-licensed CSS framework
- **Vue ecosystem**: MIT-licensed Vue.js and related plugins
- **Font Awesome**: SIL OFL 1.1 licensed icon library
- **GitHub Pages**: Free hosting service for web deployments
- **Mermaid.js**: MIT-licensed diagram rendering (used in HTML viewer)
