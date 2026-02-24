import { SegmentInfo } from './types';

export const PD1SegmentDef = {
  name: 'PD1' as const,
  fields: [
  "Living Dependency",
  "Living Arrangement",
  "Patient Primary Facility",
  "Patient Primary Care Provider Name & ID No.",
  "Student Indicator",
  "Handicap",
  "Living Will",
  "Organ Donor",
  "Separate Bill",
  "Duplicate Patient",
  "Publicity Indicator",
  "Protection Indicator",
  ] as const,
} satisfies SegmentInfo;

export type PD1FieldName = typeof PD1SegmentDef.fields[number];
