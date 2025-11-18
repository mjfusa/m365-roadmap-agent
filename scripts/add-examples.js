/**
 * Post-process OpenAPI to add parameter examples
 * TypeSpec doesn't natively support parameter examples, so we add them here
 */

const fs = require('fs');
const path = require('path');

const OPENAPI_PATH = path.join(__dirname, '../appPackage/apiSpecificationFile/roadmap-openapi.json');

const parameterExamples = {
  FilterParameter: {
    teams_items: {
      summary: "Teams items",
      description: "Find roadmap items containing 'teams' in title",
      value: "contains(tolower(title), 'teams')"
    },
    recent_items: {
      summary: "Recent items (last 30 days)",
      description: "Items created in the last 30 days",
      value: "created ge 2025-09-21T00:00:00Z"
    },
    desktop_platform: {
      summary: "Desktop platform items",
      description: "Items available on desktop platform",
      value: "platforms/any(p: p eq 'Desktop')"
    },
    availability_2026: {
      summary: "Items available in 2026",
      description: "Items with availability in 2026",
      value: "availabilities/any(a: a/year eq 2026)"
    },
    complex_filter: {
      summary: "Complex multi-criteria filter",
      description: "Teams items on desktop available in 2026",
      value: "contains(tolower(title), 'teams') and platforms/any(p: p eq 'Desktop') and availabilities/any(a: a/year eq 2026)"
    },
    major_change_variations: {
      summary: "Find roadmap items that are major changes",
      description: "Find roadmap items that are major changes using various keywords",
      value: "contains(tolower(title), 'major') or contains(tolower(title), 'breaking') or contains(tolower(description), 'major change') or contains(tolower(description), 'significant update')"
    },
    complex_date_range: {
      summary: "Complex multi-month date range filter",
      description: "Items available in November-December 2025 or January 2026",
      value: "(availabilities/any(a: a/year eq 2025 and (a/month eq 'November' or a/month eq 'December')) or availabilities/any(a: a/year eq 2026 and a/month eq 'January'))"
    },
    full_complex_example: {
      summary: "Complete example with products, keywords, and date range",
      description: "SharePoint/Viva/admin items mentioning 'agent' available November 2025 - January 2026",
      value: "(products/any(p: contains(tolower(p), 'sharepoint')) or products/any(p: contains(tolower(p), 'viva')) or products/any(p: contains(tolower(p), 'admin'))) and contains(tolower(description), 'agent') and (availabilities/any(a: a/year eq 2025 and (a/month eq 'November' or a/month eq 'December')) or availabilities/any(a: a/year eq 2026 and a/month eq 'January'))"
    }
  },
  OrderByParameter: {
    newest_first: {
      summary: "Newest items first",
      description: "Order by creation date, newest first",
      value: "created desc"
    },
    oldest_first: {
      summary: "Oldest items first",
      description: "Order by creation date, oldest first",
      value: "created asc"
    },
    title_alphabetical: {
      summary: "Alphabetical by title",
      description: "Order alphabetically by title",
      value: "title asc"
    }
  }
};

const responseExamples = {
  copilot_items: {
    summary: "Recent Copilot roadmap items",
    description: "Example response for Copilot items from the last week",
    value: {
      value: [
        {
          id: 476488,
          title: "Microsoft Teams: Ability to separate out the Townhall attendee invites",
          created: "2025-01-23T00:15:18.0000000Z",
          description: "This backend change will now address the 'separation of attendee' invites from the events crew.",
          cloudInstances: ["Worldwide (Standard Multi-Tenant)", "GCC"],
          platforms: ["Desktop", "Mac"],
          releaseRings: ["General Availability", "Targeted Release"],
          products: ["Microsoft Teams"],
          status: "In development",
          generalAvailabilityDate: "2026-03",
          availabilities: [
            {
              ring: "General Availability",
              year: 2026,
              month: "March"
            }
          ]
        }
      ],
      "@odata.count": 1,
      "@odata.nextLink": null
    }
  }
};

function addExamples() {
  console.log('📝 Adding examples to OpenAPI specification...\n');
  
  if (!fs.existsSync(OPENAPI_PATH)) {
    console.error(`❌ OpenAPI file not found: ${OPENAPI_PATH}`);
    process.exit(1);
  }
  
  let openapi = JSON.parse(fs.readFileSync(OPENAPI_PATH, 'utf8'));
  
  // Add parameter examples
  if (openapi.components && openapi.components.parameters) {
    for (const [paramName, examples] of Object.entries(parameterExamples)) {
      if (openapi.components.parameters[paramName]) {
        openapi.components.parameters[paramName].examples = examples;
        console.log(`✅ Added examples to ${paramName}`);
      }
    }
  }
  
  // Add response examples
  if (openapi.paths && openapi.paths['/m365'] && openapi.paths['/m365'].get) {
    const response200 = openapi.paths['/m365'].get.responses['200'];
    if (response200 && response200.content && response200.content['application/json']) {
      response200.content['application/json'].examples = responseExamples;
      console.log(`✅ Added examples to /m365 GET response`);
    }
  }
  
  // Write back
  fs.writeFileSync(OPENAPI_PATH, JSON.stringify(openapi, null, 2));
  console.log(`\n✅ Successfully updated ${OPENAPI_PATH}`);
}

addExamples();
