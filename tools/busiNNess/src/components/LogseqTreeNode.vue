<template>
  <div class="logseq-tree-node" :style="{ marginLeft: level * 20 + 'px' }">
    <!-- Node content -->
    <div class="node-content flex items-center gap-2 py-1 hover:bg-gray-50 rounded px-2">
      <!-- Collapse/expand button -->
      <button
        v-if="node.children && node.children.length > 0"
        @click="toggleCollapse"
        class="collapse-btn w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-600"
      >
        <ChevronRight
          v-if="node.collapsed"
          class="w-3 h-3 transition-transform"
        />
        <ChevronDown
          v-else
          class="w-3 h-3 transition-transform"
        />
      </button>
      <div v-else class="w-4"></div>

      <!-- Bullet point -->
      <div class="bullet w-2 h-2 bg-gray-400 rounded-full flex-shrink-0"></div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <div class="content">
          <span v-html="renderLogseqContent(node.displayContent || node.content)" class="text-sm"></span>

          <!-- Properties display (only show non-collapsed properties) -->
          <div v-if="Object.keys(node.properties).length > 0" class="properties mt-1">
            <div
              v-for="(value, key) in node.properties"
              :key="key"
              v-show="key !== 'collapsed'"
              class="property inline-block mr-2 mb-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
            >
              <span class="font-medium">{{ key }}:</span> {{ value }}
            </div>
          </div>
        </div>
      </div>

      <!-- Action buttons - REMOVED for read-only mode -->
    </div>

    <!-- Children -->
    <div v-if="!node.collapsed && node.children && node.children.length > 0" class="children">
      <LogseqTreeNode
        v-for="(child, index) in node.children"
        :key="child.id"
        :node="child"
        :level="level + 1"
        :is-last="index === node.children.length - 1"
        @toggle-collapse="$emit('toggle-collapse', $event)"
        @edit-node="$emit('edit-node', $event)"
        @update-node="$emit('update-node', $event)"
        @add-child="$emit('add-child', $event)"
        @delete-node="$emit('delete-node', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ChevronRight, ChevronDown } from 'lucide-vue-next'

// Props
const props = defineProps({
  node: {
    type: Object,
    required: true
  },
  level: {
    type: Number,
    default: 0
  },
  isLast: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['toggle-collapse'])

// No reactive data needed for read-only mode

// Methods
const toggleCollapse = () => {
  emit('toggle-collapse', props.node.id)
}

// Render Logseq content with proper formatting
const renderLogseqContent = (content) => {
  if (!content) return ''

  return content
    .replace(/\[\[([^\]]+)\]\]/g, '<span class="logseq-ref">[[$1]]</span>')
    .replace(/#([a-zA-Z][a-zA-Z0-9]*)/g, '<span class="logseq-tag">#$1</span>')
}

// No watchers needed for read-only mode
</script>

<style scoped>
.logseq-tree-node {
  position: relative;
}

.node-content {
  position: relative;
  transition: background-color 0.15s ease;
}

.node-content:hover .action-buttons {
  opacity: 1;
}

.collapse-btn {
  transition: transform 0.15s ease;
}

.bullet {
  margin-top: 2px;
}

.content {
  cursor: text;
  user-select: text;
}

.editing input {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.properties {
  margin-top: 0.25rem;
}

.tags {
  margin-top: 0.25rem;
}

.logseq-ref {
  color: #3b82f6;
  font-weight: 500;
  cursor: pointer;
}

.logseq-ref:hover {
  text-decoration: underline;
}

.logseq-tag {
  color: #059669;
  font-weight: 500;
}

.children {
  border-left: 1px solid #e5e7eb;
  margin-left: 10px;
  padding-left: 8px;
}
</style>