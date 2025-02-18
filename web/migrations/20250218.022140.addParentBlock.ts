import type { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
        .alterTable('block')
        .addColumn('parent_block_id', 'integer', col => col.references('block.id'))
        .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.alterTable('block').dropColumn('parent_block_id').execute()
}
