import { SegmentInfo } from './types';

export const FACSegmentDef = {
  name: 'FAC' as const,
  fields: [
  "Facility ID-FAC",
  "Facility Type",
  "Facility Address",
  "Facility Telecommunication",
  "Contact Person",
  "Contact Title",
  "Contact Address",
  "Contact Telecommunication",
  "Signature Authority",
  "Signature Authority Title",
  "Signature Authority Address",
  "Signature Authority Telecommunication",
  ] as const,
} satisfies SegmentInfo;

export type FACFieldName = typeof FACSegmentDef.fields[number];
