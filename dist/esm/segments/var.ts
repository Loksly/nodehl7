import { SegmentInfo } from './types';

export const VARSegmentDef = {
  name: 'VAR' as const,
  fields: [
  "Variance Instance ID",
  "Documented Date/Time",
  "Stated Variance Date/Time",
  "Variance Originator",
  "Variance Classification",
  "Variance Description",
  ] as const,
} satisfies SegmentInfo;

export type VARFieldName = typeof VARSegmentDef.fields[number];
