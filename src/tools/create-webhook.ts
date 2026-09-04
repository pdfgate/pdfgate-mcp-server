import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getClient } from "../client.js";
import { addSecret } from "../webhooks/secrets.js";

export function register(server: McpServer): void {
  server.tool(
    "create_webhook",
    "Create a PDFGate webhook subscription. The response includes a signing secret — store it securely to verify incoming event signatures.",
    {
      url: z.string().url().describe("The HTTPS endpoint that will receive webhook events"),
      eventTypes: z
        .array(
          z.enum([
            "envelope.sent",
            "envelope.completed",
            "envelope.expired",
            "envelope.voided",
            "envelope.deleted",
            "envelope.recipient.signed",
            "envelope.document.completed",
          ])
        )
        .min(1)
        .describe("Event types to subscribe to"),
      description: z.string().optional().describe("Optional label to identify this webhook"),
    },
    async ({ url, eventTypes, description }) => {
      try {
        const result = await getClient().createWebhook({
          url,
          eventTypes,
          description,
        } as Parameters<ReturnType<typeof getClient>["createWebhook"]>[0]);
        if (result.secret) addSecret(result.secret);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return { content: [{ type: "text", text: `Error: ${msg}` }], isError: true };
      }
    }
  );
}
