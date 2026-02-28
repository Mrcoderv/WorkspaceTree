# Changelog

All notable changes to the WorkspaceTree extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] — 2026-02-28

### Added
- ✨ Initial release of WorkspaceTree extension
- 📋 One-command export: `Ctrl+Shift+P` → **WorkspaceTree: Export Directory Structure**
- 🗂️ Smart filtering for common build/dependency directories (`node_modules`, `.git`, `dist`, `out`, `.next`, `__pycache__`, `.DS_Store`)
- 📝 Two output formats: **Markdown** (with icons and code fences) and **Plain Text**
- 📂 Path format options: **Relative** names or **Full Absolute** paths
- 🔍 Hidden file control: Toggle inclusion of files/folders starting with `.`
- ⚡ Non-blocking async processing using `fs.promises`
- 📊 Real-time status bar feedback during scanning
- 🛡️ Error-resilient — Permission errors are logged, not thrown
- 📋 Output Channel for debug logging and diagnostics
- ⚙️ Configurable exclusion patterns via VS Code settings
- 🎯 Context menu integration in Explorer sidebar
- 📄 Comprehensive user documentation and development guide

### Technical
- Built with **TypeScript 5.3+**
- Targets **VS Code 1.85+**
- Uses native VS Code API
- Fully asynchronous architecture
- Recursive tree generation with max-depth protection (50 levels)
- Cross-platform path handling (Windows/Unix)
- Source maps for debugging

### Documentation
- 📖 User-friendly **README.md**
- 🔧 Developer-focused **PUBLISHING.md**
- 🚀 One-click build script: `./build-vsix.sh`
- 📦 Optimized VSIX packaging with `.vscodeignore`

---

## Future Releases

### [1.1.0] — Planned
- [ ] Copy to clipboard confirmation dialog
- [ ] Performance metrics display
- [ ] Keyboard shortcut customization
- [ ] Custom delimiter options for plain text
- [ ] File size information in tree
- [ ] Symbol count display

### [2.0.0] — Future
- [ ] Multi-root workspace support
- [ ] Export to file instead of clipboard
- [ ] Tree filtering with regex patterns
- [ ] VSCode Webview for preview
- [ ] Custom tree styling/themes

---

## Notes

### Versioning
- **MAJOR**: Breaking changes to API or behavior
- **MINOR**: New features (backwards compatible)
- **PATCH**: Bug fixes and improvements

### Release Process
1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Test build: `npm run compile`
4. Create VSIX: `./build-vsix.sh`
5. Test locally: Install VSIX and verify
6. Commit and tag: `git tag v1.0.0`
7. Publish: `npm run publish`

---

## Support

For questions, issues, or feature requests:
- 🐛 **Issues**: https://github.com/Mrcoderv/WorkspaceTree/issues
- 💬 **Discussions**: https://github.com/Mrcoderv/WorkspaceTree/discussions
- 📧 **Contact**: See repository

---

**Last Updated**: February 28, 2026
