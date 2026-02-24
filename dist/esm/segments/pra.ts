import { SegmentInfo } from './types';

export const PRASegmentDef = {
  name: 'PRA' as const,
  fields: [
  "Primary Key Value - PRA",
  "Practitioner Group",
  "Practitioner Category",
  "Provider Billing",
  "Specialty",
  "Practitioner ID Numbers",
  "Privileges",
  "Date Entered Practice",
  "Institution",
  "Date Left Practice",
  "Government Reimbursement Billing Eligibility",
  "Set ID - PRA",
  ] as const,
} satisfies SegmentInfo;

export type PRAFieldName = typeof PRASegmentDef.fields[number];
