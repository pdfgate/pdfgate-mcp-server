import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getClient } from "../client.js";

export function register(server: McpServer): void {
  server.tool(
    "compress_pdf",
    "Compress/optimise a PDF to reduce file size without changing visual content.",
    {
      documentId: z.string().describe("The source document ID to compress"),
      linearize: z
        .boolean()
        .optional()
        .describe("Linearise the PDF to enable fast web view (first page renders sooner)"),
      preSignedUrlExpiresIn: z
        .number()
        .int()
        .min(60)
        .max(86400)
        .optional()
        .describe("Pre-signed download URL expiry in seconds (60–86400)"),
      metadata: z.record(z.unknown()).optional().describe("Custom metadata to attach"),
    },
    async ({ documentId, linearize, preSignedUrlExpiresIn, metadata }) => {
      try {
        const result = await getClient().compressPdf({ documentId, linearize, preSignedUrlExpiresIn, metadata });
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return { content: [{ type: "text", text: `Error: ${msg}` }], isError: true };
      }
    }
  );
}
