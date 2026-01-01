import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import {
  getInstalledPluginsDir,
  isPluginInstalled,
  addPluginToRegistry,
  generatePluginIntegration,
  ensurePluginsDirExists,
} from '../utils/registry';
import { InstallOptions, PluginManifest, RemotePluginInfo } from '../types/plugin';
import { fetchPluginFromRegistry, parsePluginIdentifier } from '../utils/remote';

const execAsync = promisify(exec);

/**
 * Install a plugin from various sources
 */
export async function installCommand(
  pluginIdentifier: string,
  options: InstallOptions
): Promise<void> {
  const spinner = ora(`Installing plugin: ${chalk.cyan(pluginIdentifier)}`).start();

  try {
    const global = options.global || false;

    // Ensure plugins directory exists
    await ensurePluginsDirExists(global);

    // Parse the plugin identifier
    const parsed = parsePluginIdentifier(pluginIdentifier);

    // Check if already installed
    if (!options.force && await isPluginInstalled(parsed.id, global)) {
      spinner.warn(chalk.yellow(`Plugin ${parsed.id} is already installed. Use --force to reinstall.`));
      return;
    }

    // Determine installation source
    let manifest: PluginManifest;
    let pluginPath: string;

    if (parsed.isLocal) {
      // Install from local path
      spinner.text = 'Installing from local path...';
      const result = await installFromLocal(parsed.path!, global);
      manifest = result.manifest;
      pluginPath = result.path;
    } else if (parsed.isGitHub) {
      // Install from GitHub
      spinner.text = 'Cloning from GitHub...';
      const result = await installFromGitHub(parsed.repo!, parsed.ref, global);
      manifest = result.manifest;
      pluginPath = result.path;
    } else {
      // Install from registry
      spinner.text = 'Fetching from plugin registry...';
      const result = await installFromRegistry(parsed.id, parsed.version, options.registry, global);
      manifest = result.manifest;
      pluginPath = result.path;
    }

    // Install Python dependencies if any
    if (manifest.dependencies && Object.keys(manifest.dependencies).length > 0) {
      spinner.text = 'Installing dependencies...';
      await installDependencies(pluginPath, manifest.dependencies);
    }

    // Register the plugin
    spinner.text = 'Registering plugin...';
    await addPluginToRegistry(manifest, pluginPath, global);

    // Generate integration file for backend
    spinner.text = 'Generating backend integration...';
    await generatePluginIntegration(global);

    spinner.succeed(chalk.green(`Successfully installed ${chalk.bold(manifest.name)} v${manifest.version}`));

    // Display plugin info
    console.log('');
    console.log(chalk.dim('─'.repeat(50)));
    console.log(`  ${chalk.bold('Plugin ID:')}     ${manifest.id}`);
    console.log(`  ${chalk.bold('Version:')}       ${manifest.version}`);
    console.log(`  ${chalk.bold('Author:')}        ${manifest.author}`);
    console.log(`  ${chalk.bold('Description:')}   ${manifest.description}`);
    console.log(`  ${chalk.bold('Tools:')}         ${manifest.tools.length} tool(s) added`);
    if (manifest.tools.length > 0) {
      manifest.tools.forEach(tool => {
        console.log(`                  - ${chalk.cyan(tool.name)}`);
      });
    }
    console.log(chalk.dim('─'.repeat(50)));
    console.log('');
    console.log(chalk.dim('Run `claude-plugins list` to see all installed plugins.'));

  } catch (error) {
    spinner.fail(chalk.red('Installation failed'));
    if (error instanceof Error) {
      console.error(chalk.red(`Error: ${error.message}`));
    }
    process.exit(1);
  }
}

/**
 * Install plugin from local directory
 */
async function installFromLocal(
  localPath: string,
  global: boolean
): Promise<{ manifest: PluginManifest; path: string }> {
  const absolutePath = path.resolve(localPath);

  if (!await fs.pathExists(absolutePath)) {
    throw new Error(`Local path not found: ${absolutePath}`);
  }

  const manifestPath = path.join(absolutePath, 'plugin.json');
  if (!await fs.pathExists(manifestPath)) {
    throw new Error('plugin.json not found in the specified directory');
  }

  const manifest: PluginManifest = await fs.readJson(manifestPath);
  validateManifest(manifest);

  // Copy to plugins directory
  const destPath = path.join(getInstalledPluginsDir(global), manifest.id);
  await fs.copy(absolutePath, destPath, { overwrite: true });

  return { manifest, path: destPath };
}

