---
paths: "src/api/**/*.ts"
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
