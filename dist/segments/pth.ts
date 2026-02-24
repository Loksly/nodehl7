import { SegmentInfo } from './types';

export const PTHSegmentDef = {
  name: 'PTH' as const,
  fields: [
  "Action Code",
  "Pathway ID",
  "Pathway Instance ID",
  "Pathway Established Date/Time",
  "Pathway Life Cycle Status",
  "Change Pathway Life Cycle Status Date/Time",
  ] as const,
} satisfies SegmentInfo;

export type PTHFieldName = typeof PTHSegmentDef.fields[number];
