<template>
  <div class="logseq-tree">
    <div v-for="(node, index) in treeData" :key="node.id" class="tree-node">
      <LogseqTreeNode
        :node="node"
        :level="0"
        :is-last="index === treeData.length - 1"
        @toggle-collapse="toggleCollapse"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import LogseqTreeNode from './LogseqTreeNode.vue'

// Props
const props = defineProps({
  content: {
    type: String,
    default: ''
  }
})

// No emits needed for read-only mode

// Reactive data
const treeData = ref([])
const nodeCounter = ref(0)

// Parse Logseq content into tree structure
const parseLogseqContent = (content) => {
  const lines = content.split('\n')
  const rootNodes = []
  const stack = []

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    // Skip lines that are just properties or metadata (like "tags::", "selectedMetricId::", etc.)
    // Also skip collapsed properties
    if ((trimmed.includes('::') && !trimmed.includes(' ') && !trimmed.startsWith('-') && !trimmed.startsWith('\t')) ||
        trimmed.includes('collapsed::') ||
        trimmed.startsWith('systemMetrics::')) continue

    // Determine level based on leading dashes or header level
    let level = 0
    let content = line

    // Count leading dashes for indentation level
    while (content.startsWith('-') && level < 10) {
      content = content.substring(1).trim()
      level++
    }

    // Handle headers as level indicators
    if (content.startsWith('#')) {
      const headerMatch = content.match(/^(#+)/)
      if (headerMatch) {
        level = headerMatch[1].length - 1 // # = level 0, ## = level 1, etc.
        content = content.substring(headerMatch[1].length).trim()
      }
    }

    // Special handling for tab-indented content (like in the file)
    if (content.startsWith('\t')) {
      const tabCount = content.match(/^\t*/)[0].length
      level += tabCount
      content = content.substring(tabCount)
    }

    // Skip empty content after processing
    if (!content.trim()) continue

    // Create node
    const node = {
      id: `node_${nodeCounter.value++}`,
      content: content,
      level: level,
      collapsed: false,
      children: [],
      properties: {},
      tags: [],
      references: []
    }

    // Parse Logseq-specific syntax
    node.properties = parseProperties(content)
    node.tags = parseTags(content)
    node.references = parseReferences(content)
    node.collapsed = parseCollapsedState(content)

    // Clean content for display (remove parsed elements)
    node.displayContent = cleanContent(content)

    // Find parent based on level
    while (stack.length > 0 && stack[stack.length - 1].level >= level) {
      stack.pop()
    }

    if (stack.length === 0) {
      rootNodes.push(node)
    } else {
      stack[stack.length - 1].children.push(node)
    }

    stack.push(node)
  }

  return rootNodes
}

// Parse Logseq properties (key:: value)
const parseProperties = (content) => {
  const properties = {}
  const propRegex = /(\w+)::\s*([^:\n]+)(?=\s+\w+::|$)/g
  let match
  while ((match = propRegex.exec(content)) !== null) {
    properties[match[1]] = match[2].trim()
  }
  return properties
}

// Parse tags (#tag or #tagName)
const parseTags = (content) => {
  const tagRegex = /#([a-zA-Z][a-zA-Z0-9]*)/g
  const tags = []
  let match
  while ((match = tagRegex.exec(content)) !== null) {
    tags.push(match[1])
  }
  return tags
}

// Parse collapsed state from content (Logseq format)
const parseCollapsedState = (content) => {
  // Check for collapsed:: true or similar patterns
  const collapsedRegex = /collapsed::\s*true/i
  return collapsedRegex.test(content)
}

// Parse references ([[Page Name]])
const parseReferences = (content) => {
  const refRegex = /\[\[([^\]]+)\]\]/g
  const references = []
  let match
  while ((match = refRegex.exec(content)) !== null) {
    references.push(match[1])
  }
  return references
}

// Clean content for display (remove properties, etc.)
const cleanContent = (content) => {
  let cleaned = content
    .replace(/(\w+)::\s*([^:\n]+)(?=\s+\w+::|$)/g, '') // Remove properties
    .replace(/collapsed::\s*\w+/gi, '') // Remove collapsed state
    .replace(/\n.*collapsed::.*/g, '') // Remove collapsed lines
    .trim()

  // If content is empty after cleaning, return original
  return cleaned || content.trim()
}

// Tree manipulation methods - only toggle collapse for read-only mode
const toggleCollapse = (nodeId) => {
  const node = findNodeById(treeData.value, nodeId)
  if (node) {
    node.collapsed = !node.collapsed
  }
}

// Helper to find node by ID
const findNodeById = (nodes, id) => {
  for (const node of nodes) {
    if (node.id === id) return node
    const found = findNodeById(node.children, id)
    if (found) return found
  }
  return null
}

// No conversion methods needed for read-only mode

// Watch for content changes
watch(() => props.content, (newContent) => {
  treeData.value = parseLogseqContent(newContent)
}, { immediate: true })
</script>

<style scoped>
.logseq-tree {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.5;
}

.tree-node {
  position: relative;
}
</style>