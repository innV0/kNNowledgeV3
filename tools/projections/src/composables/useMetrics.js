import { ref, computed } from 'vue'

export function useMetrics(metrics, selectedMetricId, editMode, formulaMetric1, formulaOffset1, formulaOperation, formulaMetric2, formulaOffset2) {
  const chartMetrics = ref([])
  const currentType = ref('')

  const selectedMetric = computed(() => {
    if (!selectedMetricId.value || metrics.value.length === 0) return null
    return metrics.value.find(m => m.id === selectedMetricId.value)
  })

  const sanitizeForSlug = (str) => {
    return str.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '')
  }

  const generateUniqueSlug = (baseName, metrics, excludeId = null) => {
    let slug = sanitizeForSlug(baseName)
    if (!slug) slug = 'metric'
    let counter = 1
    let uniqueSlug = slug
    while (metrics.some(m => m.slug === uniqueSlug && m.id !== excludeId)) {
      uniqueSlug = `${slug}_${counter}`
      counter++
    }
    return uniqueSlug
  }

  const selectMetric = (id) => {
    selectedMetricId.value = id
    editMode.value = true
    if (selectedMetric.value) {
      currentType.value = selectedMetric.value.type
      if (selectedMetric.value.type === 'calculated' && selectedMetric.value.formula) {
        parseFormulaForBuilder(selectedMetric.value.formula)
      } else {
        formulaMetric1.value = ''
        formulaOffset1.value = 0
        formulaOperation.value = '+'
        formulaMetric2.value = ''
        formulaOffset2.value = 0
      }
    }
  }

  const getMetricIndex = (id) => {
    return metrics.value.findIndex(m => m.id === id)
  }

  const moveMetric = ({ oldIndex, newIndex }) => {
    const movedItem = metrics.value.splice(oldIndex, 1)[0]
    metrics.value.splice(newIndex, 0, movedItem)
    recalculate()
  }

  const deleteMetric = () => {
    if (confirm(`Are you sure you want to delete "${selectedMetric.value.name}"?`)) {
      const index = getMetricIndex(selectedMetricId.value)
      if (index > -1) {
        metrics.value.splice(index, 1)
        if (metrics.value.length > 0) {
          const newIndex = Math.min(index, metrics.value.length - 1)
          selectedMetricId.value = metrics.value[newIndex].id
        } else {
          selectedMetricId.value = null
        }
        recalculate()
      }
    }
  }

  const toggleEditMode = () => {
    if (editMode.value) {
      exportData()
    }
    editMode.value = !editMode.value
  }

  const toggleChart = () => {
    const index = chartMetrics.value.indexOf(selectedMetric.value.id)
    if (index > -1) {
      chartMetrics.value.splice(index, 1)
    } else {
      chartMetrics.value.push(selectedMetric.value.id)
    }
  }

  const updateType = (event) => {
    selectedMetric.value.type = event.target.value
    onTypeChange()
  }

  const onTypeChange = () => {
    if (selectedMetric.value.type === 'calculated') {
      selectedMetric.value.formula = ''
      selectedMetric.value.values = {} // Clear values for calculated metrics
      formulaMetric1.value = ''
      formulaOffset1.value = 0
      formulaOperation.value = '+'
      formulaMetric2.value = ''
      formulaOffset2.value = 0
      recalculate()
    } else if (selectedMetric.value.type === 'variable') {
      selectedMetric.value.formula = undefined
      if (!selectedMetric.value.values) {
        selectedMetric.value.values = {}
      }
      formulaMetric1.value = ''
      formulaOffset1.value = 0
      formulaOperation.value = '+'
      formulaMetric2.value = ''
      formulaOffset2.value = 0
      recalculate()
    }
  }

  const parseDependencies = (formula, currentMetricId = null) => {
    const deps = []
    const parts = formula.split(' ')
    if (parts.length === 3) {
      const [slugOffset1, , slugOffset2] = parts
      const [slug1, offset1Str] = slugOffset1.split(':')
      const [slug2, offset2Str] = slugOffset2.split(':')
      const offset1 = parseInt(offset1Str) || 0
      const offset2 = parseInt(offset2Str) || 0
      const m1 = metrics.value.find(m => m.slug === slug1)
      const m2 = metrics.value.find(m => m.slug === slug2)
      if (m1 && (m1.id !== currentMetricId || offset1 >= 0)) deps.push(m1.id)
      if (m2 && (m2.id !== currentMetricId || offset2 >= 0)) deps.push(m2.id)
    }
    return deps
  }

  const hasCycle = (startMetricId, newDeps) => {
    const graph = {}
    metrics.value.forEach(m => {
      if (m.type === 'calculated' && m.formula && m.id !== startMetricId) {
        graph[m.id] = parseDependencies(m.formula, m.id)
      } else {
        graph[m.id] = []
      }
    })
    graph[startMetricId] = newDeps

    const visited = new Set()
    const recStack = new Set()

    const dfs = (node) => {
      if (recStack.has(node)) return true
      if (visited.has(node)) return false
      visited.add(node)
      recStack.add(node)
      for (const dep of graph[node] || []) {
        if (dfs(dep)) return true
      }
      recStack.delete(node)
      return false
    }

    return dfs(startMetricId)
  }

  const updateFormula = () => {
    if (formulaMetric1.value && formulaMetric2.value) {
      const newFormula = `${formulaMetric1.value}:${formulaOffset1.value} ${formulaOperation.value} ${formulaMetric2.value}:${formulaOffset2.value}`
      const newDeps = parseDependencies(newFormula, selectedMetric.value.id)

      if (hasCycle(selectedMetric.value.id, newDeps)) {
        alert('This formula would create a circular dependency. Please choose different metrics.')
        return
      }

      selectedMetric.value.formula = newFormula
      recalculate()
    }
  }

  // Table-based value management
  const setMetricValue = (year, month, value) => {
    if (!selectedMetric.value || selectedMetric.value.type !== 'variable') return

    const key = `${year}-${month}`
    if (!selectedMetric.value.values) {
      selectedMetric.value.values = {}
    }

    if (value === '' || value === null || value === undefined) {
      delete selectedMetric.value.values[key]
    } else {
      selectedMetric.value.values[key] = parseFloat(value) || 0
    }

    recalculate()
  }

  const getMetricValue = (year, month) => {
    if (!selectedMetric.value || !selectedMetric.value.values) return ''
    const key = `${year}-${month}`
    return selectedMetric.value.values[key] !== undefined ? selectedMetric.value.values[key] : ''
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

  const addMetric = () => {
    const newId = 'custom_' + Date.now()
    const baseName = 'New Metric'
    const slug = generateUniqueSlug(baseName, metrics.value)
    const newMetric = {
      id: newId,
      name: baseName,
      slug: slug,
      description: 'Custom metric description',
      color: '#f8f9fa',
      type: 'variable',
      values: {},
      interpolation: 'linear'
    }
    metrics.value.push(newMetric)
    selectedMetricId.value = newId
    editMode.value = true
    recalculate()
  }

  const recalculate = () => {
    // Trigger reactivity
  }

  const formatValue = (val, isCurrency) => {
    if (typeof val !== 'number' || isNaN(val)) {
      return '0'
    }
    if (isCurrency) {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)
    }

    const absVal = Math.abs(val)
    if (absVal >= 100) {
      return Math.round(val).toString()
    } else if (absVal >= 10) {
      return val.toFixed(1)
    } else {
      const fixed = val.toFixed(2)
      return fixed.replace(/\.?0+$/, '')
    }
  }


  // Removed phase-related functions

  const getDetailedFormula = (metric) => {
    if (!metric || metric.type !== 'calculated') return ''

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

    const parts = metric.formula.split(' ')
    if (parts.length === 3) {
      const [slugOffset1, op, slugOffset2] = parts
      const [slug1, offset1Str] = slugOffset1.split(':')
      const [slug2, offset2Str] = slugOffset2.split(':')
      const offset1 = parseInt(offset1Str) || 0
      const offset2 = parseInt(offset2Str) || 0
      const m1 = metrics.value.find(m => m.slug === slug1)
      const m2 = metrics.value.find(m => m.slug === slug2)
      if (m1 && m2) {
        const offsetDesc1 = offset1 === 0 ? '' : offset1 < 0 ? ` (${Math.abs(offset1)} mes${Math.abs(offset1) > 1 ? 'es' : ''} atrás)` : ` (${offset1} mes${offset1 > 1 ? 'es' : ''} adelante)`
        const offsetDesc2 = offset2 === 0 ? '' : offset2 < 0 ? ` (${Math.abs(offset2)} mes${Math.abs(offset2) > 1 ? 'es' : ''} atrás)` : ` (${offset2} mes${offset2 > 1 ? 'es' : ''} adelante)`
        return `${m1.name}${offsetDesc1} ${op} ${m2.name}${offsetDesc2}`
      }
    }
    return metric.formula
  }

  const exportData = () => {
    const data = {
      metrics: metrics.value,
      selectedMetricId: selectedMetricId.value,
      viewMode: 'monthly', // This should come from parent
      chartMetrics: chartMetrics.value
    }
    const now = new Date()
    const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19)
    const filename = `projections-data-${timestamp}.json`
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const importData = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result)
          const newMetrics = (data.metrics || []).map(m => {
            const metric = {
              ...m,
              color: m.color || '#f8f9fa',
              unit: m.unit || '',
              values: m.values || {},
              interpolation: m.interpolation || 'linear'
            }
            if (!metric.slug) {
              metric.slug = generateUniqueSlug(metric.name, metrics.value)
            }
            return metric
          })
          metrics.value.splice(0, metrics.value.length, ...newMetrics)
          selectedMetricId.value = data.selectedMetricId || null
          chartMetrics.value = data.chartMetrics || []
          if (!selectedMetricId.value && metrics.value.length > 0) {
            selectedMetricId.value = metrics.value.find(m => m.type === 'variable')?.id || metrics.value[0].id
          }
          recalculate()
          // Trigger reactivity for chart update
          setTimeout(() => {
            metrics.value = [...metrics.value]
          }, 10)
        } catch (error) {
          alert('Error loading file: ' + error.message)
        }
      }
      reader.readAsText(file)
    }
  }

  const parseFormulaForBuilder = (formula) => {
    const parts = formula.split(' ')
    if (parts.length === 3) {
      const [slugOffset1, op, slugOffset2] = parts
      const [slug1, offset1Str] = slugOffset1.split(':')
      const [slug2, offset2Str] = slugOffset2.split(':')
      formulaMetric1.value = slug1
      formulaOffset1.value = parseInt(offset1Str) || 0
      formulaOperation.value = op
      formulaMetric2.value = slug2
      formulaOffset2.value = parseInt(offset2Str) || 0
      return
    }
    formulaMetric1.value = ''
    formulaOffset1.value = 0
    formulaOperation.value = '+'
    formulaMetric2.value = ''
    formulaOffset2.value = 0
  }

  return {
    chartMetrics,
    currentType,
    selectedMetric,
    selectMetric,
    getMetricIndex,
    moveMetric,
    deleteMetric,
    toggleEditMode,
    toggleChart,
    updateType,
    onTypeChange,
    updateFormula,
    setMetricValue,
    getMetricValue,
    interpolateValues,
    addMetric,
    recalculate,
    formatValue,
    getDetailedFormula,
    exportData,
    importData,
    parseFormulaForBuilder
  }
}