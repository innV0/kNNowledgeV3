This folder contains examples of metamodels and models adapted for Logseq, converted from the original kNNnowledgeV2 format.

## Slug Generation

All Item Types in the metamodels now include a `slug` field that generates URL-safe identifiers from the `name` field using the following rules:
- Normalize Unicode (remove accents)
- Convert to lowercase
- Remove unwanted characters (keep a-z, 0-9, spaces, hyphens)
- Replace spaces with hyphens
- Collapse repeated hyphens
- Trim leading/trailing hyphens

Example: `Business Summary` → `business-summary`
