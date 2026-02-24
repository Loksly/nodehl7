import { SegmentInfo } from './types';

export const OM4SegmentDef = {
  name: 'OM4' as const,
  fields: [
  "Sequence Number - Test/Observation Master File",
  "Derived Specimen",
  "Container Description",
  "Container Volume",
  "Container Units",
  "Specimen",
  "Additive",
  "Preparation",
  "Special Handling Requirements",
  "Normal Collection Volume",
  "Minimum Collection Volume",
  "Specimen Requirements",
  "Specimen Priorities",
  "Specimen Retention Time",
  ] as const,
} satisfies SegmentInfo;

export type OM4FieldName = typeof OM4SegmentDef.fields[number];
