import {
  importSPKI as joseImportSPKI,
  importPKCS8 as joseImportPKCS8,
  CompactEncrypt as JoseCompactEncrypt,
  compactDecrypt as joseCompactDecrypt,
} from 'jose';

// Define our own KeyLike type to avoid jose's error-typed exports
export interface JWEKey {
  readonly type: string;
}

export interface CompactDecryptResult {
  plaintext: Uint8Array;
  protectedHeader: Record<string, unknown>;
}

export function importPublicKey(pem: string, alg: string): Promise<JWEKey> {
  return Promise.resolve(joseImportSPKI(pem, alg)).then(key => key as unknown as JWEKey);
}

export function importPrivateKey(pem: string, alg: string): Promise<JWEKey> {
  return Promise.resolve(joseImportPKCS8(pem, alg)).then(key => key as unknown as JWEKey);
}

export function encryptJWE(
  payload: Uint8Array,
  publicKey: JWEKey,
  header: { alg: string; enc: string; typ: string }
): Promise<string> {
  return Promise.resolve(
    new JoseCompactEncrypt(payload)
      .setProtectedHeader(header)
      .encrypt(publicKey as Parameters<typeof JoseCompactEncrypt.prototype.encrypt>[0])
  );
}

export function decryptJWE(
  jwe: string,
  privateKey: JWEKey
): Promise<CompactDecryptResult> {
  return Promise.resolve(
    joseCompactDecrypt(jwe, privateKey as unknown as Parameters<typeof joseCompactDecrypt>[1])
  ).then(result => result as CompactDecryptResult);
}
