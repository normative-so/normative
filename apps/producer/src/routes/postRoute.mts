import { Router } from "express";
import { jsonArrayFrom } from 'kysely/helpers/postgres';
import { db } from "../db/postgres.mjs";
import { buildNestedBlocks } from "./helpers/buildNestedBlocks.mjs";
import { Blocks } from "../db/types.mjs";

const router: Router = Router();

router.get("/:database", async (req, res) => {
    try {
        const { database } = req.params;

        const pages = await db
            .selectFrom('pages')
            .select((qb) => [
                'page_id',
                'created_at',
                'created_by',
                'updated_at',
                'updated_by',
                jsonArrayFrom(
                    qb.selectFrom('properties')
                        .selectAll()
                        .whereRef('properties.page_id', '=', 'pages.page_id')
                        .orderBy('properties.created_at', 'desc')
                ).as('properties')
            ])
            .where((qb) => qb.or([
                qb('database_id', '=', database),
                qb('database_alias', '=', database)
            ]))
            .execute();

        res.json(pages);
    } catch (error) {
        console.error(error);

        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/:database/:page_id", async (req, res) => {
    try {
        const { database, page_id } = req.params;

        const blocks = (await db
            .selectFrom('blocks')
            .selectAll()
            .where('page_id', '=', page_id)
            .execute()) as unknown as Blocks[];

        const nestedBlocks = buildNestedBlocks(blocks);

        const page = await db
            .selectFrom('pages')
            .select((qb) => [
                'page_id',
                'created_at',
                'created_by',
                'updated_at',
                'updated_by',
                jsonArrayFrom(
                    qb.selectFrom('properties')
                        .selectAll()
                        .where('properties.page_id', '=', page_id)
                        .orderBy('properties.created_at', 'desc')
                ).as('properties')
            ])
            .where('page_id', '=', page_id)
            .where((qb) => qb.or([
                qb('database_id', '=', database),
                qb('database_alias', '=', database)
            ]))
            .execute();

        if (page.length === 0) {
            res.status(404).json({ message: "Page not found" });
        } else {
            res.json({ ...page[0], body: nestedBlocks });
        }
    } catch (error) {
        console.error(error);

        res.status(500).json({ message: "Internal server error" });
    }

});

export default router;
