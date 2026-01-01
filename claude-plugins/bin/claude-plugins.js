#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const c = (color, text) => `${colors[color]}${text}${colors.reset}`;

// Plugin directory helpers
function getPluginsDir(global = false) {
  return global
    ? path.join(os.homedir(), '.claude-plugins')
    : path.join(process.cwd(), '.claude-plugins');
}

function getRegistryPath(global = false) {
  return path.join(getPluginsDir(global), 'registry.json');
}

function ensurePluginsDir(global = false) {
  const dir = getPluginsDir(global);
  const installedDir = path.join(dir, 'installed');

  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(installedDir)) fs.mkdirSync(installedDir, { recursive: true });

  const registryPath = getRegistryPath(global);
  if (!fs.existsSync(registryPath)) {
    fs.writeFileSync(registryPath, JSON.stringify({
      version: '1.0.0',
      plugins: {},
      lastUpdated: new Date().toISOString()
    }, null, 2));
  }
}

function loadRegistry(global = false) {
  ensurePluginsDir(global);
  try {
    return JSON.parse(fs.readFileSync(getRegistryPath(global), 'utf8'));
  } catch {
    return { version: '1.0.0', plugins: {}, lastUpdated: new Date().toISOString() };
  }
}

function saveRegistry(registry, global = false) {
  ensurePluginsDir(global);
  registry.lastUpdated = new Date().toISOString();
  fs.writeFileSync(getRegistryPath(global), JSON.stringify(registry, null, 2));
}

// Parse plugin identifier
function parseIdentifier(id) {
  if (id.startsWith('./') || id.startsWith('/') || id.startsWith('../')) {
    return { type: 'local', path: id };
  }
  if (id.startsWith('github:')) {
    const [repo, ref] = id.slice(7).split('#');
    return { type: 'github', repo, ref };
  }
  if (id.includes('/') && !id.includes('@')) {
    const [repo, ref] = id.split('#');
    return { type: 'github', repo, ref };
  }
  const [name, version] = id.split('@');
  return { type: 'registry', name, version };
}

// Commands
function install(identifier, options = {}) {
  console.log(`\n${c('cyan', '●')} Installing plugin: ${c('bold', identifier)}\n`);

  const parsed = parseIdentifier(identifier);
  const global = options.global || false;
  ensurePluginsDir(global);

  const registry = loadRegistry(global);
  const installedDir = path.join(getPluginsDir(global), 'installed');

  let manifest;
  let pluginPath;

  if (parsed.type === 'local') {
    // Install from local path
    const srcPath = path.resolve(parsed.path);
    if (!fs.existsSync(srcPath)) {
      console.error(c('red', `Error: Path not found: ${srcPath}`));
      process.exit(1);
    }

    const manifestPath = path.join(srcPath, 'plugin.json');
    if (!fs.existsSync(manifestPath)) {
      console.error(c('red', 'Error: plugin.json not found'));
      process.exit(1);
    }

    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    pluginPath = path.join(installedDir, manifest.id);

    // Copy files
    fs.cpSync(srcPath, pluginPath, { recursive: true });

  } else if (parsed.type === 'github') {
    // Install from GitHub
    console.log(c('dim', `Cloning from GitHub: ${parsed.repo}...`));
    pluginPath = path.join(installedDir, parsed.repo.replace('/', '-'));

    try {
      const ref = parsed.ref ? `--branch ${parsed.ref}` : '';
      execSync(`git clone --depth 1 ${ref} https://github.com/${parsed.repo}.git "${pluginPath}"`, { stdio: 'pipe' });
    } catch (e) {
      console.error(c('red', `Error: Failed to clone ${parsed.repo}`));
      process.exit(1);
    }

    const manifestPath = path.join(pluginPath, 'plugin.json');
    if (!fs.existsSync(manifestPath)) {
      fs.rmSync(pluginPath, { recursive: true });
      console.error(c('red', 'Error: plugin.json not found in repository'));
      process.exit(1);
    }

    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  } else {
    // Install from registry (simulated)
    console.log(c('dim', 'Fetching from registry...'));

    manifest = {
      id: parsed.name,
      name: parsed.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      version: parsed.version || '1.0.0',
      description: `Plugin: ${parsed.name}`,
      author: 'Unknown',
      license: 'MIT',
      tools: [],
      entryPoint: 'main.py'
    };

    pluginPath = path.join(installedDir, manifest.id);
    fs.mkdirSync(pluginPath, { recursive: true });
    fs.writeFileSync(path.join(pluginPath, 'plugin.json'), JSON.stringify(manifest, null, 2));
    fs.writeFileSync(path.join(pluginPath, 'main.py'), `# Plugin entry point
from typing import Dict, Any

def execute_tool(tool_name: str, tool_input: Dict) -> Any:
    raise NotImplementedError(f"Tool {tool_name} not implemented")
`);
  }

  // Register plugin
  registry.plugins[manifest.id] = {
    manifest,
    installedAt: new Date().toISOString(),
    path: pluginPath,
    enabled: true
  };
  saveRegistry(registry, global);

  console.log(c('green', `✓ Successfully installed ${c('bold', manifest.name)} v${manifest.version}`));
  console.log('');
  console.log(c('dim', '─'.repeat(50)));
  console.log(`  ${c('bold', 'Plugin ID:')}     ${manifest.id}`);
  console.log(`  ${c('bold', 'Version:')}       ${manifest.version}`);
  console.log(`  ${c('bold', 'Author:')}        ${manifest.author}`);
  console.log(`  ${c('bold', 'Description:')}   ${manifest.description}`);
  console.log(`  ${c('bold', 'Tools:')}         ${(manifest.tools || []).length} tool(s)`);
  console.log(c('dim', '─'.repeat(50)));
  console.log('');
}

