export function useProjections() {
  const calculateProjections = (metrics) => {
    if (metrics.length === 0) return []
    const months = 61
    const data = {}
    const hardcodedIds = ['totalUnits', 'salesRevenue', 'totalInflow', 'totalCogs', 'totalOutflow', 'cashBalance']

    metrics.forEach(m => {
      data[m.id] = new Array(months).fill(0)
    })

    // Interpolate values for variable metrics
    metrics.forEach(m => {
      if (m.type === 'variable') {
        const interpolated = interpolateValues(m)
        data[m.id] = interpolated
      }
    })

    // Set initial values for hardcoded calculations
    if (data.cashBalance) {
      data.cashBalance[0] = 0
    }

    // Calculate custom calculated metrics at month 0
    metrics.forEach(m => {
      if (m.type === 'calculated' && m.formula && !hardcodedIds.includes(m.id)) {
        data[m.id][0] = evaluateFormula(m.formula, 0, data, metrics)
      }
    })

    // Calculate for each month
    for (let month = 1; month < months; month++) {

      // Calculate derived
      if (data.totalUnits && data.totalCustomers && data.unitsPerCustomer) {
        data.totalUnits[month] = data.totalCustomers[month] * data.unitsPerCustomer[month]
      }
      if (data.salesRevenue && data.totalUnits && data.pricePerUnit) {
        data.salesRevenue[month] = data.totalUnits[month] * data.pricePerUnit[month]
      }
      if (data.totalInflow && data.salesRevenue && data.otherInflows) {
        data.totalInflow[month] = data.salesRevenue[month] + data.otherInflows[month]
      }
      if (data.totalCogs && data.totalUnits && data.cogsPerUnit) {
        data.totalCogs[month] = data.totalUnits[month] * data.cogsPerUnit[month]
      }
      if (data.totalOutflow && data.totalCogs && data.fixedCosts && data.otherOutflows) {
        data.totalOutflow[month] = data.totalCogs[month] + data.fixedCosts[month] + data.otherOutflows[month]
      }
      if (data.cashBalance && data.totalInflow && data.totalOutflow) {
        data.cashBalance[month] = data.cashBalance[month - 1] + data.totalInflow[month] - data.totalOutflow[month]
      }

      // Calculate custom calculated metrics
      metrics.forEach(m => {
        if (m.type === 'calculated' && m.formula && !hardcodedIds.includes(m.id)) {
          data[m.id][month] = evaluateFormula(m.formula, month, data, metrics)
        }
      })
    }

    // Prepare result
    return metrics.map(m => {
      const isCurrency = m.unit === '$'
      const isPercentage = m.unit === '%'
      return {
        name: m.name,
        values: data[m.id],
        isCurrency,
        isPercentage,
        yearlyAggregation: m.yearlyAggregation || 'last'
      }
    })
  }

  const interpolateValues = (metric) => {
    if (!metric || metric.type !== 'variable' || !metric.values) return new Array(60).fill(0)

    const result = new Array(60).fill(0)
    const knownPoints = []

    // Collect known values
    Object.entries(metric.values).forEach(([key, value]) => {
      const [year, month] = key.split('-').map(Number)
      const monthIndex = (year - 1) * 12 + (month - 1)
      if (monthIndex >= 0 && monthIndex < 60) {
        knownPoints.push({ index: monthIndex, value: Number(value) })
      }
    })

    // Sort by index
    knownPoints.sort((a, b) => a.index - b.index)

    if (knownPoints.length === 0) return result
    if (knownPoints.length === 1) {
      // Single value, fill all with this value
      return result.fill(knownPoints[0].value)
    }

    // Linear interpolation between known points
    for (let i = 0; i < knownPoints.length - 1; i++) {
      const start = knownPoints[i]
      const end = knownPoints[i + 1]

      result[start.index] = start.value
      result[end.index] = end.value

      // Interpolate between points
      const steps = end.index - start.index
      const stepValue = (end.value - start.value) / steps

      for (let j = 1; j < steps; j++) {
        result[start.index + j] = start.value + (stepValue * j)
      }
    }

    // Fill remaining gaps with nearest known value
    for (let i = 0; i < 60; i++) {
      if (result[i] === 0 && knownPoints.length > 0) {
        // Find nearest known point
        const nearest = knownPoints.reduce((prev, curr) =>
          Math.abs(curr.index - i) < Math.abs(prev.index - i) ? curr : prev
        )
        result[i] = nearest.value
      }
    }

    return result
  }

  const evaluateFormula = (formula, month, data, metrics) => {
    const tokens = formula.split(' ')
    if (tokens.length < 3 || tokens.length % 2 === 0) return 0 // Must be odd number: val op val op val...

    let result = getValue(tokens[0], month, data, metrics)

    for (let i = 1; i < tokens.length; i += 2) {
      const op = tokens[i]
      const nextVal = getValue(tokens[i + 1], month, data, metrics)
      if (op === '+') result += nextVal
      else if (op === '*') result *= nextVal
      else if (op === '/') result /= nextVal
      else if (op === '-') result -= nextVal
    }

    return result
  }

  const getValue = (token, month, data, metrics) => {
    if (token.includes(':')) {
      // It's a metric reference: slug:offset
      const [slug, offsetStr] = token.split(':')
      const offset = parseInt(offsetStr) || 0
      const metric = metrics.find(m => m.slug === slug)
      if (metric && data[metric.id]) {
        const idx = month + offset
        return (idx >= 0 && idx < data[metric.id].length) ? data[metric.id][idx] : 0
      }
    } else {
      // It's a constant number
      return parseFloat(token) || 0
    }
    return 0
  }

  return {
    calculateProjections
  }
}