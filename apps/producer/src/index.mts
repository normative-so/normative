import postQueue from "./connections/bull.mjs";
import notion from "./connections/notion.mjs";
import redis from "./connections/redis.mjs";
import { getPageBlocks } from "./utils/getPageBlocks.mjs";
import { getPosts } from "./utils/getPosts.mjs";

while (true) {
    const posts = await getPosts();

    const lastChecked = await redis.get('lastChecked') ?? new Date(0).toISOString();

    const updatedPosts = posts.filter((post) => post.last_edited_time > lastChecked);

    console.log(`Found ${updatedPosts.length} updated posts`);

    const fullPosts = await Promise.all(updatedPosts.map(async (post) => {
        const blocks = await getPageBlocks(post.id);

        await postQueue.add('processPost', {
            overview: post,
            content: blocks
        });
    }));

    await redis.set('lastChecked', new Date().toISOString());
    await new Promise((resolve) => setTimeout(resolve, 1000 * 30));
}

// writeFileSync("posts.json", JSON.stringify(fullPosts, null, 2));