function list(options = {}) {
  if (options.all) {
    console.log(`\n${c('bold', '🌐 Available Plugins')}\n`);
    console.log(c('dim', '─'.repeat(60)));
    console.log(`  ${c('cyan', 'claude-furniture-optimizer')}  v1.0.0  ${c('dim', 'Layout optimization')}`);
    console.log(`  ${c('cyan', 'claude-material-calculator')}  v1.2.0  ${c('dim', 'Material calculation')}`);
    console.log(c('dim', '─'.repeat(60)));
    console.log(`\n${c('dim', 'Run `claude-plugins install <name>` to install a plugin.')}\n`);
    return;
  }

  const localRegistry = loadRegistry(false);
  const globalRegistry = loadRegistry(true);

  const localPlugins = Object.values(localRegistry.plugins);
  const globalPlugins = Object.values(globalRegistry.plugins);
  const total = localPlugins.length + globalPlugins.length;

  if (total === 0) {
    console.log(c('yellow', '\nNo plugins installed.'));
    console.log(c('dim', 'Run `claude-plugins install <plugin-name>` to install a plugin.'));
    console.log(c('dim', 'Run `claude-plugins list --all` to see available plugins.\n'));
    return;
  }

  console.log(`\n${c('bold', '📦 Installed Plugins')}\n`);

  const printPlugins = (plugins, label) => {
    if (plugins.length === 0) return;
    console.log(c('dim', `${label}:`));
    console.log(c('dim', '  ' + '─'.repeat(50)));
    plugins.forEach(p => {
      const status = p.enabled ? c('green', 'enabled') : c('yellow', 'disabled');
      const tools = (p.manifest.tools || []).length;
      console.log(`  ${c('cyan', p.manifest.name.padEnd(25))} ${c('yellow', p.manifest.version.padEnd(10))} ${String(tools).padEnd(6)} ${status}`);
    });
    console.log('');
  };

  printPlugins(localPlugins, 'Local (project)');
  printPlugins(globalPlugins, 'Global');

  console.log(c('dim', `Total: ${total} plugin(s) installed\n`));
}

function remove(identifier, options = {}) {
  let plugin = loadRegistry(false).plugins[identifier];
  let global = false;

  if (!plugin) {
    plugin = loadRegistry(true).plugins[identifier];
    global = true;
  }

  if (!plugin) {
    console.error(c('red', `\nPlugin not found: ${identifier}`));
    console.log(c('dim', 'Run `claude-plugins list` to see installed plugins.\n'));
    process.exit(1);
  }

  console.log(`\n${c('cyan', '●')} Removing plugin: ${c('bold', plugin.manifest.name)}...`);

  // Remove files
  if (fs.existsSync(plugin.path)) {
    fs.rmSync(plugin.path, { recursive: true });
  }

  // Update registry
  const registry = loadRegistry(global);
  delete registry.plugins[identifier];
  saveRegistry(registry, global);

  console.log(c('green', `✓ Successfully removed ${plugin.manifest.name}\n`));
}

