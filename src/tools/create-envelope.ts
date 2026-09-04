import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getClient } from "../client.js";

const recipientSchema = z.object({
  email: z.string().email().describe("Recipient email address"),
  name: z.string().describe("Recipient display name"),
  role: z.string().optional().describe("Recipient role label"),
  reminderIntervalDays: z.number().int().optional().describe("Days between reminder emails"),
  reminderAttempts: z.number().int().min(1).max(10).optional().describe("Maximum number of reminder emails (defaults to 5)"),
});

const documentSchema = z.object({
  sourceDocumentId: z
    .string()
    .describe("ID of the document previously generated or uploaded to PDFGate"),
  name: z.string().describe("Display name for this document in the envelope"),
  recipients: z.array(recipientSchema).min(1).describe("Recipients for this document"),
});

export function register(server: McpServer): void {
  server.tool(
    "create_envelope",
    "Create a signing envelope from one or more existing PDFGate documents. Returns an envelope in 'created' status; call send_envelope to dispatch signing emails.",
    {
      documents: z.array(documentSchema).min(1).describe("Documents to include in the envelope"),
      requesterName: z.string().describe("Name of the user or system creating the envelope"),
      metadata: z.record(z.unknown()).optional().describe("Custom metadata to attach"),
      expiresInDays: z
        .number()
        .int()
        .min(1)
        .max(90)
        .optional()
        .describe(
          "Days until the envelope and its signing links expire, counted from creation. " +
            "Defaults to the account's envelope expiration setting."
        ),
    },
    async ({ documents, requesterName, metadata, expiresInDays }) => {
      try {
        const result = await getClient().createEnvelope({
          documents,
          requesterName,
          metadata,
          expiresInDays,
        });
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return { content: [{ type: "text", text: `Error: ${msg}` }], isError: true };
      }
    }
  );
}
