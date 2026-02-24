import { SegmentInfo } from './types';

export const BTSSegmentDef = {
  name: 'BTS' as const,
  fields: [
  "Batch Message Count",
  "Batch Comment",
  "Batch Totals",
  ] as const,
} satisfies SegmentInfo;

export type BTSFieldName = typeof BTSSegmentDef.fields[number];
