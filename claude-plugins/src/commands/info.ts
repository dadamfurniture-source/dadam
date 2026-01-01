import chalk from 'chalk';
import ora from 'ora';
import { getInstalledPlugin } from '../utils/registry';
import { fetchPluginFromRegistry, parsePluginIdentifier } from '../utils/remote';
import { InstalledPlugin, RemotePluginInfo, PluginTool } from '../types/plugin';

/**
 * Show detailed information about a plugin
 */
export async function infoCommand(pluginIdentifier: string): Promise<void> {
  const spinner = ora(`Looking up plugin: ${chalk.cyan(pluginIdentifier)}`).start();

  try {
    // First, check if installed locally
    let installedPlugin = await getInstalledPlugin(pluginIdentifier, false);
    let isGlobal = false;

    // Then check globally
    if (!installedPlugin) {
      installedPlugin = await getInstalledPlugin(pluginIdentifier, true);
      isGlobal = true;
    }

    if (installedPlugin) {
      spinner.stop();
      displayInstalledPluginInfo(installedPlugin, isGlobal);
      return;
    }

    // Not installed, try to fetch from registry
    spinner.text = 'Fetching from registry...';
    const parsed = parsePluginIdentifier(pluginIdentifier);
    const remotePlugin = await fetchPluginFromRegistry(parsed.id, parsed.version);

    spinner.stop();

    if (remotePlugin) {
      displayRemotePluginInfo(remotePlugin);
    } else {
      console.log(chalk.yellow(`\nPlugin not found: ${pluginIdentifier}`));
      console.log(chalk.dim('Check the plugin identifier and try again.'));
      console.log(chalk.dim('Run `claude-plugins list --all` to see available plugins.\n'));
    }

  } catch (error) {
    spinner.fail(chalk.red('Failed to fetch plugin info'));
    if (error instanceof Error) {
      console.error(chalk.red(`Error: ${error.message}`));
    }
    process.exit(1);
  }
}

/**
 * Display information about an installed plugin
 */
function displayInstalledPluginInfo(plugin: InstalledPlugin, isGlobal: boolean): void {
  const { manifest } = plugin;

  console.log('');
  console.log(chalk.bold.cyan(`📦 ${manifest.name}`));
  console.log(chalk.dim('─'.repeat(50)));
  console.log('');

  printField('ID', manifest.id);
  printField('Version', manifest.version);
  printField('Description', manifest.description);
  printField('Author', manifest.author);
  printField('License', manifest.license);

  if (manifest.homepage) {
    printField('Homepage', chalk.underline(manifest.homepage));
  }

  if (manifest.repository) {
    printField('Repository', chalk.underline(manifest.repository));
  }

  if (manifest.keywords && manifest.keywords.length > 0) {
    printField('Keywords', manifest.keywords.join(', '));
  }

  console.log('');
  console.log(chalk.bold('Installation'));
  console.log(chalk.dim('─'.repeat(30)));
  printField('Scope', isGlobal ? 'Global' : 'Local (project)');
  printField('Status', plugin.enabled ? chalk.green('Enabled') : chalk.yellow('Disabled'));
  printField('Installed', formatDate(plugin.installedAt));
  printField('Path', chalk.dim(plugin.path));

  console.log('');
  displayTools(manifest.tools);

  if (manifest.dependencies && Object.keys(manifest.dependencies).length > 0) {
    console.log('');
    console.log(chalk.bold('Dependencies'));
    console.log(chalk.dim('─'.repeat(30)));
    for (const [name, version] of Object.entries(manifest.dependencies)) {
      console.log(`  ${chalk.cyan(name)}: ${version}`);
    }
  }

  console.log('');
}

/**
 * Display information about a remote plugin
 */
function displayRemotePluginInfo(plugin: RemotePluginInfo): void {
  const { manifest } = plugin;

  console.log('');
  console.log(chalk.bold.cyan(`📦 ${manifest.name}`) + chalk.dim(' (not installed)'));
  console.log(chalk.dim('─'.repeat(50)));
  console.log('');

  printField('ID', manifest.id);
  printField('Version', manifest.version);
  printField('Description', manifest.description);
  printField('Author', manifest.author);
  printField('License', manifest.license);
  printField('Downloads', plugin.downloads.toLocaleString());
  printField('Rating', `${'★'.repeat(Math.round(plugin.rating))}${'☆'.repeat(5 - Math.round(plugin.rating))} (${plugin.rating.toFixed(1)})`);

  if (manifest.homepage) {
    printField('Homepage', chalk.underline(manifest.homepage));
  }

  if (manifest.repository) {
    printField('Repository', chalk.underline(manifest.repository));
  }

  console.log('');
  displayTools(manifest.tools);

  console.log('');
  console.log(chalk.dim('To install this plugin, run:'));
  console.log(chalk.cyan(`  npx claude-plugins install ${manifest.id}`));
  console.log('');
}

/**
 * Display tools provided by the plugin
 */
function displayTools(tools: PluginTool[]): void {
  console.log(chalk.bold(`Tools (${tools.length})`));
  console.log(chalk.dim('─'.repeat(30)));

  if (tools.length === 0) {
    console.log(chalk.dim('  No tools defined'));
    return;
  }

  for (const tool of tools) {
    console.log(`  ${chalk.cyan('●')} ${chalk.bold(tool.name)}`);
    console.log(`    ${chalk.dim(tool.description)}`);

    if (tool.input_schema?.properties) {
      const props = Object.entries(tool.input_schema.properties);
      if (props.length > 0) {
        console.log(chalk.dim('    Parameters:'));
        for (const [name, prop] of props) {
          const required = tool.input_schema.required?.includes(name) ? chalk.red('*') : '';
          console.log(`      - ${chalk.yellow(name)}${required}: ${prop.type} - ${prop.description}`);
        }
      }
    }
    console.log('');
  }
}

/**
 * Print a field with label
 */
function printField(label: string, value: string): void {
  console.log(`  ${chalk.bold(label + ':')} ${value}`);
}

/**
 * Format ISO date string to readable format
 */
function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
