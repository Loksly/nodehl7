import { SegmentInfo } from './types';

export const PR1SegmentDef = {
  name: 'PR1' as const,
  fields: [
  "Set ID - PR1",
  "Procedure Coding Method",
  "Procedure Code",
  "Procedure Description",
  "Procedure Date/Time",
  "Procedure Type",
  "Procedure Minutes",
  "Anesthesiologist",
  "Anesthesia Code",
  "Anesthesia Minutes",
  "Surgeon",
  "Procedure Practitioner",
  "Consent Code",
  "Procedure Priority",
  "Associated Diagnosis Code",
  ] as const,
} satisfies SegmentInfo;

export type PR1FieldName = typeof PR1SegmentDef.fields[number];
