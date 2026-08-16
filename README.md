# PDFGate MCP Server

Model Context Protocol (MCP) server for the [PDFGate](https://pdfgate.com) API. Enables AI assistants to generate PDFs, manage documents and handle e-signatures.

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

## Hosted server (remote)

If you prefer not to run anything locally, we also host the MCP server, so you can
connect straight to it — no `npx`, no local process. Point any client that
supports remote (Streamable HTTP) MCP servers at:

```
https://mcp.pdfgate.com/server
```

You can authenticate in two ways.

### Option 1 — OAuth

For clients that support remote MCP servers with OAuth (such as Claude and
ChatGPT), add the server by its URL alone and sign in through your browser. There
is no key to copy or store: the client registers itself, sends you to the PDFGate
dashboard to approve access, and receives a scoped token automatically.

```json
{
  "mcpServers": {
    "pdfgate": {
      "type": "http",
      "url": "https://mcp.pdfgate.com/server"
    }
  }
}
```

Many clients let you add this from their UI instead of a config file — for
example, in Claude: **Settings → Connectors → Add custom connector**, then enter
the URL above. OAuth sessions run against your production account; for the
sandbox, use an `X-API-KEY` with a `test_` key.

### Option 2 — API key

Pass your key in the `X-API-KEY` header:

```json
{
  "mcpServers": {
    "pdfgate": {
      "type": "http",
      "url": "https://mcp.pdfgate.com/server",
      "headers": {
        "X-API-KEY": "your_api_key_here"
      }
    }
  }
}
```

`live_` keys use production and `test_` keys use the sandbox — the environment is
selected automatically from the key.

The hosted server provides the full PDFGate toolset (PDF generation, processing,
form fields, e-signatures and webhooks). The exact client config field names
(e.g. `type` / `transport`, `headers`) may vary by MCP client.

## Getting an API key

Sign up at [pdfgate.com](https://pdfgate.com) to get your API key.

- Keys starting with `live_` connect to the production environment
- Keys starting with `test_` connect to the sandbox environment

## Tools

### PDF Operations

| Tool | Description |
|---|---|
| `generate_pdf` | Generate a PDF from a URL or raw HTML |
| `upload_file` | Upload a local PDF file or from a URL |
| `get_document` | Retrieve document metadata and a fresh download URL |
| `download_file` | Download the raw PDF bytes of a stored document |
| `delete_document` | Delete a document |
| `flatten_pdf` | Flatten an interactive PDF into a static, non-editable file |
| `extract_form_data` | Extract form field values from a fillable PDF |
| `add_form_fields` | Add interactive form fields to a PDF (placeholder tags or explicit positions) |
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
| `get_webhook` | Retrieve a webhook subscription by ID |
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
