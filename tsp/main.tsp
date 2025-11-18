import "@typespec/http";
import "@typespec/rest";
import "@typespec/openapi3";
import "./routes/roadmap.tsp";

using TypeSpec.Http;
using TypeSpec.Rest;

@service({
  title: "Microsoft 365 Roadmap API",
})
@server(
  "https://www.microsoft.com/releasecommunications/api/v2",
  "Microsoft 365 Roadmap API"
)
@doc("API for accessing Microsoft 365 roadmap items with OData query capabilities. Use 'created' field for date filtering (not 'createdDateTime').")
namespace M365Roadmap;
