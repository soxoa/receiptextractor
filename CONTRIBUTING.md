# Contributing to ReceiptExtractor

Thank you for your interest in contributing to ReceiptExtractor! This document provides guidelines and instructions for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Follow the [SETUP.md](SETUP.md) guide to set up your development environment
4. Create a new branch for your feature or bugfix

## Development Workflow

### Branch Naming

- `feature/your-feature-name` - for new features
- `fix/bug-description` - for bug fixes
- `docs/documentation-update` - for documentation changes
- `refactor/code-improvement` - for code refactoring

### Commit Messages

Follow conventional commit format:

```
type(scope): description

[optional body]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(backend): add bulk invoice upload endpoint
fix(frontend): resolve dashboard loading spinner issue
docs(readme): update installation instructions
```

## Code Standards

### Backend (Node.js)

- Use ES6+ features
- Use async/await for asynchronous code
- Always use parameterized queries for database access
- Add JSDoc comments for functions
- Handle errors gracefully
- Log errors to console

### Frontend (Next.js/React)

- Use TypeScript for type safety
- Use functional components with hooks
- Follow React best practices
- Use Tailwind CSS for styling
- Keep components focused and reusable
- Add PropTypes or TypeScript interfaces

### General

- Follow existing code style
- Write clean, readable code
- Add comments for complex logic
- Update documentation when needed

## Testing

Before submitting a PR:

1. Test your changes locally
2. Ensure all existing functionality still works
3. Test edge cases
4. Verify mobile responsiveness (for frontend changes)

## Pull Request Process

1. Update the README.md or relevant documentation if needed
2. Ensure your code follows the style guidelines
3. Write a clear PR description explaining:
   - What changes you made
   - Why you made them
   - How to test them
4. Link any related issues
5. Request review from maintainers

## PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Testing
How to test these changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented if necessary)
```

## Reporting Bugs

Use GitHub Issues to report bugs. Include:

1. Clear, descriptive title
2. Steps to reproduce
3. Expected behavior
4. Actual behavior
5. Screenshots (if applicable)
6. Environment details (OS, browser, etc.)

## Suggesting Enhancements

Use GitHub Issues for feature requests. Include:

1. Clear description of the feature
2. Use case / problem it solves
3. Proposed solution (if you have one)
4. Any alternatives considered

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all.

### Our Standards

- Be respectful and inclusive
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards others

### Unacceptable Behavior

- Harassment or discriminatory language
- Trolling or insulting comments
- Publishing others' private information
- Other unprofessional conduct

## Questions?

Feel free to open a GitHub issue with your question or reach out to the maintainers.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to ReceiptExtractor! 🎉

