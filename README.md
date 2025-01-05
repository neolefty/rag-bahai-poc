# Bahá'í Writings – Semantic Search
Search the [Bahá’í Holy Writings](https://www.bahai.org/library/authoritative-texts/) using [Retrieval-Augmented Generation](https://en.wikipedia.org/wiki/Retrieval-augmented_generation).

This is a proof of concept & learning exercise, intended for rapid development — and not necessarily refined.

## Running

Options:

1. Run everything via `docker compose`:

   1. In the `client` directory: `pnpm install`
      * only necessary when deps change — **TODO** add to `docker compose build`
   2. In the root directory: `docker compose up`

2. Server via `docker compose` and client locally with `pnpm`:

   * In the `server` directory: `docker compose up`
   * In the `client` directory: `pnpm install && pnpm dev`

