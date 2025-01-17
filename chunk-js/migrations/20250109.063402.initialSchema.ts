import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>) {
    await sql`CREATE EXTENSION IF NOT EXISTS vector`.execute(db)

    await db.schema
        .createTable('document')
        .addColumn('id', 'serial', col => col.primaryKey())
        .addColumn('url', 'varchar')
        .addColumn('title', 'varchar', col => col.unique().notNull())
        .addColumn('raw_html', 'text')
        .addColumn('raw_text', 'text')
        .execute()

    await db.schema
        .createTable('block')
        .addColumn('id', 'serial', col => col.primaryKey())
        .addColumn('document_id', 'integer', col => col.references('document.id').notNull())
        .addColumn('title', 'varchar')
        .addColumn('raw_html', 'text')
        .addColumn('raw_text', 'text')
        .addColumn('clean_text', 'text', col => col.notNull())
        .addColumn('order', 'integer', col => col.notNull())
        .addColumn('metadata', 'jsonb', col => col.notNull())
        .execute()

    await db.schema
        .createTable('language_model')
        .addColumn('id', 'serial', col => col.primaryKey())
        .addColumn('vendor', 'varchar', col => col.notNull())
        .addColumn('identifier', 'varchar', col => col.notNull())
        .addColumn('model_type', 'varchar', col => col.notNull())
        .addColumn('model_key_var', 'varchar')
        .execute()

    await db.schema
        .createTable('chunk_generator')
        .addColumn('id', 'serial', col => col.primaryKey())
        .addColumn('short_description', 'varchar', col => col.unique().notNull())
        .addColumn('system_prompt', 'text', col => col.notNull())
        .addColumn('language_model_id', 'integer', col => col.references('language_model.id').notNull())
        .execute()

    await db.schema
        .createTable('chunk')
        .addColumn('id', 'serial', col => col.primaryKey())
        .addColumn('block_id', 'integer', col => col.references('block.id').notNull())
        .addColumn('chunk_generator_id', 'integer', col => col.references('chunk_generator.id').notNull())
        .addColumn('raw_text', 'text', col => col.notNull())
        .addColumn('clean_text', 'text', col => col.notNull())
        .addColumn('order', 'integer', col => col.notNull())
        .addColumn('prev_chunk_id', 'integer', col => col.references('chunk.id'))
        .addColumn('next_chunk_id', 'integer', col => col.references('chunk.id'))
        .execute()

    await db.schema
        .createTable('embedding')
        .addColumn('id', 'serial', col => col.primaryKey())
        .addColumn('chunk_id', 'integer', col => col.references('chunk.id').notNull())
        .addColumn('language_model_id', 'integer', col => col.references('language_model.id').notNull())
        // Voyage 3 has 1024 dimensions
        .addColumn('vector', sql`vector(1024)`, col => col.notNull())
        .execute()
}

export async function down(db: Kysely<any>) {
    await db.schema.dropTable('embedding').execute()
    await db.schema.dropTable('chunk').execute()
    await db.schema.dropTable('chunk_generator').execute()
    await db.schema.dropTable('language_model').execute()
    await db.schema.dropTable('block').execute()
    await db.schema.dropTable('document').execute()
}
