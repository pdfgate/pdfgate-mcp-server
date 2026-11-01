import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getClient } from "../client.js";

export function register(server: McpServer): void {
  server.tool(
    "get_recipient",
    "Retrieve a stored recipient by ID. Once a stored signature was requested the response carries a signature object (status pending, active or revoked, plus requestedAt, adoptionMethod, enrolledAt, revokedAt, lastUsedAt and useCount); while the signature is active it also includes image, the signature as a PNG data URL, which can be very long.",
    {
      recipientId: z.string().describe("The recipient ID"),
    },
    async ({ recipientId }) => {
      try {
        const result = await getClient().getRecipient({ id: recipientId });
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return { content: [{ type: "text", text: `Error: ${msg}` }], isError: true };
      }
    }
  );
}
