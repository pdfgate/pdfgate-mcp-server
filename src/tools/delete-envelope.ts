import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getClient } from "../client.js";

export function register(server: McpServer): void {
  server.tool(
    "delete_envelope",
    "Permanently delete an envelope and the files it produced (signed documents and audit logs). Recipient data is anonymized and recipients lose access; source documents are not deleted. Only envelopes in 'draft', 'completed', 'expired', or 'voided' status can be deleted — void an active envelope first. Cannot be undone.",
    {
      envelopeId: z.string().describe("The envelope ID to delete"),
    },
    async ({ envelopeId }) => {
      try {
        await getClient().deleteEnvelope({ id: envelopeId });
        return { content: [{ type: "text", text: `Envelope ${envelopeId} deleted successfully.` }] };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return { content: [{ type: "text", text: `Error: ${msg}` }], isError: true };
      }
    }
  );
}
