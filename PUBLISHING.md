# Publishing Guide for WorkspaceTree

> This guide is for developers, maintainers, and contributors who want to build, test, package, and publish the WorkspaceTree extension.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Development Setup](#development-setup)
3. [Building & Compiling](#building--compiling)
4. [Testing](#testing)
5. [Packaging (VSIX)](#packaging-vsix)
6. [Publishing to VS Code Marketplace](#publishing-to-vs-code-marketplace)
7. [Version Management](#version-management)
8. [CI/CD Integration](#cicd-integration)

---

## Prerequisites

Before you begin, ensure you have:

- **Node.js** v18+ — [Download](https://nodejs.org)
- **npm** 9+ — Included with Node.js
- **VS Code** v1.85+ — [Download](https://code.visualstudio.com)
- **Git** — For version control
- A **GitHub account** (optional but recommended)

### Verify Installation

```bash
node --version          # Should be v18+
npm --version           # Should be 9+
git --version           # Any recent version
code --version          # Should be 1.85+
```

---

## Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Mrcoderv/WorkspaceTree.git
cd WorkspaceTree
```

### 2. Install Dependencies

```bash
npm install
```

This installs:
- TypeScript 5.3+
- VS Code API types
- ESLint & related tools
- `@vscode/vsce` (packaging tool)

### 3. Verify Installation

```bash
npm run compile    # Should complete without errors
npm run lint       # Should pass ESLint checks
```

---

## Building & Compiling

### One-Time Compilation

```bash
npm run compile
```

Output: `out/extension.js` + source maps

### Watch Mode (Development)

```bash
npm run watch
```

Automatically recompiles `src/extension.ts` when you save changes. Press `Ctrl+C` to stop.

### Clean Build

```bash
npm run compile    # Automatically handles clean rebuilds
```

---

## Testing

### Launch in Debug Mode (F5)

1. Open the `WorkspaceTree` folder in VS Code
2. Press **F5** or go to **Run → Start Debugging**
3. A new VS Code window opens (Extension Development Host)
4. Open a folder in that window (`File → Open Folder`)
5. Press `Ctrl+Shift+P` and run: `WorkspaceTree: Export Directory Structure`

### Manual Testing Checklist

- [ ] Command appears in Command Palette
- [ ] Command is available in Explorer context menu
- [ ] QuickPick wizard shows all 3 steps
- [ ] Each step can be cancelled (returns undefined)
- [ ] Results are copied to clipboard
- [ ] Status bar shows "Scanning…" indicator
- [ ] Output Channel logs messages (`Ctrl+Shift+U`)
- [ ] Works with hidden files toggle
- [ ] Works with relative paths
- [ ] Works with absolute paths
- [ ] Works with Markdown format
- [ ] Works with Plain Text format
- [ ] Large projects don't freeze UI
- [ ] Permission errors are handled gracefully

### Debugging

1. **Set breakpoints** by clicking line numbers in the editor
2. **Step through code** using the Debug toolbar
3. **View variables** in the Debug panel
4. **Check Output Channel** for runtime logs

---

## Packaging (VSIX)

### One-Click Generator

```bash
./build-vsix.sh
```

This:
1. ✅ Compiles TypeScript
2. ✅ Creates `workspace-tree-1.0.0.vsix`
3. ✅ Shows file size and installation instructions

### Manual Packaging

```bash
# First, ensure TypeScript is compiled
npm run compile

# Then package using npm
npm run package
```

Or directly with `vsce`:

```bash
npx vsce package --no-update-package-json
```

### Verify VSIX Contents

```bash
unzip -l workspace-tree-1.0.0.vsix
```

Expected structure:
```
[Content_Types].xml
extension.vsixmanifest
extension/
  ├── LICENSE.txt
  ├── README.md
  ├── package.json
  ├── images/icon.png
  └── out/extension.js
```

### Install VSIX Locally

**Option 1: VS Code UI**
1. Extensions (`Ctrl+Shift+X`)
2. Click `...` menu
3. Select "Install from VSIX…"
4. Choose the `.vsix` file

**Option 2: Command Line**
```bash
code --install-extension workspace-tree-1.0.0.vsix
```

### Test Installed Extension

1. Reload VS Code
2. Open a workspace
3. Press `Ctrl+Shift+P`
4. Run `WorkspaceTree: Export Directory Structure`
5. Verify it works as expected

---

## Publishing to VS Code Marketplace

### Prerequisites

1. **Microsoft Account** — Create free at [account.microsoft.com](https://account.microsoft.com)
2. **Publisher Account** — Register at [marketplace.visualstudio.com](https://marketplace.visualstudio.com/manage)
3. **Personal Access Token (PAT)** — Generate in Azure DevOps

### Step-by-Step Publication

#### 1. Create Publisher Account

1. Go to [marketplace.visualstudio.com/manage](https://marketplace.visualstudio.com/manage)
2. Sign in with your Microsoft account
3. Click "Create publisher"
4. Enter publisher name: `Raghavvian`
5. Accept terms and click "Create"

#### 2. Generate Personal Access Token

1. Go to [dev.azure.com](https://dev.azure.com)
2. Click your profile → **Personal access tokens**
3. Click **New Token**
4. Configure:
   - **Name**: `vsce-publish`
   - **Organization**: `All accessible organizations`
   - **Expiration**: 365 days (or your preference)
   - **Scopes**: Select `Marketplace (Manage)` scope
5. Click **Create**
6. Copy the token immediately (you can't view it again!)

#### 3. Update package.json

Ensure correct publisher name:

```json
{
  "publisher": "Raghavvian",
  "version": "1.0.0",
  "repository": {
    "type": "git",
    "url": "https://github.com/Mrcoderv/WorkspaceTree"
  }
}
```

#### 4. Publish the Extension

```bash
# Login with your PAT (one-time setup)
npx vsce login Raghavvian

# When prompted, paste your Personal Access Token

# Publish
npm run publish
```

Or directly:

```bash
npx vsce publish --pat YOUR_PAT_HERE
```

#### 5. Verify on Marketplace

1. Wait 5-10 minutes for the extension to appear
2. Visit: https://marketplace.visualstudio.com/items?itemName=Raghavvian.workspace-tree
3. Verify details, description, and icon are correct

---

## Version Management

### Update Version Number

Edit `package.json`:

```json
{
  "version": "1.1.0"
}
```

**Semantic Versioning**:
- `MAJOR.MINOR.PATCH` (e.g., `1.0.0`)
- `MAJOR` — Breaking changes
- `MINOR` — New features (backwards compatible)
- `PATCH` — Bug fixes

### Update Changelog

Maintain `CHANGELOG.md`:

```markdown
## [1.1.0] — 2026-02-28

### Added
- New feature description

### Fixed
- Bug fix description

### Changed
- Breaking change description
```

### Create a Release

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Commit: `git commit -am "v1.1.0"`
4. Tag: `git tag v1.1.0`
5. Push: `git push origin main --tags`
6. Publish to marketplace: `npm run publish`

---

## CI/CD Integration

### GitHub Actions (Optional)

Create `.github/workflows/publish.yml`:

```yaml
name: Publish to Marketplace

on:
  release:
    types: [published]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm install
      - run: npm run compile
      
      - run: npx vsce publish --pat ${{ secrets.VSCE_TOKEN }}
        env:
          VSCE_TOKEN: ${{ secrets.VSCE_TOKEN }}
```

Add GitHub Secret:
1. Go to repository **Settings**
2. Click **Secrets and variables** → **Actions**
3. New secret: `VSCE_TOKEN` = your PAT

---

## Troubleshooting

### "Permission denied" error during compilation
```bash
chmod +x ./build-vsix.sh
```

### VSIX is too large
Check `.vscodeignore` — ensure unnecessary files are excluded.

### Extension fails to install
1. Check that `out/extension.js` exists
2. Verify `package.json` `main` points to `./out/extension.js`
3. Try a clean install: `rm -rf out && npm run compile`

### Marketplace doesn't show new version immediately
- Wait 15-30 minutes for CDN propagation
- Refresh your browser
- Sign out and back into your VS Code account

### Can't login with PAT
1. Verify token hasn't expired
2. Ensure you copied the entire token
3. Make sure token has `Marketplace (Manage)` scope

---

## Project Structure

```
WorkspaceTree/
├── .github/
│   └── workflows/        (GitHub Actions — optional)
├── .vscode/
│   ├── launch.json       (F5 debug config)
│   └── tasks.json        (Watch task)
├── src/
│   └── extension.ts      (Main source code)
├── out/                  (Compiled JS — auto-generated)
├── images/
│   └── icon.png          (128×128 marketplace icon)
├── .eslintrc.json        (Linter config)
├── .gitignore
├── .vscodeignore
├── build-vsix.sh         (One-click build script)
├── CHANGELOG.md
├── LICENSE
├── package.json          (Manifest & scripts)
├── PUBLISHING.md         (This file)
├── README.md             (User guide)
└── tsconfig.json         (TypeScript config)
```

---

## Security Best Practices

1. **Never commit secrets** — Use environment variables and `.gitignore`
2. **Keep dependencies updated** — Run `npm outdated` regularly
3. **Review permissions** — Only request necessary VS Code API scopes
4. **Update PAT regularly** — Rotate tokens every 6 months
5. **Test before publishing** — Always verify locally first

---

## Resources

- **VS Code Extension API** — https://code.visualstudio.com/api
- **vsce CLI Documentation** — https://npm.im/@vscode/vsce
- **Marketplace Publishing Guide** — https://code.visualstudio.com/api/working-with-extensions/publishing-extension
- **GitHub Repository** — https://github.com/Mrcoderv/WorkspaceTree

---

## Support

For questions or issues:
- 📧 GitHub Issues: https://github.com/Mrcoderv/WorkspaceTree/issues
- 💬 Discussions: https://github.com/Mrcoderv/WorkspaceTree/discussions

---

**Happy publishing!** 🚀
