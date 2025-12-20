export interface JWTHeader {
  alg: string;
  typ: string;
  enc?: string; // For JWE
}

export interface JWTPayload {
  iss: string;
  sub: string;
  aud: string;
  exp: number;
  iat: number;
  nbf: number;
  jti: string;
  [key: string]: string | number; // Allow additional custom claims
}

export interface JWTConfig {
  header: JWTHeader;
  payload: JWTPayload;
  useJWE?: boolean;
}

export type EncryptionAlgorithm = 
  | 'RSA-OAEP-256'
  | 'RSA-OAEP'
  | 'A256KW'
  | 'A192KW'
  | 'A128KW'
  | 'dir';

export type ContentEncryption = 
  | 'A256GCM'
  | 'A192GCM'
  | 'A128GCM'
  | 'A256CBC-HS512'
  | 'A192CBC-HS384'
  | 'A128CBC-HS256';
