import queue from "../connections/bull.mjs";
import { NotionDatabase } from "../types.mjs";

export const processDatabaseList = async () => {
    try {
        const databases: NotionDatabase[] = process.env.DATABASE_LIST ? JSON.parse(process.env.DATABASE_LIST) : [];

        await queue.addBulk(databases.map((database) => ({
            name: 'processDatabase',
            data: database
        })));
    } catch (error) {
        console.error({
            location: 'processDatabaseList',
            error,
        });
    }
}