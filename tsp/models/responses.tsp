import "@typespec/http";
import "./roadmap-item.tsp";

using TypeSpec.Http;

namespace M365Roadmap.Models;

/** Response containing roadmap items with OData metadata */
model RoadmapResponse {
  /** Array of roadmap items */
  value: RoadmapItem[];

  /** Total count of items (when $count=true is specified) */
  `@odata.count`?: int32;

  /** URL for next page of results (for pagination) */
  `@odata.nextLink`?: string | null;

  /** OData context URL */
  `@odata.context`?: string;
}
