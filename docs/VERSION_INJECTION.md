# Version Injection System

## Overview

The M365 Roadmap Agent now uses a **build-time version injection system** to ensure that troubleshooting information always displays current version numbers from the source JSON files.

## How It Works

### 1. Placeholders in Source Files

The `appPackage/instructions.md` file uses placeholders that get replaced during the build process:

```markdown
**Version:** Manifest {{MANIFEST_VERSION}} | Schema {{DECLARATIVE_AGENT_SCHEMA}} | Plugin {{PLUGIN_SCHEMA}}
```

### 2. Version Sources

The script reads version numbers from these files:

- **Manifest Version**: `appPackage/manifest.json` → `version` field
- **Declarative Agent Schema**: `appPackage/declarativeAgent.json` → `version` field
- **Plugin Schema**: `appPackage/ai-plugin.json` → `schema_version` field

### 3. Build Process

The `scripts/inject-versions.js` script:

1. Reads version numbers from source JSON files
2. Replaces placeholders in the build files:
   - `appPackage/build/declarativeAgent.dev.json`
   - `appPackage/build/declarativeAgent.production.json`
3. Updates the embedded instructions with actual version numbers

### 4. Build Commands

The version injection runs automatically during build:

```bash
# Run version injection manually
npm run inject-versions

# Full build (includes version injection)
npm run build

# TypeSpec compilation + version injection
npm run tsp:compile && npm run inject-versions
```

## Updating Versions

When you update version numbers in any of the source files:

1. **Update the version in the source file** (e.g., `manifest.json`)
2. **Run the build process** to inject the new version:
   ```bash
   npm run inject-versions
   ```
3. **The troubleshooting info will automatically reflect the new version**

## Example

**Before injection (instructions.md):**
```
**Version:** Manifest {{MANIFEST_VERSION}} | Schema {{DECLARATIVE_AGENT_SCHEMA}} | Plugin {{PLUGIN_SCHEMA}}
```

**After injection (declarativeAgent.dev.json):**
```
**Version:** Manifest 1.1.5 | Schema v1.2 | Plugin v2.2
```

## Files Modified

- ✅ `appPackage/instructions.md` - Uses placeholders
- ✅ `appPackage/build/declarativeAgent.dev.json` - Gets injected versions
- ✅ `appPackage/build/declarativeAgent.production.json` - Gets injected versions
- ✅ `scripts/inject-versions.js` - Injection script
- ✅ `package.json` - Added `inject-versions` script to build process

## Benefits

1. **Always Accurate**: Troubleshooting info shows current versions
2. **Single Source of Truth**: Versions defined once in JSON files
3. **Automatic**: Runs during build, no manual updates needed
4. **Consistent**: Dev and production builds stay in sync
5. **Future-Proof**: Easy to update as versions change

## Troubleshooting

### Script doesn't run during build
Make sure `package.json` has the script configured:
```json
"prebuild": "npm run tsp:compile && npm run inject-versions",
"build": "npm run tsp:compile && npm run inject-versions"
```

### Versions not updating
1. Check that source JSON files have correct version fields
2. Run `npm run inject-versions` manually to see any errors
3. Verify build files exist in `appPackage/build/` directory

### Placeholders still visible
The placeholders should only be in `instructions.md` (the source template). The build files should have actual version numbers after running the injection script.
