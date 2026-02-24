import { SegmentInfo } from './types';

export const ODTSegmentDef = {
  name: 'ODT' as const,
  fields: [
  "Tray Type",
  "Service Period",
  ] as const,
} satisfies SegmentInfo;

export type ODTFieldName = typeof ODTSegmentDef.fields[number];
