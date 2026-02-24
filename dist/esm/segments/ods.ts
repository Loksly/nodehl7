import { SegmentInfo } from './types';

export const ODSSegmentDef = {
  name: 'ODS' as const,
  fields: [
  "Type",
  "Service Period",
  "Diet, Supplement, or Preference Code",
  "Text Instruction",
  ] as const,
} satisfies SegmentInfo;

export type ODSFieldName = typeof ODSSegmentDef.fields[number];
