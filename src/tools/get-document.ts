import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getClient } from "../client.js";

export function register(server: McpServer): void {
  server.tool(
    "get_document",
    "Retrieve metadata for a stored PDFGate document by its ID.",
    {
      documentId: z.string().describe("The document ID"),
      preSignedUrlExpiresIn: z
        .number()
        .int()
        .min(60)
        .max(86400)
        .optional()
        .describe("Generate a fresh pre-signed download URL expiring in this many seconds (60–86400)"),
    },
    async ({ documentId, preSignedUrlExpiresIn }) => {
      try {
        const result = await getClient().getDocument({ id: documentId, preSignedUrlExpiresIn });
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return { content: [{ type: "text", text: `Error: ${msg}` }], isError: true };
      }
    }
  );
}
