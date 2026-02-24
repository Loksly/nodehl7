import { SegmentInfo } from './types';

export const TQ2SegmentDef = {
  name: 'TQ2' as const,
  fields: [
  "Set ID - TQ2",
  "Sequence/Results Flag",
  "Related Placer Number",
  "Related Filler Number",
  "Related Placer Group Number",
  "Sequence Condition Code",
  "Cyclic Entry/Exit Indicator",
  "Sequence Condition Time Interval",
  "Cyclic Group Maximum Number of Repeats",
  "Special Service Request Relationship",
  ] as const,
} satisfies SegmentInfo;

export type TQ2FieldName = typeof TQ2SegmentDef.fields[number];
