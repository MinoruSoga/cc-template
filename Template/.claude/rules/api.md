---
paths: "**/*.{ts,tsx,js,jsx,py,go,rs}"
# paths をプロジェクトの API ディレクトリに合わせて変更してください
# 例: "src/api/**/*.ts", "app/api/**/*.py"
---

# API Development Rules

## Endpoint Design

- Use RESTful conventions
- Include input validation on all endpoints
- Return consistent error response format

## Error Response Format

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```

## Security

- Validate all user input
- Use parameterized queries (prevent SQL injection)
- Implement rate limiting
- Sanitize output (prevent XSS)

## Documentation

- Add OpenAPI/Swagger comments
- Document all request/response schemas
