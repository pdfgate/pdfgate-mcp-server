import PdfGate from "pdfgate";

let _client: PdfGate | null = null;

export function getClient(): PdfGate {
  if (!_client) {
    const apiKey = process.env.PDFGATE_API_KEY;
    if (!apiKey) throw new Error("PDFGATE_API_KEY environment variable is required");
    _client = new PdfGate(apiKey);
  }
  return _client;
}

export function getApiKey(): string {
  const apiKey = process.env.PDFGATE_API_KEY;
  if (!apiKey) throw new Error("PDFGATE_API_KEY environment variable is required");
  return apiKey;
}

export function getBaseUrl(apiKey: string): string {
  if (apiKey.startsWith("test_")) return "https://api-sandbox.pdfgate.com";
  if (apiKey.startsWith("live_")) return "https://api.pdfgate.com";
  throw new Error("Invalid API key format: must start with 'test_' or 'live_'");
}
