import { SegmentInfo } from './types';

export const DSCSegmentDef = {
  name: 'DSC' as const,
  fields: [
  "Continuation Pointer",
  "Continuation Style",
  ] as const,
} satisfies SegmentInfo;

export type DSCFieldName = typeof DSCSegmentDef.fields[number];
