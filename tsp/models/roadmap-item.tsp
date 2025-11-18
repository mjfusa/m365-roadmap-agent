import "@typespec/http";

using TypeSpec.Http;

namespace M365Roadmap.Models;

/** Availability information for a release ring */
model Availability {
  /** Release ring for this availability */
  ring: string;

  /** Year of availability */
  @minValue(2020)
  @maxValue(2030)
  year: int32;

  /** Month of availability */
  month: string;
}

/** A Microsoft 365 roadmap item with details about new features and updates */
model RoadmapItem {
  /** Unique identifier for the roadmap item */
  id: int32;

  /** Title of the roadmap item */
  title: string;

  /** Creation date and time of the roadmap item (ISO 8601 format). 
   * Use this field for date filtering, not 'createdDateTime'. */
  created: utcDateTime;

  /** Detailed description of the roadmap item */
  description: string;

  /** Current development status of the roadmap item */
  status: "In development" | "Rolling out" | "Launched";

  /** Last modification date and time (ISO 8601 format) */
  modified?: utcDateTime;

  /** General availability date in YYYY-MM format */
  @pattern("^\\d{4}-\\d{2}$")
  generalAvailabilityDate?: string | null;

  /** Preview availability date (ISO 8601 format) */
  previewAvailabilityDate?: utcDateTime | null;

  /** Locale information */
  locale?: string | null;

  /** Supported platforms for this feature */
  platforms?: string[];

  /** Microsoft 365 products associated with this roadmap item */
  products?: string[];

  /** Release rings for this roadmap item */
  releaseRings?: string[];

  /** Cloud deployment instances where this feature is available */
  cloudInstances?: string[];

  /** Additional information URLs related to this roadmap item */
  moreInfoUrls?: url[];

  /** Release availability information with timing details for different release rings */
  availabilities?: Availability[];
}
