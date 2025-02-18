export class TextCrypto {
  private encoder = new TextEncoder();
  private decoder = new TextDecoder();

  private salt = new Uint8Array([
    0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c,
    0x0d, 0x0e, 0x0f, 0x10,
  ]);


  private async getKey(password: string): Promise<CryptoKey> {
    const keyData = this.encoder.encode(password);

    return await crypto.subtle
      .importKey("raw", keyData, { name: "PBKDF2" }, false, [
        "deriveBits",
        "deriveKey",
      ])
      .then((keyMaterial) =>
        crypto.subtle.deriveKey(
          {
            name: "PBKDF2",
            salt: this.salt,
            iterations: 100000,
            hash: "SHA-256",
          },
          keyMaterial,
          { name: "AES-GCM", length: 256 },
          false,
          ["encrypt", "decrypt"],
        ),
      );
  }


  async encrypt(text: string, password: string): Promise<string> {
    try {
      const key = await this.getKey(password);
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const data = this.encoder.encode(text);

      const encrypted = await crypto.subtle.encrypt(
        {
          name: "AES-GCM",
          iv,
        },
        key,
        data,
      );


      const result = new Uint8Array(iv.length + encrypted.byteLength);
      result.set(iv);
      result.set(new Uint8Array(encrypted), iv.length);

      return btoa(String.fromCharCode(...result))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");
    } catch (error) {
      throw new Error("Encryption failed: " + (error as Error).message);
    }
  }

  async decrypt(encryptedText: string, password: string): Promise<string> {
    try {

      const str = encryptedText
        .replace(/-/g, "+")
        .replace(/_/g, "/")
        .padEnd(
          encryptedText.length + ((4 - (encryptedText.length % 4)) % 4),
          "=",
        );

      const binary = atob(str);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }

      const iv = bytes.slice(0, 12);
      const data = bytes.slice(12);

      const key = await this.getKey(password);

      const decrypted = await crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv,
        },
        key,
        data,
      );

      return this.decoder.decode(decrypted);
    } catch (error) {
      throw new Error("Decryption failed: Invalid password or corrupted data");
    }
  }
}
