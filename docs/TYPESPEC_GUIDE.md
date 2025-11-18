# TypeSpec Development Guide

## Overview

This project uses TypeSpec to define the API specification for the Microsoft 365 Roadmap API. TypeSpec provides a type-safe, maintainable way to define APIs that automatically generates OpenAPI specifications.

## Project Structure

```
tsp/
├── main.tsp                    # Main entry point with service configuration
├── tspconfig.yaml             # TypeSpec compiler configuration
├── models/                     # Data models
│   ├── roadmap-item.tsp       # RoadmapItem and Availability models
│   ├── responses.tsp          # RoadmapResponse model
│   └── errors.tsp             # Error models
├── routes/                     # API endpoints
│   └── roadmap.tsp            # GET /m365 endpoint definition
└── parameters/                 # Reusable parameters
    └── odata.tsp              # OData query parameters
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm

### Installation

Dependencies are already installed. If you need to reinstall:

```bash
npm install
```

### Compiling TypeSpec

To compile TypeSpec and generate the OpenAPI specification:

```bash
npm run tsp:compile
```

This command:
1. Compiles TypeSpec files to OpenAPI JSON
2. Fixes metadata (version, contact, operationId)
3. Adds parameter and response examples

### Development Workflow

1. **Make changes** to TypeSpec files in the `tsp/` directory
2. **Compile** using `npm run tsp:compile`
3. **Test** using `npm test` to validate the generated OpenAPI
4. **Commit** both TypeSpec source and generated OpenAPI

### Watch Mode

For active development, use watch mode:

```bash
npm run tsp:watch
```

This automatically recompiles TypeSpec when files change (note: doesn't run post-processing scripts).

### Formatting

Format TypeSpec files:

```bash
npm run tsp:format
```

## Making Changes

### Adding a New Field to RoadmapItem

1. Edit `tsp/models/roadmap-item.tsp`
2. Add the field with appropriate type and documentation:

```typespec
/** Description of the new field */
newField?: string;
```

3. Compile and test:

```bash
npm run tsp:compile
npm test
```

### Adding a New Endpoint

1. Edit `tsp/routes/roadmap.tsp` or create a new route file
2. Define the operation:

```typespec
@get
@route("/new-endpoint")
getNewEndpoint(): {
  @statusCode statusCode: 200;
  @body body: MyResponseModel;
};
```

3. Import the route file in `tsp/main.tsp`
4. Compile and test

### Modifying OData Parameters

1. Edit `tsp/parameters/odata.tsp`
2. Update the parameter model
3. If adding examples, also update `scripts/add-examples.js`
4. Compile and test

### Adding Response Examples

Examples are added via post-processing script for better control:

1. Edit `scripts/add-examples.js`
2. Add your example to `responseExamples`:

```javascript
my_example: {
  summary: "My Example",
  description: "Description of the example",
  value: {
    // example data
  }
}
```

3. Compile to apply changes

## TypeSpec Concepts

### Models

Models define data structures:

```typespec
model MyModel {
  /** Field documentation */
  fieldName: string;
  
  /** Optional field */
  optionalField?: int32;
  
  /** Field with constraints */
  @minValue(1)
  @maxValue(100)
  constrainedField: int32;
}
```

### Types

Common TypeSpec types:
- `string` - String value
- `int32`, `int64` - Integer numbers
- `float32`, `float64` - Floating point numbers
- `boolean` - True/false
- `utcDateTime` - ISO 8601 date-time
- `url` - URL string
- Arrays: `string[]`
- Unions: `"value1" | "value2"`

### Decorators

Decorators add metadata:

- `@doc("description")` - Add documentation
- `@minValue(n)` - Minimum value constraint
- `@maxValue(n)` - Maximum value constraint
- `@pattern("regex")` - Regex pattern
- `@query` - Mark as query parameter
- `@route("/path")` - Define route path
- `@get`, `@post`, etc. - HTTP methods
- `@statusCode` - HTTP status code

### Spreading Parameters

Use `...` to spread model properties as parameters:

```typespec
operation getItems(
  ...FilterParameter,
  ...PaginationParameters
): Response;
```

## Testing

### Validation Test

The validation test compares generated OpenAPI with the original:

```bash
npm test
```

It checks:
- OpenAPI version
- Service metadata (title, version, contact)
- All paths preserved
- All schemas preserved
- All parameters preserved
- Required fields preserved

### Manual Testing

1. Review the generated file:
   ```
   appPackage/apiSpecificationFile/roadmap-openapi.json
   ```

2. Compare with archived original:
   ```
   appPackage/apiSpecificationFile/archive/roadmap-openapi.original.json
   ```

3. Use OpenAPI tools to validate:
   - Swagger Editor: https://editor.swagger.io/
   - OpenAPI validators

## Troubleshooting

### TypeSpec Won't Compile

Check for errors in the TypeSpec output:
```bash
npm run tsp:compile 2>&1 | more
```

Common issues:
- Missing imports
- Incorrect decorator usage
- Type mismatches
- Syntax errors

### Generated OpenAPI is Missing Fields

1. Check if TypeSpec emitted the field:
   - Look at the raw TypeSpec output before post-processing
   
2. Check post-processing scripts:
   - `scripts/fix-metadata.js` - For metadata
   - `scripts/add-examples.js` - For examples

3. Verify tspconfig.yaml settings

### Examples Not Showing

Examples are added by post-processing. Check:
1. `scripts/add-examples.js` has the examples
2. The script runs after TypeSpec compilation
3. No errors in the script execution

## Best Practices

1. **Document everything** - Use `/** */` comments for all models, fields, and operations
2. **Be specific with types** - Use unions for enums, constrain numbers with minValue/maxValue
3. **Keep models modular** - Separate concerns (models, routes, parameters)
4. **Test after changes** - Always run `npm test` after modifications
5. **Format code** - Use `npm run tsp:format` regularly
6. **Commit both** - Always commit both TypeSpec source and generated OpenAPI

## Resources

- [TypeSpec Documentation](https://microsoft.github.io/typespec/)
- [TypeSpec HTTP Library](https://microsoft.github.io/typespec/standard-library/http)
- [TypeSpec OpenAPI Emitter](https://microsoft.github.io/typespec/emitters/openapi3/reference)
- [OpenAPI Specification](https://swagger.io/specification/)

## Support

For questions or issues:
1. Check TypeSpec documentation
2. Review this guide
3. Examine existing TypeSpec files for patterns
4. Create an issue in the repository
