import { SegmentInfo } from './types';

export const NTESegmentDef = {
  name: 'NTE' as const,
  fields: [
  "Set ID - NTE",
  "Source of Comment",
  "Comment",
  "Comment Type",
  ] as const,
} satisfies SegmentInfo;

export type NTEFieldName = typeof NTESegmentDef.fields[number];
