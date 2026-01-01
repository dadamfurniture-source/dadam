#!/usr/bin/env node

import { Command } from 'commander';
import { installCommand } from './commands/install';
import { listCommand } from './commands/list';
import { removeCommand } from './commands/remove';
import { infoCommand } from './commands/info';

const program = new Command();

program
  .name('claude-plugins')
  .description('CLI tool for managing Claude AI plugins for the Dadam furniture design system')
  .version('1.0.0');

program
  .command('install <plugin-identifier>')
  .alias('i')
  .description('Install a plugin by its unique identifier')
  .option('-g, --global', 'Install plugin globally')
  .option('-f, --force', 'Force reinstall if plugin already exists')
  .option('--registry <url>', 'Use a custom plugin registry URL')
  .action(installCommand);

program
  .command('list')
  .alias('ls')
  .description('List all installed plugins')
  .option('-a, --all', 'Show all available plugins from registry')
  .action(listCommand);

program
  .command('remove <plugin-identifier>')
  .alias('rm')
  .description('Remove an installed plugin')
  .option('-f, --force', 'Force removal without confirmation')
  .action(removeCommand);

program
  .command('info <plugin-identifier>')
  .description('Show detailed information about a plugin')
  .action(infoCommand);

program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
