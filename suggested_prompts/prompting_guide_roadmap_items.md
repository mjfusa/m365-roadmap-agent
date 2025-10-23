# Prompting Guide for Microsoft 365 Roadmap Agent

Below are concise natural-language query patterns that can be used with the Microsoft 365 Roadmap Agent. Use these patterns as templates you can paste into the Roadmap Agent.

## Overview
- value[] (roadmap item object) — per-property patterns
  - **id**
    - Natural language: "Get roadmap item 12345" / "Show roadmap item with id 12345"
  - **title**
    - Natural language: "Roadmap items whose title contains 'Copilot'" / "Find items with 'Teams' in the title"
  - **created** / **targetDate**
    - Natural language: 
    - "Roadmap items from October 1, 2025 to October 15, 2025" / "Items created since October 1, 2025"
    - "Items with target date after December 1, 2025" / "Features releasing before November 2025"
  - **category**
    - Natural language: "Roadmap items in category 'Microsoft 365'" / "Show Microsoft Teams roadmap items" / "Power Platform features"
  - **status**
    - Natural language: "Show items in development" / "Only rolling out features" / "Preview status items"
  - **platforms** (array)
    - Natural language: "Features for Web platform" / "Mobile-supported roadmap items" / "Items supporting Desktop and Mobile"
    - Important phrasing: use "for platform" or "supporting" to target platform arrays.
  - **tags** (array)
    - Natural language: "Roadmap items tagged 'AI'" / "Show items tagged with 'Preview' or 'Beta'"
    - Important phrasing: use "tagged" or "with tag" in NL to target tags.
  - **description**
    - Natural language:
      - "Search description for 'artificial intelligence'" / "Items where description mentions 'security'"
  
- **Combined / compound queries**
  - Natural language: "Show the top 10 recent Copilot roadmap items in development created since October 1, 2025"
  - "Find Microsoft Teams features in preview status supporting mobile platforms"
  - "Power Platform items with target date before December 2025"

- **Pagination / next page**
  - Natural language: "Show more roadmap items" or "Show next page" or "Give me the next 10 items"

- **Sorting preferences**
  - Natural language: "Sort by newest first" / "Order by target date" / "Show alphabetically by title"

## Query Examples by Use Case

### **Recent Items**
- "Show roadmap items from the last week"
- "Recent Copilot features created since October 1, 2025"
- "What's new in the roadmap this month?"

### **Product-Specific Searches**
- "Microsoft Teams roadmap items"
- "SharePoint features in development"
- "Power Platform items rolling out"
- "Viva suite roadmap updates"

### **Status-Based Queries**
- "Show all features in preview"
- "What's currently rolling out?"
- "Planned features for next quarter"
- "Items launched this month"

### **Platform-Specific Searches**
- "Mobile features in the roadmap"
- "Web-only roadmap items"
- "Features supporting both Desktop and Mobile"
- "iOS-specific roadmap items"

### **AI and Copilot Focus**
- "All Copilot-related roadmap items"
- "AI features in Microsoft 365"
- "Copilot Studio roadmap updates"
- "Machine learning features across platforms"

### **Date-Range Queries**
- "Roadmap items releasing in Q4 2025"
- "Features created between October 1-15, 2025"
- "Items with target dates after January 2026"
- "What was announced last month?"

### **Complex Multi-Criteria**
- "Microsoft 365 Copilot features in development supporting mobile platforms"
- "Teams items in preview status created since October 1st"
- "Security features rolling out with desktop support"

## Tips / Phrasing Guidance

- **Use "created since/before"** to target the `created` field for when items were added to roadmap
- **Use "target date" or "releasing"** to target `targetDate` for planned release dates
- **Use "for platform" or "supporting"** when referring to the `platforms` array
- **Use "tagged" or "with tag"** when you mean the `tags` array
- **Use "in category"** to target specific product categories
- **Use "status" or "in [status]"** for development status filtering
- **Use "contains" language** for searching titles and descriptions (e.g., "title contains", "description mentions")

## Important Field Notes

- **Date Field**: Always use `created` for filtering by when items were added to the roadmap (NOT `createdDateTime`)
- **Categories**: Main categories include "Microsoft 365", "Microsoft Teams", "SharePoint", "Exchange", "OneDrive", "Power Platform", "Viva", "Security & Compliance"
- **Status Values**: "In Development", "Rolling Out", "Launched", "Preview", "Planned", "Cancelled"
- **Platforms**: "Web", "Desktop", "Mobile", "Mac", "iOS", "Android"

This prompting guide helps users naturally query the Microsoft 365 roadmap using conversational language that the agent can translate into proper OData queries against the roadmap API.