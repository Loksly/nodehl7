import { SegmentInfo } from './types';

export const OM3SegmentDef = {
  name: 'OM3' as const,
  fields: [
  "Sequence Number - Test/Observation Master File",
  "Preferred Coding System",
  "Valid Coded Answers",
  "Normal Text/Codes for Categorical Observations",
  "Abnormal Text/Codes for Categorical Observations",
  "Critical Text/Codes for Categorical Observations",
  "Value Type",
  ] as const,
} satisfies SegmentInfo;

export type OM3FieldName = typeof OM3SegmentDef.fields[number];
