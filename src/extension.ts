/**
 * WorkspaceTree - VS Code Extension
 * Exports the current workspace directory structure to the clipboard
 * in Markdown or plain text format.
 *
 * Author: Mrcoderv
 * 
 * License: MIT
 */

import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

// ---------------------------------------------------------------------------
// Types & Interfaces
// ---------------------------------------------------------------------------

/** User-selected options from the QuickPick wizard */
interface ExportOptions {
  includeHidden: boolean;
  pathFormat: "relative" | "full";
  exportType: "markdown" | "plaintext";
}

/** Internal node used when building the tree */
interface TreeNode {
  name: string;
  absolutePath: string;
  isDirectory: boolean;
  children: TreeNode[];
}

/** Result returned from the tree-generation phase */
interface GenerationResult {
  text: string;
  fileCount: number;
  dirCount: number;
}

// ---------------------------------------------------------------------------
// Extension lifecycle
// ---------------------------------------------------------------------------

/** Output channel shared across the extension's lifetime */
let outputChannel: vscode.OutputChannel;

/**
 * Called once by VS Code when the extension is first activated.
 * Registers all commands and initialises shared resources.
 */
export function activate(context: vscode.ExtensionContext): void {
  // Create a dedicated Output Channel for non-intrusive logging
  outputChannel = vscode.window.createOutputChannel("WorkspaceTree");
  context.subscriptions.push(outputChannel);

  // Register the main export command
  const exportCommand = vscode.commands.registerCommand(
    "workspace-tree.export",
    handleExportCommand
  );

  context.subscriptions.push(exportCommand);

  log("WorkspaceTree extension activated.");
}

/**
 * Called when the extension is deactivated (VS Code shuts down or
 * the extension is disabled). Clean-up happens automatically via
 * context.subscriptions, but we log for diagnostics.
 */
export function deactivate(): void {
  log("WorkspaceTree extension deactivated.");
}

// ---------------------------------------------------------------------------
// Command handler
// ---------------------------------------------------------------------------

/**
 * Orchestrates the full export flow:
 *  1. Validate a workspace is open
 *  2. Collect user options via QuickPick
 *  3. Show "Scanning…" status feedback
 *  4. Build the tree recursively (async, non-blocking)
 *  5. Copy result to clipboard
 *  6. Notify the user
 */
async function handleExportCommand(): Promise<void> {
  // 1. Ensure a workspace folder is available
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    vscode.window.showWarningMessage(
      "WorkspaceTree: No workspace folder is open. Please open a folder first."
    );
    return;
  }

  // Use the first workspace root (multi-root workspaces: we pick [0])
  const rootUri = workspaceFolders[0].uri;
  const rootPath = rootUri.fsPath; // OS-native path (handles \ on Windows)

  // 2. Collect export options from the user
  const options = await promptForOptions();
  if (!options) {
    // User dismissed the wizard — silently abort
    return;
  }

  // 3. Show a status-bar "Scanning…" indicator
  const statusItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  );
  statusItem.text = "$(sync~spin) WorkspaceTree: Scanning…";
  statusItem.tooltip = "Building workspace directory tree…";
  statusItem.show();

  try {
    // 4. Build the tree (async, won't block the UI thread)
    const result = await generateTree(rootPath, options);

    // 5. Write to clipboard
    await vscode.env.clipboard.writeText(result.text);

    // 6. Success feedback
    vscode.window.showInformationMessage(
      `WorkspaceTree: Copied to clipboard! ` +
        `(${result.dirCount} folders, ${result.fileCount} files)`
    );

    log(
      `Export complete. Dirs: ${result.dirCount}, Files: ${result.fileCount}`
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    vscode.window.showErrorMessage(
      `WorkspaceTree: Export failed — ${message}`
    );
    log(`ERROR: ${message}`);
  } finally {
    // Always clean up the status-bar item
    statusItem.dispose();
  }
}

// ---------------------------------------------------------------------------
// QuickPick wizard
// ---------------------------------------------------------------------------

/**
 * Displays a multi-step QuickPick wizard and returns the chosen options,
 * or undefined if the user cancelled at any step.
 */
