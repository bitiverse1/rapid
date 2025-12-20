#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { TextEncoder, TextDecoder } from 'util';
import type { JWTHeader, JWTPayload } from './types/jwt';
import { importPublicKey, importPrivateKey, encryptJWE, decryptJWE } from './utils/jwe';

const CONFIG_DIR = path.join(process.cwd(), '.jwt-config');
const KEYS_DIR = path.join(CONFIG_DIR, 'keys');
const PAYLOAD_FILE = path.join(CONFIG_DIR, 'payload.json');
const HEADER_FILE = path.join(CONFIG_DIR, 'header.json');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

interface AlgorithmConfig {
  type: 'symmetric' | 'asymmetric';
  keySize?: number;
}

const ALGORITHMS: Record<string, AlgorithmConfig> = {
  HS256: { type: 'symmetric' },
  HS384: { type: 'symmetric' },
  HS512: { type: 'symmetric' },
  RS256: { type: 'asymmetric', keySize: 2048 },
  RS384: { type: 'asymmetric', keySize: 2048 },
  RS512: { type: 'asymmetric', keySize: 2048 },
  ES256: { type: 'asymmetric', keySize: 256 },
  ES384: { type: 'asymmetric', keySize: 384 },
  ES512: { type: 'asymmetric', keySize: 521 },
};

const program = new Command();

program
  .name('cli-jwt-generator')
  .description('Generate and validate JWT tokens with various algorithms')
  .version('1.0.0')
  .configureHelp({
    formatHelp: (cmd) => {
      let output = '';
      
      // Title
      output += chalk.cyan.bold('\n🔐 JWT Generator CLI\n\n');
      
      // Usage
      output += chalk.yellow.bold('Usage:\n');
      output += `  ${chalk.white('cli-jwt-generator')} ${chalk.gray('[options]')}\n\n`;
      
      // Description
      output += chalk.yellow.bold('Description:\n');
      output += `  ${cmd.description()}\n\n`;
      
      // Options
      output += chalk.yellow.bold('Options:\n');
      const options = [
        { flags: '-V, --version', description: 'output the version number' },
        { flags: '-i, --init', description: 'Initialize JWT configuration with algorithm and keys' },
        { flags: '-g, --generate', description: 'Generate a JWT token' },
        { flags: '-v, --validate', description: 'Validate a JWT token' },
        { flags: '-o, --output <file>', description: 'Save the JWT token to a file (use with --generate)' },
        { flags: '-t, --token <token>', description: 'JWT token to validate (use with --validate)' },
        { flags: '-f, --file <file>', description: 'File containing JWT token (use with --validate)' },
        { flags: '-h, --help', description: 'display help for command' },
      ];
      
      options.forEach(opt => {
        output += `  ${chalk.green(opt.flags.padEnd(25))} ${chalk.gray(opt.description)}\n`;
      });
      
      // Examples
      output += chalk.yellow.bold('\nExamples:\n');
      output += `  ${chalk.gray('# Initialize configuration')}\n`;
      output += `  ${chalk.white('$ cli-jwt-generator')} ${chalk.green('-i')}\n\n`;
      output += `  ${chalk.gray('# Generate a token')}\n`;
      output += `  ${chalk.white('$ cli-jwt-generator')} ${chalk.green('-g')}\n\n`;
      output += `  ${chalk.gray('# Generate and save to file')}\n`;
      output += `  ${chalk.white('$ cli-jwt-generator')} ${chalk.green('-g -o')} ${chalk.cyan('token.txt')}\n\n`;
      output += `  ${chalk.gray('# Validate token from file')}\n`;
      output += `  ${chalk.white('$ cli-jwt-generator')} ${chalk.green('-v -f')} ${chalk.cyan('token.txt')}\n\n`;
      output += `  ${chalk.gray('# Validate token directly')}\n`;
      output += `  ${chalk.white('$ cli-jwt-generator')} ${chalk.green('-v -t')} ${chalk.cyan('"eyJhbGc..."')}\n\n`;
      
      return output;
    }
  });

