import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { PluginRegistry, InstalledPlugin, PluginManifest } from '../types/plugin';

const DEFAULT_REGISTRY: PluginRegistry = {
  version: '1.0.0',
  plugins: {},
  lastUpdated: new Date().toISOString(),
};

/**
 * Get the plugins directory path
 */
export function getPluginsDir(global: boolean = false): string {
  if (global) {
    return path.join(os.homedir(), '.claude-plugins');
  }
  // Local plugins directory relative to the project
  return path.join(process.cwd(), '.claude-plugins');
}

/**
 * Get the registry file path
 */
export function getRegistryPath(global: boolean = false): string {
  return path.join(getPluginsDir(global), 'registry.json');
}

/**
 * Get the installed plugins directory
 */
export function getInstalledPluginsDir(global: boolean = false): string {
  return path.join(getPluginsDir(global), 'installed');
}

/**
 * Ensure the plugins directory structure exists
 */
export async function ensurePluginsDirExists(global: boolean = false): Promise<void> {
  const pluginsDir = getPluginsDir(global);
  const installedDir = getInstalledPluginsDir(global);

  await fs.ensureDir(pluginsDir);
  await fs.ensureDir(installedDir);

  const registryPath = getRegistryPath(global);
  if (!await fs.pathExists(registryPath)) {
    await fs.writeJson(registryPath, DEFAULT_REGISTRY, { spaces: 2 });
  }
}

/**
 * Load the plugin registry
 */
export async function loadRegistry(global: boolean = false): Promise<PluginRegistry> {
  await ensurePluginsDirExists(global);
  const registryPath = getRegistryPath(global);

  try {
    return await fs.readJson(registryPath);
  } catch {
    return DEFAULT_REGISTRY;
  }
}

/**
 * Save the plugin registry
 */
export async function saveRegistry(registry: PluginRegistry, global: boolean = false): Promise<void> {
  await ensurePluginsDirExists(global);
  const registryPath = getRegistryPath(global);

  registry.lastUpdated = new Date().toISOString();
  await fs.writeJson(registryPath, registry, { spaces: 2 });
}

/**
 * Check if a plugin is installed
 */
export async function isPluginInstalled(pluginId: string, global: boolean = false): Promise<boolean> {
  const registry = await loadRegistry(global);
  return pluginId in registry.plugins;
}

/**
 * Get an installed plugin
 */
export async function getInstalledPlugin(pluginId: string, global: boolean = false): Promise<InstalledPlugin | null> {
  const registry = await loadRegistry(global);
  return registry.plugins[pluginId] || null;
}

/**
 * Add a plugin to the registry
 */
export async function addPluginToRegistry(
  manifest: PluginManifest,
  pluginPath: string,
  global: boolean = false
): Promise<void> {
  const registry = await loadRegistry(global);

  registry.plugins[manifest.id] = {
    manifest,
    installedAt: new Date().toISOString(),
    path: pluginPath,
    enabled: true,
  };

  await saveRegistry(registry, global);
}

/**
 * Remove a plugin from the registry
 */
export async function removePluginFromRegistry(pluginId: string, global: boolean = false): Promise<boolean> {
  const registry = await loadRegistry(global);

  if (!(pluginId in registry.plugins)) {
    return false;
  }

  delete registry.plugins[pluginId];
  await saveRegistry(registry, global);
  return true;
}

/**
 * Get all installed plugins
 */
export async function getAllInstalledPlugins(global: boolean = false): Promise<InstalledPlugin[]> {
  const registry = await loadRegistry(global);
  return Object.values(registry.plugins);
}

/**
 * Generate a Python plugin integration file for the backend
 */
export async function generatePluginIntegration(global: boolean = false): Promise<void> {
  const registry = await loadRegistry(global);
  const plugins = Object.values(registry.plugins).filter(p => p.enabled);

  const integrationCode = `# Auto-generated plugin integration file
# Do not edit manually - managed by claude-plugins CLI

from typing import Dict, List, Any
import importlib.util
import sys

INSTALLED_PLUGINS: Dict[str, Dict] = ${JSON.stringify(
    Object.fromEntries(
      plugins.map(p => [p.manifest.id, {
        name: p.manifest.name,
        version: p.manifest.version,
        tools: p.manifest.tools,
        entryPoint: p.manifest.entryPoint,
        path: p.path,
      }])
    ),
    null,
    2
  )}

def get_plugin_tools() -> List[Dict]:
    """Get all tools from installed plugins"""
    tools = []
    for plugin_id, plugin_info in INSTALLED_PLUGINS.items():
        for tool in plugin_info.get('tools', []):
            tools.append(tool)
    return tools

def load_plugin_module(plugin_id: str):
    """Dynamically load a plugin module"""
    if plugin_id not in INSTALLED_PLUGINS:
        raise ValueError(f"Plugin {plugin_id} not found")

    plugin_info = INSTALLED_PLUGINS[plugin_id]
    module_path = f"{plugin_info['path']}/{plugin_info['entryPoint']}"

    spec = importlib.util.spec_from_file_location(plugin_id, module_path)
    if spec is None or spec.loader is None:
        raise ImportError(f"Could not load plugin {plugin_id}")

    module = importlib.util.module_from_spec(spec)
    sys.modules[plugin_id] = module
    spec.loader.exec_module(module)
    return module

def execute_plugin_tool(plugin_id: str, tool_name: str, tool_input: Dict) -> Any:
    """Execute a tool from a plugin"""
    module = load_plugin_module(plugin_id)
    if hasattr(module, 'execute_tool'):
        return module.execute_tool(tool_name, tool_input)
    raise AttributeError(f"Plugin {plugin_id} does not have execute_tool function")
`;

  // Write to backend plugins directory
  const backendPluginsDir = path.join(process.cwd(), 'dadam-ai-agent', 'backend', 'plugins');
  await fs.ensureDir(backendPluginsDir);
  await fs.writeFile(path.join(backendPluginsDir, 'integration.py'), integrationCode);

  // Also create __init__.py if it doesn't exist
  const initPath = path.join(backendPluginsDir, '__init__.py');
  if (!await fs.pathExists(initPath)) {
    await fs.writeFile(initPath, '# Plugin integration module\nfrom .integration import *\n');
  }
}
