import { SegmentInfo } from './types';

export const AIGSegmentDef = {
  name: 'AIG' as const,
  fields: [
  "Set ID - AIG",
  "Segment Action Code",
  "Resource ID",
  "Resource Type",
  "Resource Group",
  "Resource Quantity",
  "Resource Quantity Units",
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

export type AIGFieldName = typeof AIGSegmentDef.fields[number];
