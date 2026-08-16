import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getClient } from "../client.js";

export function register(server: McpServer): void {
  server.tool(
    "extract_form_data",
    "Extract form field values from a fillable PDF. Returns a JSON object mapping field names to their values.",
    {
      documentId: z.string().describe("The document ID of the fillable PDF"),
    },
    async ({ documentId }) => {
      try {
        const result = await getClient().extractPdfFormData({ documentId });
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return { content: [{ type: "text", text: `Error: ${msg}` }], isError: true };
      }
    }
  );
}
