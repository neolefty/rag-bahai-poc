import { Kysely, PostgresDialect } from "kysely"
import { Pool } from "pg"
import { Database } from "./dbTypes"

// See https://kysely.dev/docs/getting-started?dialect=postgresql#instantiation
// for original template & more details.
const dialect = new PostgresDialect({
    pool: new Pool({
        // password from env var PGPASSWORD; can use ev's for these other values too
        // See: https://node-postgres.com/features/connecting#environment-variables
        host: "pg",
        database: "rag",
        user: "rag",
    })
})

export const db = new Kysely<Database>({
    dialect,
})