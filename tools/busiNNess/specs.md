# Startup Financial Projections Tool - Functional Specifications

## 1. Introduction

The Startup Financial Projections Tool is a web-based application designed to help entrepreneurs and financial analysts create, visualize, and manage financial projections for startup businesses. The tool allows users to define key business metrics, set growth rates across different business phases, and generate 5-year financial projections with interactive visualizations.

## 2. Application Overview

The application provides a comprehensive interface for financial modeling with the following key capabilities:
- Define and edit business metrics and variables
- Configure growth rates per business phase
- Generate monthly and yearly financial projections
- Interactive data visualization with charts
- Real-time calculation updates
- Phase-based growth modeling

## 3. Functional Requirements

### 3.1 User Interface Layout

The application uses a two-panel layout:
- **Left Panel (Main View)**: Displays the projections table and chart
- **Right Panel (Details Panel)**: Shows detailed configuration for the selected metric

### 3.2 Metric Management

#### 3.2.1 Metric Types
- **Variable Metrics**: User-configurable values with growth rates (e.g., customer acquisition, pricing)
- **Calculated Metrics**: Computed values based on formulas (e.g., revenue = units × price)

#### 3.2.2 Metric Properties
- **ID**: Unique identifier
- **Name**: Display name
- **Type**: Variable or Calculated
- **Initial Value**: Starting value (for variables)
- **Formula**: Calculation expression (for calculated metrics)
- **Growth Settings**: Per-phase growth configuration (for variables)

### 3.3 Phase Management

#### 3.3.1 Phase Definition
- **Name**: Descriptive name (e.g., "Growth Phase", "Maturity Phase")
- **Start Month**: Beginning month of the phase
- **End Month**: Ending month of the phase

#### 3.3.2 Default Phases
- Phase 1: Months 1-6
- Phase 2: Months 7-24
- Phase 3: Months 25-60

#### 3.3.3 Phase Operations
- Add new phases
- Edit phase names and date ranges
- Remove phases
- Automatic adjustment of growth settings when phases change

### 3.4 Growth Configuration

#### 3.4.1 Growth Types
- **Additive**: Fixed amount added each month (e.g., +10 customers)
- **Multiplicative**: Percentage growth (e.g., ×1.05 for 5% growth)

#### 3.4.2 Phase-Specific Growth
Each variable metric can have different growth settings for each business phase:
- Growth Type per phase
- Growth Rate per phase

### 3.5 Projection Calculations

#### 3.5.1 Calculation Engine
- Processes 61 months (0-60) of data
- Applies phase-appropriate growth rates
- Handles cumulative calculations
- Supports complex formula dependencies

#### 3.5.2 Calculation Order
1. Set initial values for variables
2. For each month:
   - Apply growth to variables based on current phase
   - Calculate derived metrics using formulas
   - Update cumulative values

### 3.6 View Modes

#### 3.6.1 Monthly View
- Displays all 61 months (0-60)
- Shows detailed month-by-month data
- Allows editing of metric parameters

#### 3.6.2 Yearly View
- Aggregates data by year (Years 1-5)
- Shows end-of-year values
- Simplified view for long-term planning

### 3.7 Data Visualization

#### 3.7.1 Chart Features
- Line chart showing metric trends over time
- Multiple metrics can be selected for display
- Automatic scaling and labeling
- Supports both monthly and yearly views

#### 3.7.2 Chart Controls
- Checkbox selection for metrics to display
- Real-time updates when data changes
- Responsive design

### 3.8 User Interactions

#### 3.8.1 Table Interactions
- Click on metric rows to select for detailed editing
- Visual highlighting of selected metrics
- Inline editing of growth parameters for quick adjustments

#### 3.8.2 Detail Panel
- Shows comprehensive settings for selected metric
- Phase-specific growth configuration
- Chart visibility toggle

#### 3.8.3 Phase Management
- Add/remove phases with automatic data adjustment
- Edit phase properties
- Visual feedback for phase boundaries

## 4. Data Model

### 4.1 Core Data Structures

