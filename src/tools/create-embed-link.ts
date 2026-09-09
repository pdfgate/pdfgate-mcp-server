import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getClient } from "../client.js";

export function register(server: McpServer): void {
  server.tool(
    "create_embed_link",
    "Create a short-lived signing URL for an embedded recipient, to be rendered in an iframe inside your application. The envelope must be in 'in_progress' status and the link expires after 10 minutes, so create it when the signer is ready (one link per signing session). When the session ends the iframe redirects to returnUrl with event (signing_complete, voided, expired or not_found), envelopeId, documentId and recipientId appended as query parameters; existing returnUrl query parameters are preserved.",
    {
      envelopeId: z.string().describe("The envelope ID"),
      documentId: z.string().describe("The envelope document ID (sourceDocumentId)"),
      recipientId: z.string().describe("The recipient ID of the embedded recipient"),
      returnUrl: z.string().url().describe("URL the signing session redirects to when it ends"),
    },
    async ({ envelopeId, documentId, recipientId, returnUrl }) => {
      try {
        const result = await getClient().createEmbedLink({
          id: envelopeId,
          documentId,
          recipientId,
          returnUrl,
        });
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return { content: [{ type: "text", text: `Error: ${msg}` }], isError: true };
      }
    }
  );
}
