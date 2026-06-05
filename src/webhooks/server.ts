import * as http from "node:http";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { addEvent } from "./store.js";
import { hasSecrets, verifyWithAnySecret } from "./secrets.js";

export function startWebhookServer(mcpServer: McpServer): void {
  const port = parseInt(process.env.PDFGATE_WEBHOOK_PORT ?? "3599", 10);

  const httpServer = http.createServer((req, res) => {
    if (req.method !== "POST") {
      res.writeHead(405).end();
      return;
    }

    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => {
      const rawBody = Buffer.concat(chunks);

      if (hasSecrets()) {
        const signature = req.headers["x-pdfgate-signature"];
        if (typeof signature !== "string") {
          res.writeHead(401).end("Missing signature");
          return;
        }
        if (!verifyWithAnySecret(signature, rawBody)) {
          res.writeHead(401).end("Invalid signature");
          return;
        }
      }

      try {
        const event = JSON.parse(rawBody.toString("utf8"));
        addEvent(event);
        mcpServer.server.sendResourceUpdated({ uri: "pdfgate://events" }).catch(() => {});
      } catch {
        res.writeHead(400).end("Invalid JSON");
        return;
      }

      res.writeHead(200).end("OK");
    });
  });

  httpServer.listen(port, () => {
    process.stderr.write(`PDFGate webhook listener started on port ${port}\n`);
  });
}
