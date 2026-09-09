import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getClient } from "../client.js";

export function register(server: McpServer): void {
  server.tool(
    "update_recipient",
    "Update a stored recipient's name or metadata. The email cannot be changed. Existing envelopes are not affected; they keep the recipient name they were created with.",
    {
      recipientId: z.string().describe("The recipient ID"),
      name: z.string().optional().describe("New recipient display name"),
      metadata: z.record(z.unknown()).optional().describe("Replacement custom metadata"),
    },
    async ({ recipientId, name, metadata }) => {
      try {
        const result = await getClient().updateRecipient({ id: recipientId, name, metadata });
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return { content: [{ type: "text", text: `Error: ${msg}` }], isError: true };
      }
    }
  );
}
