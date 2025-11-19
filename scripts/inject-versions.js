/**
 * Inject version numbers from JSON files into instructions.md and build files
 * This ensures troubleshooting info displays current versions
 */

const fs = require('fs');
const path = require('path');

// File paths
const MANIFEST_PATH = path.join(__dirname, '../appPackage/manifest.json');
const DECLARATIVE_AGENT_PATH = path.join(__dirname, '../appPackage/declarativeAgent.json');
const AI_PLUGIN_PATH = path.join(__dirname, '../appPackage/ai-plugin.json');
const INSTRUCTIONS_PATH = path.join(__dirname, '../appPackage/instructions.md');
const DEV_BUILD_PATH = path.join(__dirname, '../appPackage/build/declarativeAgent.dev.json');
const PROD_BUILD_PATH = path.join(__dirname, '../appPackage/build/declarativeAgent.production.json');

function injectVersions() {
  console.log('🔧 Injecting version numbers into instructions...\n');
  
  // Read version numbers from source files
  let manifestVersion = '1.0.0';
  let declarativeAgentSchema = 'v1.2';
  let pluginSchema = 'v2.2';
  
  try {
    // Read manifest version
    if (fs.existsSync(MANIFEST_PATH)) {
      const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
      manifestVersion = manifest.version || manifestVersion;
      console.log(`✅ Manifest version: ${manifestVersion}`);
    }
    
    // Read declarative agent schema version
    if (fs.existsSync(DECLARATIVE_AGENT_PATH)) {
      const declarativeAgent = JSON.parse(fs.readFileSync(DECLARATIVE_AGENT_PATH, 'utf8'));
      declarativeAgentSchema = declarativeAgent.version || declarativeAgentSchema;
      console.log(`✅ Declarative Agent schema: ${declarativeAgentSchema}`);
    }
    
    // Read plugin schema version
    if (fs.existsSync(AI_PLUGIN_PATH)) {
      const aiPlugin = JSON.parse(fs.readFileSync(AI_PLUGIN_PATH, 'utf8'));
      pluginSchema = aiPlugin.schema_version || pluginSchema;
      console.log(`✅ Plugin schema: ${pluginSchema}`);
    }
  } catch (error) {
    console.error(`❌ Error reading version files: ${error.message}`);
    process.exit(1);
  }
  
  // Function to replace placeholders in text
  function replacePlaceholders(text) {
    return text
      .replace(/\{\{MANIFEST_VERSION\}\}/g, manifestVersion)
      .replace(/\{\{DECLARATIVE_AGENT_SCHEMA\}\}/g, declarativeAgentSchema)
      .replace(/\{\{PLUGIN_SCHEMA\}\}/g, pluginSchema);
  }
  
  // Update instructions.md (source file - temporarily for build process)
  let originalInstructions = null;
  try {
    if (fs.existsSync(INSTRUCTIONS_PATH)) {
      originalInstructions = fs.readFileSync(INSTRUCTIONS_PATH, 'utf8');
      // Check if it has placeholders and replace them temporarily
      if (originalInstructions.includes('{{MANIFEST_VERSION}}')) {
        const updatedInstructions = replacePlaceholders(originalInstructions);
        fs.writeFileSync(INSTRUCTIONS_PATH, updatedInstructions, 'utf8');
        console.log(`✅ Temporarily updated instructions.md (source file)`);
        console.log(`ℹ️  Note: Source file will be restored after build`);
      }
    }
  } catch (error) {
    console.warn(`⚠️  Could not update instructions.md: ${error.message}`);
  }
  
  // Helper function to remove read-only attribute and update file
  function updateBuildFile(filePath, fileName) {
    try {
      if (fs.existsSync(filePath)) {
        // Remove read-only attribute if present (Windows)
        try {
          fs.chmodSync(filePath, 0o666);
        } catch (chmodError) {
          // Ignore chmod errors on non-Windows systems
        }
        
        let buildFile = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (buildFile.instructions) {
          buildFile.instructions = replacePlaceholders(buildFile.instructions);
          fs.writeFileSync(filePath, JSON.stringify(buildFile, null, 2));
          console.log(`✅ Updated ${fileName}`);
        }
      }
    } catch (error) {
      console.warn(`⚠️  Could not update ${fileName}: ${error.message}`);
    }
  }
  
  // Update dev build file
  updateBuildFile(DEV_BUILD_PATH, path.basename(DEV_BUILD_PATH));
  
  // Update production build file
  updateBuildFile(PROD_BUILD_PATH, path.basename(PROD_BUILD_PATH));
  
  console.log(`\n✅ Version injection complete!`);
  console.log(`   Manifest: ${manifestVersion}`);
  console.log(`   Schema: ${declarativeAgentSchema}`);
  console.log(`   Plugin: ${pluginSchema}`);
}

injectVersions();
