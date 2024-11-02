import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable('properties')
        .addColumn('page_id', 'text', (col) => col.notNull())
        .addColumn('field_id', 'text', (col) => col.notNull())
        .addColumn('type', 'text', (col) => col.notNull())
        .addColumn('value', sql`jsonb[]`, (col) => col.notNull())
        .addColumn('created_at', 'timestamp', (col) =>
            col.defaultTo(sql`now()`).notNull(),
        ).addColumn('updated_at', 'timestamp', (col) =>
            col.defaultTo(sql`now()`).notNull(),
        )
        .execute()

    await db.schema
        .createIndex('properties_page_id_index')
        .on('properties')
        .column('page_id')
        .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable('person').execute()
}