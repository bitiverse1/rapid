/* eslint-disable @typescript-eslint/no-non-null-assertion */

import * as crypto from 'crypto';
import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';
import * as path from 'path';

describe('JWT Token Generation and Validation', () => {
  const testDir = path.join(__dirname, '../../.test-jwt-config');
  const keysDir = path.join(testDir, 'keys');

  beforeAll(() => {
    // Create test directory
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
    if (!fs.existsSync(keysDir)) {
      fs.mkdirSync(keysDir, { recursive: true });
    }
  });

  afterAll(() => {
    // Clean up test directory
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe('Symmetric Key (HS256)', () => {
    let secret: string;
    let token: string;

    beforeAll(() => {
      secret = crypto.randomBytes(64).toString('hex');
      fs.writeFileSync(path.join(keysDir, 'secret.key'), secret);
    });

    it('should generate a valid HS256 token', () => {
      const payload = {
        iss: 'test-issuer',
        sub: '1234567890',
        aud: 'test-audience',
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000),
        nbf: Math.floor(Date.now() / 1000),
        jti: crypto.randomUUID(),
      };

      token = jwt.sign(payload, secret, {
        algorithm: 'HS256',
        noTimestamp: true,
      });

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });

    it('should validate a valid HS256 token', () => {
      const decoded = jwt.verify(token, secret, { algorithms: ['HS256'] });

      expect(decoded).toBeDefined();
      expect((decoded as { iss: string }).iss).toBe('test-issuer');
      expect((decoded as { sub: string }).sub).toBe('1234567890');
    });

    it('should reject an invalid HS256 token', () => {
      const invalidToken = token.slice(0, -5) + 'xxxxx';

      expect(() => {
        jwt.verify(invalidToken, secret, { algorithms: ['HS256'] });
      }).toThrow();
    });

    it('should reject an expired HS256 token', () => {
      const expiredPayload = {
        iss: 'test-issuer',
        sub: '1234567890',
        exp: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
        iat: Math.floor(Date.now() / 1000) - 7200, // 2 hours ago
      };

      const expiredToken = jwt.sign(expiredPayload, secret, {
        algorithm: 'HS256',
        noTimestamp: true,
      });

      expect(() => {
        jwt.verify(expiredToken, secret, { algorithms: ['HS256'] });
      }).toThrow('jwt expired');
    });
  });

  describe('Asymmetric Key (RS256)', () => {
    let publicKey: string;
    let privateKey: string;
    let token: string;

    beforeAll(() => {
      const keyPair = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
      });

      publicKey = keyPair.publicKey;
      privateKey = keyPair.privateKey;

      fs.writeFileSync(path.join(keysDir, 'public.key'), publicKey);
      fs.writeFileSync(path.join(keysDir, 'private.key'), privateKey);
    });

    it('should generate a valid RS256 token', () => {
      const payload = {
        iss: 'test-issuer',
        sub: '1234567890',
        aud: 'test-audience',
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000),
        nbf: Math.floor(Date.now() / 1000),
        jti: crypto.randomUUID(),
      };

      token = jwt.sign(payload, privateKey, {
        algorithm: 'RS256',
        noTimestamp: true,
      });

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });

    it('should validate a valid RS256 token with public key', () => {
      const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });

      expect(decoded).toBeDefined();
      expect((decoded as { iss: string }).iss).toBe('test-issuer');
      expect((decoded as { sub: string }).sub).toBe('1234567890');
    });

    it('should reject an RS256 token with wrong public key', () => {
      const wrongKeyPair = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
      });

      expect(() => {
        jwt.verify(token, wrongKeyPair.publicKey, { algorithms: ['RS256'] });
      }).toThrow();
    });

    it('should decode token without verification', () => {
      const decoded = jwt.decode(token, { complete: true });

      expect(decoded).toBeDefined();
      expect(decoded?.header.alg).toBe('RS256');
      expect(decoded?.header.typ).toBe('JWT');
    });
  });

  describe('Token Time Validation', () => {
    let secret: string;

    beforeAll(() => {
      secret = crypto.randomBytes(64).toString('hex');
    });

    it('should validate nbf (not before) claim', () => {
      const futurePayload = {
        sub: '1234567890',
        nbf: Math.floor(Date.now() / 1000) + 3600, // 1 hour in future
        exp: Math.floor(Date.now() / 1000) + 7200,
      };

      const futureToken = jwt.sign(futurePayload, secret, {
        algorithm: 'HS256',
        noTimestamp: true,
      });

      expect(() => {
        jwt.verify(futureToken, secret, { algorithms: ['HS256'] });
      }).toThrow('jwt not active');
    });

    it('should validate iat (issued at) claim', () => {
      const now = Math.floor(Date.now() / 1000);
      const payload = {
        sub: '1234567890',
        iat: now,
        exp: now + 3600,
      };

      const token = jwt.sign(payload, secret, { algorithm: 'HS256' });
      const decoded = jwt.verify(token, secret, { algorithms: ['HS256'] }) as {
        iat: number;
      };

      expect(decoded.iat).toBeDefined();
      expect(typeof decoded.iat).toBe('number');
    });

    it('should calculate time until expiration', () => {
      const now = Math.floor(Date.now() / 1000);
      const expiresIn = 1800; // 30 minutes
      const payload = {
        sub: '1234567890',
        iat: now,
        exp: now + expiresIn,
      };

      const token = jwt.sign(payload, secret, {
        algorithm: 'HS256',
        noTimestamp: true,
      });
      const decoded = jwt.verify(token, secret, {
        algorithms: ['HS256'],
      }) as { exp: number };

      const timeUntilExpiry = decoded.exp - Math.floor(Date.now() / 1000);
      expect(timeUntilExpiry).toBeGreaterThan(0);
      expect(timeUntilExpiry).toBeLessThanOrEqual(expiresIn);
    });
  });

  describe('Token Structure', () => {
    it('should have correct JWT structure', () => {
      const secret = crypto.randomBytes(64).toString('hex');
      const payload = { sub: '1234567890' };
      const token = jwt.sign(payload, secret, { algorithm: 'HS256' });

      const parts = token.split('.');
      expect(parts).toHaveLength(3);

      // Decode header
      const header = JSON.parse(
        Buffer.from(parts[0]!, 'base64').toString()
      ) as { alg: string; typ: string };
      expect(header.alg).toBe('HS256');
      expect(header.typ).toBe('JWT');

      // Decode payload
      const decodedPayload = JSON.parse(
        Buffer.from(parts[1]!, 'base64').toString()
      ) as { sub: string };
      expect(decodedPayload.sub).toBe('1234567890');
    });

    it('should include jti (JWT ID) claim', () => {
      const secret = crypto.randomBytes(64).toString('hex');
      const jti = crypto.randomUUID();
      const payload = { sub: '1234567890', jti };
      const token = jwt.sign(payload, secret, {
        algorithm: 'HS256',
        noTimestamp: true,
      });

      const decoded = jwt.decode(token) as { jti: string };
      expect(decoded.jti).toBe(jti);
    });
  });
});
