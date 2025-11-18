# TypeSpec Quick Reference

## Common Commands

```bash
# Compile TypeSpec to OpenAPI
npm run tsp:compile

# Watch mode (auto-recompile on changes)
npm run tsp:watch

# Format TypeSpec files
npm run tsp:format

# Run validation tests
npm test

# Run integration tests
npm run test:integration

# Run all tests
npm run test:all

# Full build (includes compilation)
npm run build
```

## Project Structure

```
tsp/
├── main.tsp              # Entry point & service config
├── models/               # Data models
│   ├── roadmap-item.tsp
│   ├── responses.tsp
│   └── errors.tsp
├── routes/               # API endpoints
│   └── roadmap.tsp
└── parameters/           # Reusable parameters
    └── odata.tsp
```

## TypeSpec Basics

### Model Definition

```typespec
model MyModel {
  /** Field documentation appears in OpenAPI */
  requiredField: string;
  
  /** Optional field */
  optionalField?: int32;
  
  /** Field with default */
  fieldWithDefault: boolean = true;
}
```

### Common Types

| TypeSpec | OpenAPI | Description |
|----------|---------|-------------|
| `string` | string | Text value |
| `int32` | integer | 32-bit integer |
| `boolean` | boolean | True/false |
| `utcDateTime` | string (date-time) | ISO 8601 datetime |
| `url` | string (uri) | URL string |
| `string[]` | array of strings | Array type |
| `"A" \| "B"` | enum | Union type / enum |

### Useful Decorators

```typespec
@doc("Description")              // Add documentation
@minValue(1)                     // Minimum value
@maxValue(100)                   // Maximum value
@pattern("^\\d{4}-\\d{2}$")     // Regex pattern
@query                           // Query parameter
@route("/path")                  // URL path
@get                             // HTTP GET
@statusCode statusCode: 200      // HTTP status code
```

### Define an Endpoint

```typespec
@route("/my-endpoint")
interface MyOperations {
  @get
  @route("")
  getItems(
    ...QueryParameters
  ): {
    @statusCode statusCode: 200;
    @body body: MyResponse;
  } | {
    @statusCode statusCode: 400;
    @body body: ErrorResponse;
  };
}
```

## Making Changes

### Add a Field to RoadmapItem

1. Edit `tsp/models/roadmap-item.tsp`
2. Add field:
   ```typespec
   /** New field description */
   newField?: string;
   ```
3. Compile: `npm run tsp:compile`
4. Test: `npm test`

### Add a Query Parameter

1. Edit `tsp/parameters/odata.tsp`
2. Add model:
   ```typespec
   model MyParameter {
     @query
     $myParam?: string;
   }
   ```
3. Use in route:
   ```typespec
   operation(...MyParameter)
   ```
4. Compile & test

### Add Response Example

1. Edit `scripts/add-examples.js`
2. Add to `responseExamples`:
   ```javascript
   my_example: {
     summary: "Example title",
     description: "Example description",
     value: { /* data */ }
   }
   ```
3. Compile to apply

## Troubleshooting

### Compilation Errors

```bash
# View detailed errors
npm run tsp:compile 2>&1 | more
```

Common fixes:
- Check syntax (missing semicolons, brackets)
- Verify imports at top of file
- Ensure decorators are valid for target
- Check type compatibility

### Generated File Issues

1. Clear and rebuild:
   ```bash
   Remove-Item tsp-output -Recurse -Force
   npm run build
   ```

2. Compare with original:
   ```bash
   # Original backup
   appPackage/apiSpecificationFile/archive/roadmap-openapi.original.json
   
   # Generated
   appPackage/apiSpecificationFile/roadmap-openapi.json
   ```

### Tests Failing

```bash
# Run individual tests
npm test                    # Validation test
npm run test:integration    # Integration test

# Check what changed
git diff appPackage/apiSpecificationFile/roadmap-openapi.json
```

## File Locations

| File Type | Location |
|-----------|----------|
| TypeSpec source | `tsp/` |
| Generated OpenAPI | `appPackage/apiSpecificationFile/roadmap-openapi.json` |
| Original backup | `appPackage/apiSpecificationFile/archive/` |
| Scripts | `scripts/` |
| Tests | `tests/` |
| Documentation | `docs/` |

## Best Practices

✅ **DO**
- Document all models and fields
- Run tests after changes
- Format code with `npm run tsp:format`
- Commit both TypeSpec and generated OpenAPI
- Use specific types (not just `string`)
- Keep models modular

❌ **DON'T**
- Edit generated OpenAPI directly
- Skip validation tests
- Use overly generic types
- Forget to compile after changes
- Commit without running tests

## Help Resources

- **Full Guide**: [docs/TYPESPEC_GUIDE.md](../docs/TYPESPEC_GUIDE.md)
- **Migration Info**: [docs/MIGRATION_SUMMARY.md](../docs/MIGRATION_SUMMARY.md)
- **TypeSpec Docs**: https://microsoft.github.io/typespec/
- **OpenAPI Spec**: https://swagger.io/specification/

## Quick Workflow

1. **Edit** TypeSpec in `tsp/`
2. **Compile** with `npm run tsp:compile`
3. **Test** with `npm test`
4. **Review** generated OpenAPI
5. **Commit** changes

---

*For detailed information, see [TYPESPEC_GUIDE.md](TYPESPEC_GUIDE.md)*
