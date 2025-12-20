import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

const CONFIG_DIR = path.join(process.cwd(), '.jwt-config');
const KEYS_DIR = path.join(CONFIG_DIR, 'keys');
const PAYLOAD_FILE = path.join(CONFIG_DIR, 'payload.json');
const HEADER_FILE = path.join(CONFIG_DIR, 'header.json');

interface AlgorithmConfig {
  type: 'symmetric' | 'asymmetric';
  keySize?: number;
}

interface InitAnswers {
  algorithm: string;
  expiration: number;
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
  const namedCurve =
    algorithm === 'ES256'
      ? 'prime256v1'
      : algorithm === 'ES384'
        ? 'secp384r1'
        : 'secp521r1';

  if (algorithm.startsWith('RS')) {
    return crypto.generateKeyPairSync('rsa', {
      modulusLength: keySize,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });
  } else {
    return crypto.generateKeyPairSync('ec', {
      namedCurve,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });
  }
}

export const initCommand = new Command('init')
  .description('Initialize JWT configuration with algorithm and keys')
  .action(async () => {
    console.log(chalk.cyan.bold('\n🔐 JWT Generator Initialization\n'));

    const answers = await inquirer.prompt<InitAnswers>([
      {
        type: 'list',
        name: 'algorithm',
        message: 'Select the JWT signing algorithm:',
        choices: Object.keys(ALGORITHMS).map((algo) => ({
          name: algo === 'RS256' ? `${algo} (default)` : algo,
          value: algo,
        })),
        default: 'RS256',
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
        default: 3, // Index of "30 minutes" in the array
      },
    ]);

    const { algorithm, expiration } = answers;
    const config = ALGORITHMS[algorithm];

    if (!config) {
      console.error(chalk.red(`\n❌ Invalid algorithm: ${algorithm}\n`));
      process.exit(1);
    }

    console.log(chalk.yellow(`\n⚙️  Generating keys for ${algorithm}...\n`));

    ensureConfigDir();

    try {
      if (config.type === 'symmetric') {
        const secret = generateSymmetricKey();
        fs.writeFileSync(path.join(KEYS_DIR, 'secret.key'), secret);
        console.log(chalk.green('✓ Secret key generated'));
      } else {
        const keySize = config.keySize ?? 2048;
        const { publicKey, privateKey } = generateAsymmetricKeys(
          algorithm,
          keySize
        );
        fs.writeFileSync(path.join(KEYS_DIR, 'private.key'), privateKey);
        fs.writeFileSync(path.join(KEYS_DIR, 'public.key'), publicKey);
        console.log(chalk.green('✓ Private key generated'));
        console.log(chalk.green('✓ Public key generated'));
      }

      // Create default JWT payload
      const payload = {
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

      // Save header config
      const header = {
        alg: algorithm,
        typ: 'JWT',
      };
      fs.writeFileSync(HEADER_FILE, JSON.stringify(header, null, 2));
      console.log(chalk.green('✓ JWT header created'));

      console.log(chalk.cyan.bold('\n✨ Initialization complete!\n'));
      console.log(chalk.gray(`Keys saved to: ${KEYS_DIR}`));
      console.log(chalk.gray(`Header saved to: ${HEADER_FILE}`));
      console.log(chalk.gray(`Payload saved to: ${PAYLOAD_FILE}`));
      console.log(
        chalk.gray(`\nEdit ${PAYLOAD_FILE} to customize your JWT payload.\n`)
      );
    } catch (error) {
      console.error(chalk.red(`\n❌ Error: ${(error as Error).message}\n`));
      process.exit(1);
    }
  });
