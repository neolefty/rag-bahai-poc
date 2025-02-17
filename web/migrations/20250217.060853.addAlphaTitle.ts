import type { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema.alterTable('document').addColumn('alpha_title', 'varchar').execute()
    await db.schema.createIndex('document_alpha_title_index').on('document').column('alpha_title').execute()
    await db.schema.createIndex('document_title_index').on('document').column('title').execute()
    await db.updateTable('document').set((eb) => ({
        alpha_title: eb.ref('title'),
    })).execute()
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropIndex('document_title_index').execute()
    await db.schema.alterTable('document').dropColumn('alpha_title').execute()
}
