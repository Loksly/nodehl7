import { SegmentInfo } from './types';

export const MRGSegmentDef = {
  name: 'MRG' as const,
  fields: [
  "Prior Patient ID - Internal",
  "Prior Alternate Patient ID",
  "Prior Patient Account Number",
  "Prior Patient ID - External",
  "Prior Visit Number",
  "Prior Alternate Visit ID",
  "Prior Patient Name",
  ] as const,
} satisfies SegmentInfo;

export type MRGFieldName = typeof MRGSegmentDef.fields[number];
