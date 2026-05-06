# Contributing to Interview Copilot AI

Thank you for your interest in contributing! We appreciate any help, whether it's fixing bugs, adding features, improving documentation, or reporting issues.

## How to Contribute

### 1. **Report a Bug**

Found an issue? Please create a GitHub issue with:
- A clear, descriptive title
- Detailed description of the bug
- Steps to reproduce
- Expected vs. actual behavior
- Your environment (OS, Node version, etc.)
- Screenshots if applicable

### 2. **Suggest a Feature**

Have an idea? Open a GitHub discussion or issue with:
- Clear description of the feature
- Why it would be useful
- Possible implementation approach (optional)

### 3. **Submit Code Changes**

#### Fork & Branch
```bash
# 1. Fork the repository on GitHub
# 2. Clone your fork locally
git clone https://github.com/YOUR_USERNAME/interview-copilot-ai-v1.git
cd interview-copilot-ai-v1

# 3. Add upstream remote
git remote add upstream https://github.com/ayushsinha008/interview-copilot-ai-v1.git

# 4. Create a feature branch
git checkout -b feature/your-feature-name
# or for bugfixes:
git checkout -b fix/bug-description
```

#### Make Changes
- Write clean, readable code
- Follow the existing code style
- Add comments for complex logic
- Update TypeScript types where needed

#### Commit Changes
```bash
# Use clear, descriptive commit messages
git commit -m "feat: add keyboard shortcut customization"
git commit -m "fix: resolve speech recognition timeout issue"
git commit -m "docs: update installation guide"
```

**Commit message format:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `perf:` - Performance improvements

#### Push & Create Pull Request
```bash
# Push to your fork
git push origin feature/your-feature-name

# Go to GitHub and create a Pull Request
# - Link related issues
# - Provide clear description of changes
# - List any breaking changes
```

---

## Development Guidelines

### Code Style

- **TypeScript**: Use strict mode, explicit types
- **React**: Functional components with hooks
- **Components**: Keep them small and focused
- **Naming**: Use descriptive names (camelCase for files, PascalCase for components)
- **Comments**: Document complex logic and edge cases

### Project Structure

- `/main` - Electron main process code
- `/renderer/components` - Reusable React components
- `/renderer/hooks` - Custom React hooks
- `/renderer/lib` - Utility functions
- `/renderer/types` - TypeScript type definitions

### Setting Up Development Environment

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open DevTools in Electron (Ctrl+Shift+I)
# 4. Check console for errors
```

### Testing Your Changes

- Test on your target OS (Windows/macOS/Linux)
- Verify speech recognition works
- Check API integration with OpenAI
- Test settings persistence
- Verify keyboard shortcuts
- Check window dragging/resizing

### Building for Release

```bash
npm run build
# Creates distributable in release/ folder
```

---

## Code Review Process

1. **Automated Checks**: GitHub Actions will run linting/building
2. **Review**: Maintainers will review your PR for:
   - Code quality and style
   - Functionality and correctness
   - Documentation completeness
   - No breaking changes without discussion
3. **Feedback**: Address any requested changes
4. **Approval & Merge**: Once approved, your PR will be merged

---

## Performance Tips

- Use React DevTools Profiler to identify bottlenecks
- Debounce API calls to avoid rate limiting
- Optimize re-renders with `useMemo` and `useCallback`
- Keep component tree shallow
- Monitor Electron main process CPU usage

---

## Documentation

When adding features or changing behavior:
- Update [README.md](README.md)
- Update [SETUP.md](SETUP.md) if setup changes
- Add code comments for complex logic
- Update TypeScript types
- Add examples if applicable

---

## Questions?

- 📖 Check [README.md](README.md) and [SETUP.md](SETUP.md)
- 💬 Open a GitHub Discussion
- 📧 Email: ayush.sinha008@gmail.com

---

## Code of Conduct

Be respectful, inclusive, and constructive. We want Interview Copilot AI to be a welcoming community for all contributors.

---

**Thank you for contributing to Interview Copilot AI! 🙏**
