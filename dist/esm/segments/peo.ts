import { SegmentInfo } from './types';

export const PEOSegmentDef = {
  name: 'PEO' as const,
  fields: [
  "Event Identifiers Used",
  "Event Symptom/Diagnosis Code",
  "Event Onset Date/Time",
  "Event Exacerbation Date/Time",
  "Event Improved Date/Time",
  "Event Ended Data/Time",
  "Event Location Occurred Address",
  "Event Qualification",
  "Event Serious",
  "Event Expected",
  "Event Outcome",
  "Patient Outcome",
  "Event Description From Others",
  "Event From Original Reporter",
  "Event Description From Patient",
  "Event Description From Practitioner",
  "Event Description From Autopsy",
  ] as const,
} satisfies SegmentInfo;

export type PEOFieldName = typeof PEOSegmentDef.fields[number];
