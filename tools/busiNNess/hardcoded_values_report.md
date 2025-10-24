# Hardcoded Values Report - Business Model Application

## Executive Summary

This report identifies hardcoded values in the business model application, particularly in the metrics and projections system. The analysis reveals several areas where values are hardcoded instead of being loaded from the model configuration.

## Findings

### 1. Hardcoded Metric IDs in Projections Logic

**Location:** `src/composables/useProjections.js` (line 9)

```javascript
const hardcodedIds = ['totalUnits', 'salesRevenue', 'totalInflow', 'totalCogs', 'totalOutflow', 'cashBalance']
```

**Issue:** These metric IDs are hardcoded and used to determine which metrics should be calculated automatically rather than loaded from the model.

**Impact:** Limits flexibility in defining calculated metrics through the model configuration.

### 2. Hardcoded Array Sizes (61 Months)

**Locations:**
- `src/composables/useProjections.js` (line 7): `const months = 61`
- `src/composables/useMetrics.js` (line 6): `return new Array(61).fill(0)`
- `src/composables/formulaParser.js` (line 318): `if (targetPeriod < 0 || targetPeriod >= 61)`

**Issue:** The application assumes exactly 61 months (5 years) of data, hardcoded throughout the codebase.

**Impact:** Cannot easily support different time horizons without code changes.

### 3. Hardcoded Metric Descriptions

**Location:** `src/composables/useMetrics.js` (lines 525-539)

```javascript
if (metric.id === 'totalCustomers') {
  return 'Previous total + New customers per month'
} else if (metric.id === 'totalUnits') {
  return 'Total customers × Units per customer per month'
} else if (metric.id === 'salesRevenue') {
  return 'Total units sold × Price per unit'
} else if (metric.id === 'totalInflow') {
  return 'Sales revenue + Other inflows per month'
} else if (metric.id === 'totalCogs') {
  return 'Total units sold × COGS per unit'
} else if (metric.id === 'totalOutflow') {
  return 'Total COGS + Fixed costs + Other outflows per month'
} else if (metric.id === 'cashBalance') {
  return 'Previous balance + Total inflow - Total outflow'
}
```

**Issue:** Formula descriptions are hardcoded based on specific metric IDs.

**Impact:** Cannot customize descriptions for different business models.

### 4. Hardcoded Metric Descriptions in Components

**Location:** `src/components/MetricDetails.vue` (lines 484-496)

Same hardcoded descriptions as above, duplicated in the UI component.

**Issue:** Code duplication and hardcoded business logic in UI layer.

### 5. Hardcoded Period Calculations

**Location:** `src/App.vue` (line 485)

```javascript
? Array.from({ length: 61 }, (_, i) => i)
: Array.from({ length: 5 }, (_, i) => i + 1)
```

**Issue:** Monthly view assumes 61 months, yearly view assumes 5 years.

**Impact:** Time period logic is hardcoded and not configurable.

### 6. Hardcoded Sample Data

**Location:** `sample-data*.json` files

**Issue:** Sample data contains hardcoded metric IDs and structures that match the hardcoded logic.

**Impact:** Sample data reinforces the hardcoded assumptions.

## Recommendations

### 1. Move Hardcoded IDs to Model Configuration

Replace the hardcoded `hardcodedIds` array with a configuration loaded from the model that specifies which metrics are system-calculated vs. user-defined.

### 2. Make Time Horizons Configurable

- Add time horizon configuration to the model
- Replace hardcoded `61` with configurable values
- Support different time units (months, quarters, years)

### 3. Dynamic Formula Descriptions

- Store formula descriptions in the model configuration
- Remove hardcoded ID-based logic
- Allow custom descriptions for calculated metrics

### 4. Centralized Configuration

Create a configuration system that loads:
- System metric definitions
- Time horizons
- Default formulas and descriptions
- Calculation rules

### 5. Model-Driven Architecture

Shift from code-driven to model-driven approach where:
- Metric types and behaviors are defined in the model
- Calculation logic is configurable
- UI adapts to model definitions

## Priority

1. **High:** Time horizon configuration (61 months)
2. **High:** System metric definitions (hardcodedIds)
3. **Medium:** Formula descriptions
4. **Low:** Sample data cleanup

## Implementation Approach

1. Create a model configuration schema that includes system settings
2. Update parsers to load configuration from model files
3. Refactor calculation logic to use configuration instead of hardcoded values
4. Update UI components to be model-driven
5. Add validation for configuration consistency