async function promptForOptions(): Promise<ExportOptions | undefined> {
  // --- Step 1: Include hidden files? ---
  const hiddenPick = await vscode.window.showQuickPick(
    [
      {
        label: "$(eye-closed)  No — Skip hidden files & folders",
        description: "Recommended",
        value: false,
      },
      {
        label: "$(eye)  Yes — Include hidden files & folders",
        description: 'Items starting with "." (e.g. .env, .git)',
        value: true,
      },
    ],
    {
      title: "WorkspaceTree  (1/3)",
      placeHolder: "Include hidden files and folders?",
      ignoreFocusOut: true,
    }
  );
  if (!hiddenPick) {
    return undefined;
  }

  // --- Step 2: Path format ---
  const pathPick = await vscode.window.showQuickPick(
    [
      {
        label: "$(symbol-folder)  Relative paths",
        description: "e.g.  src/utils/helper.ts",
        value: "relative" as const,
      },
      {
        label: "$(file-directory)  Full (absolute) paths",
        description: "e.g.  /home/user/project/src/utils/helper.ts",
        value: "full" as const,
      },
    ],
    {
      title: "WorkspaceTree  (2/3)",
      placeHolder: "Choose path format",
      ignoreFocusOut: true,
    }
  );
  if (!pathPick) {
    return undefined;
  }

  // --- Step 3: Export format ---
  const formatPick = await vscode.window.showQuickPick(
    [
      {
        label: "$(markdown)  Markdown list",
        description: "Uses icons, indentation, and code fences",
        value: "markdown" as const,
      },
      {
        label: "$(list-tree)  Plain text",
        description: "Simple indented tree — great for READMEs",
        value: "plaintext" as const,
      },
    ],
    {
      title: "WorkspaceTree  (3/3)",
      placeHolder: "Choose export format",
      ignoreFocusOut: true,
    }
  );
  if (!formatPick) {
    return undefined;
  }

  return {
    includeHidden: (hiddenPick as { value: boolean }).value,
    pathFormat: (pathPick as { value: "relative" | "full" }).value,
    exportType: (formatPick as { value: "markdown" | "plaintext" }).value,
  };
}

// ---------------------------------------------------------------------------
// Tree generation
// ---------------------------------------------------------------------------

/**
 * Entry point for tree generation.
 * Reads workspace config for excluded patterns, then recursively
 * scans the file system starting from `rootPath`.
 */
async function generateTree(
  rootPath: string,
  options: ExportOptions
): Promise<GenerationResult> {
  const config = vscode.workspace.getConfiguration("workspaceTree");
  const excludePatterns: string[] = config.get("excludePatterns") ?? [
    "node_modules",
    ".git",
    "dist",
    "out",
    ".next",
    "__pycache__",
    ".DS_Store",
  ];

  // Build the in-memory tree model
  const rootNode = await buildTreeNode(
    rootPath,
    options,
    excludePatterns,
    0 // depth counter (for safety cap)
  );

  // Counters updated during rendering
  let fileCount = 0;
  let dirCount = 0;

  // Render the tree to a string
  const rootName = path.basename(rootPath);
  const lines: string[] = [];

  if (options.exportType === "markdown") {
    lines.push("```");
    lines.push(`📁 ${rootName}/`);
    renderMarkdown(rootNode.children, lines, "   ", options, rootPath, {
      file: (n) => {
        fileCount++;
        return n;
      },
      dir: (n) => {
        dirCount++;
        return n;
      },
    });
    lines.push("```");
    lines.push("");
    lines.push(
      `> Generated by **WorkspaceTree** — ${fileCount} files, ${dirCount} folders`
    );
  } else {
    lines.push(`${rootName}/`);
    renderPlainText(rootNode.children, lines, "  ", options, rootPath, {
      file: (n) => {
        fileCount++;
        return n;
      },
      dir: (n) => {
        dirCount++;
        return n;
      },
    });
  }

  return {
    text: lines.join("\n"),
    fileCount,
    dirCount,
  };
}

/**
 * Recursively builds a TreeNode by reading directory entries via
 * `fs.promises` (non-blocking). Permission errors on individual
 * entries are caught and logged without crashing the whole export.
 */
