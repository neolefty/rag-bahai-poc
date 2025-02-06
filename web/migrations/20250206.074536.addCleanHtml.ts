import type { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema.alterTable('document').addColumn('clean_html', 'text').execute()
    await db.schema.alterTable('block').addColumn('clean_html', 'text').execute()
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.alterTable('block').dropColumn('clean_html').execute()
    await db.schema.alterTable('document').dropColumn('clean_html').execute()
}
