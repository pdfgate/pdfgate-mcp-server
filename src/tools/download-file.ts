import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getClient } from "../client.js";

export function register(server: McpServer): void {
  server.tool(
    "download_file",
    "Download the raw PDF bytes of a stored document, returned as an embedded resource. For a shareable link instead, use get_document.",
    {
      documentId: z.string().describe("The document ID"),
    },
    async ({ documentId }) => {
      try {
        const data = await getClient().getFile({ documentId });
        const buf = Buffer.isBuffer(data) ? data : Buffer.from(data as unknown as Uint8Array);
        return {
          content: [
            { type: "text", text: `Downloaded document ${documentId} (${buf.length} bytes).` },
            {
              type: "resource",
              resource: {
                uri: `pdfgate://document/${documentId}/file`,
                mimeType: "application/pdf",
                blob: buf.toString("base64"),
              },
            },
          ],
        };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return { content: [{ type: "text", text: `Error: ${msg}` }], isError: true };
      }
    }
  );
}
