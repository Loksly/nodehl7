import { SegmentInfo } from './types';

export const FTSSegmentDef = {
  name: 'FTS' as const,
  fields: [
  "File Batch Count",
  "File Trailer Comment",
  ] as const,
} satisfies SegmentInfo;

export type FTSFieldName = typeof FTSSegmentDef.fields[number];
