import { Command } from 'commander';
import chalk from 'chalk';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';
import * as path from 'path';

interface ValidateOptions {
  token?: string;
  file?: string;
}

interface JWTPayload {
  iat?: number;
  nbf?: number;
  exp?: number;
  [key: string]: unknown;
}

interface JWTError extends Error {
  name: string;
  message: string;
  expiredAt?: string;
  date?: string;
}

const CONFIG_DIR = path.join(process.cwd(), '.jwt-config');
const KEYS_DIR = path.join(CONFIG_DIR, 'keys');

function loadKey(algorithm: string) {
  const isSymmetric = algorithm.startsWith('HS');

  if (isSymmetric) {
    const secretPath = path.join(KEYS_DIR, 'secret.key');
    if (!fs.existsSync(secretPath)) {
      throw new Error('Secret key not found. Run "init" command first.');
    }
    return fs.readFileSync(secretPath, 'utf-8');
  } else {
    const publicPath = path.join(KEYS_DIR, 'public.key');
    if (!fs.existsSync(publicPath)) {
      throw new Error('Public key not found. Run "init" command first.');
    }
    return fs.readFileSync(publicPath, 'utf-8');
  }
}

export const validateCommand = new Command('validate')
  .description('Validate a JWT token')
  .option('-t, --token <token>', 'JWT token to validate')
  .option('-f, --file <file>', 'File containing the JWT token')
  .action((options: ValidateOptions) => {
    console.log(chalk.cyan.bold('\n🔍 Validating JWT Token\n'));

    try {
      let token: string;

      // Get token from options or file
      if (options.token) {
        token = options.token;
      } else if (options.file) {
        if (!fs.existsSync(options.file)) {
          throw new Error(`File not found: ${options.file}`);
        }
        token = fs.readFileSync(options.file, 'utf-8').trim();
      } else {
        throw new Error(
          'Please provide a token using -t or --token, or a file path using -f or --file'
        );
      }

      // Decode without verification first to get algorithm
      const decoded = jwt.decode(token, { complete: true });

      if (!decoded) {
        console.error(chalk.red('❌ Invalid token format\n'));
        process.exit(1);
      }

      console.log(chalk.gray('Token Header:'));
      console.log(chalk.white(JSON.stringify(decoded.header, null, 2)));
      console.log();

      // Load the appropriate key
      const algorithm = decoded.header.alg;
      const key = loadKey(algorithm);

      // Verify the token
      const verified = jwt.verify(token, key, {
        algorithms: [algorithm as jwt.Algorithm],
      }) as JWTPayload;

      console.log(chalk.green.bold('✓ Token is valid!\n'));

      console.log(chalk.gray('Token Payload:'));
      console.log(chalk.white(JSON.stringify(verified, null, 2)));
      console.log();

      // Check time-based claims
      const now = Math.floor(Date.now() / 1000);

      console.log(chalk.cyan.bold('Time Validation:\n'));

      if (verified.iat) {
        const issuedDate = new Date(verified.iat * 1000);
        console.log(
          chalk.gray('Issued At (iat):'),
          chalk.white(issuedDate.toISOString())
        );
        console.log(
          chalk.green(
            `  ✓ Token was issued ${Math.floor((now - verified.iat) / 60)} minutes ago`
          )
        );
      }

      if (verified.nbf) {
        const notBeforeDate = new Date(verified.nbf * 1000);
        console.log(
          chalk.gray('Not Before (nbf):'),
          chalk.white(notBeforeDate.toISOString())
        );
        if (now >= verified.nbf) {
          console.log(
            chalk.green('  ✓ Token is valid (current time is after nbf)')
          );
        } else {
          console.log(
            chalk.red(
              `  ✗ Token not yet valid (valid in ${Math.ceil((verified.nbf - now) / 60)} minutes)`
            )
          );
        }
      }

      if (verified.exp) {
        const expirationDate = new Date(verified.exp * 1000);
        console.log(
          chalk.gray('Expires At (exp):'),
          chalk.white(expirationDate.toISOString())
        );
        const timeUntilExpiry = verified.exp - now;
        if (timeUntilExpiry > 0) {
          const minutes = Math.floor(timeUntilExpiry / 60);
          const hours = Math.floor(minutes / 60);
          const days = Math.floor(hours / 24);

          if (days > 0) {
            console.log(
              chalk.green(
                `  ✓ Token expires in ${days} day(s) and ${hours % 24} hour(s)`
              )
            );
          } else if (hours > 0) {
            console.log(
              chalk.green(
                `  ✓ Token expires in ${hours} hour(s) and ${minutes % 60} minute(s)`
              )
            );
          } else {
            console.log(
              chalk.green(`  ✓ Token expires in ${minutes} minute(s)`)
            );
          }
        } else {
          console.log(
            chalk.red(
              `  ✗ Token expired ${Math.abs(Math.floor(timeUntilExpiry / 60))} minutes ago`
            )
          );
        }
      }

      console.log();
    } catch (err) {
      const error = err as JWTError;
      if (error.name === 'TokenExpiredError') {
        console.error(chalk.red.bold('❌ Token has expired\n'));
        console.error(
          chalk.gray(`Expired at: ${error.expiredAt ?? 'unknown'}`)
        );
      } else if (error.name === 'JsonWebTokenError') {
        console.error(chalk.red.bold('❌ Token validation failed\n'));
        console.error(chalk.gray(`Reason: ${error.message}`));
      } else if (error.name === 'NotBeforeError') {
        console.error(chalk.red.bold('❌ Token not yet valid\n'));
        console.error(chalk.gray(`Valid from: ${error.date ?? 'unknown'}`));
      } else {
        console.error(chalk.red(`\n❌ Error: ${error.message}\n`));
      }
      process.exit(1);
    }
  });
