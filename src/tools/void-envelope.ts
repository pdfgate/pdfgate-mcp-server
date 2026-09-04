import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getClient } from "../client.js";

export function register(server: McpServer): void {
  server.tool(
    "void_envelope",
    "Void (cancel) an envelope in 'created' or 'in_progress' status. Recipients who have not signed are notified by email and their signing links stop working; documents already signed by all recipients are not affected. The optional reason is visible to recipients. Cannot be undone.",
    {
      envelopeId: z.string().describe("The envelope ID to void"),
      reason: z
        .string()
        .max(500)
        .optional()
        .describe("Reason for voiding. Included in the cancellation email sent to recipients"),
    },
    async ({ envelopeId, reason }) => {
      try {
        const result = await getClient().voidEnvelope({ id: envelopeId, reason });
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return { content: [{ type: "text", text: `Error: ${msg}` }], isError: true };
      }
    }
  );
}
