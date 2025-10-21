/**
 * Logseq Markdown Parser for Business Model Documents
 * Handles parsing of unified documents with Document, Projections, and Artifacts sections
 */

export class LogseqParser {
  constructor() {
    this.reset()
  }

  reset() {
    this.sections = {
      document: [],
      projections: [],
      artifacts: []
    }
    this.currentSection = 'document'
  }

  parseDocument(content) {
    const lines = content.split('\n')
    this.reset()

    for (const line of lines) {
      this.parseLine(line)
    }

    return {
      document: this.sections.document.join('\n'),
      projections: this.sections.projections.join('\n'),
      artifacts: this.sections.artifacts.join('\n')
    }
  }

  parseLine(line) {
    // Detect section changes (H1 headers)
    if (line.startsWith('# Projections')) {
      this.currentSection = 'projections'
    } else if (line.startsWith('# Artifacts')) {
      this.currentSection = 'artifacts'
    }

    // Add line to current section
    this.sections[this.currentSection].push(line)
  }
}

export class ProjectionsParser {
  constructor() {
    this.reset()
  }

  reset() {
    this.metrics = []
    this.metadata = {
      selectedMetricId: null,
      viewMode: 'monthly',
      chartMetrics: []
    }
    this.currentMetric = null
    this.currentSubsection = null
    this.inMetricsSection = false
    this.parsingState = 'metadata' // metadata, metrics, values, format
  }

  parse(content) {
    const lines = content.split('\n')
    this.reset()

    for (let i = 0; i < lines.length; i++) {
      this.parseLine(lines[i], i, lines)
    }

    // Add last metric if exists
    this.finalizeCurrentMetric()

    console.log('Final metrics parsed:', this.metrics.length)
    this.metrics.forEach((m, idx) => {
      console.log(`Metric ${idx}: ${m.name} (${m.type}) - values:`, Object.keys(m.values || {}).length)
    })

    return {
      metrics: this.metrics,
      ...this.metadata
    }
  }

  parseLine(line, index, allLines) {
    const trimmed = line.trim()

    // Skip empty lines
    if (!trimmed) return

    console.log(`Line ${index}: "${trimmed}" (state: ${this.parsingState})`)

    // Parse based on current state
    switch (this.parsingState) {
      case 'metadata':
        if (this.parseMetadata(trimmed)) {
          console.log('Parsed metadata')
          return
        }
        if (this.detectMetricsSection(trimmed)) {
          console.log('Detected metrics section')
          this.parsingState = 'metrics'
          return
        }
        break

      case 'metrics':
        if (this.parseMetricHeader(trimmed)) {
          console.log('Parsed metric header')
          return
        }
        if (this.parseSubsectionHeader(trimmed)) {
          console.log('Parsed subsection header')
          return
        }
        if (this.parseMetricProperty(trimmed)) {
          console.log('Parsed metric property')
          return
        }
        break

      case 'values':
        if (this.parseValueEntry(trimmed)) {
          console.log('Parsed value entry')
          return
        }
        if (this.parseSubsectionHeader(trimmed)) {
          console.log('Parsed subsection header from values')
          return
        }
        break

      case 'format':
        if (this.parseFormatProperty(trimmed)) {
          console.log('Parsed format property')
          return
        }
        if (this.parseSubsectionHeader(trimmed)) {
          console.log('Parsed subsection header from format')
          return
        }
        break
    }

    console.log('Line not parsed')
  }

  parseMetadata(trimmed) {
    const metadataMappings = {
      'selectedMetricId': (value) => { this.metadata.selectedMetricId = value },
      'viewMode': (value) => { this.metadata.viewMode = value },
      'chartMetrics': (value) => {
        try {
          this.metadata.chartMetrics = JSON.parse(value)
        } catch (e) {
          this.metadata.chartMetrics = []
        }
      },
      'tags': (value) => {
        // Tags are handled at document level, skip for now
      }
    }

    for (const [prop, setter] of Object.entries(metadataMappings)) {
      // Check both formats: new (property:: value) and legacy (- property:: value)
      if (trimmed.startsWith(`${prop}::`) || trimmed.startsWith(`- ${prop}::`)) {
        const value = trimmed.split('::')[1].trim()
        setter(value)
        return true
      }
    }

    return false
  }

  detectMetricsSection(trimmed) {
    return trimmed === '## Business Metrics (Metrics Array)' ||
            trimmed === '## Metrics' ||
            trimmed === '- ## Metrics'
  }

  parseMetricHeader(trimmed) {
    // H3 header for new metric (new format)
    if (trimmed.startsWith('### [[') && trimmed.includes(']]')) {
      this.finalizeCurrentMetric()
      this.startNewMetric(trimmed)
      this.parsingState = 'metrics'
      return true
    }
    // Legacy metric header (* [[Name]])
    if (trimmed.startsWith('* [[') && trimmed.includes(']]')) {
      this.finalizeCurrentMetric()
      this.startNewMetric(trimmed.replace('* ', '### '))
      this.parsingState = 'metrics'
      return true
    }
    // Dash-prefixed metric header (- [[Name]])
    if (trimmed.startsWith('- [[') && trimmed.includes(']]')) {
      this.finalizeCurrentMetric()
      this.startNewMetric(trimmed.replace('- ', '### '))
      this.parsingState = 'metrics'
      return true
    }
    return false
  }

