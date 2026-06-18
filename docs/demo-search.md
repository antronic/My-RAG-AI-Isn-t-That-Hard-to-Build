# Demo: Vector Search (Client-Side Embedding)

`tools/app/demo_search.ts` is a CLI demo of MongoDB Atlas Vector Search where the
**query embedding is generated on the client** (by Azure OpenAI, Ollama, or
Voyage AI) and then passed to `$vectorSearch` as a `queryVector`.

This is the "classic" vector search flow:

1. Take the raw search text.
2. Generate an embedding for it using the configured provider.
3. Run `$vectorSearch` with that embedding (`queryVector`).

> Looking for the server-side embedding flow (no client embedding)? See
> [Demo: Auto-Embedded Search](./demo-auto-embedded-search.md).

## Prerequisites

- The dataset has been loaded and embedded into MongoDB for your chosen provider
  (see [Running the Project](./running-the-project.md)).
- A matching Atlas Vector Search index exists for that provider's collection.

The provider, collection, and index are resolved from the
provider → config mapping in
`tools/anime-puller/src/services/embedding-models.ts`:

| `TEXT_EMBEDDING_AI` | Collection | Index name | Path |
| --- | --- | --- | --- |
| `azure-openai` | `embedded_aoai_anime_list` | `content_rating_filter` | `content_embedding` |
| `ollama` | `embedded_nomic_anime_list` | `content_rating_filter` | `content_embedding` |
| `voyage` | `embedded_aoai_anime_list` | `autoembed_index_1` | `synopsis` |

## Configure environment variables

Create `tools/app/.env`:

```bash
MONGO_URI=""
MONGO_DB_NAME=""

# Which embedding provider to use: azure-openai | ollama | voyage
TEXT_EMBEDDING_AI="voyage"

# Azure OpenAI (only when TEXT_EMBEDDING_AI="azure-openai")
AZURE_OPENAI_ENDPOINT=""
AZURE_OPENAI_API_KEY=""
AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME="text-embedding-ada-002"

# Voyage AI (only when TEXT_EMBEDDING_AI="voyage")
VOYAGE_AI_API_KEY=""
VOYAGE_AI_EMBEDDING_MODEL="voyage-4-large"
```

> If `MONGO_URI` is empty, the demo throws a clear connection error instead of
> hanging — populate it with the same Atlas connection string used by the
> anime-puller.

## Install dependencies

```bash
cd tools/app
bun install
```

## Run the demo

From `tools/app/`:

```bash
# Full output (whole documents)
bun run demo_search.ts "magical girl school"

# Compact output (title, rating, url only)
bun run demo_search.ts "magical girl school" compact
```

- The **first argument** is the search query.
- The **second argument** is the log option: `full` (default) or `compact`.

## What you should see

```
🔎 Searching... magical girl school
🕵️‍♀️ Helping by... voyage
⚙️ Converting... magical girl school
...
📚 Found N results for "magical girl school"
```

If you get `📚 Found 0 results`, the most common causes are:

- The collection for the active provider isn't populated yet.
- The Atlas vector index name/path doesn't match the
  `embedding-models.ts` entry for that provider.
- The query embedding's dimension count doesn't match the index
  (`text-embedding-ada-002` → 1536, `voyage-4-large` → 1024,
  `nomic-embed-text` → 768).
