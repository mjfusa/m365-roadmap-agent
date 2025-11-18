/**
 * OpenAPI Validation Test
 * Compares generated OpenAPI spec with original to ensure critical fields are preserved
 */

const fs = require('fs');
const path = require('path');

const GENERATED_PATH = path.join(__dirname, '../appPackage/apiSpecificationFile/roadmap-openapi.json');
const ORIGINAL_PATH = path.join(__dirname, '../appPackage/apiSpecificationFile/archive/roadmap-openapi.original.json');

function deepCompare(obj1, obj2, path = '') {
  const issues = [];
  
  // Check if types match
  if (typeof obj1 !== typeof obj2) {
    issues.push(`Type mismatch at ${path}: ${typeof obj1} vs ${typeof obj2}`);
    return issues;
  }
  
  // Handle null
  if (obj1 === null || obj2 === null) {
    if (obj1 !== obj2) {
      issues.push(`Null mismatch at ${path}`);
    }
    return issues;
  }
  
  // Handle arrays
  if (Array.isArray(obj1)) {
    if (!Array.isArray(obj2)) {
      issues.push(`Array mismatch at ${path}`);
      return issues;
    }
    if (obj1.length !== obj2.length) {
      issues.push(`Array length mismatch at ${path}: ${obj1.length} vs ${obj2.length}`);
    }
    return issues;
  }
  
  // Handle objects
  if (typeof obj1 === 'object') {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    
    // Check for missing keys
    const missingInGenerated = keys2.filter(k => !keys1.includes(k));
    const extraInGenerated = keys1.filter(k => !keys2.includes(k));
    
    if (missingInGenerated.length > 0) {
      issues.push(`Missing keys at ${path}: ${missingInGenerated.join(', ')}`);
    }
    
    if (extraInGenerated.length > 0) {
      issues.push(`Extra keys at ${path}: ${extraInGenerated.join(', ')}`);
    }
    
    // Recursively compare common keys
    const commonKeys = keys1.filter(k => keys2.includes(k));
    for (const key of commonKeys) {
      const newPath = path ? `${path}.${key}` : key;
      issues.push(...deepCompare(obj1[key], obj2[key], newPath));
    }
  }
  
  return issues;
}

function validateCriticalFields(generated, original) {
  const criticalChecks = [];
  
  // Check OpenAPI version
  if (generated.openapi !== original.openapi) {
    criticalChecks.push(`❌ OpenAPI version mismatch: ${generated.openapi} vs ${original.openapi}`);
  } else {
    criticalChecks.push(`✅ OpenAPI version: ${generated.openapi}`);
  }
  
  // Check info section
  if (generated.info?.title === original.info?.title) {
    criticalChecks.push(`✅ Title preserved: ${generated.info.title}`);
  } else {
    criticalChecks.push(`❌ Title mismatch`);
  }
  
  if (generated.info?.version === original.info?.version) {
    criticalChecks.push(`✅ Version preserved: ${generated.info.version}`);
  } else {
    criticalChecks.push(`❌ Version mismatch`);
  }
  
  // Check paths
  const originalPaths = Object.keys(original.paths || {});
  const generatedPaths = Object.keys(generated.paths || {});
  
  if (JSON.stringify(originalPaths.sort()) === JSON.stringify(generatedPaths.sort())) {
    criticalChecks.push(`✅ All paths preserved: ${originalPaths.join(', ')}`);
  } else {
    criticalChecks.push(`❌ Path mismatch`);
  }
  
  // Check schemas
  const originalSchemas = Object.keys(original.components?.schemas || {});
  const generatedSchemas = Object.keys(generated.components?.schemas || {});
  
  if (JSON.stringify(originalSchemas.sort()) === JSON.stringify(generatedSchemas.sort())) {
    criticalChecks.push(`✅ All schemas preserved: ${originalSchemas.join(', ')}`);
  } else {
    criticalChecks.push(`❌ Schema mismatch`);
    criticalChecks.push(`  Original: ${originalSchemas.join(', ')}`);
    criticalChecks.push(`  Generated: ${generatedSchemas.join(', ')}`);
  }
  
  // Check parameters
  const originalParams = Object.keys(original.components?.parameters || {});
  const generatedParams = Object.keys(generated.components?.parameters || {});
  
  if (JSON.stringify(originalParams.sort()) === JSON.stringify(generatedParams.sort())) {
    criticalChecks.push(`✅ All parameters preserved: ${originalParams.join(', ')}`);
  } else {
    criticalChecks.push(`❌ Parameter mismatch`);
  }
  
  // Check RoadmapItem required fields
  const originalRequired = original.components?.schemas?.RoadmapItem?.required || [];
  const generatedRequired = generated.components?.schemas?.RoadmapItem?.required || [];
  
  if (JSON.stringify(originalRequired.sort()) === JSON.stringify(generatedRequired.sort())) {
    criticalChecks.push(`✅ RoadmapItem required fields preserved: ${originalRequired.join(', ')}`);
  } else {
    criticalChecks.push(`❌ RoadmapItem required fields mismatch`);
    criticalChecks.push(`  Original: ${originalRequired.join(', ')}`);
    criticalChecks.push(`  Generated: ${generatedRequired.join(', ')}`);
  }
  
  return criticalChecks;
}

function main() {
  console.log('🔍 Validating Generated OpenAPI Specification\n');
  console.log('='.repeat(60));
  
  // Check if files exist
  if (!fs.existsSync(GENERATED_PATH)) {
    console.error(`❌ Generated file not found: ${GENERATED_PATH}`);
    console.error('   Run "npm run tsp:compile" first');
    process.exit(1);
  }
  
  if (!fs.existsSync(ORIGINAL_PATH)) {
    console.error(`⚠️  Original file not found: ${ORIGINAL_PATH}`);
    console.error('   Skipping comparison test');
    process.exit(0);
  }
  
  // Load JSON files
  let generated, original;
  
  try {
    generated = JSON.parse(fs.readFileSync(GENERATED_PATH, 'utf8'));
    original = JSON.parse(fs.readFileSync(ORIGINAL_PATH, 'utf8'));
  } catch (error) {
    console.error(`❌ Error parsing JSON: ${error.message}`);
    process.exit(1);
  }
  
  console.log('\n📋 Critical Field Validation:\n');
  const criticalChecks = validateCriticalFields(generated, original);
  criticalChecks.forEach(check => console.log(check));
  
  console.log('\n' + '='.repeat(60));
  
  const failedCritical = criticalChecks.filter(c => c.startsWith('❌'));
  
  if (failedCritical.length > 0) {
    console.log(`\n❌ Validation FAILED: ${failedCritical.length} critical issue(s) found`);
    process.exit(1);
  } else {
    console.log('\n✅ Validation PASSED: All critical fields preserved');
    console.log('\n💡 TypeSpec migration successful!');
    process.exit(0);
  }
}

main();
