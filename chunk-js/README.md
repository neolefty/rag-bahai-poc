# chunk-js

Chunk documents for search & retrieval, using the Vercel AI SDK.

Video: [Jack Herrington shows how to use AI structured output](https://www.youtube.com/watch?v=_Rb4SpWRHC8).

## Running

* This is a [Next.js](https://nextjs.org) project bootstrapped with [create-next-app](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
* Requires [pnpm](https://pnpm.io/).

```bash
pnpm install  # only necessary the first time, or when dependencies change
pnpm dev
```

Open http://localhost:3000.

## Goals

* Big enough to be meaningful.
* Small enough to be embedded in vector space.

## Ideas

* Store links to next & prev chunks.
    * Would allow vector search followed by merging and re-embedding & reranking.