#### 4.1.1 Metric
```javascript
{
  id: string,           // Unique identifier
  name: string,         // Display name
  type: 'variable' | 'calculated',
  initial: number,      // Starting value (variables only)
  formula: string,      // Calculation formula (calculated only)
  growths: Growth[]     // Growth settings per phase (variables only)
}
```

#### 4.1.2 Growth
```javascript
{
  phaseId: string,      // Reference to phase
  growthType: 'additive' | 'multiplicative',
  growthRate: number
}
```

#### 4.1.3 Phase
```javascript
{
  id: string,           // Unique identifier
  name: string,         // Display name
  startMonth: number,   // Starting month (1-60)
  endMonth: number      // Ending month (1-60)
}
```

### 4.2 Application State

#### 4.2.1 Global State
- metrics: Metric[] - All business metrics
- phases: Phase[] - Business phases
- selectedMetricId: string - Currently selected metric
- viewMode: 'monthly' | 'yearly' - Current view mode
- selectedMetricsForChart: Set<string> - Metrics shown in chart

#### 4.2.2 Derived State
- projections: ProjectionData[] - Calculated projection values

## 5. Calculation Logic

### 5.1 Projection Algorithm

```javascript
function calculateProjections(metrics, phases) {
  const data = initializeData(metrics);
  setInitialValues(data, metrics);

  for (let month = 1; month <= 60; month++) {
    const currentPhase = findPhaseForMonth(phases, month);

    // Apply growth to variables
    metrics.forEach(metric => {
      if (metric.type === 'variable') {
        const growth = findGrowthForPhase(metric.growths, currentPhase);
        data[metric.id][month] = applyGrowth(
          data[metric.id][month - 1],
          growth
        );
      }
    });

    // Calculate derived metrics
    calculateDerivedMetrics(data, metrics, month);
  }

  return formatProjections(metrics, data);
}
```

### 5.2 Growth Application

```javascript
function applyGrowth(previousValue, growth) {
  if (!growth) return previousValue;

  if (growth.growthType === 'additive') {
    return previousValue + growth.growthRate;
  } else {
    return previousValue * growth.growthRate;
  }
}
```

### 5.3 Phase Detection

```javascript
function findPhaseForMonth(phases, month) {
  return phases.find(phase =>
    month >= phase.startMonth && month <= phase.endMonth
  );
}
```

## 6. User Experience Requirements

### 6.1 Responsiveness
- Application adapts to different screen sizes
- Touch-friendly interface for mobile devices
- Optimized performance for large datasets

### 6.2 Real-time Updates
- All calculations update immediately when parameters change
- Chart updates dynamically
- No page refreshes required

### 6.3 Data Persistence
- Local storage support for saving configurations
- Export/import functionality for sharing models

### 6.4 Error Handling
- Validation of input values
- Graceful handling of calculation errors
- User-friendly error messages

## 7. Technical Requirements

### 7.1 Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ JavaScript support
- HTML5 and CSS3 features

### 7.2 Performance
- Handle 61 months × 15+ metrics efficiently
- Smooth chart rendering
- Fast calculation updates

### 7.3 Accessibility
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support

## 8. Future Enhancements

### 8.1 Advanced Features
- Scenario comparison
- Sensitivity analysis
- Monte Carlo simulations
- Financial statement generation

### 8.2 Integration
- API connectivity for real data
- Cloud storage
- Collaboration features

### 8.3 Visualization
- Additional chart types (bar, area, scatter)
- Custom date ranges
- Comparative analysis views

## 9. Testing Requirements

### 9.1 Unit Tests
- Calculation engine accuracy
- Growth application logic
- Phase detection

### 9.2 Integration Tests
- End-to-end calculation workflows
- UI interaction flows
- Data persistence

### 9.3 User Acceptance Tests
- Business user validation
- Performance benchmarks
- Cross-browser testing

## 10. Deployment and Maintenance

### 10.1 Deployment
- Static file hosting
- CDN distribution
- Offline capability

### 10.2 Maintenance
- Version control
- Automated testing
- User feedback integration

---

*This specification document provides a comprehensive overview of the Startup Financial Projections Tool requirements and implementation details. It serves as the foundation for development, testing, and future enhancements.*