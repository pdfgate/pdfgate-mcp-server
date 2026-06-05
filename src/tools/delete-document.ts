import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { httpDelete } from "../http.js";

export function register(server: McpServer): void {
  server.tool(
    "delete_document",
    "Delete a PDFGate document.",
    {
      documentId: z.string().describe("The document ID to delete"),
    },
    async ({ documentId }) => {
      try {
        await httpDelete(`/document/${documentId}`);
        return { content: [{ type: "text", text: `Document ${documentId} deleted successfully.` }] };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return { content: [{ type: "text", text: `Error: ${msg}` }], isError: true };
      }
    }
  );
}
