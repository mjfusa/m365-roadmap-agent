/**
 * Restore placeholders in instructions.md after build
 * This ensures the source file maintains placeholders for version control
 */

const fs = require('fs');
const path = require('path');

const INSTRUCTIONS_PATH = path.join(__dirname, '../appPackage/instructions.md');

function restorePlaceholders() {
  console.log('🔄 Restoring placeholders in instructions.md...\n');
  
  try {
    if (fs.existsSync(INSTRUCTIONS_PATH)) {
      let instructions = fs.readFileSync(INSTRUCTIONS_PATH, 'utf8');
      
      // Replace version numbers back with placeholders
      const restored = instructions
        .replace(/(\*\*Versions:\*\*\s+- App Manifest: )[\d.]+/g, '$1{{MANIFEST_VERSION}}')
        .replace(/(\*\*Versions:\*\*[\s\S]*?- Declarative Agent Schema: )v[\d.]+/g, '$1{{DECLARATIVE_AGENT_SCHEMA}}')
        .replace(/(\*\*Versions:\*\*[\s\S]*?- AI Plugin Schema: )v[\d.]+/g, '$1{{PLUGIN_SCHEMA}}');
      
      fs.writeFileSync(INSTRUCTIONS_PATH, restored, 'utf8');
      console.log('✅ Placeholders restored in instructions.md');
      console.log('ℹ️  Source file is ready for version control\n');
    } else {
      console.warn('⚠️  instructions.md not found');
    }
  } catch (error) {
    console.error(`❌ Error restoring placeholders: ${error.message}`);
    process.exit(1);
  }
}

restorePlaceholders();
