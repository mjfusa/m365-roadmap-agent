/**
 * Post-process OpenAPI to fix metadata
 * Adds version info and contact details
 */

const fs = require('fs');
const path = require('path');

const OPENAPI_PATH = path.join(__dirname, '../appPackage/apiSpecificationFile/roadmap-openapi.json');

function fixMetadata() {
  console.log('📝 Fixing OpenAPI metadata...\n');
  
  if (!fs.existsSync(OPENAPI_PATH)) {
    console.error(`❌ OpenAPI file not found: ${OPENAPI_PATH}`);
    process.exit(1);
  }
  
  let openapi = JSON.parse(fs.readFileSync(OPENAPI_PATH, 'utf8'));
  
  // Add version and contact info
  if (openapi.info) {
    openapi.info.version = "v2";
    openapi.info.contact = {
      name: "Microsoft 365 Roadmap",
      url: "https://www.microsoft.com/microsoft-365/roadmap"
    };
    console.log(`✅ Added version and contact info`);
  }
  
  // Add operationId
  if (openapi.paths && openapi.paths['/m365'] && openapi.paths['/m365'].get) {
    openapi.paths['/m365'].get.operationId = "getM365RoadmapInfo";
    console.log(`✅ Added operationId`);
  }
  
  // Write back
  fs.writeFileSync(OPENAPI_PATH, JSON.stringify(openapi, null, 2));
  console.log(`\n✅ Successfully updated ${OPENAPI_PATH}`);
}

fixMetadata();
