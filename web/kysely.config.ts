import { defineConfig } from "kysely-ctl"
import { Pool } from "pg"
import { format } from "date-fns"

// See https://github.com/kysely-org/kysely-ctl?tab=readme-ov-file#configuration
export default defineConfig({
    dialect: "pg",
    migrations: {
        getMigrationPrefix: () => format(new Date(), "yyyyMMdd.hhmmss."),
    },
    dialectConfig: {
        pool: new Pool({
            host: "pg",
            database: "rag",
            user: "rag",
        }),
    },
});