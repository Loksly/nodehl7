import { SegmentInfo } from './types';

export const EVNSegmentDef = {
  name: 'EVN' as const,
  fields: [
  "Event Type Code",
  "Recorded Date/Time",
  "Date/Time Planned Event",
  "Event Reason Code",
  "Operator ID",
  "Event Occurred",
  "Event Facility",
  ] as const,
} satisfies SegmentInfo;

export type EVNFieldName = typeof EVNSegmentDef.fields[number];
