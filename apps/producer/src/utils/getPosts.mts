import { PageObjectResponse, PartialPageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import notion from "../connections/notion.mjs";

export const getPosts = async (): Promise<PageObjectResponse[]> => {
    const { results: posts } = await notion.databases.query({
        database_id: process.env.NOTION_DATABASE_ID!!,
        filter: {
            property: "Status",
            status: {
                equals: "Published",
            },
        },
    });

    return posts as PageObjectResponse[];
}