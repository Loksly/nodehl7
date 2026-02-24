import { SegmentInfo } from './types';

export const NK1SegmentDef = {
  name: 'NK1' as const,
  fields: [
  "Set ID - NK1",
  "Name",
  "Relationship",
  "Address",
  "Phone Number",
  "Business Phone Number",
  "Contact Role",
  "Start Date",
  "End Date",
  "Next of Kin / Associated Parties Job Title",
  "Next of Kin / Associated Parties Job Code/Class",
  "Next of Kin / Associated Parties Employee Number",
  "Organization Name",
  "Marital Status",
  "Sex",
  "Date/Time of Birth",
  ] as const,
} satisfies SegmentInfo;

export type NK1FieldName = typeof NK1SegmentDef.fields[number];
