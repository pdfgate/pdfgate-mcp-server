import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getClient } from "../client.js";

export function register(server: McpServer): void {
  server.tool(
    "get_envelope",
    "Retrieve the current state of an envelope including its status, document progress, and per-recipient signing status. Each recipient carries an embedded boolean; embedded recipients have no signing link — mint one with create_embed_link instead. Recipients on ordered documents carry signingOrder and, once it is their turn, activatedAt.",
    {
      envelopeId: z.string().describe("The envelope ID to retrieve"),
    },
    async ({ envelopeId }) => {
      try {
        const result = await getClient().getEnvelope({ id: envelopeId });
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return { content: [{ type: "text", text: `Error: ${msg}` }], isError: true };
      }
    }
  );
}
