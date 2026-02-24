import { SegmentInfo } from './types';

export const URSSegmentDef = {
  name: 'URS' as const,
  fields: [
  "R/U Where Subject Definition",
  "R/U When Data Start Date/Time",
  "R/U When Data End Date/Time",
  "R/U What User Qualifier",
  "R/U Other Results Subject Definition",
  "R/U Which Date/Time Qualifier",
  "R/U Which Date/Time Status Qualifier",
  "R/U Date/Time Selection Qualifier",
  "R/U Quantity/Timing Qualifier",
  ] as const,
} satisfies SegmentInfo;

export type URSFieldName = typeof URSSegmentDef.fields[number];
