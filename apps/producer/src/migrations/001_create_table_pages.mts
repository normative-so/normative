import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable('pages')
        .addColumn('database_id', 'text', (col) => col.notNull())
        .addColumn('database_alias', 'text', (col) => col.notNull())
        .addColumn('page_id', 'text', (col) => col.primaryKey())
        .addColumn('created_by', 'text', (col) => col.notNull())
        .addColumn('updated_by', 'text', (col) => col.notNull())
        .addColumn('created_at', 'timestamp', (col) =>
            col.defaultTo(sql`now()`).notNull(),
        ).addColumn('updated_at', 'timestamp', (col) =>
            col.defaultTo(sql`now()`).notNull(),
        )
        .execute()

    await db.schema
        .createIndex('database_id_index')
        .on('pages')
        .column('database_id')
        .execute()

    await db.schema
        .createIndex('database_alias_index')
        .on('pages')
        .column('database_alias')
        .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable('pages').execute()
}