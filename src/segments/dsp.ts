import { SegmentInfo } from './types';

export const DSPSegmentDef = {
  name: 'DSP' as const,
  fields: [
  "Set ID - DSP",
  "Display Level",
  "Data Line",
  "Break Point",
  "Result ID",
  ] as const,
} satisfies SegmentInfo;

export type DSPFieldName = typeof DSPSegmentDef.fields[number];
