import { postQueue } from "./bull.mjs";
import notion from "./notion.mjs";
import { getPageBlocks } from "./utils/getPageBlocks.mjs";

const { results: posts } = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!!,
    filter: {
        property: "Status",
        status: {
            equals: "Published",
        },
    },
});

const fullPosts = await Promise.all(posts.map(async (post) => {
    if (true) {
        const blocks = await getPageBlocks(post.id);

        // await postQueue.add('processPost', {
        //     overview: post,
        //     content: blocks
        // });
        return {
            overview: post,
            content: blocks
        };
    }
}));

// writeFileSync("posts.json", JSON.stringify(fullPosts, null, 2));


