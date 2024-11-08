import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable('blocks')
        .addColumn('page_id', 'text', (col) => col.notNull())
        .addColumn('block_id', 'text', (col) => col.primaryKey())
        .addColumn('parent_id', 'text')
        .addColumn('type', 'text', (col) => col.notNull())
        .addColumn('content', 'jsonb', (col) => col.notNull())
        .addColumn('created_by', 'text', (col) => col.notNull())
        .addColumn('updated_by', 'text', (col) => col.notNull())
        .addColumn('created_at', 'timestamp', (col) =>
            col.defaultTo(sql`now()`).notNull(),
        ).addColumn('updated_at', 'timestamp', (col) =>
            col.defaultTo(sql`now()`).notNull(),
        )
        .execute()

    await db.schema
        .createIndex('blocks_page_id_index')
        .on('blocks')
        .column('page_id')
        .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable('blocks').execute()
}