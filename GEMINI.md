# Gemini Context

## Project Language

**All project artifacts (code, documentation, comments, commit messages, etc.) must be generated in English. User interaction with Gemini can be in any language, but any output that is committed to the project must be in English.**

This document provides a stable context for the Gemini CLI, enabling it to understand the project's conventions, architecture, and domain.

## Directory Overview

This directory contains the documentation and planning materials for migrating an application called **kNNnowledgeV2** into a **Logseq plugin**. The project is centered around structured, model-driven note-taking. It is not a direct software project with runnable code in its current state, but rather a knowledge base to guide a future refactoring effort.

The core idea is to map the concepts from kNNnowledgeV2 (like Items, Fields, and Relations) to Logseq's native features (Pages, Blocks, Custom Properties, and References).

## Key Files

*   **`LogSecMigration.md`**: This is the primary document outlining the migration strategy. It details the conceptual mapping between kNNnowledgeV2 and Logseq, data model transformations, UI adaptation, and the necessary refactoring steps.

*   **`plugin_info.md`**: A reference guide summarizing the key features and syntax of Logseq that are relevant to the migration. This includes details on Logseq's data model (Blocks and Pages), custom properties (`key:: value`), and referencing mechanisms (`[[Page Name]]`, `((UUID))`).

*   **`logseq_adapted_examples/`**: This directory contains example files that have been converted from the original kNNnowledgeV2 format to the new Logseq-compatible format. It serves as a practical illustration of the migration's end goal.
    *   `metamodel_biz_knn.md`: An example of a metamodel adapted for Logseq.
    *   `ghostbusters-model_biz_knn.md`: An example of a model file adapted for Logseq.

*   **`legacy/`**: This directory appears to contain the original kNNnowledgeV2 files before the migration was planned. It should be treated as a historical reference and not be modified.

## Usage

The contents of this directory are intended to be used as a blueprint for developing the kNNnowledgeV2 Logseq plugin. The primary workflow would be:

1.  **Understand the Core Concepts**: Read `LogSecMigration.md` and `plugin_info.md` to grasp the mapping between the old and new systems.
2.  **Reference the Examples**: Use the files in `logseq_adapted_examples/` as a guide for the target format.
3.  **Implement the Plugin**: Begin the development of the Logseq plugin, following the strategy outlined in the documentation.

## Domain Glossary

*   **Metametamodel**: A model that defines the structure of other metamodels. In this project, **kNN** serves as the metametamodel, defining the structure of Metamodels.
*   **Metamodel**: A model that defines the structure of other models. In this application, it seems to define the types of items that can be used in a model.
*   **Model**: A document or page that represents a structured set of information. In this application, it seems to be a text file that is parsed and validated against a metamodel.
*   **Item**: An element in a model. Each item has a type, which is defined in the metamodel.
*   **Field**: A piece of metadata attached to an Item, equivalent to a Logseq Custom Property.
*   **Relation**: A link between Items, equivalent to a Logseq Page or Block Reference.
*   **Slug**: A URL-safe, human-readable identifier generated from the name field using specific rules. Slugs are used as unique identifiers for entities across URLs, file systems, and JavaScript objects.

## Slug Generation Guidelines

This application uses **slugs** as unique, human-readable identifiers for entities across URLs, file systems, and JavaScript objects. To ensure consistency, **all slugs must follow the same convention**:

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
