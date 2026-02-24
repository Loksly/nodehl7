import { SegmentInfo } from './types';

export const MSASegmentDef = {
  name: 'MSA' as const,
  fields: [
  "Acknowledgment Code",
  "Message Control ID",
  "Text Message",
  "Expected Sequence Number",
  "Delayed Acknowledgment Type",
  "Error Condition",
  ] as const,
} satisfies SegmentInfo;

export type MSAFieldName = typeof MSASegmentDef.fields[number];
