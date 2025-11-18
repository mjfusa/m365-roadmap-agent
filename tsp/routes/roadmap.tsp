import "@typespec/http";
import "@typespec/rest";
import "../models/roadmap-item.tsp";
import "../models/responses.tsp";
import "../models/errors.tsp";
import "../parameters/odata.tsp";

using TypeSpec.Http;
using TypeSpec.Rest;

namespace M365Roadmap.Routes;

@route("/m365")
interface RoadmapOperations {
  /** Get Microsoft 365 roadmap items
   * 
   * Retrieve roadmap items with optional filtering, sorting, and pagination.
   * Always use 'created' field for date operations, not 'createdDateTime'.
   */
  @get
  @route("")
  getM365RoadmapInfo(
    ...M365Roadmap.Parameters.FilterParameter,
    ...M365Roadmap.Parameters.OrderByParameter,
    ...M365Roadmap.Parameters.TopParameter,
    ...M365Roadmap.Parameters.SkipParameter,
    ...M365Roadmap.Parameters.CountParameter
  ): {
    @statusCode statusCode: 200;
    @body body: M365Roadmap.Models.RoadmapResponse;
  } | {
    @statusCode statusCode: 400;
    @body body: M365Roadmap.Models.ErrorResponse;
  } | {
    @statusCode statusCode: 500;
    @body body: M365Roadmap.Models.ErrorResponse;
  };
}
