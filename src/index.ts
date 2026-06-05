#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerTools } from "./tools/index.js";
import { startWebhookServer } from "./webhooks/server.js";
import { getEvents } from "./webhooks/store.js";

const server = new McpServer({
  name: "pdfgate",
  version: "0.1.0",
});

registerTools(server);

server.resource(
  "pdfgate-events",
  "pdfgate://events",
  { description: "Recent PDFGate webhook events (newest first, up to 100). Subscribe to this resource to receive push notifications when new events arrive." },
  async () => ({
    contents: [
      {
        uri: "pdfgate://events",
        mimeType: "application/json",
        text: JSON.stringify(getEvents(), null, 2),
      },
    ],
  })
);

startWebhookServer(server);

const transport = new StdioServerTransport();
await server.connect(transport);
