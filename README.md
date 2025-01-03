# Bahá'í Writings – Semantic Search
Search the [Bahá’í Holy Writings](https://www.bahai.org/library/authoritative-texts/) using [Retrieval-Augmented Generation](https://en.wikipedia.org/wiki/Retrieval-augmented_generation).

This is a proof of concept & learning exercise, intended for rapid development — and not necessarily refined.

## Running

Options:

1. Run everything via `docker compose`:

   * In the `client` directory: `pnpm install`
   * In the root directory: `docker compose up`

2. Server via `docker compose` and client locally with `pnpm`:

   * In the `server` directory: `docker compose up`
   * In the `client` directory: `pnpm install && pnpm dev`

