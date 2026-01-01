import { RemotePluginInfo } from '../types/plugin';

const DEFAULT_REGISTRY_URL = 'https://registry.claude-plugins.dev';

interface ParsedIdentifier {
  id: string;
  version?: string;
  isLocal: boolean;
  isGitHub: boolean;
  path?: string;
  repo?: string;
  ref?: string;
}

/**
 * Parse a plugin identifier to determine its source
 *
 * Supported formats:
 * - plugin-name (registry lookup)
 * - plugin-name@1.0.0 (registry with version)
 * - ./local/path (local directory)
 * - /absolute/path (local directory)
 * - github:owner/repo (GitHub repository)
 * - github:owner/repo#branch (GitHub with specific branch/tag)
 * - owner/repo (shorthand for GitHub)
 */
export function parsePluginIdentifier(identifier: string): ParsedIdentifier {
  // Local path (starts with . or /)
  if (identifier.startsWith('./') || identifier.startsWith('/') || identifier.startsWith('../')) {
    return {
      id: '',
      isLocal: true,
      isGitHub: false,
      path: identifier,
    };
  }

  // GitHub explicit (github:owner/repo)
  if (identifier.startsWith('github:')) {
    const repoSpec = identifier.slice(7);
    const [repo, ref] = repoSpec.split('#');
    return {
      id: repo.replace('/', '-'),
      isLocal: false,
      isGitHub: true,
      repo,
      ref,
    };
  }

  // GitHub shorthand (owner/repo without @)
  if (identifier.includes('/') && !identifier.includes('@')) {
    const [repo, ref] = identifier.split('#');
    return {
      id: repo.replace('/', '-'),
      isLocal: false,
      isGitHub: true,
      repo,
      ref,
    };
  }

  // Registry with version (plugin-name@1.0.0)
  if (identifier.includes('@')) {
    const [id, version] = identifier.split('@');
    return {
      id,
      version,
      isLocal: false,
      isGitHub: false,
    };
  }

  // Simple registry lookup
  return {
    id: identifier,
    isLocal: false,
    isGitHub: false,
  };
}

/**
 * Fetch plugin information from the registry
 */
export async function fetchPluginFromRegistry(
  pluginId: string,
  version?: string,
  registryUrl?: string
): Promise<RemotePluginInfo | null> {
  const baseUrl = registryUrl || DEFAULT_REGISTRY_URL;
  const versionSuffix = version ? `@${version}` : '';
  const url = `${baseUrl}/api/plugins/${pluginId}${versionSuffix}`;

  try {
    // Note: In a real implementation, this would make an HTTP request
    // For now, we'll return null to indicate the plugin needs to be
    // fetched differently or doesn't exist in the registry

    // Simulated registry response for demo purposes
    if (pluginId.startsWith('claude-')) {
      return {
        id: pluginId,
        name: pluginId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        version: version || '1.0.0',
        description: `Official Claude plugin: ${pluginId}`,
        author: 'Anthropic',
        downloads: 1000,
        rating: 5.0,
        tarballUrl: `${baseUrl}/packages/${pluginId}/${version || 'latest'}.tar.gz`,
        manifest: {
          id: pluginId,
          name: pluginId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          version: version || '1.0.0',
          description: `Official Claude plugin: ${pluginId}`,
          author: 'Anthropic',
          license: 'MIT',
          tools: [],
          entryPoint: 'main.py',
        },
      };
    }

    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Search plugins in the registry
 */
export async function searchPlugins(
  query: string,
  registryUrl?: string
): Promise<RemotePluginInfo[]> {
  const baseUrl = registryUrl || DEFAULT_REGISTRY_URL;

  try {
    // Simulated search results
    // In production, this would make an HTTP request to the registry
    return [];
  } catch (error) {
    return [];
  }
}

/**
 * Fetch all available plugins from the registry
 */
export async function fetchAllPlugins(
  registryUrl?: string
): Promise<RemotePluginInfo[]> {
  const baseUrl = registryUrl || DEFAULT_REGISTRY_URL;

  try {
    // Simulated available plugins
    // In production, this would make an HTTP request to the registry
    return [
      {
        id: 'claude-furniture-optimizer',
        name: 'Claude Furniture Optimizer',
        version: '1.0.0',
        description: 'Advanced furniture layout optimization tools',
        author: 'Anthropic',
        downloads: 500,
        rating: 4.8,
        tarballUrl: `${baseUrl}/packages/claude-furniture-optimizer/1.0.0.tar.gz`,
        manifest: {
          id: 'claude-furniture-optimizer',
          name: 'Claude Furniture Optimizer',
          version: '1.0.0',
          description: 'Advanced furniture layout optimization tools',
          author: 'Anthropic',
          license: 'MIT',
          tools: [
            {
              name: 'optimize_layout',
              description: 'Optimize furniture layout for maximum space efficiency',
              input_schema: {
                type: 'object',
                properties: {
                  room_width: { type: 'number', description: 'Room width in mm' },
                  room_depth: { type: 'number', description: 'Room depth in mm' },
                },
                required: ['room_width', 'room_depth'],
              },
            },
          ],
          entryPoint: 'main.py',
        },
      },
      {
        id: 'claude-material-calculator',
        name: 'Claude Material Calculator',
        version: '1.2.0',
        description: 'Calculate material requirements for furniture projects',
        author: 'Dadam',
        downloads: 320,
        rating: 4.5,
        tarballUrl: `${baseUrl}/packages/claude-material-calculator/1.2.0.tar.gz`,
        manifest: {
          id: 'claude-material-calculator',
          name: 'Claude Material Calculator',
          version: '1.2.0',
          description: 'Calculate material requirements for furniture projects',
          author: 'Dadam',
          license: 'MIT',
          tools: [
            {
              name: 'calculate_materials',
              description: 'Calculate required materials for a design',
              input_schema: {
                type: 'object',
                properties: {
                  design_id: { type: 'string', description: 'Design ID to calculate materials for' },
                },
                required: ['design_id'],
              },
            },
          ],
          entryPoint: 'main.py',
        },
      },
    ];
  } catch (error) {
    return [];
  }
}
