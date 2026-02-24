import { SegmentInfo } from './types';

export const CTISegmentDef = {
  name: 'CTI' as const,
  fields: [
  "Sponsor Study ID",
  "Study Phase Identifier",
  "Study Scheduled Time Point",
  ] as const,
} satisfies SegmentInfo;

export type CTIFieldName = typeof CTISegmentDef.fields[number];
