import { Router } from "express";
import { jsonArrayFrom } from 'kysely/helpers/postgres';
import { db } from "../db/postgres.mjs";

const router: Router = Router();

router.get("/:database", async (req, res) => {
    try {
        const { database } = req.params;

        const pages = await db
            .selectFrom('pages')
            .select((eb) => [
                'page_id',
                'created_at',
                'created_by',
                'updated_at',
                'updated_by',
                jsonArrayFrom(
                    eb.selectFrom('properties')
                        .selectAll()
                        .whereRef('properties.page_id', '=', 'pages.page_id')
                        .orderBy('properties.created_at', 'desc')
                ).as('properties')
            ])
            .where((eb) => eb.or([
                eb('database_id', '=', database),
                eb('database_alias', '=', database)
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

        const page = await db
            .selectFrom('pages')
            .select((eb) => [
                'page_id',
                'body',
                'created_at',
                'created_by',
                'updated_at',
                'updated_by',
                jsonArrayFrom(
                    eb.selectFrom('properties')
                        .selectAll()
                        .whereRef('properties.page_id', '=', 'pages.page_id')
                        .orderBy('properties.created_at', 'desc')
                ).as('properties')
            ])
            .where('page_id', '=', page_id)
            .where((eb) => eb.or([
                eb('database_id', '=', database),
                eb('database_alias', '=', database)
            ]))
            .execute();

        if (page.length === 0) {
            res.status(404).json({ message: "Page not found" });
        } else {
            res.json(page[0]);
        }
    } catch (error) {
        console.error(error);

        res.status(500).json({ message: "Internal server error" });
    }

});

export default router;

