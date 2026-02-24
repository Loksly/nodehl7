import { SegmentInfo } from './types';

export const AL1SegmentDef = {
  name: 'AL1' as const,
  fields: [
  "Set ID - AL1",
  "Allergen Type Code",
  "Allergen Code/Mnemonic/Description",
  "Allergy Severity Code",
  "Allergy Reaction Code",
  "Identification Date",
  ] as const,
} satisfies SegmentInfo;

export type AL1FieldName = typeof AL1SegmentDef.fields[number];
