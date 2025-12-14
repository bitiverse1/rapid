#!/usr/bin/env node
// @ts-nocheck - This is a template file with placeholders
import { Command } from 'commander';
import { exampleCommand } from './commands/example';

const program = new Command();

program
  .name('__APP_NAME__')
  .description('__APP_DESCRIPTION__')
  .version('1.0.0');

// Register commands
program.addCommand(exampleCommand);

// Parse arguments
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
