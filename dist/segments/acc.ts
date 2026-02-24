import { SegmentInfo } from './types';

export const ACCSegmentDef = {
  name: 'ACC' as const,
  fields: [
  "Accident Date/Time",
  "Accident Code",
  "Accident Location",
  "Auto Accident State",
  "Accident Job Related Indicator",
  "Accident Death Indicator",
  "Entered By",
  "Accident Description",
  "Brought In By",
  "Police Notified Indicator",
  "Accident Address",
  ] as const,
} satisfies SegmentInfo;

export type ACCFieldName = typeof ACCSegmentDef.fields[number];
