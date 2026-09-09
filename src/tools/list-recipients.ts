import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getClient } from "../client.js";

export function register(server: McpServer): void {
  server.tool(
    "list_recipients",
    "List stored recipients with the given email (case-insensitive), oldest first.",
    {
      email: z.string().email().describe("Email to look up"),
    },
    async ({ email }) => {
      try {
        const result = await getClient().listRecipients({ email });
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return { content: [{ type: "text", text: `Error: ${msg}` }], isError: true };
      }
    }
  );
}