// Options
program
  .option('-i, --init', 'Initialize JWT configuration with algorithm and keys')
  .option('-g, --generate', 'Generate a JWT token')
  .option('-v, --validate', 'Validate a JWT token')
  .option('-o, --output <file>', 'Save the JWT token to a file (use with --generate)')
  .option('-t, --token <token>', 'JWT token to validate (use with --validate)')
  .option('-f, --file <file>', 'File containing JWT token (use with --validate or --generate output)');

program.parse(process.argv);

const options = program.opts();

// Helper functions
function ensureConfigDir() {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
  if (!fs.existsSync(KEYS_DIR)) {
    fs.mkdirSync(KEYS_DIR, { recursive: true });
  }
}

function generateSymmetricKey(): string {
  return crypto.randomBytes(64).toString('hex');
}

function generateAsymmetricKeys(algorithm: string, keySize: number) {
  const namedCurve = algorithm === 'ES256' ? 'prime256v1' : 
                     algorithm === 'ES384' ? 'secp384r1' : 'secp521r1';

  if (algorithm.startsWith('RS')) {
    return crypto.generateKeyPairSync('rsa', {
      modulusLength: keySize,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    });
  } else {
    return crypto.generateKeyPairSync('ec', {
      namedCurve,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    });
  }
}

function loadHeader(): JWTHeader {
  if (!fs.existsSync(HEADER_FILE)) {
    throw new Error('Header not found. Run with --init first.');
  }
  return JSON.parse(fs.readFileSync(HEADER_FILE, 'utf-8')) as JWTHeader;
}

function loadPayload(): JWTPayload {
  if (!fs.existsSync(PAYLOAD_FILE)) {
    throw new Error('Payload not found. Run with --init first.');
  }
  return JSON.parse(fs.readFileSync(PAYLOAD_FILE, 'utf-8')) as JWTPayload;
}

function loadKeyForSigning(algorithm: string) {
  const isSymmetric = algorithm.startsWith('HS');
  
  if (isSymmetric) {
    const secretPath = path.join(KEYS_DIR, 'secret.key');
    if (!fs.existsSync(secretPath)) {
      throw new Error('Secret key not found. Run with --init first.');
    }
    return fs.readFileSync(secretPath, 'utf-8');
  } else {
    const privatePath = path.join(KEYS_DIR, 'private.key');
    if (!fs.existsSync(privatePath)) {
      throw new Error('Private key not found. Run with --init first.');
    }
    return fs.readFileSync(privatePath, 'utf-8');
  }
}

function loadKeyForValidation(algorithm: string) {
  const isSymmetric = algorithm.startsWith('HS');
  
  if (isSymmetric) {
    const secretPath = path.join(KEYS_DIR, 'secret.key');
    if (!fs.existsSync(secretPath)) {
      throw new Error('Secret key not found. Run with --init first.');
    }
    return fs.readFileSync(secretPath, 'utf-8');
  } else {
    const publicPath = path.join(KEYS_DIR, 'public.key');
    if (!fs.existsSync(publicPath)) {
      throw new Error('Public key not found. Run with --init first.');
    }
    return fs.readFileSync(publicPath, 'utf-8');
  }
}

