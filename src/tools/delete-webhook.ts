import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getClient } from "../client.js";

export function register(server: McpServer): void {
  server.tool(
    "delete_webhook",
    "Delete a PDFGate webhook subscription. Future events will no longer be delivered to the associated endpoint.",
    {
      webhookId: z.string().describe("The webhook ID to delete"),
    },
    async ({ webhookId }) => {
      try {
        await getClient().deleteWebhook({ id: webhookId });
        return { content: [{ type: "text", text: `Webhook ${webhookId} deleted successfully.` }] };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return { content: [{ type: "text", text: `Error: ${msg}` }], isError: true };
      }
    }
  );
}
