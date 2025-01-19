# Bahá’í Writings – Semantic Search
Search the [Bahá’í Holy Writings](https://www.bahai.org/library/authoritative-texts/) using [Retrieval-Augmented Generation](https://en.wikipedia.org/wiki/Retrieval-augmented_generation).

This is a proof of concept & learning exercise, intended for rapid development — and not necessarily refined.

## Running

### Option 1: `docker compose`

* Initial setup (and whenever there are new migrations):

   1. `docker compose build`
   2. `docker compose up`
   3. `docker compose exec chunk-js kysely migrate latest`

* Normal operation: `docker compose up`
 
### Option 2: Server via `docker compose` and client locally with `pnpm`:

1. In the `server` directory: `docker compose up`
2. Setup (first time and when there are new migrations):
   * In the `client` directory: `pnpm install`
   * Run migrations: `pnpm kysely migrate latest`
3. Run the client: `pnpm dev`

## Tips

_Assumes docker compose development enviromnent._

* Undo migrations: `docker compose exec chunk-js kysely migrate down`
* Postgres CLI: `PGPASSWORD=rag_password psql -p 5432 -h localhost -U rag`