// Init command
async function init() {
  console.log(chalk.cyan.bold('\n🔐 JWT Generator Initialization\n'));

  const answers = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'useJWE',
      message: 'Do you want to use JWE (JSON Web Encryption)?',
      default: false,
    },
    {
      type: 'list',
      name: 'algorithm',
      message: 'Select the JWT signing algorithm:',
      choices: Object.keys(ALGORITHMS).map(algo => ({
        name: algo === 'RS256' ? `${algo} (default)` : algo,
        value: algo
      })),
      default: 'RS256',
      when: (answers: { useJWE: boolean }) => !answers.useJWE,
    },
    {
      type: 'list',
      name: 'encryptionAlg',
      message: 'Select the key encryption algorithm:',
      choices: [
        { name: 'RSA-OAEP-256 (default)', value: 'RSA-OAEP-256' },
        { name: 'RSA-OAEP', value: 'RSA-OAEP' },
        { name: 'A256KW', value: 'A256KW' },
        { name: 'A192KW', value: 'A192KW' },
        { name: 'A128KW', value: 'A128KW' },
      ],
      default: 'RSA-OAEP-256',
      when: (answers: { useJWE: boolean }) => answers.useJWE,
    },
    {
      type: 'list',
      name: 'contentEncryption',
      message: 'Select the content encryption algorithm:',
      choices: [
        { name: 'A256GCM (default)', value: 'A256GCM' },
        { name: 'A192GCM', value: 'A192GCM' },
        { name: 'A128GCM', value: 'A128GCM' },
        { name: 'A256CBC-HS512', value: 'A256CBC-HS512' },
        { name: 'A192CBC-HS384', value: 'A192CBC-HS384' },
        { name: 'A128CBC-HS256', value: 'A128CBC-HS256' },
      ],
      default: 'A256GCM',
      when: (answers: { useJWE: boolean }) => answers.useJWE,
    },
    {
      type: 'list',
      name: 'expiration',
      message: 'When should the JWT expire?',
      choices: [
        { name: '5 minutes', value: 5 * 60 },
        { name: '10 minutes', value: 10 * 60 },
        { name: '15 minutes', value: 15 * 60 },
        { name: '30 minutes (default)', value: 30 * 60 },
        { name: '1 hour', value: 60 * 60 },
        { name: '2 hours', value: 2 * 60 * 60 },
        { name: '3 hours', value: 3 * 60 * 60 },
        { name: '6 hours', value: 6 * 60 * 60 },
        { name: '12 hours', value: 12 * 60 * 60 },
        { name: '1 day', value: 24 * 60 * 60 },
        { name: '2 days', value: 2 * 24 * 60 * 60 },
        { name: '3 days', value: 3 * 24 * 60 * 60 },
        { name: '1 week', value: 7 * 24 * 60 * 60 },
        { name: '2 weeks', value: 14 * 24 * 60 * 60 },
        { name: '3 weeks', value: 21 * 24 * 60 * 60 },
        { name: '1 month', value: 30 * 24 * 60 * 60 },
        { name: '2 months', value: 60 * 24 * 60 * 60 },
        { name: '3 months', value: 90 * 24 * 60 * 60 },
        { name: '6 months', value: 180 * 24 * 60 * 60 },
        { name: '1 year', value: 365 * 24 * 60 * 60 },
      ],
      default: 3,
    },
  ]) as { useJWE: boolean; algorithm?: string; encryptionAlg?: string; contentEncryption?: string; expiration: number };

  const { useJWE, algorithm, encryptionAlg, contentEncryption, expiration } = answers;

  if (useJWE) {
    console.log(chalk.yellow(`\n⚙️  Generating keys for JWE (${encryptionAlg ?? 'RSA-OAEP-256'})...\n`));
  } else {
    const config = algorithm ? ALGORITHMS[algorithm] : undefined;

    if (!config) {
      console.error(chalk.red(`\n❌ Invalid algorithm: ${algorithm ?? 'unknown'}\n`));
      process.exit(1);
    }

    console.log(chalk.yellow(`\n⚙️  Generating keys for ${algorithm}...\n`));
  }

  ensureConfigDir();

  try {
    if (useJWE) {
      // For JWE, always generate RSA keys for encryption
      const keyPair = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
      });
      fs.writeFileSync(path.join(KEYS_DIR, 'private.key'), keyPair.privateKey);
      fs.writeFileSync(path.join(KEYS_DIR, 'public.key'), keyPair.publicKey);
      console.log(chalk.green('✓ Private key generated (for decryption)'));
      console.log(chalk.green('✓ Public key generated (for encryption)'));
    } else {
      const config = algorithm ? ALGORITHMS[algorithm] : undefined;
      if (!config || !algorithm) {
        console.error(chalk.red(`\n❌ Invalid algorithm: ${algorithm ?? 'unknown'}\n`));
        process.exit(1);
      }
      if (config.type === 'symmetric') {
        const secret = generateSymmetricKey();
        fs.writeFileSync(path.join(KEYS_DIR, 'secret.key'), secret);
        console.log(chalk.green('✓ Secret key generated'));
      } else {
        const keyPair = generateAsymmetricKeys(algorithm, config.keySize ?? 2048);
        fs.writeFileSync(path.join(KEYS_DIR, 'private.key'), keyPair.privateKey);
        fs.writeFileSync(path.join(KEYS_DIR, 'public.key'), keyPair.publicKey);
        console.log(chalk.green('✓ Private key generated'));
        console.log(chalk.green('✓ Public key generated'));
      }
    }

    const payload: JWTPayload = {
      iss: 'your-issuer',
      sub: '1234567890',
      aud: 'your-audience',
      exp: Math.floor(Date.now() / 1000) + expiration,
      iat: Math.floor(Date.now() / 1000),
      nbf: Math.floor(Date.now() / 1000),
      jti: crypto.randomUUID(),
    };

    fs.writeFileSync(PAYLOAD_FILE, JSON.stringify(payload, null, 2));
    console.log(chalk.green('✓ JWT payload created'));

    const header: JWTHeader = useJWE
      ? {
          alg: encryptionAlg ?? 'RSA-OAEP-256',
          enc: contentEncryption ?? 'A256GCM',
          typ: 'JWT',
        }
      : {
          alg: algorithm ?? 'RS256',
          typ: 'JWT',
        };
    fs.writeFileSync(HEADER_FILE, JSON.stringify(header, null, 2));
    console.log(chalk.green('✓ JWT header created'));

    // Save config with JWE flag
    const configData = {
      useJWE,
      algorithm: useJWE ? encryptionAlg : algorithm,
      contentEncryption: useJWE ? contentEncryption : undefined,
    };
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(configData, null, 2));
    console.log(chalk.green('✓ Configuration saved'));

    console.log(chalk.cyan.bold('\n✨ Initialization complete!\n'));
    console.log(chalk.gray(`Keys saved to: ${KEYS_DIR}`));
    console.log(chalk.gray(`Header saved to: ${HEADER_FILE}`));
    console.log(chalk.gray(`Payload saved to: ${PAYLOAD_FILE}`));
    console.log(chalk.gray(`\nEdit ${PAYLOAD_FILE} to customize your JWT payload.\n`));
  } catch (error) {
    console.error(chalk.red(`\n❌ Error: ${(error as Error).message}\n`));
    process.exit(1);
  }
}

