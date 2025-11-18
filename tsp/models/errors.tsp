namespace M365Roadmap.Models;

/** Error detail information */
model ErrorDetail {
  code: string;
  message: string;
}

/** Error information */
model Error {
  /** Error code */
  code: string;

  /** Error message */
  message: string;

  /** Additional error details */
  details?: ErrorDetail[];
}

/** Error response structure */
model ErrorResponse {
  error: Error;
}
