import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { register as registerGeneratePdf } from "./generate-pdf.js";
import { register as registerUploadPdf } from "./upload-pdf.js";
import { register as registerGetDocument } from "./get-document.js";
import { register as registerDeleteDocument } from "./delete-document.js";
import { register as registerFlattenPdf } from "./flatten-pdf.js";
import { register as registerExtractPdfData } from "./extract-pdf-data.js";
import { register as registerCompressPdf } from "./compress-pdf.js";
import { register as registerProtectPdf } from "./protect-pdf.js";
import { register as registerWatermarkPdf } from "./watermark-pdf.js";
import { register as registerCreateEnvelope } from "./create-envelope.js";
import { register as registerSendEnvelope } from "./send-envelope.js";
import { register as registerGetEnvelope } from "./get-envelope.js";
import { register as registerCreateWebhook } from "./create-webhook.js";
import { register as registerDeleteWebhook } from "./delete-webhook.js";

export function registerTools(server: McpServer): void {
  registerGeneratePdf(server);
  registerUploadPdf(server);
  registerGetDocument(server);
  registerDeleteDocument(server);
  registerFlattenPdf(server);
  registerExtractPdfData(server);
  registerCompressPdf(server);
  registerProtectPdf(server);
  registerWatermarkPdf(server);
  registerCreateEnvelope(server);
  registerSendEnvelope(server);
  registerGetEnvelope(server);
  registerCreateWebhook(server);
  registerDeleteWebhook(server);
}
