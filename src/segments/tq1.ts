import { SegmentInfo } from './types';

export const TQ1SegmentDef = {
  name: 'TQ1' as const,
  fields: [
  "Set ID - TQ1",
  "Quantity",
  "Repeat Pattern",
  "Explicit Time",
  "Relative Time and Units",
  "Service Duration",
  "Start Date/Time",
  "End Date/Time",
  "Priority",
  "Condition Text",
  "Text Instruction",
  "Conjunction",
  "Occurrence Duration",
  "Total Occurrences",
  ] as const,
} satisfies SegmentInfo;

export type TQ1FieldName = typeof TQ1SegmentDef.fields[number];