/**
 * Install plugin from GitHub repository
 */
async function installFromGitHub(
  repo: string,
  ref: string | undefined,
  global: boolean
): Promise<{ manifest: PluginManifest; path: string }> {
  const destPath = path.join(getInstalledPluginsDir(global), repo.replace('/', '-'));
  await fs.ensureDir(destPath);

  const cloneUrl = `https://github.com/${repo}.git`;
  const refArg = ref ? `--branch ${ref}` : '';

  try {
    await execAsync(`git clone --depth 1 ${refArg} ${cloneUrl} "${destPath}"`);
  } catch (error) {
    throw new Error(`Failed to clone repository: ${repo}`);
  }

  const manifestPath = path.join(destPath, 'plugin.json');
  if (!await fs.pathExists(manifestPath)) {
    await fs.remove(destPath);
    throw new Error('plugin.json not found in the repository');
  }

  const manifest: PluginManifest = await fs.readJson(manifestPath);
  validateManifest(manifest);

  // Rename directory to plugin ID
  const finalPath = path.join(getInstalledPluginsDir(global), manifest.id);
  if (destPath !== finalPath) {
    await fs.move(destPath, finalPath, { overwrite: true });
  }

  return { manifest, path: finalPath };
}

/**
 * Install plugin from remote registry
 */
async function installFromRegistry(
  pluginId: string,
  version: string | undefined,
  registryUrl: string | undefined,
  global: boolean
): Promise<{ manifest: PluginManifest; path: string }> {
  const pluginInfo = await fetchPluginFromRegistry(pluginId, version, registryUrl);

  if (!pluginInfo) {
    throw new Error(`Plugin not found: ${pluginId}`);
  }

  const destPath = path.join(getInstalledPluginsDir(global), pluginInfo.id);
  await fs.ensureDir(destPath);

  // Download and extract plugin
  await downloadAndExtract(pluginInfo.tarballUrl, destPath);

  const manifestPath = path.join(destPath, 'plugin.json');
  const manifest: PluginManifest = await fs.readJson(manifestPath);

  return { manifest, path: destPath };
}

/**
 * Download and extract plugin tarball
 */
async function downloadAndExtract(url: string, destPath: string): Promise<void> {
  // For now, create a placeholder since we don't have a real registry
  // In production, this would download and extract the tarball
  const placeholderManifest: PluginManifest = {
    id: path.basename(destPath),
    name: path.basename(destPath),
    version: '1.0.0',
    description: 'Plugin installed from registry',
    author: 'Unknown',
    license: 'MIT',
    tools: [],
    entryPoint: 'main.py',
  };

  await fs.writeJson(path.join(destPath, 'plugin.json'), placeholderManifest, { spaces: 2 });

  // Create placeholder Python entry point
  const entryPoint = `# Plugin entry point
from typing import Dict, Any

def execute_tool(tool_name: str, tool_input: Dict) -> Any:
    """Execute a tool from this plugin"""
    raise NotImplementedError(f"Tool {tool_name} not implemented")
`;
  await fs.writeFile(path.join(destPath, 'main.py'), entryPoint);
}

/**
 * Install Python dependencies for a plugin
 */
async function installDependencies(
  pluginPath: string,
  dependencies: Record<string, string>
): Promise<void> {
  const requirementsPath = path.join(pluginPath, 'requirements.txt');

  // Create requirements.txt from dependencies
  const requirements = Object.entries(dependencies)
    .map(([name, version]) => version ? `${name}${version}` : name)
    .join('\n');

  await fs.writeFile(requirementsPath, requirements);

  // Install using pip
  try {
    await execAsync(`pip install -r "${requirementsPath}"`);
  } catch (error) {
    console.warn(chalk.yellow('Warning: Failed to install some Python dependencies'));
  }
}

/**
 * Validate plugin manifest
 */
function validateManifest(manifest: PluginManifest): void {
  const required = ['id', 'name', 'version', 'description', 'author', 'entryPoint'];

  for (const field of required) {
    if (!(field in manifest)) {
      throw new Error(`Invalid plugin manifest: missing required field '${field}'`);
    }
  }

  if (!/^[a-z0-9-]+$/.test(manifest.id)) {
    throw new Error('Invalid plugin ID: must contain only lowercase letters, numbers, and hyphens');
  }

  if (!manifest.tools) {
    manifest.tools = [];
  }
}
