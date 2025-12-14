import { Command } from 'commander';
import chalk from 'chalk';
import { delay } from '@rapid/utilities';

interface ExampleOptions {
  name: string;
}

// Simulate an async operation (e.g., API call, file I/O, etc.)
async function simulateAsyncOperation(name: string): Promise<string> {
  await delay(1000);
  return `Hello, ${name}!`;
}

export const exampleCommand = new Command('example')
  .description('Example command')
  .option('-n, --name <name>', 'Name to greet', 'World')
  .action(async (options: ExampleOptions) => {
    console.log(chalk.blue('Processing...'));
    const message = await simulateAsyncOperation(options.name);
    console.log(chalk.green(message));
  });
