import "@typespec/http";

using TypeSpec.Http;

namespace M365Roadmap.Parameters;

/** OData filter expression for complex queries */
model FilterParameter {
  /** OData filter expression. IMPORTANT: Use 'created' field for created date filtering (not 'createdDateTime'). Use the 'modified' field for last modified date filtering (not 'lastModifiedDateTime'). Supports contains(), tolower(), and date comparisons. Filter the results based on specific conditions. Use `contains(tolower(title),tolower('search term'))` to search within the title property for a specific term. For creation date filtering, use the 'created' property with ISO 8601 date format. For example, `created ge 2025-03-01T00:00:00Z` to filter roadmap items created after March 1, 2025. To combine filters, use `and` operator. For example, `contains(tolower(title),tolower('Teams')) and created ge 2025-03-01T00:00:00Z`. For the 'status' field, you can filter by status using `status eq 'In development'`, `status eq 'Rolling out'`, `status eq 'Launched'`, `status eq 'Preview'`, `status eq 'Planned'`, or `status eq 'Cancelled'`. For array fields, use the any() operator: For 'platforms' array, use `platforms/any(p: contains(tolower(p), 'desktop'))` to find items available on desktop platform, or `platforms/any(p: p eq 'Web')` for exact platform match. For 'products' array, use `products/any(p: contains(tolower(p), 'teams'))` to search within product names. For 'releaseRings' array, use `releaseRings/any(r: contains(tolower(r), 'general'))` to filter by release ring. For 'cloudInstances' array, use `cloudInstances/any(c: contains(tolower(c), 'gcc'))` to filter by cloud instance. For 'availabilities' array, use nested object filtering: `availabilities/any(a: a/ring eq 'General Availability')` to filter by release ring, `availabilities/any(a: a/year eq 2026)` to filter by year, or `availabilities/any(a: a/month eq 'March')` to filter by month. Date range filtering example: `created ge 2025-01-01T00:00:00Z and created le 2025-12-31T23:59:59Z`. For complex date ranges spanning multiple months and years, ALWAYS use proper parentheses grouping: `(availabilities/any(a: a/year eq 2025 and (a/month eq 'November' or a/month eq 'December')) or availabilities/any(a: a/year eq 2026 and a/month eq 'January'))`. Complex example: `contains(tolower(title), 'teams') and platforms/any(p: p eq 'Desktop') and (availabilities/any(a: a/year eq 2025 and (a/month eq 'November' or a/month eq 'December')) or availabilities/any(a: a/year eq 2026 and a/month eq 'January'))`. To find roadmap items that are 'major changes', use contains(tolower(title), 'major') or contains(tolower(title), 'breaking') or contains(tolower(description), 'major') or contains(tolower(description), 'significant'). Do not use '$filter=isMajorChange+eq+true' as it is not supported by the API. */
  @query
  $filter?: string;
}

/** OData orderby parameter */
model OrderByParameter {
  /** Order results by specified field. Use 'created' for date ordering (not 'createdDateTime'). */
  @query
  $orderby?: string;
}

/** OData top parameter for pagination */
model TopParameter {
  /** Number of items to return (default: 10, max: 100) */
  @query
  @minValue(1)
  @maxValue(100)
  $top?: int32 = 10;
}

/** OData skip parameter for pagination */
model SkipParameter {
  /** Number of items to skip for pagination */
  @query
  @minValue(0)
  $skip?: int32 = 0;
}

/** OData count parameter */
model CountParameter {
  /** Include total count of items in response */
  @query
  $count: boolean = true;
}
