import { SegmentInfo } from './types';

export const OM5SegmentDef = {
  name: 'OM5' as const,
  fields: [
  "Sequence Number - Test/Observation Master File",
  "Test/Observations Included within an Ordered Test Battery",
  "Observation ID Suffixes",
  ] as const,
} satisfies SegmentInfo;

export type OM5FieldName = typeof OM5SegmentDef.fields[number];
