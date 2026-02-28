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
/**
 * Called once by VS Code when the extension is first activated.
 * Registers all commands and initialises shared resources.
 */
export declare function activate(context: vscode.ExtensionContext): void;
/**
 * Called when the extension is deactivated (VS Code shuts down or
 * the extension is disabled). Clean-up happens automatically via
 * context.subscriptions, but we log for diagnostics.
 */
export declare function deactivate(): void;
//# sourceMappingURL=extension.d.ts.map