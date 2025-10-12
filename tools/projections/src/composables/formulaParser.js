// Enhanced Formula Parser for Financial Projections
// Supports advanced mathematical expressions with functions and operators

export class FormulaParser {
  constructor(metrics) {
    this.metrics = metrics
    this.functions = {
      // Statistical functions
      'SUM': this.sumFunction.bind(this),
      'AVG': this.avgFunction.bind(this),
      'MIN': this.minFunction.bind(this),
      'MAX': this.maxFunction.bind(this),

      // Growth and change functions
      'GROWTH': this.growthFunction.bind(this),
      'DELTA': this.deltaFunction.bind(this),
      'PCT_CHANGE': this.pctChangeFunction.bind(this),

      // Financial functions
      'ROI': this.roiFunction.bind(this),
      'MARGIN': this.marginFunction.bind(this),
      'RATIO': this.ratioFunction.bind(this),

      // Temporal functions
      'CUMULATIVE': this.cumulativeFunction.bind(this),
      'MOVING_AVG': this.movingAvgFunction.bind(this)
    }
  }

  // Tokenize the expression
  tokenize(expression) {
    const tokens = []
    let i = 0

    while (i < expression.length) {
      const char = expression[i]

      // Skip whitespace
      if (/\s/.test(char)) {
        i++
        continue
      }

      // Numbers
      if (/\d|\./.test(char)) {
        let num = ''
        while (i < expression.length && (/\d|\./.test(expression[i]))) {
          num += expression[i]
          i++
        }
        tokens.push({ type: 'number', value: parseFloat(num) })
        continue
      }

      // Identifiers (function names and metric names)
      if (/[a-zA-Z_]/.test(char)) {
        let ident = ''
        while (i < expression.length && /[a-zA-Z0-9_]/.test(expression[i])) {
          ident += expression[i]
          i++
        }
        tokens.push({ type: 'identifier', value: ident })
        continue
      }

      // Operators
      if ('+-*/^%'.includes(char)) {
        tokens.push({ type: 'operator', value: char })
        i++
        continue
      }

      // Special operators (// for integer division)
      if (char === '/' && i + 1 < expression.length && expression[i + 1] === '/') {
        tokens.push({ type: 'operator', value: '//' })
        i += 2
        continue
      }

      // Parentheses
      if ('()'.includes(char)) {
        tokens.push({ type: 'parenthesis', value: char })
        i++
        continue
      }

      // Colon (for metric offsets)
      if (char === ':') {
        tokens.push({ type: 'colon', value: char })
        i++
        continue
      }

      // Comma (function arguments)
      if (char === ',') {
        tokens.push({ type: 'comma', value: char })
        i++
        continue
      }

      // Unknown character
      throw new Error(`Unexpected character: ${char} at position ${i}`)
    }

    return tokens
  }

  // Parse tokens into AST
  parse(tokens) {
    this.tokens = tokens
    this.current = 0
    return this.parseExpression()
  }

  parseExpression() {
    return this.parseAddition()
  }

  parseAddition() {
    let left = this.parseMultiplication()

    while (this.current < this.tokens.length) {
      const token = this.tokens[this.current]
      if (token.type === 'operator' && (token.value === '+' || token.value === '-')) {
        this.current++
        const right = this.parseMultiplication()
        left = {
          type: 'binary',
          operator: token.value,
          left: left,
          right: right
        }
      } else {
        break
      }
    }

    return left
  }

  parseMultiplication() {
    let left = this.parsePower()

    while (this.current < this.tokens.length) {
      const token = this.tokens[this.current]
      if (token.type === 'operator' && (token.value === '*' || token.value === '/' || token.value === '//' || token.value === '%')) {
        this.current++
        const right = this.parsePower()
        left = {
          type: 'binary',
          operator: token.value,
          left: left,
          right: right
        }
      } else {
        break
      }
    }

    return left
  }

  parsePower() {
    let left = this.parseUnary()

    while (this.current < this.tokens.length) {
      const token = this.tokens[this.current]
      if (token.type === 'operator' && token.value === '^') {
        this.current++
        const right = this.parseUnary()
        left = {
          type: 'binary',
          operator: token.value,
          left: left,
          right: right
        }
      } else {
        break
      }
    }

    return left
  }

  parseUnary() {
    const token = this.tokens[this.current]

    if (token.type === 'operator' && (token.value === '+' || token.value === '-')) {
      this.current++
      return {
        type: 'unary',
        operator: token.value,
        operand: this.parseUnary()
      }
    }

    return this.parsePrimary()
  }

