import queue from "../connections/bull.mjs";
import notion from "../connections/notion.mjs";


export const processDatabase = async (database_id: string) => {
    const { results } = await notion.databases.query({
        database_id: database_id,
    });

    for (const row of results) {
        console.log(`Enqueuing row ${row.id}`);

        await queue.add('processRow', {
            rows: row,
        });
    }
}