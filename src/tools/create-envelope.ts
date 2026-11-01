import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getClient } from "../client.js";

const recipientSchema = z.object({
  recipientId: z
    .string()
    .optional()
    .describe("ID of a stored recipient to reuse. Provide either recipientId or email and name, never both"),
  email: z.string().email().optional().describe("Recipient email address. Required when recipientId is not provided"),
  name: z.string().optional().describe("Recipient display name. Required when recipientId is not provided"),
  role: z.string().optional().describe("Recipient role label"),
  reminderIntervalDays: z.number().int().optional().describe("Days between reminder emails"),
  reminderAttempts: z.number().int().min(1).max(10).optional().describe("Maximum number of reminder emails (defaults to 5)"),
  signingOrder: z
    .number()
    .int()
    .min(1)
    .optional()
    .describe(
      "Signing order of the recipient, starting from 1. Recipients sign one after another in this order and a recipient is activated once everyone with a lower value has signed. Recipients with the same value can sign in parallel. Provide it for every recipient of a document or for none. Omitted, all recipients can sign immediately"
    ),
  embedded: z
    .boolean()
    .optional()
    .describe(
      "Embedded recipients sign inside your own application through a short-lived embed link and receive no emails from PDFGate"
    ),
  autoSign: z
    .boolean()
    .optional()
    .describe(
      "Automatic signing. Applies the stored signature of the referenced recipient on their behalf when their turn to sign comes, with no signing session or email. Requires recipientId pointing to a recipient with an active stored signature (request it with the request_recipient_signature tool) and cannot be combined with embedded. Every required field of the recipient must already have a value before the document is sent, except signature and auto-filled date fields"
    ),
  sendSignedCopy: z
    .boolean()
    .optional()
    .describe(
      "Whether to email this recipient the signed document when the document completes. Defaults to true for recipients who sign through the emailed signing link and false for embedded and automatic signing recipients"
    ),
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
    "Create a signing envelope from one or more existing PDFGate documents. Each recipient is given either as email and name or as the recipientId of a stored recipient. A recipient signs through the hosted flow (emailed link), embedded signing (embedded: sign inside your application via create_embed_link, no emails) or automatic signing (autoSign: the stored signature of a recipient enrolled with request_recipient_signature is applied on their behalf, no signing session). Use signingOrder to make recipients sign in sequence. Returns an envelope in 'created' status; call send_envelope to dispatch signing emails.",
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
