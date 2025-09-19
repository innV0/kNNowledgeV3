# kNNnowledgeV2 to Logseq Plugin Migration Guide

## Conceptual Hierarchy: Metametamodel, Metamodel, Model

This project introduces a three-tiered conceptual hierarchy for structured knowledge management:

1.  **Metametamodel (kNN)**: Defines the structure and components of a Metamodel. In this project, the `kNN` concept itself serves as the Metametamodel, specifying what constitutes an Item Type, Field, and Relation within any Metamodel.
2.  **Metamodel**: Defines the structure and rules for a specific domain Model (e.g., `metamodel_biz_knn` defines the structure for business models).
3.  **Model**: Represents a specific instance of structured information, adhering to the rules defined by a Metamodel (e.g., `ghostbusters-model_biz_knn` is a Model conforming to the `metamodel_biz_knn`).

This document provides a comprehensive overview of the considerations and mapping strategies required to migrate the kNNnowledgeV2 application's core functionalities into a Logseq plugin. It synthesizes information from the existing kNNnowledgeV2 documentation and Logseq's plugin conventions.

## 1. Core Conceptual Mapping

| kNNnowledgeV2 Concept | Logseq Equivalent / Approach |
| :-------------------- | :----------------------------- |
| **Model File**        | Logseq **Page**                |
| **Item**              | Logseq **Block** (or Page for top-level items) |
| **Field**             | Logseq **Custom Property** (`key:: value`) |
| **Relation**          | Logseq **Page Reference** (`[[Page Name]]`) or **Block Reference** (`((UUID))`) |
| **Metamodel**         | External JSON schema, validated and interpreted by the plugin |
| **ParserService**     | Plugin-side parsing logic, adapted for Logseq's Markdown and API |
| **SerializerService** | Plugin-side serialization logic, adapted for Logseq's Markdown and API |
| **Editor**            | Logseq's native editor, enhanced by plugin UI/features |
| **NavTree**           | Logseq's native graph view, page list, or custom plugin UI |
| **InsertTagPopup**    | Custom plugin UI (e.g., modal, context menu, slash command) |

## 2. Data Model Transformation

### 2.1 Items to Blocks/Pages

*   **kNNnowledgeV2's `Item` Structure:** kNNnowledgeV2 organizes content hierarchically using `Item` objects, identified by markdown headings (`# [[Item Title]]`). Each `Item` has a `type`, `title`, `level`, `content`, `fields`, and `relations`.
*   **Logseq's Block/Page Structure:** Logseq treats every line/bullet point as a block with a UUID. Top-level items in kNNnowledgeV2 (e.g., `# [[My Model]]`) could map to Logseq Pages, while nested items (`## [[Sub-Item]]`) would map to Logseq Blocks.
*   **Migration Challenge:** The hierarchical structure of kNNnowledgeV2's `Item`s needs to be carefully translated into Logseq's flatter block structure, maintaining parent-child relationships through indentation or explicit block references.

### 2.2 Fields to Custom Properties

*   **kNNnowledgeV2 Field Syntax:** `[[key]]:[[value]]`
*   **Logseq Custom Property Syntax:** `key:: value`
*   **Migration Strategy:** This is a direct syntactic translation. The `ParserService` and `SerializerService` will need to be updated to recognize and generate Logseq's `key:: value` format.
    *   **Key Naming:** kNNnowledgeV2 keys can be multi-word; Logseq prefers single words or hyphens. This might require a conversion strategy for existing multi-word keys (e.g., `[[due date]]` -> `due-date::`).
    *   **Placement:** kNNnowledgeV2 fields can appear anywhere within an `Item`'s content. Logseq properties have specific placement rules (first block for page properties, any block for block properties). The plugin will need to adhere to these rules when writing properties.

### 2.3 Relations to References

*   **kNNnowledgeV2 Relation Syntax:** `[[type]][[target]]`
*   **Logseq Reference Syntax:**
    *   **Page References:** `[[Page Name]]`
    *   **Block References:** `((UUID))`
    *   **Aliased References:** `[Alias Text](((UUID)))`