async function buildTreeNode(
  nodePath: string,
  options: ExportOptions,
  excludePatterns: string[],
  depth: number
): Promise<TreeNode> {
  const MAX_DEPTH = 50; // Guard against infinite symlink loops
  const name = path.basename(nodePath);

  // Read directory entries asynchronously
  let entries: fs.Dirent[] = [];
  try {
    entries = await fs.promises.readdir(nodePath, { withFileTypes: true });
  } catch (err) {
    // Log permission/read errors to Output Channel — don't crash
    const message = err instanceof Error ? err.message : String(err);
    log(`WARN: Cannot read directory "${nodePath}": ${message}`);
    return { name, absolutePath: nodePath, isDirectory: true, children: [] };
  }

  // Sort: directories first, then files — both alphabetically
  entries.sort((a, b) => {
    if (a.isDirectory() && !b.isDirectory()) {
      return -1;
    }
    if (!a.isDirectory() && b.isDirectory()) {
      return 1;
    }
    return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
  });

  const children: TreeNode[] = [];

  for (const entry of entries) {
    // --- Apply exclusion rules ---
    if (shouldExclude(entry.name, options, excludePatterns)) {
      continue;
    }

    const childPath = path.join(nodePath, entry.name); // OS-safe join

    if (entry.isDirectory()) {
      if (depth < MAX_DEPTH) {
        const childNode = await buildTreeNode(
          childPath,
          options,
          excludePatterns,
          depth + 1
        );
        children.push(childNode);
      } else {
        log(`WARN: Max depth (${MAX_DEPTH}) reached at "${childPath}". Skipping subtree.`);
      }
    } else if (entry.isFile()) {
      children.push({
        name: entry.name,
        absolutePath: childPath,
        isDirectory: false,
        children: [],
      });
    }
    // Symlinks, block devices, sockets etc. are intentionally skipped
  }

  return { name, absolutePath: nodePath, isDirectory: true, children };
}

/**
 * Determines whether a given entry name should be excluded
 * from the exported tree.
 */
function shouldExclude(
  name: string,
  options: ExportOptions,
  excludePatterns: string[]
): boolean {
  // Always-exclude list from settings
  if (excludePatterns.includes(name)) {
    return true;
  }

  // Hidden-file handling (entries starting with ".")
  if (!options.includeHidden && name.startsWith(".")) {
    return true;
  }

  return false;
}

// ---------------------------------------------------------------------------
// Rendering helpers
// ---------------------------------------------------------------------------

/** Counter callbacks for tracking stats during rendering */
interface CounterCallbacks {
  file: (node: TreeNode) => TreeNode;
  dir: (node: TreeNode) => TreeNode;
}

/**
 * Renders the tree into Markdown format lines (mutates `lines`).
 *
 * Example output:
 * ```
 * 📁 src/
 *    📁 utils/
 *       📄 helper.ts
 *    📄 extension.ts
 * ```
 */
function renderMarkdown(
  nodes: TreeNode[],
  lines: string[],
  indent: string,
  options: ExportOptions,
  rootPath: string,
  counters: CounterCallbacks
): void {
  nodes.forEach((node, index) => {
    const isLast = index === nodes.length - 1;
    const connector = isLast ? "└── " : "├── ";
    const displayPath = formatNodePath(node, options);

    if (node.isDirectory) {
      counters.dir(node);
      lines.push(`${indent}${connector}📁 ${displayPath}/`);
      const childIndent = indent + (isLast ? "    " : "│   ");
      renderMarkdown(
        node.children,
        lines,
        childIndent,
        options,
        rootPath,
        counters
      );
    } else {
      counters.file(node);
      lines.push(`${indent}${connector}📄 ${displayPath}`);
    }
  });
}

/**
 * Renders the tree into plain-text format lines (mutates `lines`).
 *
 * Example output:
 * ```
 * src/
 *   utils/
 *     helper.ts
 *   extension.ts
 * ```
 */
function renderPlainText(
  nodes: TreeNode[],
  lines: string[],
  indent: string,
  options: ExportOptions,
  rootPath: string,
  counters: CounterCallbacks
): void {
  nodes.forEach((node) => {
    const displayPath = formatNodePath(node, options);

    if (node.isDirectory) {
      counters.dir(node);
      lines.push(`${indent}${displayPath}/`);
      renderPlainText(
        node.children,
        lines,
        indent + "  ",
        options,
        rootPath,
        counters
      );
    } else {
      counters.file(node);
      lines.push(`${indent}${displayPath}`);
    }
  });
}

/**
 * Returns either the file/folder name (relative mode) or
 * the full, platform-normalised absolute path (full mode).
 * Normalises path separators to forward-slashes for portability.
 */
function formatNodePath(
  node: TreeNode,
  options: ExportOptions
): string {
  if (options.pathFormat === "full") {
    // Normalise separators: replace Windows backslashes with forward slashes
    return node.absolutePath.split(path.sep).join("/");
  }

  // Relative: just the entry name (depth is conveyed via indentation)
  return node.name;
}

// ---------------------------------------------------------------------------
// Logging utility
// ---------------------------------------------------------------------------

/**
 * Writes a timestamped message to the WorkspaceTree Output Channel.
 * Use this instead of console.log for all diagnostics.
 */
function log(message: string): void {
  const timestamp = new Date().toISOString();
  outputChannel.appendLine(`[${timestamp}] ${message}`);
}