// Generate command
async function generate(): Promise<void> {
  console.log(chalk.cyan.bold('\n🔑 Generating JWT Token\n'));

  try {
    const header = loadHeader();
    const payload = loadPayload();
    const configData = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8')) as { useJWE?: boolean; contentEncryption?: string };

    console.log(chalk.yellow(`Algorithm: ${header.alg}`));
    console.log(chalk.yellow(`Type: ${header.typ}`));
    if (header.enc) {
      console.log(chalk.yellow(`Encryption: ${header.enc}`));
    }
    console.log(chalk.yellow(`Payload: ${JSON.stringify(payload, null, 2)}\n`));

    let token: string;

    if (configData.useJWE) {
      // Generate JWE token
      const publicKeyPath = path.join(KEYS_DIR, 'public.key');
      const publicKeyPem = fs.readFileSync(publicKeyPath, 'utf-8');
      const publicKey = await importPublicKey(publicKeyPem, header.alg);

      const encoder = new TextEncoder();
      const jwe = await encryptJWE(
        encoder.encode(JSON.stringify(payload)),
        publicKey,
        { alg: header.alg, enc: header.enc ?? 'A256GCM', typ: header.typ }
      );

      token = jwe;
      console.log(chalk.green.bold('✓ JWE Token generated successfully!\n'));
    } else {
      // Generate JWT token
      const key = loadKeyForSigning(header.alg);
      token = jwt.sign(
        payload,
        key,
        {
          algorithm: header.alg as jwt.Algorithm,
          noTimestamp: true,
        }
      );
      console.log(chalk.green.bold('✓ Token generated successfully!\n'));
    }

    console.log(chalk.white.bold('JWT Token:'));
    console.log(chalk.cyan(token));
    console.log();

    if (options.output) {
      const outputPath = options.output as string;
      fs.writeFileSync(outputPath, token);
      console.log(chalk.green(`✓ Token saved to: ${outputPath}\n`));
    }

    if (!configData.useJWE) {
      const decoded = jwt.decode(token, { complete: true });
      if (decoded) {
        console.log(chalk.gray('─'.repeat(60)));
        console.log(chalk.white.bold('Token Details:'));
        console.log(chalk.gray('Header:'), JSON.stringify(decoded.header, null, 2));
        console.log(chalk.gray('Payload:'), JSON.stringify(decoded.payload, null, 2));
        console.log(chalk.gray('─'.repeat(60)));
        console.log();
      }
    } else {
      console.log(chalk.gray('\n(JWE tokens are encrypted - use validate command to decrypt and view)\n'));
    }
  } catch (error) {
    console.error(chalk.red(`\n❌ Error: ${(error as Error).message}\n`));
    process.exit(1);
  }
}

