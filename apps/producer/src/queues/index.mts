import { readdirSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter.js';

export const loadQueues = async () => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const queuesPath = resolve(__dirname);

    const queueFiles = readdirSync(queuesPath).filter(
        (file) => file.endsWith('.mjs') && file !== 'index.mjs',
    );

    const bullMQAdapters = await Promise.all(
        queueFiles.map(async (file) => {
            try {
                const queueModuleUrl = pathToFileURL(
                    join(queuesPath, file),
                ).href;
                const queueModule = await import(queueModuleUrl);
                const queue = queueModule.default;

                if (queue) {
                    console.log(`Queue loaded from: ${file}`);
                    return new BullMQAdapter(queue);
                }
            } catch (err) {
                console.error(`Failed to load queue from file ${file}:`, err);
            }
        }),
    );

    // Filter out any undefined values
    return bullMQAdapters.filter((adapter) => adapter !== undefined);
};