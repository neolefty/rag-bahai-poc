# RAG Web App

Import documents & search them using the Vercel AI SDK.

Videos:

* Vercel AI SDK: [Jack Herrington shows how to use AI structured output](https://www.youtube.com/watch?v=_Rb4SpWRHC8).
* RAG from Scratch: [Lance Martin walks through a RAG example using LangChain / Python](https://www.youtube.com/watch?v=sVcwVQRHIc8)

## Running

* This is a [Next.js](https://nextjs.org) project bootstrapped with [create-next-app](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
* Requires [pnpm](https://pnpm.io/).

```bash
pnpm install  # only necessary the first time, or when dependencies change
pnpm dev
```

Open http://localhost:3000.

## Goals

* Learn RAG elements
* Learn how to use the Vercel AI SDK

## Next Steps

* Get blocking working (divide documents into sections that each have a unique link)
  * Recognize that initial division may be very simple, just get it good enough to move on 
* Vector search
  * Convert query to intermediate inputs that are in the same vector space as the documents
