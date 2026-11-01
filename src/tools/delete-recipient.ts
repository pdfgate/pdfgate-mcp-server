import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getClient } from "../client.js";

export function register(server: McpServer): void {
  server.tool(
    "delete_recipient",
    "Delete a stored recipient from your account directory. The record is kept with its personal data removed (email, name, phone, metadata and any stored signature), so later reads return 404 and a new envelope to the same address creates a fresh recipient; envelopes already sent keep their own copy and are not affected. Rejected with a 400 error while the recipient has an active stored signature or a pending enrolment — call remove_recipient_signature first.",
    {
      recipientId: z.string().describe("The recipient ID"),
    },
    async ({ recipientId }) => {
      try {
        await getClient().deleteRecipient({ id: recipientId });
        return { content: [{ type: "text", text: `Recipient ${recipientId} deleted successfully.` }] };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return { content: [{ type: "text", text: `Error: ${msg}` }], isError: true };
      }
    }
  );
}
