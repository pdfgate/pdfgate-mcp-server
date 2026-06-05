import PdfGate from "pdfgate";

const secrets = new Set<string>();

export function addSecret(secret: string): void {
  secrets.add(secret);
}

export function verifyWithAnySecret(signature: string, payload: Buffer): boolean {
  for (const secret of secrets) {
    try {
      PdfGate.verifySignature(secret, signature, payload);
      return true;
    } catch {}
  }
  return false;
}

export function hasSecrets(): boolean {
  return secrets.size > 0;
}
