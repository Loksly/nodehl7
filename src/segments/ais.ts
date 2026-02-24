import { SegmentInfo } from './types';

export const AISSegmentDef = {
  name: 'AIS' as const,
  fields: [
  "Set ID - AIS",
  "Segment Action Code",
  "Universal Service Identifier",
  "Start Date/Time",
  "Start Date/Time Offset",
  "Start Date/Time Offset Units",
  "Duration",
  "Duration Units",
  "Allow Substitution Code",
  "Filler Status Code",
  "Placer Supplemental Service Information",
  ] as const,
} satisfies SegmentInfo;

export type AISFieldName = typeof AISSegmentDef.fields[number];
