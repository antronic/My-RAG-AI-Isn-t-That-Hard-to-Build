# Running the Project

This guide walks through setting up and running the full RAG AI Anime Search application: loading the dataset, creating the vector index, and starting the API + UI.

## Prerequisites

- [Bun](https://bun.sh/)
- [Node.js](https://nodejs.org/en/)
- [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas)
- An embedding provider (pick one):
  - [Azure OpenAI](https://azure.microsoft.com/en-us/services/cognitive-services/openai/) with a `text-embedding-ada-002` deployment (and a `gpt-3.5-turbo` / `gpt-4o` deployment for chat).
  - [Voyage AI (via MongoDB Atlas)](https://www.mongodb.com/docs/voyageai/) — e.g. `voyage-4-large`.
  - [Ollama](https://ollama.com/) running locally with `nomic-embed-text`.

## Repository Layout

| Path | Purpose |
| --- | --- |
| `tools/anime-puller` | Pulls the anime dataset, embeds it, and stores it in MongoDB. |
| `tools/app` | Standalone CLI demos for vector search (see the demo docs). |
| `api` | Backend API server consumed by the UI. |
| `ui` | Frontend application. |

## 1. Setup Kafka and MongoDB

The dataset is large, so loading uses a Kafka producer/consumer pattern.

You can run Kafka locally with Docker:

```bash
docker run -d --name kafka-broker -p 9092:9092 apache/kafka:latest
```

## 2. Configure environment variables

Create `tools/anime-puller/.env`:

```bash
AZURE_OPENAI_ENDPOINT=""
AZURE_OPENAI_API_KEY=""
AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME="text-embedding-ada-002"
AZURE_OPENAI_COMPLETION_DEPLOYMENT_NAME="gpt-35-turbo"

MONGO_URI=""
MONGO_DB_NAME=""
BROKER_URL="localhost:9092"

# Which embedding provider to use: azure-openai | ollama | voyage
TEXT_EMBEDDING_AI="azure-openai"

# Only required when TEXT_EMBEDDING_AI="voyage"
VOYAGE_AI_API_KEY=""
VOYAGE_AI_EMBEDDING_MODEL="voyage-4-large"
```

> The active provider determines which MongoDB collection and vector index are
> used. See `tools/anime-puller/src/services/embedding-models.ts` for the
> provider → `collectionName` / `vectorIndex` mapping.

## 3. Install dependencies

```bash
cd tools/anime-puller
bun install
```

## 4. Load the dataset

Start the producer to pull the anime dataset and push it to a Kafka topic:

```bash
bun run ./src/workers/start_producer.ts
```

In a separate terminal, start the consumer to read from Kafka, embed each
synopsis, and store the result in MongoDB:

```bash
bun run ./src/workers/start_consumer.ts
```

Once the consumer has processed all messages, stop both processes with
`Ctrl + C`.

## 5. Create a MongoDB Vector Index

Create a vector index on the embedding collection for your provider. For the
default Azure OpenAI setup, create an index named `content_rating_filter` on the
`embedded_aoai_anime_list` collection:

```json
{
  "fields": [
    {
      "type": "vector",
      "path": "content_embedding",
      "numDimensions": 1536,
      "similarity": "cosine"
    },
    {
      "type": "filter",
      "path": "rating"
    }
  ]
}
```

- `numDimensions` must match the embedding model output size
  (`text-embedding-ada-002` → 1536, `voyage-4-large` → 1024,
  `nomic-embed-text` → 768).
- The `rating` filter field enables safe-search filtering.

See the [Atlas Vector Search docs](https://www.mongodb.com/docs/atlas/atlas-vector-search/vector-search-type/) for other ways to create indexes.

## 6. Start the API server

Configure `api/.env`:

```bash
MONGO_URI=""
AZURE_OPENAI_ENDPOINT=""
AZURE_OPENAI_API_KEY=""
AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME="text-embedding-ada-002"
AZURE_OPENAI_COMPLETION_DEPLOYMENT_NAME="gpt-35-turbo"
```

Then:

```bash
cd api
bun install
bun run ./http.ts
```

## 7. Start the frontend

```bash
cd ui
npm install
npm start
```

## Next Steps

- [Test the demo search (client-side embedding)](./demo-search.md)
- [Test the demo auto-embedded search](./demo-auto-embedded-search.md)