  parseSubsectionHeader(trimmed) {
    // H4 headers for subsections (new format)
    if (trimmed.startsWith('#### ')) {
      const subsection = trimmed.substring(5).toLowerCase().replace(/[^a-z]/g, '')
      this.currentSubsection = subsection

      switch (subsection) {
        case 'values':
          this.parsingState = 'values'
          break
        case 'format':
          this.parsingState = 'format'
          break
        default:
          this.parsingState = 'metrics'
      }
      return true
    }

    // Legacy subsection detection (property lines that indicate subsections)
    if (trimmed.startsWith('- ') && trimmed.includes('::')) {
      const [prop] = trimmed.substring(2).split('::')
      const propName = prop.trim()

      if (propName === 'values') {
        this.parsingState = 'values'
        return true
      } else if (propName === 'format') {
        this.parsingState = 'format'
        return true
      }
    }

    // Legacy metric header detection (when we're in format state and encounter a new metric)
    if ((trimmed.startsWith('* [[') || trimmed.startsWith('- [[')) && trimmed.includes(']]')) {
      // Finalize current metric and start new one
      this.finalizeCurrentMetric()
      this.startNewMetric(trimmed.replace(/^[*|-]\s+/, '### '))
      this.parsingState = 'metrics'
      return true
    }

    return false
  }

  parseMetricProperty(trimmed) {
    if (!trimmed.includes('::')) return false

    let prop, value
    if (trimmed.startsWith('- ')) {
      // Legacy format: - property:: value
      [prop, ...value] = trimmed.substring(2).split('::')
    } else {
      // New format: property:: value
      [prop, ...value] = trimmed.split('::')
    }

    prop = prop.trim()
    const fullValue = value.join('::').trim()

    // Special handling for values property - switch to values state
    if (prop === 'values') {
      this.parsingState = 'values'
      return true
    }

    // Special handling for format property - switch to format state
    if (prop === 'format') {
      this.parsingState = 'format'
      return true
    }

    this.setMetricProperty(prop, fullValue)
    return true
  }

  parseValueEntry(trimmed) {
    if (!trimmed.includes('::')) return false

    let key, value
    if (trimmed.startsWith('- ')) {
      // Legacy format: - key:: value
      [key, ...value] = trimmed.substring(2).split('::')
    } else {
      // New format: key:: value
      [key, ...value] = trimmed.split('::')
    }

    if (key.match(/^\d+-\d+$/) && this.currentMetric) {
      this.currentMetric.values[key.trim()] = parseFloat(value.join('::').trim()) || 0
      return true
    }
    return false
  }

  parseFormatProperty(trimmed) {
    if (!trimmed.includes('::')) return false

    let prop, value
    if (trimmed.startsWith('- ')) {
      // Legacy format: - property:: value
      [prop, ...value] = trimmed.substring(2).split('::')
    } else {
      // New format: property:: value
      [prop, ...value] = trimmed.split('::')
    }

    this.setFormatProperty(prop.trim(), value.join('::').trim())
    return true
  }

  finalizeCurrentMetric() {
    if (this.currentMetric) {
      // Ensure all required properties are set
      this.ensureMetricDefaults()
      this.metrics.push(this.currentMetric)
      this.currentMetric = null
      this.currentSubsection = null
      this.parsingState = 'metrics'
    }
  }

