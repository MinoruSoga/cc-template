---
paths: "**/*.{test,spec}.{ts,tsx,js,jsx,py}"
---

# Testing Rules

## Test Structure

- Use `describe` for grouping related tests
- Use `it` or `test` for individual test cases
- Follow AAA pattern: Arrange, Act, Assert

## Naming

- Test files: `*.test.ts` or `*.spec.ts`
- Test descriptions: Start with "should"

## Coverage Requirements

- New features: Minimum 80% coverage
- Bug fixes: Add regression test

## Mocking

- Mock external dependencies
- Use dependency injection for testability
- Reset mocks in `beforeEach`
