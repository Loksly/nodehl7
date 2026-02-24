import { SegmentInfo } from './types';

export const DB1SegmentDef = {
  name: 'DB1' as const,
  fields: [
  "Set ID - DB1",
  "Disabled Person Code",
  "Disabled Person Identifier",
  "Disabled Indicator",
  "Disability Start Date",
  "Disability End Date",
  "Disability Return to Work Date",
  "Disability Unable to Work Date",
  ] as const,
} satisfies SegmentInfo;

export type DB1FieldName = typeof DB1SegmentDef.fields[number];
