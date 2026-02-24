import { SegmentInfo } from './types';

export const AILSegmentDef = {
  name: 'AIL' as const,
  fields: [
  "Set ID - AIL",
  "Segment Action Code",
  "Location Resource ID",
  "Location Type-AIL",
  "Location Group",
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

export type AILFieldName = typeof AILSegmentDef.fields[number];
