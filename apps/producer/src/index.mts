// import { enqueueRows } from "./enqueue/rows.mjs";
import queue from "./connections/bull.mjs";
import { databases } from "./utils/data.mjs";
import "./utils/worker.mjs";

for (const database of databases) {
    console.log(`Enqueuing database ${database}`);

    await queue.add('processDatabase', {
        databaseId: database,
    }, {
        repeat: {
            every: 1000 * 60,
        }
    });
}

//

// while (true) {
//     await enqueueDatabases();
// await enqueueRows();

// const posts = await getPosts();

// const lastChecked = await redis.get('lastChecked') ?? new Date(0).toISOString();

// const updatedPosts = posts.filter((post) => post.last_edited_time > lastChecked);

// console.log(`Found ${updatedPosts.length} updated posts`);

// const fullPosts = await Promise.all(updatedPosts.map(async (post) => {
//     const blocks = await getPageBlocks(post.id);

//     await postQueue.add('processPost', {
//         overview: post,
//         content: blocks
//     });
// }));

// await redis.set('lastChecked', new Date().toISOString());
await new Promise((resolve) => setTimeout(resolve, 1000 * 60 * 10));
// }

// writeFileSync("posts.json", JSON.stringify(fullPosts, null, 2));


