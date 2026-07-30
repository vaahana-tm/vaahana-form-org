/**
 * Represents a single activity entry in the Weekday Activities step.
 * Stored as a JSONB array in the weekday_activities column.
 */
export interface ActivityRow {
  placeType: string;    // Type of place (e.g. "Work / Office")
  transport: string;   // Mode of transport (e.g. "Namma Metro")
  place: string;       // Bangalore locality (e.g. "Whitefield")
  arrivalMin: number;  // Minutes since midnight, 15-min snapped (0–1425)
  departureMin: number;
}
