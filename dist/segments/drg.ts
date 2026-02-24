import { SegmentInfo } from './types';

export const DRGSegmentDef = {
  name: 'DRG' as const,
  fields: [
  "Diagnostic Related Group",
  "DRG Assigned Date/Time",
  "DRG Approval Indicator",
  "DRG Grouper Review Code",
  "Outlier Type",
  "Outlier Days",
  "Outlier Cost",
  "DRG Payor",
  "Outlier Reimbursement",
  "Confidential Indicator",
  "DRG Transfer Type",
  ] as const,
} satisfies SegmentInfo;

export type DRGFieldName = typeof DRGSegmentDef.fields[number];
