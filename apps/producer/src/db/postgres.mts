import { Kysely, PostgresDialect } from 'kysely';
import pg from 'pg';
import { DB } from './types.mjs';

const Pool = pg.Pool;

export const db = new Kysely<DB>({
    dialect: new PostgresDialect({
        pool: new Pool({
            connectionString: process.env.POSTGRES_URL,
        })
    })
})