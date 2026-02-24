import { SegmentInfo } from './types';

export const QRFSegmentDef = {
  name: 'QRF' as const,
  fields: [
  "Where Subject Filter",
  "When Data Start Date/Time",
  "When Data End Date/Time",
  "What User Qualifier",
  "Other QRY Subject Filter",
  "Which Date/Time Qualifier",
  "Which Date/Time Status Qualifier",
  "Date/Time Selection Qualifier",
  "When Quantity/Timing Qualifier",
  ] as const,
} satisfies SegmentInfo;

export type QRFFieldName = typeof QRFSegmentDef.fields[number];
