import { SegmentInfo } from './types';

export const FHSSegmentDef = {
  name: 'FHS' as const,
  fields: [
  "File Field Separator",
  "File Encoding Characters",
  "File Sending Application",
  "File Sending Facility",
  "File Receiving Application",
  "File Receiving Facility",
  "File Creation Date/Time",
  "File Security",
  "File Name/ID",
  "File Header Comment",
  "File Control ID",
  "Reference File Control ID",
  "File Sending Network Address",
  "File Receiving Network Address",
  ] as const,
} satisfies SegmentInfo;

export type FHSFieldName = typeof FHSSegmentDef.fields[number];
