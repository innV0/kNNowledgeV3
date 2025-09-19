# kNNnowledgeV2 to Logseq Plugin - Relevant Information

This document outlines key functional aspects, syntax, and conventions within Logseq that are relevant for refactoring kNNnowledgeV2 into a Logseq plugin. The focus is on understanding how Logseq handles structured data, properties, and relationships, rather than specific technologies.

## 1. Logseq's Core Data Model: Blocks and Pages

In Logseq, all content is organized into **Blocks** and **Pages**.

*   **Pages:** Represent top-level concepts or documents. Each page has a title.
*   **Blocks:** Every line or bullet point within a page is considered a block. Each block has a unique identifier (UUID).

This block-based structure is fundamental to how Logseq manages and links information.

## 2. Custom Properties (Fields in kNNnowledgeV2)

Logseq provides a powerful mechanism for adding metadata to blocks and pages through custom properties. These can be directly mapped to the concept of "Fields" in kNNnowledgeV2.

*   **Syntax:** Custom properties are defined using the `key:: value` syntax.
    *   **Example:** `status:: in-progress`
    *   **Example with multi-word key:** `due-date:: [[2025-09-18]]`

*   **Key Naming Conventions:**
    *   Typically single words.
    *   Multi-word keys can use hyphens (e.g., `my-property::`).

*   **Placement:**
    *   **Page Properties:** To apply a property to an entire page, the `key:: value` pair must be placed in the **very first block** of that page.
    *   **Block Properties:** Properties can be added to **any individual block** within a page. A single block can have multiple properties.

*   **Values:**
    *   Can be plain text.
    *   Can include links to other pages or blocks using Logseq's linking syntax (see below).

*   **Markdown Compatibility:** The `key:: value` syntax is specific to Logseq and is not standard Markdown. When viewed in other Markdown editors, these properties might appear as plain text.

## 3. Relationships and References (Relations in kNNnowledgeV2)

Logseq excels at creating a highly interconnected knowledge graph through various referencing mechanisms, which can be mapped to "Relations" in kNNnowledgeV2.

### 3.1 Page References

Linking to other pages is a primary way to establish relationships.

*   **Syntax:** `[[Page Name]]`
    *   **Example:** `related-concept:: [[Another Page]]`

### 3.2 Block References

Referencing specific blocks allows for granular connections between ideas.

*   **Syntax:** `((UUID))`
    *   Every block in Logseq has a unique identifier (UUID).
    *   **Example:** `source:: ((654a321b-cdef-1234-5678-abcdef123456))`

*   **Aliased References:** For more readable links, you can use standard Markdown link syntax combined with the block ID:
    *   **Syntax:** `[Alias Text](((UUID)))`
    *   **Example:** `[Detailed Explanation](((654a321b-cdef-1234-5678-abcdef123456)))`

*   **Block Embeds:** To display the full content of a referenced block directly within another block:
    *   **Syntax:** `!((UUID))`
    *   **Example:** `!((654a321b-cdef-1234-5678-abcdef123456))`

*   **Markdown Compatibility:** The `((UUID))` syntax is Logseq-specific. Logseq embeds the block ID as a hidden property within the Markdown file, which can be used for global searches.

## 4. Logseq Plugin Interaction Model

Logseq plugins interact with the application's data and UI through a dedicated Plugin API (exposed via `@logseq/libs`). Key aspects include:

*   **Accessing Data:** Plugins can query and retrieve `BlockEntity` and `PageEntity` objects, which represent the structured data of blocks and pages.
*   **Manipulating Data:** Plugins can create, update, and delete blocks and pages, including their properties and content.
*   **UI Integration:** Plugins can extend Logseq's UI, for example, by adding custom commands, context menus, or UI components.

## 5. Implications for kNNnowledgeV2 Refactoring

When refactoring kNNnowledgeV2 for Logseq, consider the following:

*   **Mapping kNNnowledgeV2 Items to Logseq Blocks/Pages:** The hierarchical `Item` structure in kNNnowledgeV2 will need to be mapped to Logseq's block/page hierarchy. Top-level items might become pages, while nested items become blocks.
*   **Converting kNNnowledgeV2 Fields to Logseq Properties:** The `[[key]]:[[value]]` syntax of kNNnowledgeV2 fields can be directly translated to Logseq's `key:: value` property syntax.
*   **Converting kNNnowledgeV2 Relations to Logseq References:** The `[[type]][[target]]` syntax of kNNnowledgeV2 relations will need to be converted to Logseq's page or block reference syntax. This might involve resolving `target` to a Logseq page name or a block UUID.
*   **Slug Generation for Page Names:** The `slug` field in kNNnowledgeV2 Item Types should be used to generate URL-safe page names in Logseq. This ensures consistent naming conventions across the knowledge base.
*   **Metamodel Validation:** The `MetamodelService` in kNNnowledgeV2 will need to be adapted to validate against Logseq's property and reference conventions, or to leverage Logseq's internal validation mechanisms if available.
*   **Parsing and Serialization:** The `ParserService` and `SerializerService` will need to be rewritten or adapted to understand and generate Logseq-compatible Markdown, including its specific property and reference syntax.

## 6. Slug Generation Guidelines

This application uses **slugs** as unique, human-readable identifiers for entities across URLs, file systems, and JavaScript objects. In the context of Logseq, slugs are particularly useful for generating consistent page names and identifiers.

### 🔧 Rules for Generating a Slug

1. **Normalize Unicode**
   - Convert to [NFD](https://unicode.org/reports/tr15/) form.
   - Remove diacritical marks (accents, tildes, etc.).
   - Example: `Cañón` → `Canon`.

2. **Lowercase**
   - Convert all letters to lowercase.
   - Example: `Canon` → `canon`.

3. **Remove Unwanted Characters**
   - Keep only: `a-z`, `0-9`, spaces, and hyphens.
   - Remove punctuation, symbols, and special characters.
   - Example: `Canon 2025!` → `Canon 2025`.

4. **Replace Spaces with Hyphens**
   - Convert one or more spaces into a single `-`.
   - Example: `Canon 2025` → `canon-2025`.

5. **Collapse Repeated Hyphens**
   - Avoid consecutive hyphens.
   - Example: `canon--2025` → `canon-2025`.

6. **Trim Hyphens**
   - Remove leading or trailing hyphens.
   - Example: `-canon-2025-` → `canon-2025`.

### ✅ Examples

| Input                          | Output Slug                   |
|--------------------------------|------------------------------|
| `Cañón de Ávila 2025`          | `canon-de-avila-2025`        |
| `Proyecto Ñandú: Éxito Total!` | `proyecto-nandu-exito-total` |
| `Hello World`                  | `hello-world`                |
| `123 - Ready, Go!`             | `123-ready-go`               |

### 📜 Standard Reference

This convention follows:

- [RFC 3986](https://datatracker.ietf.org/doc/html/rfc3986) for safe URL segments
- Common practice in CMSs like WordPress and Next.js
- File-system-safe naming (avoids reserved characters)

### 🧑‍💻 Recommended Implementation (JavaScript)

```js
function slugify(str) {
  return str
    .normalize("NFD")                 // split accents from letters
    .replace(/[\u0300-\u036f]/g, "")  // remove accents/diacritics
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")     // remove invalid chars
    .replace(/\s+/g, "-")             // spaces → hyphens
    .replace(/-+/g, "-");             // collapse multiple hyphens
}
```

This document serves as a foundational understanding for the refactoring effort. Further details will emerge during the plugin development process.
