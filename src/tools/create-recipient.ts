import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getClient } from "../client.js";

export function register(server: McpServer): void {
  server.tool(
    "create_recipient",
    "Store a recipient in your account so envelopes can reference them by recipientId. Emails are not unique; every call creates a new recipient, so use list_recipients first when reuse is intended.",
    {
      email: z
        .string()
        .email()
        .describe("Recipient email address. Stored lowercased and cannot be changed later"),
      name: z.string().optional().describe("Recipient display name"),
      metadata: z.record(z.unknown()).optional().describe("Custom metadata to attach"),
    },
    async ({ email, name, metadata }) => {
      try {
        const result = await getClient().createRecipient({ email, name, metadata });
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return { content: [{ type: "text", text: `Error: ${msg}` }], isError: true };
      }
    }
  );
}
