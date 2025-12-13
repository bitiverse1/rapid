#!/usr/bin/env node
import { Command } from 'commander';
import { exampleCommand } from './commands/example';

const program = new Command();

program
  .name('example-cli')
  .description('Example cli application')
  .version('1.0.0');

// Register commands
program.addCommand(exampleCommand);

// Parse arguments
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
