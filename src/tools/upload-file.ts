import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { readFileSync } from "node:fs";
import path from "node:path";
import { getClient } from "../client.js";

export function register(server: McpServer): void {
  server.tool(
    "upload_file",
    "Upload a PDF to PDFGate so it can be referenced by other operations. Provide either 'filePath' (local path) or 'url'.",
    {
      filePath: z.string().optional().describe("Absolute local path to the PDF file to upload"),
      url: z.string().url().optional().describe("Publicly accessible URL of the PDF to upload"),
      preSignedUrlExpiresIn: z
        .number()
        .int()
        .min(60)
        .max(86400)
        .optional()
        .describe("Pre-signed download URL expiry in seconds (60–86400)"),
      metadata: z.record(z.unknown()).optional().describe("Custom metadata to attach"),
    },
    async ({ filePath, url, preSignedUrlExpiresIn, metadata }) => {
      try {
        let file: { name: string; data: Buffer } | undefined;
        if (filePath) {
          const data = readFileSync(filePath);
          file = { name: path.basename(filePath), data };
        }
        const result = await getClient().uploadFile({ file, url, preSignedUrlExpiresIn, metadata });
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return { content: [{ type: "text", text: `Error: ${msg}` }], isError: true };
      }
    }
  );
}
