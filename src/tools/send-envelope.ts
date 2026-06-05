import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getClient } from "../client.js";

export function register(server: McpServer): void {
  server.tool(
    "send_envelope",
    "Send a created envelope to its recipients. PDFGate dispatches signing emails with secure, OTP-protected links that expire after 30 days.",
    {
      envelopeId: z.string().describe("The envelope ID to send"),
    },
    async ({ envelopeId }) => {
      try {
        const result = await getClient().sendEnvelope({ id: envelopeId });
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return { content: [{ type: "text", text: `Error: ${msg}` }], isError: true };
      }
    }
  );
}