function info(identifier) {
  let plugin = loadRegistry(false).plugins[identifier];
  let global = false;

  if (!plugin) {
    plugin = loadRegistry(true).plugins[identifier];
    global = true;
  }

  if (!plugin) {
    console.log(c('yellow', `\nPlugin not found: ${identifier}`));
    console.log(c('dim', 'Run `claude-plugins list --all` to see available plugins.\n'));
    return;
  }

  const m = plugin.manifest;
  console.log(`\n${c('bold', c('cyan', `📦 ${m.name}`))}`);
  console.log(c('dim', '─'.repeat(50)));
  console.log(`  ${c('bold', 'ID:')}          ${m.id}`);
  console.log(`  ${c('bold', 'Version:')}     ${m.version}`);
  console.log(`  ${c('bold', 'Description:')} ${m.description}`);
  console.log(`  ${c('bold', 'Author:')}      ${m.author}`);
  console.log(`  ${c('bold', 'License:')}     ${m.license}`);
  console.log(`  ${c('bold', 'Scope:')}       ${global ? 'Global' : 'Local'}`);
  console.log(`  ${c('bold', 'Status:')}      ${plugin.enabled ? c('green', 'Enabled') : c('yellow', 'Disabled')}`);
  console.log(`  ${c('bold', 'Installed:')}   ${new Date(plugin.installedAt).toLocaleString()}`);
  console.log(`  ${c('bold', 'Path:')}        ${c('dim', plugin.path)}`);

  const tools = m.tools || [];
  console.log(`\n${c('bold', `Tools (${tools.length})`)}`);
  console.log(c('dim', '─'.repeat(30)));
  if (tools.length === 0) {
    console.log(c('dim', '  No tools defined'));
  } else {
    tools.forEach(t => {
      console.log(`  ${c('cyan', '●')} ${c('bold', t.name)}`);
      console.log(`    ${c('dim', t.description)}`);
    });
  }
  console.log('');
}

function showHelp() {
  console.log(`
${c('bold', 'claude-plugins')} - CLI for managing Claude AI plugins

${c('bold', 'USAGE')}
  claude-plugins <command> [options]

${c('bold', 'COMMANDS')}
  install, i <identifier>   Install a plugin
  list, ls                  List installed plugins
  remove, rm <identifier>   Remove a plugin
  info <identifier>         Show plugin details

${c('bold', 'OPTIONS')}
  -g, --global              Use global scope
  -a, --all                 Show all available (for list)
  -f, --force               Force operation
  -h, --help                Show help

${c('bold', 'PLUGIN IDENTIFIERS')}
  plugin-name               Install from registry
  plugin-name@1.0.0         Install specific version
  ./local/path              Install from local path
  github:owner/repo         Install from GitHub
  owner/repo                GitHub shorthand

${c('bold', 'EXAMPLES')}
  claude-plugins install claude-furniture-optimizer
  claude-plugins install github:dadam/my-plugin
  claude-plugins install ./my-local-plugin
  claude-plugins list --all
  claude-plugins remove my-plugin
`);
}

// Main
const args = process.argv.slice(2);
const command = args[0];

const options = {
  global: args.includes('-g') || args.includes('--global'),
  all: args.includes('-a') || args.includes('--all'),
  force: args.includes('-f') || args.includes('--force'),
};

const positionalArgs = args.filter(a => !a.startsWith('-'));

switch (command) {
  case 'install':
  case 'i':
    if (!positionalArgs[1]) {
      console.error(c('red', 'Error: Plugin identifier required'));
      process.exit(1);
    }
    install(positionalArgs[1], options);
    break;

  case 'list':
  case 'ls':
    list(options);
    break;

  case 'remove':
  case 'rm':
    if (!positionalArgs[1]) {
      console.error(c('red', 'Error: Plugin identifier required'));
      process.exit(1);
    }
    remove(positionalArgs[1], options);
    break;

  case 'info':
    if (!positionalArgs[1]) {
      console.error(c('red', 'Error: Plugin identifier required'));
      process.exit(1);
    }
    info(positionalArgs[1]);
    break;

  case '-h':
  case '--help':
  case 'help':
  case undefined:
    showHelp();
    break;

  default:
    console.error(c('red', `Unknown command: ${command}`));
    showHelp();
    process.exit(1);
}
