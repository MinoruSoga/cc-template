---
paths: "**/*.{ts,tsx,js,jsx}"
---

# Code Style Rules

## Naming Conventions

- Variables/Functions: camelCase
- Classes/Components: PascalCase
- Constants: UPPER_SNAKE_CASE
- Files: kebab-case (components: PascalCase)

## Import Order

1. React/Framework imports
2. External libraries
3. Internal modules (@/)
4. Relative imports
5. Type imports

## Prohibited

- `any` type usage
- Unused imports
- `console.log` in production code
- Hardcoded values (use env vars or constants)
