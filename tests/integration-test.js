/**
 * Comprehensive End-to-End TypeSpec Integration Test
 * Validates the entire TypeSpec compilation pipeline
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const OPENAPI_PATH = path.join(__dirname, '../appPackage/apiSpecificationFile/roadmap-openapi.json');
const ORIGINAL_PATH = path.join(__dirname, '../appPackage/apiSpecificationFile/archive/roadmap-openapi.original.json');

console.log('🧪 Running Comprehensive TypeSpec Integration Tests\n');
console.log('='.repeat(60));

let testsPassed = 0;
let testsFailed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
    testsPassed++;
  } catch (error) {
    console.log(`❌ ${name}`);
    console.log(`   Error: ${error.message}`);
    testsFailed++;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

// Test 1: TypeSpec files exist
test('TypeSpec source files exist', () => {
  const files = [
    '../tsp/main.tsp',
    '../tsp/tspconfig.yaml',
    '../tsp/models/roadmap-item.tsp',
    '../tsp/models/responses.tsp',
    '../tsp/models/errors.tsp',
    '../tsp/routes/roadmap.tsp',
    '../tsp/parameters/odata.tsp'
  ];
  
  files.forEach(file => {
    const filePath = path.join(__dirname, file);
    assert(fs.existsSync(filePath), `File ${file} does not exist`);
  });
});

// Test 2: Generated OpenAPI exists and is valid JSON
test('Generated OpenAPI file exists and is valid JSON', () => {
  assert(fs.existsSync(OPENAPI_PATH), 'Generated OpenAPI not found');
  const content = fs.readFileSync(OPENAPI_PATH, 'utf8');
  const openapi = JSON.parse(content); // Will throw if invalid JSON
  assert(openapi, 'OpenAPI is empty');
});

// Test 3: OpenAPI structure validation
test('OpenAPI has correct structure', () => {
  const openapi = JSON.parse(fs.readFileSync(OPENAPI_PATH, 'utf8'));
  
  assert(openapi.openapi === '3.0.1', 'OpenAPI version incorrect');
  assert(openapi.info, 'Missing info section');
  assert(openapi.info.title === 'Microsoft 365 Roadmap API', 'Incorrect title');
  assert(openapi.info.version === 'v2', 'Incorrect version');
  assert(openapi.info.contact, 'Missing contact info');
  assert(openapi.servers && openapi.servers.length > 0, 'Missing servers');
  assert(openapi.paths, 'Missing paths');
  assert(openapi.components, 'Missing components');
});

// Test 4: Required schemas exist
test('All required schemas are present', () => {
  const openapi = JSON.parse(fs.readFileSync(OPENAPI_PATH, 'utf8'));
  const schemas = openapi.components.schemas;
  
  const requiredSchemas = ['RoadmapItem', 'RoadmapResponse', 'ErrorResponse'];
  requiredSchemas.forEach(schema => {
    assert(schemas[schema], `Schema ${schema} missing`);
  });
});

// Test 5: RoadmapItem schema validation
test('RoadmapItem schema is correct', () => {
  const openapi = JSON.parse(fs.readFileSync(OPENAPI_PATH, 'utf8'));
  const roadmapItem = openapi.components.schemas.RoadmapItem;
  
  assert(roadmapItem.type === 'object', 'RoadmapItem not an object');
  assert(roadmapItem.required, 'RoadmapItem missing required fields');
  assert(roadmapItem.required.includes('id'), 'Missing id in required');
  assert(roadmapItem.required.includes('title'), 'Missing title in required');
  assert(roadmapItem.required.includes('created'), 'Missing created in required');
  assert(roadmapItem.required.includes('description'), 'Missing description in required');
  assert(roadmapItem.required.includes('status'), 'Missing status in required');
  
  // Check specific fields
  assert(roadmapItem.properties.id, 'Missing id property');
  assert(roadmapItem.properties.title, 'Missing title property');
  assert(roadmapItem.properties.created, 'Missing created property');
  assert(roadmapItem.properties.status, 'Missing status property');
  assert(roadmapItem.properties.status.enum, 'Status missing enum values');
});

// Test 6: Parameters validation
test('All OData parameters are present', () => {
  const openapi = JSON.parse(fs.readFileSync(OPENAPI_PATH, 'utf8'));
  const parameters = openapi.components.parameters;
  
  const requiredParams = ['FilterParameter', 'OrderByParameter', 'TopParameter', 'SkipParameter', 'CountParameter'];
  requiredParams.forEach(param => {
    assert(parameters[param], `Parameter ${param} missing`);
    assert(parameters[param].name, `Parameter ${param} missing name`);
    assert(parameters[param].in === 'query', `Parameter ${param} not a query param`);
  });
});

// Test 7: Parameter examples validation
test('Parameter examples are present', () => {
  const openapi = JSON.parse(fs.readFileSync(OPENAPI_PATH, 'utf8'));
  
  const filterParam = openapi.components.parameters.FilterParameter;
  assert(filterParam.examples, 'FilterParameter missing examples');
  assert(Object.keys(filterParam.examples).length >= 5, 'FilterParameter has too few examples');
  
  const orderbyParam = openapi.components.parameters.OrderByParameter;
  assert(orderbyParam.examples, 'OrderByParameter missing examples');
  assert(Object.keys(orderbyParam.examples).length >= 3, 'OrderByParameter has too few examples');
});

// Test 8: Endpoint validation
test('GET /m365 endpoint is correctly defined', () => {
  const openapi = JSON.parse(fs.readFileSync(OPENAPI_PATH, 'utf8'));
  
  assert(openapi.paths['/m365'], 'Missing /m365 path');
  assert(openapi.paths['/m365'].get, 'Missing GET operation');
  
  const getOp = openapi.paths['/m365'].get;
  assert(getOp.operationId === 'getM365RoadmapInfo', 'Incorrect operationId');
  assert(getOp.summary, 'Missing summary');
  assert(getOp.description, 'Missing description');
  assert(getOp.parameters, 'Missing parameters');
  assert(getOp.parameters.length >= 5, 'Too few parameters');
  assert(getOp.responses, 'Missing responses');
  assert(getOp.responses['200'], 'Missing 200 response');
  assert(getOp.responses['400'], 'Missing 400 response');
  assert(getOp.responses['500'], 'Missing 500 response');
});

// Test 9: Response examples validation
test('Response examples are present', () => {
  const openapi = JSON.parse(fs.readFileSync(OPENAPI_PATH, 'utf8'));
  
  const response200 = openapi.paths['/m365'].get.responses['200'];
  assert(response200.content, 'Missing content in 200 response');
  assert(response200.content['application/json'], 'Missing application/json content type');
  assert(response200.content['application/json'].examples, 'Missing examples in response');
});

// Test 10: Availability nested model validation
test('Availability nested model is correct', () => {
  const openapi = JSON.parse(fs.readFileSync(OPENAPI_PATH, 'utf8'));
  const roadmapItem = openapi.components.schemas.RoadmapItem;
  
  assert(roadmapItem.properties.availabilities, 'Missing availabilities property');
  assert(roadmapItem.properties.availabilities.type === 'array', 'Availabilities not an array');
  assert(roadmapItem.properties.availabilities.items, 'Missing items in availabilities');
  
  const availability = roadmapItem.properties.availabilities.items;
  assert(availability.properties.ring, 'Missing ring in availability');
  assert(availability.properties.year, 'Missing year in availability');
  assert(availability.properties.month, 'Missing month in availability');
  assert(availability.properties.year.minimum === 2020, 'Year minimum not 2020');
  assert(availability.properties.year.maximum === 2030, 'Year maximum not 2030');
});

// Test 11: Build scripts validation
test('Package.json has correct scripts', () => {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
  
  assert(packageJson.scripts['tsp:compile'], 'Missing tsp:compile script');
  assert(packageJson.scripts.test, 'Missing test script');
  assert(packageJson.scripts.build, 'Missing build script');
  assert(packageJson.scripts['tsp:format'], 'Missing tsp:format script');
});

// Test 12: Dependencies validation
test('Package.json has TypeSpec dependencies', () => {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
  
  assert(packageJson.devDependencies['@typespec/compiler'], 'Missing @typespec/compiler');
  assert(packageJson.devDependencies['@typespec/http'], 'Missing @typespec/http');
  assert(packageJson.devDependencies['@typespec/openapi3'], 'Missing @typespec/openapi3');
  assert(packageJson.devDependencies['@typespec/rest'], 'Missing @typespec/rest');
});

// Test 13: Comparison with original (if exists)
if (fs.existsSync(ORIGINAL_PATH)) {
  test('Generated OpenAPI matches original structure', () => {
    const generated = JSON.parse(fs.readFileSync(OPENAPI_PATH, 'utf8'));
    const original = JSON.parse(fs.readFileSync(ORIGINAL_PATH, 'utf8'));
    
    // Compare key structural elements
    assert(generated.openapi === original.openapi, 'OpenAPI version changed');
    assert(generated.info.title === original.info.title, 'Title changed');
    
    const genPaths = Object.keys(generated.paths).sort();
    const origPaths = Object.keys(original.paths).sort();
    assert(JSON.stringify(genPaths) === JSON.stringify(origPaths), 'Paths changed');
    
    const genSchemas = Object.keys(generated.components.schemas).sort();
    const origSchemas = Object.keys(original.components.schemas).sort();
    assert(JSON.stringify(genSchemas) === JSON.stringify(origSchemas), 'Schemas changed');
  });
}

// Test 14: Post-processing scripts exist
test('Post-processing scripts exist', () => {
  const scripts = [
    '../scripts/fix-metadata.js',
    '../scripts/add-examples.js'
  ];
  
  scripts.forEach(script => {
    const scriptPath = path.join(__dirname, script);
    assert(fs.existsSync(scriptPath), `Script ${script} does not exist`);
  });
});

// Test 15: Documentation exists
test('Documentation files exist', () => {
  const docs = [
    '../docs/TYPESPEC_GUIDE.md',
    '../docs/MIGRATION_SUMMARY.md'
  ];
  
  docs.forEach(doc => {
    const docPath = path.join(__dirname, doc);
    assert(fs.existsSync(docPath), `Documentation ${doc} does not exist`);
  });
});

// Summary
console.log('\n' + '='.repeat(60));
console.log(`\n📊 Test Results:`);
console.log(`   ✅ Passed: ${testsPassed}`);
console.log(`   ❌ Failed: ${testsFailed}`);
console.log(`   📈 Success Rate: ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1)}%`);

if (testsFailed === 0) {
  console.log('\n🎉 All integration tests passed!');
  console.log('✨ TypeSpec implementation is fully functional\n');
  process.exit(0);
} else {
  console.log(`\n⚠️  ${testsFailed} test(s) failed`);
  console.log('Please review the errors above\n');
  process.exit(1);
}