  startNewMetric(trimmed) {
    const nameMatch = trimmed.match(/\[\[([^\]]+)\]\]/)
    if (nameMatch) {
      this.currentMetric = {
        name: nameMatch[1],
        id: '',
        slug: '',
        description: '',
        type: 'variable',
        unit: '',
        color: '#f8f9fa',
        interpolation: 'linear',
        tags: [],
        values: {},
        format: this.getDefaultFormat()
      }
      this.currentSubsection = null
    }
  }

  setMetricProperty(prop, value) {
    if (!this.currentMetric) return

    switch (prop) {
      case 'id':
        this.currentMetric.id = value
        break
      case 'slug':
        this.currentMetric.slug = value
        break
      case 'description':
        this.currentMetric.description = value
        break
      case 'type':
        this.currentMetric.type = value
        if (value === 'calculated') {
          this.currentMetric.values = {} // Clear values for calculated metrics
        }
        break
      case 'unit':
        this.currentMetric.unit = value
        break
      case 'color':
        this.currentMetric.color = value
        break
      case 'interpolation':
        this.currentMetric.interpolation = value
        break
      case 'tags':
        this.currentMetric.tags = this.parseTags(value)
        break
      case 'formula':
        this.currentMetric.formula = value
        break
    }
  }

  setFormatProperty(prop, value) {
    if (!this.currentMetric || !this.currentMetric.format) return

    if (prop === 'decimals' || prop === 'minThreshold') {
      this.currentMetric.format[prop] = parseFloat(value) || 0
    } else if (['compact', 'percentage', 'scientific', 'colorize'].includes(prop)) {
      this.currentMetric.format[prop] = value === 'true'
    } else {
      this.currentMetric.format[prop] = value
    }
  }

  parseTags(value) {
    if (value.startsWith('[[') && value.includes(']], [[')) {
      return value.split(']], [[').map(tag =>
        tag.replace(/\[\[|\]\]/g, '').trim()
      )
    }
    try {
      return JSON.parse(value) || []
    } catch (e) {
      return []
    }
  }

  getDefaultFormat() {
    return {
      decimals: 2,
      compact: false,
      currency: '',
      percentage: false,
      scientific: false,
      suffix: '',
      rounding: 'round',
      colorize: false,
      minThreshold: 0.01
    }
  }

  ensureMetricDefaults() {
    if (!this.currentMetric) return

    // Generate slug if missing
    if (!this.currentMetric.slug) {
      this.currentMetric.slug = this.generateSlug(this.currentMetric.name)
    }

    // Ensure format object exists
    if (!this.currentMetric.format) {
      this.currentMetric.format = this.getDefaultFormat()
    }

    // Ensure values object exists for variable metrics
    if (this.currentMetric.type === 'variable' && !this.currentMetric.values) {
      this.currentMetric.values = {}
    }
  }

  generateSlug(name) {
    return name.toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '')
  }
}

// Backward compatibility parser for old format
export class LegacyProjectionsParser extends ProjectionsParser {
  parseLine(line, index, allLines) {
    const trimmed = line.trim()

    // Try new format first
    const result = super.parseLine(line, index, allLines)
    if (result !== false) return result

    // Fallback to legacy parsing
    return this.parseLegacyLine(line, index, allLines)
  }

  parseLegacyLine(line, index, allLines) {
    const trimmed = line.trim()

    // Legacy metadata parsing (with asterisks)
    if (trimmed.startsWith('* selectedMetricId::')) {
      this.metadata.selectedMetricId = trimmed.split('::')[1].trim()
      return
    } else if (trimmed.startsWith('* viewMode::')) {
      this.metadata.viewMode = trimmed.split('::')[1].trim()
      return
    } else if (trimmed.startsWith('* chartMetrics::')) {
      const chartMetricsStr = trimmed.split('::')[1].trim()
      try {
        this.metadata.chartMetrics = JSON.parse(chartMetricsStr)
      } catch (e) {
        this.metadata.chartMetrics = []
      }
      return
    }

    // Legacy metrics section detection
    if (trimmed === '* ## Business Metrics (Metrics Array)' ||
        trimmed === '## Business Metrics (Metrics Array)') {
      this.inMetricsSection = true
      return
    }

    // Legacy metric parsing
    if (this.inMetricsSection) {
      // New metric (old format with asterisks)
      if ((trimmed.startsWith('* [[') || trimmed.startsWith('- [[')) && trimmed.includes(']]')) {
        this.finalizeCurrentMetric()
        const nameMatch = trimmed.match(/\[\[([^\]]+)\]\]/)
        if (nameMatch) {
          this.startNewMetric(`### [[${nameMatch[1]}]]`)
        }
        return
      }

      // Legacy property parsing (indented with asterisks or dashes)
      if ((line.startsWith('  * ') || line.startsWith('  - ') || line.startsWith(' * ') || line.startsWith(' - ')) &&
          trimmed.includes('::')) {
        let propLine = trimmed

        // Remove leading dash or asterisk if present
        if (propLine.startsWith('- ') || propLine.startsWith('* ')) {
          propLine = propLine.substring(2).trim()
        }

        if (propLine.includes('::')) {
          const [prop, ...valueParts] = propLine.split('::')
          const value = valueParts.join('::').trim()
          this.setMetricProperty(prop.trim(), value)
        }
      }

      // Legacy values parsing
      if ((line.startsWith('    * ') || line.startsWith('    - ') || line.startsWith('  * ') || line.startsWith('  - ')) &&
          trimmed.includes('::')) {
        let valueLine = trimmed

        if (valueLine.startsWith('- ') || valueLine.startsWith('* ')) {
          valueLine = valueLine.substring(2).trim()
        }

        if (valueLine.includes('::')) {
          const [key, ...valueParts] = valueLine.split('::')
          const value = valueParts.join('::').trim()

          if (key.match(/^\d+-\d+$/) && this.currentMetric) {
            this.currentMetric.values[key.trim()] = parseFloat(value) || 0
          } else {
            // Could be format property in old format
            this.setFormatProperty(key.trim(), value)
          }
        }
      }
    }
  }
}