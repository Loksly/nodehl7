import { SegmentInfo } from './types';

export const RGSSegmentDef = {
  name: 'RGS' as const,
  fields: [
  "Set ID - RGS",
  "Segment Action Code",
  "Resource Group ID",
  ] as const,
} satisfies SegmentInfo;

export type RGSFieldName = typeof RGSSegmentDef.fields[number];
