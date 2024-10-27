import { Database } from './types.mjs' // this is the Database interface we defined earlier
import * as path from 'path'
import { Pool } from 'pg'
import { promises as fs } from 'fs'
import { FileMigrationProvider, Kysely, Migrator, PostgresDialect } from 'kysely'

export const db = new Kysely<Database>({
    dialect: new PostgresDialect({
        pool: new Pool({
            connectionString: process.env.POSTGRES_URL,
        })
    })
})

const migrator = new Migrator({
    db: db,
    provider: new FileMigrationProvider({
        fs,
        path,
        migrationFolder: path.join(__dirname, '../migrations'),
    })
})

const { error, results } = await migrator.migrateToLatest()

results?.forEach((it) => {
    if (it.status === 'Success') {
        console.log(`migration "${it.migrationName}" was executed successfully`)
    } else if (it.status === 'Error') {
        console.error(`failed to execute migration "${it.migrationName}"`)
    }
})

if (error) {
    console.error('failed to migrate')
    console.error(error)
    process.exit(1)
}