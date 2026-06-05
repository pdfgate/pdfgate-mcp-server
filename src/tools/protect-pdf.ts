import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getClient } from "../client.js";

export function register(server: McpServer): void {
  server.tool(
    "protect_pdf",
    "Encrypt a PDF with a password and optional permission restrictions. Produces a new document; the original is unchanged.",
    {
      documentId: z.string().describe("The source document ID to protect"),
      algorithm: z
        .enum(["AES256", "AES128"])
        .optional()
        .describe("Encryption algorithm (default: AES256)"),
      userPassword: z
        .string()
        .optional()
        .describe("Password required to open the PDF"),
      ownerPassword: z
        .string()
        .optional()
        .describe("Full-control owner password; required when using AES256 with a userPassword"),
      disablePrint: z.boolean().optional().describe("Prevent printing"),
      disableCopy: z.boolean().optional().describe("Prevent copying text"),
      disableEditing: z.boolean().optional().describe("Prevent editing"),
      encryptMetadata: z.boolean().optional().describe("Encrypt PDF metadata (default: false)"),
      preSignedUrlExpiresIn: z
        .number()
        .int()
        .min(60)
        .max(86400)
        .optional()
        .describe("Pre-signed download URL expiry in seconds (60–86400)"),
      metadata: z.record(z.unknown()).optional().describe("Custom metadata to attach"),
    },
    async ({
      documentId,
      algorithm,
      userPassword,
      ownerPassword,
      disablePrint,
      disableCopy,
      disableEditing,
      encryptMetadata,
      preSignedUrlExpiresIn,
      metadata,
    }) => {
      try {
        const result = await getClient().protectPdf({
          documentId,
          algorithm,
          userPassword,
          ownerPassword,
          disablePrint,
          disableCopy,
          disableEditing,
          encryptMetadata,
          preSignedUrlExpiresIn,
          metadata,
        });
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return { content: [{ type: "text", text: `Error: ${msg}` }], isError: true };
      }
    }
  );
}