*   **Migration Strategy:** This is more complex. The `type` of a kNNnowledgeV2 relation might become a custom property (e.g., `depends-on:: [[Target Page]]`) or be implicitly handled by the reference itself. The `target` will need to be resolved to either a Logseq Page Name or a Block UUID.
    *   **UUID Resolution:** kNNnowledgeV2 does not inherently use UUIDs for items. A mapping mechanism will be needed to associate kNNnowledgeV2 `Item`s with Logseq Block UUIDs or Page Names.
    *   **Directionality:** kNNnowledgeV2 relations are implicitly directional. Logseq references are bi-directional by nature, which can be leveraged.

## 3. Metamodel Integration

*   **kNNnowledgeV2 Metamodel:** Defined as a JSON schema, loaded by `MetamodelService` to validate and guide editing.
*   **Logseq Plugin Approach:** The kNNnowledgeV2 `MetamodelService` can be adapted to run within the Logseq plugin. It would still load and interpret the JSON metamodel. However, its validation and guidance functions would need to interact with Logseq's API for UI elements (e.g., dropdowns for properties) and potentially for data validation against Logseq's internal data model.
*   **Metamodel Reference:** The `[[metamodel]]:[[path/to/metamodel.json]]` tag in kNNnowledgeV2 models would need to be re-evaluated. Logseq plugins might have a different way to associate a page/graph with a metamodel (e.g., a plugin setting, a specific page property).

## 4. UI/UX Adaptation

*   **kNNnowledgeV2 UI:** Built with React and Material-UI, running in an Electron renderer process.
*   **Logseq Plugin UI:** Logseq plugins can inject custom UI components into various parts of the Logseq interface (e.g., sidebar, right sidebar, modals, context menus). The existing React components (`Editor`, `NavTree`, `InsertTagPopup`, `Metamodel Tab`) will need to be re-implemented or adapted to fit within Logseq's plugin UI framework.
    *   **Editor:** Logseq has its own powerful editor. The kNNnowledgeV2 `Editor` component would likely be replaced by enhancing Logseq's native editor with features like context-aware tag insertion and validation.
    *   **NavTree:** Logseq provides its own page and graph navigation. A custom `NavTree` might be redundant or need to be integrated as a specialized view within Logseq.
    *   **InsertTagPopup:** This functionality can be re-implemented as a Logseq modal, a slash command, or a context menu item, leveraging Logseq's API for UI elements and data manipulation.
    *   **Metamodel Tab:** The display of the metamodel JSON could be integrated into a Logseq right sidebar panel or a dedicated plugin page.

## 5. Functional Components for Migration

*   **`ParserService` Adaptation:** The core logic for identifying headings, fields, and relations will need to be adapted to Logseq's specific Markdown parsing rules and block structure. It will need to interact with Logseq's API to get block content and properties.
*   **`SerializerService` Adaptation:** This service will need to generate Logseq-compatible Markdown, including `key:: value` properties and `((UUID))` references, when saving changes.
*   **`MetamodelService` Integration:** The existing `MetamodelService` can be largely reused for its metamodel interpretation logic, but its interaction with the model (for validation and guidance) will shift from direct markdown parsing to using Logseq's API to query block properties and relationships.
*   **File System Operations:** kNNnowledgeV2 relies on Electron's `fs` module for file operations. A Logseq plugin will use Logseq's internal APIs to read and write content, as direct file system access is typically restricted for security.

## 6. Key Refactoring Steps

1.  **Understand Logseq Plugin API:** Deep dive into `@logseq/libs` to understand how to interact with blocks, pages, properties, and UI.
2.  **Data Model Mapping:** Define a clear mapping between kNNnowledgeV2 `Item`s, `Field`s, `Relation`s and Logseq Pages, Blocks, and Properties/References.
3.  **Adapt Parsing/Serialization:** Rewrite `ParserService` and `SerializerService` to work with Logseq's Markdown and API.
4.  **UI Re-implementation:** Re-implement kNNnowledgeV2's UI components as Logseq plugin UI elements.
5.  **Metamodel Validation Logic:** Integrate `MetamodelService` with Logseq's data model for validation and guidance.

This migration will involve a significant refactoring effort, moving from an Electron desktop application to a plugin architecture within Logseq, but the core concepts of structured markdown modeling remain valuable.
