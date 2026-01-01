/**
 * Plugin metadata and configuration types
 */

export interface PluginInputSchema {
  type: 'object';
  properties: Record<string, {
    type: string;
    description: string;
    enum?: string[];
    items?: { type: string };
  }>;
  required?: string[];
}

export interface PluginTool {
  name: string;
  description: string;
  input_schema: PluginInputSchema;
}

export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  license: string;
  homepage?: string;
  repository?: string;
  keywords?: string[];
  tools: PluginTool[];
  dependencies?: Record<string, string>;
  entryPoint: string;
  pythonVersion?: string;
}

export interface InstalledPlugin {
  manifest: PluginManifest;
  installedAt: string;
  path: string;
  enabled: boolean;
}

export interface PluginRegistry {
  version: string;
  plugins: Record<string, InstalledPlugin>;
  lastUpdated: string;
}

export interface RemotePluginInfo {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  downloads: number;
  rating: number;
  tarballUrl: string;
  manifest: PluginManifest;
}

export interface InstallOptions {
  global?: boolean;
  force?: boolean;
  registry?: string;
}

export interface ListOptions {
  all?: boolean;
}

export interface RemoveOptions {
  force?: boolean;
}
