import { SegmentInfo } from './types';

export const BLGSegmentDef = {
  name: 'BLG' as const,
  fields: [
  "When to Charge",
  "Charge Type",
  "Account ID",
  "Charge Type Reason",
  ] as const,
} satisfies SegmentInfo;

export type BLGFieldName = typeof BLGSegmentDef.fields[number];
