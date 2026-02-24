import { SegmentInfo } from './types';

export const AIPSegmentDef = {
  name: 'AIP' as const,
  fields: [
  "Set ID - AIP",
  "Segment Action Code",
  "Personnel Resource ID",
  "Resource Type",
  "Resource Group",
  "Start Date/Time",
  "Start Date/Time Offset",
  "Start Date/Time Offset Units",
  "Duration",
  "Duration Units",
  "Allow Substitution Code",
  "Filler Status Code",
  "Universal Service Identifier",
  ] as const,
} satisfies SegmentInfo;

export type AIPFieldName = typeof AIPSegmentDef.fields[number];