  parsePrimary() {
    const token = this.tokens[this.current]

    // Parenthesized expression
    if (token.type === 'parenthesis' && token.value === '(') {
      this.current++
      const expr = this.parseExpression()
      if (this.tokens[this.current]?.type === 'parenthesis' && this.tokens[this.current]?.value === ')') {
        this.current++
        return expr
      } else {
        throw new Error('Expected closing parenthesis')
      }
    }

    // Function call
    if (token.type === 'identifier' && this.tokens[this.current + 1]?.type === 'parenthesis' && this.tokens[this.current + 1]?.value === '(') {
      return this.parseFunctionCall()
    }

    // Metric reference
    if (token.type === 'identifier') {
      return this.parseMetricReference()
    }

    // Number literal
    if (token.type === 'number') {
      this.current++
      return { type: 'number', value: token.value }
    }

    throw new Error(`Unexpected token: ${token.type} ${token.value}`)
  }

  parseFunctionCall() {
    const functionName = this.tokens[this.current].value
    this.current += 2 // Skip function name and opening parenthesis

    const args = []
    while (this.current < this.tokens.length && !(this.tokens[this.current].type === 'parenthesis' && this.tokens[this.current].value === ')')) {
      args.push(this.parseExpression())
      if (this.tokens[this.current]?.type === 'comma') {
        this.current++
      }
    }

    if (this.tokens[this.current]?.type === 'parenthesis' && this.tokens[this.current]?.value === ')') {
      this.current++
    } else {
      throw new Error('Expected closing parenthesis in function call')
    }

    return {
      type: 'function',
      name: functionName,
      arguments: args
    }
  }

  parseMetricReference() {
    const metricName = this.tokens[this.current].value
    this.current++

    let offset = 0
    if (this.tokens[this.current]?.type === 'colon') {
      this.current++
      if (this.tokens[this.current]?.type === 'operator' && (this.tokens[this.current].value === '+' || this.tokens[this.current].value === '-')) {
        const sign = this.tokens[this.current].value
        this.current++
        if (this.tokens[this.current]?.type === 'number') {
          offset = sign === '-' ? -this.tokens[this.current].value : this.tokens[this.current].value
          this.current++
        } else {
          throw new Error('Expected number after +/- in metric offset')
        }
      } else if (this.tokens[this.current]?.type === 'number') {
        offset = this.tokens[this.current].value
        this.current++
      }
    }

    return {
      type: 'metric',
      name: metricName,
      offset: offset
    }
  }

  // Evaluate AST with data
  evaluate(ast, periodIndex = 0) {
    switch (ast.type) {
      case 'number':
        return ast.value

      case 'metric':
        return this.evaluateMetric(ast, periodIndex)

      case 'binary':
        return this.evaluateBinary(ast, periodIndex)

      case 'unary':
        return this.evaluateUnary(ast, periodIndex)

      case 'function':
        return this.evaluateFunction(ast, periodIndex)

      default:
        throw new Error(`Unknown AST node type: ${ast.type}`)
    }
  }

  evaluateMetric(ast, periodIndex) {
    const metric = this.metrics.value.find(m => m.slug === ast.name)
    if (!metric) {
      throw new Error(`Metric not found: ${ast.name}`)
    }

    const targetPeriod = periodIndex + ast.offset
    if (targetPeriod < 0 || targetPeriod >= 60) {
      return 0 // Out of bounds, return 0
    }

    const values = interpolateValues(metric)
    return values[targetPeriod] || 0
  }

  evaluateBinary(ast, periodIndex) {
    const left = this.evaluate(ast.left, periodIndex)
    const right = this.evaluate(ast.right, periodIndex)

    switch (ast.operator) {
      case '+': return left + right
      case '-': return left - right
      case '*': return left * right
      case '/':
        if (right === 0) throw new Error('Division by zero')
        return left / right
      case '//':
        if (right === 0) throw new Error('Division by zero')
        return Math.floor(left / right)
      case '%':
        if (right === 0) throw new Error('Modulo by zero')
        return left % right
      case '^': return Math.pow(left, right)
      default: throw new Error(`Unknown operator: ${ast.operator}`)
    }
  }

  evaluateUnary(ast, periodIndex) {
    const operand = this.evaluate(ast.operand, periodIndex)
    return ast.operator === '-' ? -operand : operand
  }

  evaluateFunction(ast, periodIndex) {
    const func = this.functions[ast.name.toUpperCase()]
    if (!func) {
      throw new Error(`Unknown function: ${ast.name}`)
    }
    return func(ast.arguments, periodIndex)
  }

  // Mathematical functions
  sumFunction(args, periodIndex) {
    const [metricRef, periods = 1] = args
    let sum = 0
    for (let i = 0; i < periods; i++) {
      sum += this.evaluate(metricRef, periodIndex - i)
    }
    return sum
  }

  avgFunction(args, periodIndex) {
    const [metricRef, periods = 1] = args
    return this.sumFunction(args, periodIndex) / periods
  }

  minFunction(args, periodIndex) {
    const [metricRef, periods = 1] = args
    let min = Infinity
    for (let i = 0; i < periods; i++) {
      const val = this.evaluate(metricRef, periodIndex - i)
      if (val < min) min = val
    }
    return min === Infinity ? 0 : min
  }

