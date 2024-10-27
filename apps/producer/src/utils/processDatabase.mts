import queue from "../connections/bull.mjs";
import notion from "../connections/notion.mjs";


export const processDatabase = async (database_id: string) => {
    const { results: pages } = await notion.databases.query({
        database_id: database_id,
    });

    await queue.addBulk(pages.map((page) => ({
        name: 'processPage',
        data: {
            page: page,
        },
    })));
}