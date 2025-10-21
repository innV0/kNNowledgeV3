# Value Formatting Enhancement Plan

## Overview
Add a comprehensive value formatting system to metrics that allows customization of how numbers are displayed in the table.

## User Requirements
- ✅ Decimal places (1 decimal, 2 decimals)
- ✅ Compact notation (K for thousands, M for millions)
- ✅ Currency symbol toggle
- ✅ Currency symbol selection

## Additional Useful Formats
- **Decimal Precision**: 0, 1, 2, 3 decimals
- **Compact Notation**: K (thousands), M (millions), B (billions), T (trillions)
- **Currency Options**: None, $, €, £, ¥, custom symbol
- **Percentage**: With/without % symbol
- **Scientific Notation**: For very large/small numbers (1.23e+6)
- **Custom Suffixes**: "per month", "per user", "total", etc.
- **Rounding Methods**: Round, Floor, Ceil, Truncate
- **Color Coding**: Green for positive, red for negative
- **Minimum Thresholds**: Show "< 0.01" for very small numbers

## Format Structure
```javascript
{
  decimals: 2,           // 0, 1, 2, 3
  compact: false,        // true = use K/M/B/T
  currency: '$',         // '', '$', '€', '£', '¥', or custom
  percentage: false,     // true = add % symbol
  scientific: false,     // true = use scientific notation
  suffix: '',            // custom suffix like "per month"
  rounding: 'round',     // 'round', 'floor', 'ceil', 'trunc'
  colorize: false,       // true = color positive/negative
  minThreshold: 0.01     // show "< 0.01" for smaller values
}
```

## Implementation Steps

### 1. Data Structure Changes
- Add `format` object to metric structure in useMetrics.js
- Update addMetric() to include default format
- Update import/export to handle format field

### 2. MetricDetails.vue Updates
- Add comprehensive format editor section
- Group related options logically
- Provide presets for common formats
- Real-time preview of format

### 3. MetricTable.vue Updates
- Update formatValue function to use metric.format
- Implement all formatting logic
- Add color styling for positive/negative values

### 4. Format Logic Implementation
- Create formatValue utility function
- Handle all format combinations
- Ensure backward compatibility

### 5. UI/UX Considerations
- Intuitive format selector
- Format presets (Currency, Percentage, Compact, etc.)
- Live preview
- Clear visual feedback

## Backward Compatibility
- Existing metrics without format field get default format
- Old formatValue logic becomes fallback
- Import old data seamlessly

## Testing Scenarios
- Currency formatting with different symbols
- Compact notation for large numbers
- Percentage display
- Custom suffixes
- Color coding for financial data
- Edge cases (very large/small numbers)