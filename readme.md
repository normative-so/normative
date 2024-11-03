# Normative Project

## Setup

1. **Get a Notion Integration ID:**
   - Go to [Notion Developers](https://www.notion.so/my-integrations) and create a new integration.
   - Copy the Integration ID.

2. **Set up Environment Variables:**
   - Create a `.env` file in the root directory of the project.
   - Add your Notion Integration ID to the `.env` file:
     
     ```
     NOTION_TOKEN=your_integration_id_here
     ```

3. **Install Dependencies:**
   - Run the following command to install the necessary dependencies:
     
     ```bash
     pnpm install
     ```

4. **Start the Server:**
   - Run the following command to start the server:
     
     ```bash
     pnpm start
     ```

## Usage

- **Get Database Details:**
  - To get details of a database, use the following routes:
    
    ```
    http://localhost:3000/<database_id or database_alias>
    ```
  - To get details of a page, use the following routes:
    
    ```
    http://localhost:3000/<database_id or database_alias>/<page_id>
    ```

Make sure to replace `database_id`, `database_alias`, and `page_id` with the actual values.

## License

This project is licensed under the MIT License.