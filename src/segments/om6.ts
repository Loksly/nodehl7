import { SegmentInfo } from './types';

export const OM6SegmentDef = {
  name: 'OM6' as const,
  fields: [
  "Sequence Number - Test/Observation Master File",
  "Derivation Rule",
  ] as const,
} satisfies SegmentInfo;

export type OM6FieldName = typeof OM6SegmentDef.fields[number];
