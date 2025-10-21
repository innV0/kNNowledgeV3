# Tags Implementation Plan for Metrics

## Overview
Add a tags field to metrics that allows users to categorize metrics and filter the table by tags.

## Current Architecture Analysis
- **Metrics data structure**: Objects with id, name, slug, description, unit, color, type, values, interpolation, yearlyAggregation, formula
- **Components**: MetricTable.vue (displays table), MetricDetails.vue (editing), useMetrics.js (logic)
- **Data flow**: Metrics stored in reactive array, edited through composable functions

## Implementation Steps

### 1. Data Structure Changes
- Add `tags: []` field to metric objects
- Update `addMetric()` function to include empty tags array
- Update `importData()` to handle tags field (backward compatible)

### 2. MetricDetails.vue Updates
- Add tags input section in edit mode
- Support comma-separated tag input
- Display tags as badges when not editing
- Allow adding/removing individual tags

### 3. MetricTable.vue Updates
- Add tags column to table header
- Display tags as small badges in table cells
- Add filter controls above table:
  - Multi-select dropdown for available tags
  - "Show all" / "Filter by tags" toggle
- Implement filtering logic to show only metrics with selected tags

### 4. useMetrics.js Updates
- Add tag filtering functionality
- Update export/import to include tags
- Ensure backward compatibility with existing data

### 5. Sample Data Updates
- Add example tags to sample-data.json
- Include various tag categories (revenue, costs, customers, etc.)

## UI/UX Considerations
- Tags displayed as small colored badges
- Filter interface should be intuitive and non-intrusive
- Support for multiple tags per metric
- Case-insensitive tag matching
- Easy tag management in edit mode

## Technical Details
- Tags stored as array of strings
- Filtering uses intersection logic (metric must have ALL selected tags)
- Reactive updates when tags change
- Maintain existing functionality while adding new features

## Testing Requirements
- Create metrics with tags
- Filter table by single tag
- Filter table by multiple tags
- Import/export data with tags
- Backward compatibility with old data