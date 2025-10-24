## Why
The application currently uses emojis (📄, 📊, 🎨, 🚀, 📊, 💡, 🧠, 🆚) to represent different sections and artifacts, which may not render consistently across all devices and browsers. We want to replace these with professional Lucide Vue icons for better visual consistency, accessibility, and modern appearance, while removing the unused Font Awesome dependency.

## What Changes
- Install Lucide Vue as the icon library
- Replace emojis in main navigation tabs (Document 📄, Projections 📊, Artifacts 🎨)
- Add specific Lucide icons for each artifact type and their sections in the Artifacts tab:
  - Business Model Canvas: 🎨 → Building2 icon
  - Lean Canvas: 🚀 → Rocket icon
  - SWOT Analysis: 📊 → BarChart3 icon
  - Value Proposition Canvas: 💡 → Lightbulb icon
  - Empathy Map: 🧠 → Brain icon
  - Competitive Analysis: 🆚 → Trophy icon
- Remove Font Awesome from package.json and any references
- Update Vue components to use Lucide icons instead of emojis

## Impact
- Affected code: src/App.vue, package.json
- Affected specs: ui-icons capability (to be created)
- No breaking changes to functionality, only visual improvements
- Reduces bundle size by removing unused Font Awesome dependency
- Improves accessibility and cross-platform consistency