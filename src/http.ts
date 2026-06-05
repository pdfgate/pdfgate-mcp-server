import { getApiKey, getBaseUrl } from "./client.js";

export async function httpDelete(path: string): Promise<void> {
  const apiKey = getApiKey();
  const baseUrl = getBaseUrl(apiKey);
  const res = await fetch(`${baseUrl}${path}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    let message = res.statusText;
    try {
      const parsed = JSON.parse(body);
      if (parsed?.message) message = parsed.message;
    } catch {}
    throw new Error(`HTTP ${res.status}: ${message}`);
  }
}

export async function httpPost<T>(path: string, body: unknown): Promise<T> {
  const apiKey = getApiKey();
  const baseUrl = getBaseUrl(apiKey);
  const res = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let message = res.statusText;
    try {
      const parsed = JSON.parse(text);
      if (parsed?.message) message = parsed.message;
    } catch {}
    throw new Error(`HTTP ${res.status}: ${message}`);
  }
  return res.json() as Promise<T>;
}
