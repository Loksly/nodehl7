import { SegmentInfo } from './types';

export const RXRSegmentDef = {
  name: 'RXR' as const,
  fields: [
  "Route",
  "Administration Site",
  "Administration Device",
  "Administration Method",
  "Routing Instruction",
  "Administration Site Modifier",
  ] as const,
} satisfies SegmentInfo;

export type RXRFieldName = typeof RXRSegmentDef.fields[number];
