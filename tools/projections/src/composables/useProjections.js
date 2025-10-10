export function useProjections() {
  const calculateProjections = (metrics) => {
    if (metrics.length === 0) return []
    const months = 61
    const data = {}
    const hardcodedIds = ['totalCustomers', 'totalUnits', 'salesRevenue', 'totalInflow', 'totalCogs', 'totalOutflow', 'cashBalance']

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
    if (data.totalCustomers && data.currentCustomers) {
      data.totalCustomers[0] = data.currentCustomers[0]
    }
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
      if (data.totalCustomers && data.newCustomers) {
        data.totalCustomers[month] = data.totalCustomers[month - 1] + data.newCustomers[month]
      }
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
      return {
        name: m.name,
        values: data[m.id],
        isCurrency,
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
    const parts = formula.split(' ')
    if (parts.length === 3) {
      const [slugOffset1, op, slugOffset2] = parts
      const [slug1, offset1Str] = slugOffset1.split(':')
      const [slug2, offset2Str] = slugOffset2.split(':')
      const offset1 = parseInt(offset1Str) || 0
      const offset2 = parseInt(offset2Str) || 0
      const m1 = metrics.find(m => m.slug === slug1)
      const m2 = metrics.find(m => m.slug === slug2)
      if (m1 && m2 && data[m1.id] && data[m2.id]) {
        const idx1 = month + offset1
        const idx2 = month + offset2
        const v1 = (idx1 >= 0 && idx1 < data[m1.id].length) ? data[m1.id][idx1] : 0
        const v2 = (idx2 >= 0 && idx2 < data[m2.id].length) ? data[m2.id][idx2] : 0
        if (op === '+') return v1 + v2
        if (op === '*') return v1 * v2
      }
    }
    return 0
  }

  return {
    calculateProjections
  }
}