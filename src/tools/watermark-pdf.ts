import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { readFileSync } from "node:fs";
import path from "node:path";
import { getClient } from "../client.js";

export function register(server: McpServer): void {
  server.tool(
    "watermark_pdf",
    "Apply a text or image watermark to a PDF. For type='text' provide 'text'; for type='image' provide 'watermarkImagePath'.",
    {
      documentId: z.string().describe("The source document ID"),
      type: z.enum(["text", "image"]).describe("Watermark type"),
      text: z.string().optional().describe("Watermark text (required when type='text')"),
      watermarkImagePath: z
        .string()
        .optional()
        .describe("Local path to a .png/.jpg watermark image (required when type='image')"),
      fontFilePath: z
        .string()
        .optional()
        .describe("Local path to a .ttf/.otf font file (overrides 'font')"),
      font: z
        .enum([
          "times-roman", "times-bold", "times-italic", "times-bolditalic",
          "helvetica", "helvetica-bold", "helvetica-oblique", "helvetica-boldoblique",
          "courier", "courier-bold", "courier-oblique", "courier-boldoblique",
        ])
        .optional()
        .describe("Standard PDF font name"),
      fontSize: z.number().optional().describe("Font size in points"),
      fontColor: z.string().optional().describe("Font colour as hex e.g. '#FF0000'"),
      opacity: z.number().min(0).max(1).optional().describe("Opacity 0–1"),
      xPosition: z.number().optional().describe("Horizontal position"),
      yPosition: z.number().optional().describe("Vertical position"),
      imageWidth: z.number().optional().describe("Image watermark width"),
      imageHeight: z.number().optional().describe("Image watermark height"),
      rotate: z.number().min(0).max(360).optional().describe("Rotation in degrees (0–360)"),
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
      documentId,
      type,
      text,
      watermarkImagePath,
      fontFilePath,
      font,
      fontSize,
      fontColor,
      opacity,
      xPosition,
      yPosition,
      imageWidth,
      imageHeight,
      rotate,
      preSignedUrlExpiresIn,
      metadata,
    }) => {
      try {
        let watermark: { name: string; data: Buffer } | undefined;
        if (watermarkImagePath) {
          watermark = {
            name: path.basename(watermarkImagePath),
            data: readFileSync(watermarkImagePath),
          };
        }

        let fontFile: { name: string; data: Buffer } | undefined;
        if (fontFilePath) {
          fontFile = { name: path.basename(fontFilePath), data: readFileSync(fontFilePath) };
        }

        const result = await getClient().watermarkPdf({
          documentId,
          type,
          text,
          watermark,
          fontFile,
          font: font as any,
          fontSize,
          fontColor,
          opacity,
          xPosition,
          yPosition,
          imageWidth,
          imageHeight,
          rotate,
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
