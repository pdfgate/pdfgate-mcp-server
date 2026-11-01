import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getClient } from "../client.js";

export function register(server: McpServer): void {
  server.tool(
    "remove_recipient_signature",
    "Automatic signing: remove the stored signature of a recipient (signature.status becomes 'revoked' and the recipient.signature.revoked webhook fires) or cancel a pending enrolment so its link stops working. Envelopes already waiting on the automatic signature fall back to a signing link emailed to the recipient. Idempotent: a recipient without a stored signature is returned unchanged. Required before delete_recipient while a signature is active or an enrolment is pending.",
    {
      recipientId: z.string().describe("The recipient ID"),
    },
    async ({ recipientId }) => {
      try {
        const result = await getClient().removeRecipientSignature({ id: recipientId });
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return { content: [{ type: "text", text: `Error: ${msg}` }], isError: true };
      }
    }
  );
}
