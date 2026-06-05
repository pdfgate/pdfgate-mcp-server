import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { httpPost } from "../http.js";
import { addSecret } from "../webhooks/secrets.js";

interface WebhookResponse {
  id: string;
  url: string;
  eventTypes: string[];
  description?: string;
  secret: string;
}

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
            "envelope.document.completed",
          ])
        )
        .min(1)
        .describe("Event types to subscribe to"),
      description: z.string().optional().describe("Optional label to identify this webhook"),
    },
    async ({ url, eventTypes, description }) => {
      try {
        const result = await httpPost<WebhookResponse>("/webhook", { url, eventTypes, description });
        addSecret(result.secret);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return { content: [{ type: "text", text: `Error: ${msg}` }], isError: true };
      }
    }
  );
}
