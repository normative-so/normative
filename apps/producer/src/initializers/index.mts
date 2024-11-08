import { migrate } from "../db/migrator.mjs";
import { processDatabaseList } from "../jobs/index.mjs";
import { initializeWorkers } from "../workers/index.mjs"

export const initializeApp = async () => {
    await migrate();

    await processDatabaseList();

    await initializeWorkers();
}