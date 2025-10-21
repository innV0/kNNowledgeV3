import { interpolateValues } from './useMetrics'
import { FormulaParser } from './formulaParser.js'

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


  const evaluateFormula = (formula, month, data, metrics) => {
    try {
      // Try new enhanced parser first
      const parser = new FormulaParser(metrics)
      const validation = parser.validate(formula)
      if (validation.valid) {
        return parser.evaluate(validation.ast, month)
      }
    } catch (error) {
      console.warn('Enhanced formula parser failed, falling back to legacy parser:', error.message)
    }

    // Fallback to legacy parser for backward compatibility
    const tokens = formula.split(' ')
    if (tokens.length < 3 || tokens.length % 2 === 0) return 0 // Must be odd number: val op val op val...

    let result = getValue(tokens[0], month, data, metrics)

    for (let i = 1; i < tokens.length; i += 2) {
      const op = tokens[i]
      const nextVal = getValue(tokens[i + 1], month, data, metrics)
      if (op === '+') result += nextVal
      else if (op === '*') result *= nextVal
      else if (op === '/') {
        if (nextVal === 0) {
          console.warn('Division by zero in legacy parser, returning 0')
          return 0
        }
        result /= nextVal
      }
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