// Validate command
async function validate(): Promise<void> {
  console.log(chalk.cyan.bold('\n🔍 Validating JWT Token\n'));

  try {
    let token: string;

    if (options.token) {
      token = options.token as string;
    } else if (options.file) {
      const filePath = options.file as string;
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }
      token = fs.readFileSync(filePath, 'utf-8').trim();
    } else {
      throw new Error('Please provide a token using -t or a file path using -f');
    }

    // Check if it's a JWE (5 parts) or JWT (3 parts)
    const parts = token.split('.');
    const isJWE = parts.length === 5;

    if (isJWE) {
      console.log(chalk.yellow('Detected JWE (encrypted) token\n'));
      
      // Decrypt JWE
      const privateKeyPath = path.join(KEYS_DIR, 'private.key');
      const privateKeyPem = fs.readFileSync(privateKeyPath, 'utf-8');
      const privateKey = await importPrivateKey(privateKeyPem, 'RSA-OAEP-256');

      const { plaintext, protectedHeader } = await decryptJWE(token, privateKey);
      const decoder = new TextDecoder();
      const payload = JSON.parse(decoder.decode(plaintext)) as JWTPayload;

      console.log(chalk.gray('Protected Header:'));
      console.log(chalk.white(JSON.stringify(protectedHeader, null, 2)));
      console.log();

      console.log(chalk.green.bold('✓ Token decrypted successfully!\n'));
      
      console.log(chalk.gray('Decrypted Payload:'));
      console.log(chalk.white(JSON.stringify(payload, null, 2)));
      console.log();

      // Validate time claims
      const now = Math.floor(Date.now() / 1000);
      console.log(chalk.cyan.bold('Time Validation:\n'));

      if (payload.iat) {
        const issuedDate = new Date(payload.iat * 1000);
        console.log(chalk.gray('Issued At (iat):'), chalk.white(issuedDate.toISOString()));
        console.log(chalk.green(`  ✓ Token was issued ${Math.floor((now - payload.iat) / 60)} minutes ago`));
      }

      if (payload.nbf) {
        const notBeforeDate = new Date(payload.nbf * 1000);
        console.log(chalk.gray('Not Before (nbf):'), chalk.white(notBeforeDate.toISOString()));
        if (now >= payload.nbf) {
          console.log(chalk.green('  ✓ Token is valid (current time is after nbf)'));
        } else {
          console.log(chalk.red(`  ✗ Token not yet valid (valid in ${Math.ceil((payload.nbf - now) / 60)} minutes)`));
        }
      }

      if (payload.exp) {
        const expirationDate = new Date(payload.exp * 1000);
        console.log(chalk.gray('Expires At (exp):'), chalk.white(expirationDate.toISOString()));
        const timeUntilExpiry = payload.exp - now;
        if (timeUntilExpiry > 0) {
          const minutes = Math.floor(timeUntilExpiry / 60);
          const hours = Math.floor(minutes / 60);
          const days = Math.floor(hours / 24);
          
          if (days > 0) {
            console.log(chalk.green(`  ✓ Token expires in ${days} day(s) and ${hours % 24} hour(s)`));
          } else if (hours > 0) {
            console.log(chalk.green(`  ✓ Token expires in ${hours} hour(s) and ${minutes % 60} minute(s)`));
          } else {
            console.log(chalk.green(`  ✓ Token expires in ${minutes} minute(s)`));
          }
        } else {
          console.log(chalk.red(`  ✗ Token expired ${Math.abs(Math.floor(timeUntilExpiry / 60))} minutes ago`));
        }
      }

      console.log();
    } else {
      // Validate JWT
      const decoded = jwt.decode(token, { complete: true });
    
      if (!decoded || typeof decoded === 'string') {
        console.error(chalk.red('❌ Invalid token format\n'));
        process.exit(1);
      }

      console.log(chalk.gray('Token Header:'));
      console.log(chalk.white(JSON.stringify(decoded.header, null, 2)));
      console.log();

      const algorithm = decoded.header.alg;
      const key = loadKeyForValidation(algorithm);

      const verified = jwt.verify(token, key, {
        algorithms: [algorithm as jwt.Algorithm],
      });

      console.log(chalk.green.bold('✓ Token is valid!\n'));
    
      console.log(chalk.gray('Token Payload:'));
      console.log(chalk.white(JSON.stringify(verified, null, 2)));
      console.log();

      const now = Math.floor(Date.now() / 1000);
      const payload = verified as jwt.JwtPayload;

      console.log(chalk.cyan.bold('Time Validation:\n'));

      if (payload.iat) {
        const issuedDate = new Date(payload.iat * 1000);
      console.log(chalk.gray('Issued At (iat):'), chalk.white(issuedDate.toISOString()));
      console.log(chalk.green(`  ✓ Token was issued ${Math.floor((now - payload.iat) / 60)} minutes ago`));
    }

    if (payload.nbf) {
      const notBeforeDate = new Date(payload.nbf * 1000);
      console.log(chalk.gray('Not Before (nbf):'), chalk.white(notBeforeDate.toISOString()));
      if (now >= payload.nbf) {
        console.log(chalk.green('  ✓ Token is valid (current time is after nbf)'));
      } else {
        console.log(chalk.red(`  ✗ Token not yet valid (valid in ${Math.ceil((payload.nbf - now) / 60)} minutes)`));
      }
    }

    if (payload.exp) {
      const expirationDate = new Date(payload.exp * 1000);
      console.log(chalk.gray('Expires At (exp):'), chalk.white(expirationDate.toISOString()));
      const timeUntilExpiry = payload.exp - now;
      if (timeUntilExpiry > 0) {
        const minutes = Math.floor(timeUntilExpiry / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) {
          console.log(chalk.green(`  ✓ Token expires in ${days} day(s) and ${hours % 24} hour(s)`));
        } else if (hours > 0) {
          console.log(chalk.green(`  ✓ Token expires in ${hours} hour(s) and ${minutes % 60} minute(s)`));
        } else {
          console.log(chalk.green(`  ✓ Token expires in ${minutes} minute(s)`));
        }
      } else {
        console.log(chalk.red(`  ✗ Token expired ${Math.abs(Math.floor(timeUntilExpiry / 60))} minutes ago`));
      }
    }

    console.log();
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'TokenExpiredError') {
        console.error(chalk.red.bold('❌ Token has expired\n'));
        console.error(chalk.gray(`Reason: ${error.message}`));
      } else if (error.name === 'JsonWebTokenError') {
        console.error(chalk.red.bold('❌ Token validation failed\n'));
        console.error(chalk.gray(`Reason: ${error.message}`));
      } else if (error.name === 'NotBeforeError') {
        console.error(chalk.red.bold('❌ Token not yet valid\n'));
        console.error(chalk.gray(`Reason: ${error.message}`));
      } else {
        console.error(chalk.red(`\n❌ Error: ${error.message}\n`));
      }
    } else {
      console.error(chalk.red('\n❌ Unknown error occurred\n'));
    }
    process.exit(1);
  }
}

// Execute based on options
void (async () => {
  if (options.init) {
    await init();
  } else if (options.generate) {
    await generate();
  } else if (options.validate) {
    await validate();
  } else {
    program.outputHelp();
  }
})().catch((err: Error) => {
  console.error(chalk.red(`Fatal error: ${err.message}`));
  process.exit(1);
});
