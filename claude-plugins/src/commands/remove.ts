import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import readline from 'readline';
import {
  getInstalledPlugin,
  removePluginFromRegistry,
  generatePluginIntegration,
} from '../utils/registry';
import { RemoveOptions } from '../types/plugin';

/**
 * Remove an installed plugin
 */
export async function removeCommand(
  pluginIdentifier: string,
  options: RemoveOptions
): Promise<void> {
  const spinner = ora(`Looking up plugin: ${chalk.cyan(pluginIdentifier)}`).start();

  try {
    // Check local first, then global
    let plugin = await getInstalledPlugin(pluginIdentifier, false);
    let isGlobal = false;

    if (!plugin) {
      plugin = await getInstalledPlugin(pluginIdentifier, true);
      isGlobal = true;
    }

    if (!plugin) {
      spinner.fail(chalk.red(`Plugin not found: ${pluginIdentifier}`));
      console.log(chalk.dim('\nRun `claude-plugins list` to see installed plugins.'));
      return;
    }

    spinner.stop();

    // Confirmation prompt unless --force
    if (!options.force) {
      const confirmed = await confirmRemoval(plugin.manifest.name);
      if (!confirmed) {
        console.log(chalk.yellow('Removal cancelled.'));
        return;
      }
    }

    const removeSpinner = ora('Removing plugin...').start();

    // Remove plugin files
    if (await fs.pathExists(plugin.path)) {
      await fs.remove(plugin.path);
    }

    // Remove from registry
    await removePluginFromRegistry(pluginIdentifier, isGlobal);

    // Regenerate integration file
    removeSpinner.text = 'Updating backend integration...';
    await generatePluginIntegration(isGlobal);

    removeSpinner.succeed(chalk.green(`Successfully removed ${chalk.bold(plugin.manifest.name)}`));

    console.log('');
    console.log(chalk.dim('The plugin has been uninstalled and its tools are no longer available.'));
    console.log('');

  } catch (error) {
    if (error instanceof Error) {
      console.error(chalk.red(`\nError: ${error.message}`));
    }
    process.exit(1);
  }
}

/**
 * Prompt user for confirmation
 */
async function confirmRemoval(pluginName: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    console.log('');
    rl.question(
      chalk.yellow(`Are you sure you want to remove ${chalk.bold(pluginName)}? [y/N] `),
      (answer) => {
        rl.close();
        resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
      }
    );
  });
}
