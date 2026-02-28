# WorkspaceTree 🌳

> **Export your VS Code workspace directory structure to the clipboard** in beautiful Markdown or plain text format — instantly.

[![Publisher](https://img.shields.io/badge/Publisher-Raghavvian-blue)](https://marketplace.visualstudio.com/publishers/Raghavvian)
[![Version](https://img.shields.io/badge/Version-1.0.0-green)](https://github.com/Mrcoderv/WorkspaceTree/releases)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

---

<<<<<<< HEAD
## 📁 Where to Find Extension Files

Want to access the extension folder on your computer? Here's where WorkspaceTree is installed:

| OS | Location |
|---|---|
| **Windows** | `%APPDATA%\.vscode\extensions\raghavvian.workspace-tree-1.0.0` |
| **macOS** | `~/.vscode/extensions/raghavvian.workspace-tree-1.0.0` |
| **Linux** | `~/.vscode/extensions/raghavvian.workspace-tree-1.0.0` |

### Quick Access

**From VS Code (Easiest):**
=======
## Quick Access

**From VS Code (Easiest):**

>>>>>>> 18f725f (Add demo video to README)
1. Go to **Extensions** (`Ctrl+Shift+X`)
2. Search "WorkspaceTree"
3. Click gear icon ⚙️ → "Show in File Manager"

<<<<<<< HEAD
**Windows:** Press `Win+R`, paste path above, press Enter  
**macOS:** Press `Cmd+Shift+G` in Finder, paste path above, press Enter  
=======
**Windows:** Press `Win+R`, paste path above, press Enter
**macOS:** Press `Cmd+Shift+G` in Finder, paste path above, press Enter
>>>>>>> 18f725f (Add demo video to README)
**Linux:** Press `Ctrl+L` in File Manager, paste path above, press Enter

📖 **For detailed file access instructions**, see [USER_FILE_ACCESS.md](USER_FILE_ACCESS.md)

<<<<<<< HEAD
=======
## Video

![Demo Video](./video.webm)

## 📁 Where to Find Extension Files

Want to access the extension folder on your computer? Here's where WorkspaceTree is installed:

| OS                | Location                                                         |
| ----------------- | ---------------------------------------------------------------- |
| **Windows** | `%APPDATA%\.vscode\extensions\raghavvian.workspace-tree-1.0.0` |
| **macOS**   | `~/.vscode/extensions/raghavvian.workspace-tree-1.0.0`         |
| **Linux**   | `~/.vscode/extensions/raghavvian.workspace-tree-1.0.0`         |

>>>>>>> 18f725f (Add demo video to README)
---

## ✨ Features

| Feature                      | Benefit                                                                             |
| ---------------------------- | ----------------------------------------------------------------------------------- |
| **One-Command Export** | Press `Ctrl+Shift+P` and run **WorkspaceTree: Export Directory Structure**  |
| **Visual Icons**       | 📁 Folders and 📄 Files in Markdown mode                                            |
| **Smart Filtering**    | Automatically excludes `node_modules`, `.git`, `dist`, hidden files, and more |
<<<<<<< HEAD
| **Flexible Formats**   | Export as **Markdown** (with code fences) or **Plain Text**            |
=======
| **Flexible Formats**   | Export as**Markdown** (with code fences) or **Plain Text**              |
>>>>>>> 18f725f (Add demo video to README)
| **Path Options**       | Choose between**Relative** names or **Full Absolute** paths             |
| **Non-Blocking**       | Fully asynchronous using `fs.promises` — never freezes VS Code                   |
| **Error Resilient**    | Permission errors are logged to Output Channel, not crashes                         |
| **Status Feedback**    | Real-time scanning indicator in status bar                                          |
| **Customizable**       | Configure exclusion patterns via VS Code settings                                   |

---

## 🎯 Use Cases

- 📄 **Include in READMEs** — Show project structure in documentation
- 📋 **Share Project Layout** — Copy and paste into Slack, Discord, email
- 🗂️ **Documentation** — Create visual file tree diagrams
- 🔍 **Project Analysis** — Quickly understand repository structure
- 📊 **Reports** — Generate project overview for stakeholders

---

## 🚀 Quick Start

### Installation

1. Open **VS Code**
2. Go to **Extensions** (`Ctrl+Shift+X`)
3. Search for **"WorkspaceTree"**
4. Click **Install**

---

### Usage

#### Method 1: Command Palette (Easiest)

1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS)
2. Type `WorkspaceTree: Export Directory Structure`
3. Press `Enter`
4. Configure your options:
   - **Include hidden files?** → Choose `Yes` or `No`
   - **Path format?** → Choose `Relative` or `Full`
   - **Export format?** → Choose `Markdown` or `Plain Text`
5. The result is copied to your clipboard ✓

#### Method 2: Explorer Context Menu

1. Right-click any folder in the **Explorer** sidebar
2. Select **WorkspaceTree: Export Directory Structure**
3. Follow the same wizard steps

---

## 📋 Example Outputs

### Markdown Format

```
📁 my-project/
   ├── 📁 src/
   │   ├── 📁 components/
   │   │   ├── 📄 Header.tsx
   │   │   └── 📄 Footer.tsx
   │   ├── 📁 utils/
   │   │   └── 📄 helpers.ts
   │   └── 📄 App.tsx
   ├── 📁 public/
   │   └── 📄 index.html
   ├── 📄 package.json
   └── 📄 README.md
```

> Generated by **WorkspaceTree** — 8 files, 4 folders

### Plain Text Format

```
my-project/
  src/
    components/
      Header.tsx
      Footer.tsx
    utils/
      helpers.ts
    App.tsx
  public/
    index.html
  package.json
  README.md
```

---

## ⚙️ Configuration

Open VS Code **Settings** (`Ctrl+,`) and search for **WorkspaceTree**:

### Exclude Patterns

Add or remove patterns to exclude from exports:

```json
"workspaceTree.excludePatterns": [
  "node_modules",
  ".git",
  "dist",
  "out",
  ".next",
  "__pycache__",
  ".DS_Store",
  "build",
  ".venv"
]
```

**Default exclusions**: `node_modules`, `.git`, `dist`, `out`, `.next`, `__pycache__`, `.DS_Store`

### Hidden Files

Control whether to include files/folders starting with `.` (e.g., `.env`, `.gitignore`):

- Choose at runtime in the wizard, or
- Set a default in settings

---

## 📊 Output Channel

All debug logs are sent to the **"WorkspaceTree"** Output Channel:

1. Open **Output** panel (`Ctrl+Shift+U`)
2. Select **"WorkspaceTree"** from the dropdown
3. View scan progress, file counts, and any errors

---

## 🔧 Technical Details

### Architecture

- **Language**: TypeScript 5.3+
- **Target**: VS Code 1.85+
- **Framework**: Native VS Code API
- **File I/O**: Asynchronous (`fs.promises`)

### Performance

- ✅ Non-blocking UI using async/await
- ✅ Recursive tree generation with max-depth protection (50 levels)
- ✅ Error handling for permission issues
- ✅ Status bar feedback during scanning

### Error Handling

- Permission errors are logged, not thrown
- Symlink loops are prevented with depth limit
- File read failures don't crash the extension

---

## 🐛 Troubleshooting

### Extension doesn't appear in menus

1. Reload VS Code: `Ctrl+Shift+P` → **"Developer: Reload Window"**
2. Check **Extensions** panel to ensure it's enabled

### Output looks incomplete

- Check the **WorkspaceTree Output Channel** (`Ctrl+Shift+U`) for errors
- Some files may be excluded by your settings — review `workspaceTree.excludePatterns`

### Clipboard doesn't copy

1. Wait for the status bar indicator to finish
2. Check your system clipboard permissions
3. Try using plain text format instead of Markdown

### Hidden files not showing

- Ensure you selected **"Yes — Include hidden files"** in the wizard
- Check that hidden file patterns aren't in `excludePatterns`

---

## 📈 Performance Tips

- **Large Projects**: First export may take 5-10 seconds on monorepos
- **Deep Nesting**: Use relative paths for cleaner output
- **Exclusions**: Add more patterns to `excludePatterns` for faster scans

---

## 🤝 Contributing

Found a bug? Have a feature request? Visit our **GitHub**:

🔗 **Repository**: https://github.com/Mrcoderv/WorkspaceTree

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature/my-feature`
5. Submit a pull request

**For development setup**, see [PUBLISHING.md](PUBLISHING.md).

---

## 📄 License

MIT License — See [LICENSE](LICENSE) for details.

**Copyright © 2026 Raghavvian**

---

## 🙏 Support

- **Issues**: https://github.com/Mrcoderv/WorkspaceTree/issues
- **Discussions**: https://github.com/Mrcoderv/WorkspaceTree/discussions

---

## 🎉 What's Next?

- ⭐️ Star us on GitHub if you find this useful!
- 📢 Share with your team
- 💬 Leave a review on VS Code Marketplace

**Happy exporting!** 🚀
