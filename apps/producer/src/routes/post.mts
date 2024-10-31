import { Router } from "express";
import { db } from "../db/postgres.mjs";
import { sql } from "kysely";
import { jsonArrayFrom } from 'kysely/helpers/postgres'

const router: Router = Router();

router.get("/", async (req, res) => {
    try {
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
            .execute();

        // .innerJoin(
        //     (eb) => eb
        //         .selectFrom('properties')
        //         .selectAll()
        //         .where('field_id', '=', 'title')
        //         .as('properties'),
        //     (join) => join
        //         .onRef('properties.page_id', '=', 'pages.page_id'),
        // ).select(['pages.page_id', 'pages.created_at', 'pages.created_by', 'pages.updated_at', 'pages.updated_by', 'properties.value as title'])
        // .where(sql`cardinality(properties.value::jsonb[])`, '>', 0)

        res.json(pages);
    } catch (error) {
        console.error(error);

        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

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

