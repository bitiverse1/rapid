declare module 'jose' {
  export interface KeyLike {
    type: string;
  }

  export interface JWTPayload {
    [key: string]: unknown;
  }

  export interface ProtectedHeaderParameters {
    alg?: string;
    enc?: string;
    typ?: string;
    [key: string]: unknown;
  }

  export interface CompactDecryptResult {
    plaintext: Uint8Array;
    protectedHeader: ProtectedHeaderParameters;
  }

  export function importSPKI(spki: string, alg: string): Promise<KeyLike>;
  export function importPKCS8(pkcs8: string, alg: string): Promise<KeyLike>;

  export class CompactEncrypt {
    constructor(plaintext: Uint8Array);
    setProtectedHeader(protectedHeader: ProtectedHeaderParameters): this;
    encrypt(key: KeyLike): Promise<string>;
  }

  export function compactDecrypt(
    jwe: string,
    key: KeyLike
  ): Promise<CompactDecryptResult>;
}
