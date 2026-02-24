import { SegmentInfo } from './types';

export const ERRSegmentDef = {
  name: 'ERR' as const,
  fields: [
  "Error Code and Location",
  "Error Location",
  "HL7 Error Code",
  "Severity",
  "Application Error Code",
  "Application Error Parameter",
  "Diagnostic Information",
  "User Message",
  "Inform Person Indicator",
  "Override Type",
  "Override Reason Code",
  "Help Desk Contact Point",
  ] as const,
} satisfies SegmentInfo;

export type ERRFieldName = typeof ERRSegmentDef.fields[number];
