import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getClient } from "../client.js";

export function register(server: McpServer): void {
  server.tool(
    "request_recipient_signature",
    "Automatic signing: email a stored recipient a link to store a reusable signature (they verify their email with a one-time code, accept the authorization text and type, draw or upload their signature). The link is valid for 7 days and calling this again replaces a pending request with a new link. Returns the recipient with signature.status 'pending'; once they complete the enrolment the recipient.signature.enrolled webhook fires and envelopes can set autoSign on this recipient. Rejected with a 400 error when the recipient has no email or already has an active stored signature (remove it first with remove_recipient_signature).",
    {
      recipientId: z.string().describe("The recipient ID"),
    },
    async ({ recipientId }) => {
      try {
        const result = await getClient().requestRecipientSignature({ id: recipientId });
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return { content: [{ type: "text", text: `Error: ${msg}` }], isError: true };
      }
    }
  );
}
