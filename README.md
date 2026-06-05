# PDFGate MCP Server

Model Context Protocol (MCP) server for the [PDFGate](https://pdfgate.com) API. Enables AI assistants to generate PDFs, manage documents, handle e-signatures, and receive real-time envelope events.

## Installation

Add the following to your MCP client configuration:

```json
{
  "mcpServers": {
    "pdfgate": {
      "command": "npx",
      "args": ["-y", "@pdfgate/mcp-server"],
      "env": {
        "PDFGATE_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

## Getting an API key

Sign up at [pdfgate.com](https://pdfgate.com) to get your API key.

- Keys starting with `live_` connect to the production environment
- Keys starting with `test_` connect to the sandbox environment

## Tools

### PDF Operations

| Tool | Description |
|---|---|
| `generate_pdf` | Generate a PDF from a URL or raw HTML |
| `upload_pdf` | Upload a local PDF file or from a URL |
| `get_document` | Retrieve document metadata and a fresh download URL |
| `delete_document` | Delete a document |
| `flatten_pdf` | Flatten an interactive PDF into a static, non-editable file |
| `extract_pdf_form_data` | Extract form field values from a fillable PDF |
| `compress_pdf` | Compress a PDF to reduce file size |
| `protect_pdf` | Encrypt a PDF with a password and permission restrictions |
| `watermark_pdf` | Apply a text or image watermark to a PDF |

### E-Signatures

| Tool | Description |
|---|---|
| `create_envelope` | Create a signing envelope from one or more documents |
| `send_envelope` | Send a created envelope to recipients |
| `get_envelope` | Get the current status of an envelope |

### Webhook Management

| Tool | Description |
|---|---|
| `create_webhook` | Subscribe to PDFGate events |
| `delete_webhook` | Remove a webhook subscription |

## Webhook Triggers

The server listens for incoming PDFGate events on port `3599` by default. To receive events:

1. Expose port `3599` to the internet (e.g. via [ngrok](https://ngrok.com))
2. Use the `create_webhook` tool to register your public URL

Supported events:

| Event | Description |
|---|---|
| `envelope.sent` | Signing request emails have been dispatched to recipients |
| `envelope.completed` | All documents in the envelope have been signed |
| `envelope.expired` | The envelope expired before all documents were signed |
| `envelope.document.completed` | A single document inside the envelope has been fully signed |

Received events are available via the `pdfgate://events` MCP resource and pushed to the client in real time.

## Environment variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `PDFGATE_API_KEY` | Yes | — | Your PDFGate API key |
| `PDFGATE_WEBHOOK_PORT` | No | `3599` | Port for the webhook listener |
