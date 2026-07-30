import { supabase } from './supabaseClient';
import type { ActivityRow } from './types';

export interface SubmissionPayload {
  referrer: string;
  city: string;
  locality: string;
  designation: string;
  vehicles: Record<string, number>;
  weekdayActivities: ActivityRow[];
  weekendActivities: ActivityRow[];
  places: string[];
  otherPlaces: string[];
  frequency: Record<string, string>;
  events: string[];
  comments: string;
}

export interface SubmitResult {
  success: boolean;
  /** The generated user-facing ID, e.g. "VAA-USER-0042" */
  userId?: string;
  error?: string;
}

/**
 * Format minutes-since-midnight → "H:MM AM/PM" for CSV readability.
 */
function formatTime(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  const ampm = h < 12 ? 'AM' : 'PM';
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour12}:${m.toString().padStart(2, '0')} ${ampm}`;
}

/**
 * Sanitise a free-text string: trim whitespace.
 * Returns null if the result is empty (to store NULL in DB).
 */
const sanitiseText = (val: string): string | null => {
  const trimmed = (val ?? '').trim();
  return trimmed.length > 0 ? trimmed : null;
};

/**
 * Merge default + custom places, trim each, de-duplicate, drop blanks.
 */
const mergePlaces = (places: string[], otherPlaces: string[]): string[] => {
  const combined = [...places, ...otherPlaces]
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
  return [...new Set(combined)];
};

/**
 * Remove vehicle modes with 0 days — still keep the full object but
 * we keep 0s since they are intentional (user slid to 0).
 * We do ensure all values are valid numbers.
 */
const sanitiseVehicles = (vehicles: Record<string, number>): Record<string, number> => {
  const sanitised: Record<string, number> = {};
  for (const [key, val] of Object.entries(vehicles)) {
    const num = Number(val);
    sanitised[key] = isNaN(num) ? 0 : Math.max(0, Math.min(30, num));
  }
  return sanitised;
};

/**
 * Maps frequency label keys to their max numeric values.
 * Rarely=5, Monthly=10, Often=15, Weekly=20, Daily=30
 */
const FREQUENCY_MAX_VALUES: Record<string, number> = {
  Rarely:  5,
  Monthly: 10,
  Often:   15,
  Weekly:  20,
  Daily:   30,
};

/**
 * Convert frequency object from { place: label } to { place: maxNumber }.
 * Unknown labels fall back to 0.
 */
const convertFrequency = (frequency: Record<string, string>): Record<string, number> => {
  const result: Record<string, number> = {};
  for (const [place, label] of Object.entries(frequency)) {
    let baseLabel = label;
    if (label.startsWith('Daily')) baseLabel = 'Daily';
    else if (label.startsWith('Weekly')) baseLabel = 'Weekly';
    else if (label.startsWith('Monthly')) baseLabel = 'Monthly';
    else if (label.startsWith('Rarely')) baseLabel = 'Rarely';

    result[place] = FREQUENCY_MAX_VALUES[baseLabel] ?? 0;
  }
  return result;
};

/**
 * Enrich an ActivityRow with human-readable time strings and duration.
 * Produces a flat, CSV-friendly object for AI analysis.
 */
const enrichActivity = (act: ActivityRow) => ({
  place_type:     act.placeType,
  transport:      act.transport,
  place:          act.place,
  arrival_min:    act.arrivalMin,
  departure_min:  act.departureMin,
  arrival_time:   formatTime(act.arrivalMin),
  departure_time: formatTime(act.departureMin),
  duration_min:   act.departureMin - act.arrivalMin,
});

/**
 * Submit the questionnaire to Supabase.
 *
 * - All required text fields are validated non-blank before insert.
 * - places are merged and de-duplicated.
 * - weekday_activities stored as enriched JSONB array (CSV-export ready).
 * - comments stored as NULL if blank.
 */
export async function submitResponse(payload: SubmissionPayload): Promise<SubmitResult> {
  // ── Required field validation ───────────────────────────────────────
  const requiredFields: Array<[string, string]> = [
    ['City',        payload.city],
    ['Locality',    payload.locality],
    ['Designation', payload.designation],
  ];

  for (const [label, value] of requiredFields) {
    if (!sanitiseText(value)) {
      return { success: false, error: `${label} is required and cannot be blank.` };
    }
  }

  const allPlaces = mergePlaces(payload.places, payload.otherPlaces);
  if (allPlaces.length === 0) {
    return { success: false, error: 'At least one place must be selected or entered.' };
  }

  // ── Build DB row ────────────────────────────────────────────────────
  const row = {
    referrer:           sanitiseText(payload.referrer) ?? null,
    city:               sanitiseText(payload.city)!,
    locality:           sanitiseText(payload.locality)!,
    designation:        sanitiseText(payload.designation)!,
    vehicles:           sanitiseVehicles(payload.vehicles),
    weekday_activities: (payload.weekdayActivities ?? []).map(enrichActivity),
    weekend_activities: (payload.weekendActivities ?? []).map(enrichActivity),
    all_places:         allPlaces,
    frequency:          convertFrequency(payload.frequency ?? {}),
    events:             (payload.events ?? []).filter((e) => e.trim().length > 0),
    // NULL if no comments, otherwise trimmed text
    comments:           sanitiseText(payload.comments) ?? null,
  };

  // ── Insert ──────────────────────────────────────────────────────────
  const { data, error } = await supabase
    .from('vaahana_responses')
    .insert(row)
    .select('id')
    .single();

  if (error) {
    console.error('[Supabase] Insert error:', error);
    return {
      success: false,
      error: error.message ?? 'Submission failed. Please try again.',
    };
  }

  // Build a zero-padded user ID from the auto-increment PK
  const userId = `VAA-USER-${String(data.id).padStart(4, '0')}`;
  return { success: true, userId };
}
