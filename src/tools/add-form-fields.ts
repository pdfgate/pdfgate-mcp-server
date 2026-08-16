import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getClient } from "../client.js";

const fieldType = z.enum([
  "signature",
  "text",
  "number",
  "textarea",
  "date",
  "time",
  "datetime",
  "checkbox",
  "radio",
  "select",
]);

export function register(server: McpServer): void {
  server.tool(
    "add_form_fields",
    "Add interactive form fields to a stored PDF — from placeholder tags (refined via fieldOverrides) and/or explicitly positioned fields.",
    {
      documentId: z.string().describe("The document ID"),
      fieldOverrides: z
        .record(
          z.object({
            options: z.array(z.string()).optional(),
            height: z.number().int().positive().optional(),
            width: z.number().int().positive().optional(),
            role: z.string().optional(),
            fontSize: z.number().positive().optional(),
            autoFill: z.boolean().optional(),
            optional: z.boolean().optional(),
            description: z.string().optional(),
          })
        )
        .optional()
        .describe("Per-field overrides keyed by field name"),
      fields: z
        .array(
          z.object({
            name: z.string(),
            type: fieldType,
            page: z.number().int().min(1),
            height: z.number().int().min(1),
            width: z.number().int().min(1),
            x: z.number(),
            y: z.number(),
            value: z.string().optional(),
            options: z.array(z.string()).optional(),
            role: z.string().optional(),
            fontSize: z.number().positive().optional(),
            autoFill: z.boolean().optional(),
            optional: z.boolean().optional(),
            description: z.string().optional(),
          })
        )
        .optional()
        .describe("Fields to add at explicit positions"),
      preSignedUrlExpiresIn: z
        .number()
        .int()
        .min(60)
        .max(86400)
        .optional()
        .describe("Generate a fresh pre-signed download URL expiring in this many seconds (60–86400)"),
    },
    async ({ documentId, fieldOverrides, fields, preSignedUrlExpiresIn }) => {
      try {
        const result = await getClient().addFormFields({
          documentId,
          fieldOverrides,
          fields,
          preSignedUrlExpiresIn,
        } as Parameters<ReturnType<typeof getClient>["addFormFields"]>[0]);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return { content: [{ type: "text", text: `Error: ${msg}` }], isError: true };
      }
    }
  );
}
