import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getClient } from "../client.js";

export function register(server: McpServer): void {
  server.tool(
    "generate_pdf",
    "Generate a PDF from a URL or raw HTML. Provide either 'url' or 'html', not both.",
    {
      url: z.string().url().optional().describe("Public URL to render as PDF"),
      html: z.string().optional().describe("Raw HTML string to render as PDF"),
      pageSizeType: z
        .enum(["a0", "a1", "a2", "a3", "a4", "a5", "a6", "ledger", "tabloid", "legal", "letter"])
        .optional()
        .describe("Page size (default: a4)"),
      orientation: z
        .enum(["portrait", "landscape"])
        .optional()
        .describe("Page orientation (default: portrait)"),
      marginTop: z.string().optional().describe("Top margin e.g. '10mm'"),
      marginBottom: z.string().optional().describe("Bottom margin"),
      marginLeft: z.string().optional().describe("Left margin"),
      marginRight: z.string().optional().describe("Right margin"),
      header: z.string().optional().describe("HTML string for the page header"),
      footer: z.string().optional().describe("HTML string for the page footer"),
      printBackground: z.boolean().optional().describe("Print background graphics (default: true)"),
      waitForNetworkIdle: z.boolean().optional().describe("Wait for network idle before rendering"),
      javascript: z.string().optional().describe("JavaScript to inject before rendering"),
      css: z.string().optional().describe("CSS to inject before rendering"),
      emulateMediaType: z.enum(["screen", "print"]).optional(),
      enableFormFields: z
        .boolean()
        .optional()
        .describe("Enable interactive PDF form fields from HTML"),
      preSignedUrlExpiresIn: z
        .number()
        .int()
        .min(60)
        .max(86400)
        .optional()
        .describe("Pre-signed download URL expiry in seconds (60–86400)"),
      metadata: z.record(z.unknown()).optional().describe("Custom metadata to attach"),
    },
    async ({
      url,
      html,
      pageSizeType,
      orientation,
      marginTop,
      marginBottom,
      marginLeft,
      marginRight,
      header,
      footer,
      printBackground,
      waitForNetworkIdle,
      javascript,
      css,
      emulateMediaType,
      enableFormFields,
      preSignedUrlExpiresIn,
      metadata,
    }) => {
      try {
        const margin =
          marginTop || marginBottom || marginLeft || marginRight
            ? { top: marginTop, bottom: marginBottom, left: marginLeft, right: marginRight }
            : undefined;

        const result = await getClient().generatePdf({
          url,
          html,
          pageSizeType: pageSizeType as any,
          orientation: orientation as any,
          margin,
          header,
          footer,
          printBackground,
          waitForNetworkIdle,
          javascript,
          css,
          emulateMediaType: emulateMediaType as any,
          enableFormFields,
          preSignedUrlExpiresIn,
          metadata,
        });
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return { content: [{ type: "text", text: `Error: ${msg}` }], isError: true };
      }
    }
  );
}
