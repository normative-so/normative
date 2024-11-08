import { readdirSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

export async function initializeWorkers() {
    try {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        const workersPath = resolve(__dirname);
        const workerFiles = readdirSync(workersPath).filter(
            (file) => file.endsWith('.mjs') && file !== 'index.mjs',
        );

        await Promise.all(
            workerFiles.map(async (file) => {
                try {
                    const workerModuleUrl = pathToFileURL(
                        join(workersPath, file),
                    ).href;
                    const workerModule = await import(workerModuleUrl);
                    const { default: worker } = workerModule;

                    if (worker) {
                        console.log(`Initialized worker from ${file}`);
                    } else {
                        console.error(
                            `Failed to initialize worker from ${file}: no default export found`,
                        );
                    }
                } catch (importError) {
                    console.error(
                        `Failed to import worker from ${file}:`,
                        importError,
                    );
                }
            }),
        );
    } catch (error) {
        console.error('Failed to initialize workers:', error);
    }
}
