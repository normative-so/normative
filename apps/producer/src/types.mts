import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export interface NotionDatabase {
    alias: string;
    id: string;
}

export interface NotionPage {
    database: NotionDatabase;
    page: PageObjectResponse;
}

export interface NotionBlock {
    page_id: string;
    block_id: string;
}