import * as jwt from 'jsonwebtoken';
import { Command } from 'commander';
import chalk from 'chalk';
import * as path from 'path';
import * as fs from 'fs';

const CONFIG_DIR = path.join(process.cwd(), '.jwt-config');
const KEYS_DIR = path.join(CONFIG_DIR, 'keys');
const PAYLOAD_FILE = path.join(CONFIG_DIR, 'payload.json');
const HEADER_FILE = path.join(CONFIG_DIR, 'header.json');

interface GenerateOptions {
  output?: string;
}

interface JWTHeader {
  alg: jwt.Algorithm;
  typ: string;
}

interface JWTPayload {
  [key: string]: unknown;
}

function loadHeader(): JWTHeader {
  if (!fs.existsSync(HEADER_FILE)) {
    throw new Error('Header not found. Run "init" command first.');
  }
  return JSON.parse(fs.readFileSync(HEADER_FILE, 'utf-8')) as JWTHeader;
}

function loadPayload(): JWTPayload {
  if (!fs.existsSync(PAYLOAD_FILE)) {
    throw new Error('Payload not found. Run "init" command first.');
  }
  return JSON.parse(fs.readFileSync(PAYLOAD_FILE, 'utf-8')) as JWTPayload;
}

function loadKey(algorithm: string) {
  const isSymmetric = algorithm.startsWith('HS');

  if (isSymmetric) {
    const secretPath = path.join(KEYS_DIR, 'secret.key');
    if (!fs.existsSync(secretPath)) {
      throw new Error('Secret key not found. Run "init" command first.');
    }
    return fs.readFileSync(secretPath, 'utf-8');
  } else {
    const privatePath = path.join(KEYS_DIR, 'private.key');
    if (!fs.existsSync(privatePath)) {
      throw new Error('Private key not found. Run "init" command first.');
    }
    return fs.readFileSync(privatePath, 'utf-8');
  }
}

export const generateCommand = new Command('generate')
  .description('Generate a JWT token using the configured template')
  .option('-o, --output <file>', 'Save the JWT token to a file')
  .action((options: GenerateOptions) => {
    console.log(chalk.cyan.bold('\n🔑 Generating JWT Token\n'));

    try {
      const header = loadHeader();
      const payload = loadPayload();
      const key = loadKey(header.alg);

      console.log(chalk.yellow(`Algorithm: ${header.alg}`));
      console.log(chalk.yellow(`Type: ${header.typ}`));
      console.log(
        chalk.yellow(`Payload: ${JSON.stringify(payload, null, 2)}\n`)
      );

      const token = jwt.sign(payload, key, {
        algorithm: header.alg,
        noTimestamp: true, // Don't add iat automatically since it's in payload
      });

      console.log(chalk.green.bold('✓ Token generated successfully!\n'));
      console.log(chalk.white.bold('JWT Token:'));
      console.log(chalk.cyan(token));
      console.log();

      if (options.output) {
        fs.writeFileSync(options.output, token);
        console.log(chalk.green(`✓ Token saved to: ${options.output}\n`));
      }

      // Decode and display token parts
      const decoded = jwt.decode(token, { complete: true });
      if (decoded) {
        console.log(chalk.gray('─'.repeat(60)));
        console.log(chalk.white.bold('Token Details:'));
        console.log(
          chalk.gray('Header:'),
          JSON.stringify(decoded.header, null, 2)
        );
        console.log(
          chalk.gray('Payload:'),
          JSON.stringify(decoded.payload, null, 2)
        );
        console.log(chalk.gray('─'.repeat(60)));
        console.log();
      }
    } catch (error) {
      console.error(chalk.red(`\n❌ Error: ${(error as Error).message}\n`));
      process.exit(1);
    }
  });
