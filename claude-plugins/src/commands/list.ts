import chalk from 'chalk';
import ora from 'ora';
import { getAllInstalledPlugins, loadRegistry } from '../utils/registry';
import { fetchAllPlugins } from '../utils/remote';
import { ListOptions, InstalledPlugin, RemotePluginInfo } from '../types/plugin';

/**
 * List installed plugins or all available plugins
 */
export async function listCommand(options: ListOptions): Promise<void> {
  if (options.all) {
    await listAvailablePlugins();
  } else {
    await listInstalledPlugins();
  }
}

/**
 * List all installed plugins
 */
async function listInstalledPlugins(): Promise<void> {
  const spinner = ora('Loading installed plugins...').start();

  try {
    // Get both local and global plugins
    const localPlugins = await getAllInstalledPlugins(false);
    const globalPlugins = await getAllInstalledPlugins(true);

    spinner.stop();

    const totalPlugins = localPlugins.length + globalPlugins.length;

    if (totalPlugins === 0) {
      console.log(chalk.yellow('\nNo plugins installed.'));
      console.log(chalk.dim('Run `claude-plugins install <plugin-name>` to install a plugin.'));
      console.log(chalk.dim('Run `claude-plugins list --all` to see available plugins.\n'));
      return;
    }

    console.log(chalk.bold('\n📦 Installed Plugins\n'));

    if (localPlugins.length > 0) {
      console.log(chalk.dim('Local (project-specific):'));
      printPluginTable(localPlugins);
    }

    if (globalPlugins.length > 0) {
      if (localPlugins.length > 0) console.log('');
      console.log(chalk.dim('Global:'));
      printPluginTable(globalPlugins);
    }

    console.log('');
    console.log(chalk.dim(`Total: ${totalPlugins} plugin(s) installed`));
    console.log('');

  } catch (error) {
    spinner.fail(chalk.red('Failed to load plugins'));
    if (error instanceof Error) {
      console.error(chalk.red(`Error: ${error.message}`));
    }
    process.exit(1);
  }
}

/**
 * List all available plugins from registry
 */
async function listAvailablePlugins(): Promise<void> {
  const spinner = ora('Fetching available plugins from registry...').start();

  try {
    const availablePlugins = await fetchAllPlugins();
    const installedLocal = await getAllInstalledPlugins(false);
    const installedGlobal = await getAllInstalledPlugins(true);

    const installedIds = new Set([
      ...installedLocal.map(p => p.manifest.id),
      ...installedGlobal.map(p => p.manifest.id),
    ]);

    spinner.stop();

    if (availablePlugins.length === 0) {
      console.log(chalk.yellow('\nNo plugins available in registry.'));
      return;
    }

    console.log(chalk.bold('\n🌐 Available Plugins\n'));

    const maxNameLen = Math.max(...availablePlugins.map(p => p.name.length), 20);
    const maxVersionLen = 10;

    // Header
    console.log(
      chalk.dim('  ') +
      chalk.bold('Name'.padEnd(maxNameLen)) + '  ' +
      chalk.bold('Version'.padEnd(maxVersionLen)) + '  ' +
      chalk.bold('Status'.padEnd(12)) + '  ' +
      chalk.bold('Description')
    );
    console.log(chalk.dim('─'.repeat(80)));

    for (const plugin of availablePlugins) {
      const isInstalled = installedIds.has(plugin.id);
      const status = isInstalled
        ? chalk.green('✓ installed')
        : chalk.dim('available');

      console.log(
        '  ' +
        chalk.cyan(plugin.name.padEnd(maxNameLen)) + '  ' +
        chalk.yellow(plugin.version.padEnd(maxVersionLen)) + '  ' +
        status.padEnd(12) + '  ' +
        chalk.dim(truncate(plugin.description, 40))
      );
    }

    console.log('');
    console.log(chalk.dim(`Found ${availablePlugins.length} plugin(s) in registry`));
    console.log(chalk.dim('Run `claude-plugins install <plugin-name>` to install a plugin.\n'));

  } catch (error) {
    spinner.fail(chalk.red('Failed to fetch plugins'));
    if (error instanceof Error) {
      console.error(chalk.red(`Error: ${error.message}`));
    }
    process.exit(1);
  }
}

/**
 * Print a table of installed plugins
 */
function printPluginTable(plugins: InstalledPlugin[]): void {
  const maxNameLen = Math.max(...plugins.map(p => p.manifest.name.length), 15);
  const maxVersionLen = 10;
  const maxToolsLen = 8;

  // Header
  console.log(
    chalk.dim('  ') +
    chalk.bold('Name'.padEnd(maxNameLen)) + '  ' +
    chalk.bold('Version'.padEnd(maxVersionLen)) + '  ' +
    chalk.bold('Tools'.padEnd(maxToolsLen)) + '  ' +
    chalk.bold('Status')
  );
  console.log(chalk.dim('  ' + '─'.repeat(maxNameLen + maxVersionLen + maxToolsLen + 20)));

  for (const plugin of plugins) {
    const status = plugin.enabled
      ? chalk.green('enabled')
      : chalk.yellow('disabled');

    const toolCount = plugin.manifest.tools?.length || 0;

    console.log(
      '  ' +
      chalk.cyan(plugin.manifest.name.padEnd(maxNameLen)) + '  ' +
      chalk.yellow(plugin.manifest.version.padEnd(maxVersionLen)) + '  ' +
      String(toolCount).padEnd(maxToolsLen) + '  ' +
      status
    );
  }
}

/**
 * Truncate string to specified length
 */
function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 3) + '...';
}
