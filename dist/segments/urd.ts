import { SegmentInfo } from './types';

export const URDSegmentDef = {
  name: 'URD' as const,
  fields: [
  "R/U Date/Time",
  "Report Priority",
  "R/U Who Subject Definition",
  "R/U What Subject Definition",
  "R/U What Department Code",
  "R/U Display/Print Locations",
  "R/U Results Level",
  ] as const,
} satisfies SegmentInfo;

export type URDFieldName = typeof URDSegmentDef.fields[number];