  maxFunction(args, periodIndex) {
    const [metricRef, periods = 1] = args
    let max = -Infinity
    for (let i = 0; i < periods; i++) {
      const val = this.evaluate(metricRef, periodIndex - i)
      if (val > max) max = val
    }
    return max === -Infinity ? 0 : max
  }

  growthFunction(args, periodIndex) {
    const [metricRef, periods = 1] = args
    const current = this.evaluate(metricRef, periodIndex)
    const past = this.evaluate(metricRef, periodIndex - periods)
    if (past === 0) return 0
    return Math.pow(current / past, 1 / periods) - 1
  }

  deltaFunction(args, periodIndex) {
    const [metricRef] = args
    return this.evaluate(metricRef, periodIndex) - this.evaluate(metricRef, periodIndex - 1)
  }

  pctChangeFunction(args, periodIndex) {
    const [metricRef] = args
    const current = this.evaluate(metricRef, periodIndex)
    const past = this.evaluate(metricRef, periodIndex - 1)
    if (past === 0) return 0
    return (current - past) / past
  }

  roiFunction(args, periodIndex) {
    const [returnMetric, costMetric] = args
    const returns = this.evaluate(returnMetric, periodIndex)
    const costs = this.evaluate(costMetric, periodIndex)
    if (costs === 0) return 0
    return (returns - costs) / costs
  }

  marginFunction(args, periodIndex) {
    const [numerator, denominator] = args
    const num = this.evaluate(numerator, periodIndex)
    const den = this.evaluate(denominator, periodIndex)
    if (den === 0) return 0
    return num / den
  }

  ratioFunction(args, periodIndex) {
    return this.marginFunction(args, periodIndex)
  }

  cumulativeFunction(args, periodIndex) {
    const [metricRef] = args
    let sum = 0
    for (let i = 0; i <= periodIndex; i++) {
      sum += this.evaluate(metricRef, i)
    }
    return sum
  }

  movingAvgFunction(args, periodIndex) {
    const [metricRef, window = 3] = args
    let sum = 0
    let count = 0
    for (let i = 0; i < window; i++) {
      const val = this.evaluate(metricRef, periodIndex - i)
      if (!isNaN(val)) {
        sum += val
        count++
      }
    }
    return count > 0 ? sum / count : 0
  }

  // Validation
  validate(expression) {
    try {
      const tokens = this.tokenize(expression)
      const ast = this.parse(tokens)
      return { valid: true, ast, error: null }
    } catch (error) {
      return { valid: false, ast: null, error: error.message }
    }
  }

  // Get suggestions for auto-complete
  getSuggestions(expression, cursorPosition) {
    // This would be implemented for auto-complete functionality
    // For now, return basic suggestions
    return {
      metrics: this.metrics.value.map(m => m.slug),
      functions: Object.keys(this.functions),
      operators: ['+', '-', '*', '/', '//', '%', '^']
    }
  }
}

// Helper function to interpolate values (imported from useMetrics)
function interpolateValues(metric) {
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

  if (metric.interpolation === 'none') {
    // No interpolation - only use explicitly entered values
    knownPoints.forEach(point => {
      result[point.index] = point.value
    })
    return result
  } else if (metric.interpolation === 'curve') {
    // Curve interpolation
    return interpolateCurve(knownPoints, result)
  } else {
    // Linear interpolation (default)
    return interpolateLinear(knownPoints, result)
  }
}

function interpolateLinear(knownPoints, result) {
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

function interpolateCurve(knownPoints, result) {
  // Enhanced curve interpolation using cubic Hermite spline
  knownPoints.forEach(point => {
    result[point.index] = point.value
  })

  // For each segment between known points, apply cubic interpolation
  for (let i = 0; i < knownPoints.length - 1; i++) {
    const p0 = knownPoints[Math.max(0, i - 1)]
    const p1 = knownPoints[i]
    const p2 = knownPoints[i + 1]
    const p3 = knownPoints[Math.min(knownPoints.length - 1, i + 2)]

    const steps = p2.index - p1.index
    if (steps <= 1) continue

    // Calculate tangents using Catmull-Rom spline approach
    const dt1 = p2.index - p0.index
    const dt2 = p3.index - p1.index

    const m1 = dt1 > 0 ? (p2.value - p0.value) / dt1 * 0.5 : 0
    const m2 = dt2 > 0 ? (p3.value - p1.value) / dt2 * 0.5 : 0

    // Apply cubic Hermite interpolation
    for (let j = 1; j < steps; j++) {
      const t = j / steps

      const h00 = 2*t*t*t - 3*t*t + 1
      const h10 = t*t*t - 2*t*t + t
      const h01 = -2*t*t*t + 3*t*t
      const h11 = t*t*t - t*t

      result[p1.index + j] = h00 * p1.value +
                           h10 * m1 * (p2.index - p1.index) +
                           h01 * p2.value +
                           h11 * m2 * (p2.index - p1.index)
    }
  }

  return result
}