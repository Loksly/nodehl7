import { SegmentInfo } from './types';

export const DG1SegmentDef = {
  name: 'DG1' as const,
  fields: [
  "Set ID - DG1",
  "Diagnosis Coding Method",
  "Diagnosis Code",
  "Diagnosis Description",
  "Diagnosis Date/Time",
  "Diagnosis/DRG Type",
  "Major Diagnostic Category",
  "Diagnostic Related Group",
  "DRG Approval Indicator",
  "DRG Grouper Review Code",
  "Outlier Type",
  "Outlier Days",
  "Outlier Cost",
  "Grouper Version and Type",
  "Diagnosis/DRG Priority",
  "Diagnosing Clinician",
  "Diagnosis Classification",
  "Confidential Indicator",
  "Attestation Date/Time",
  ] as const,
} satisfies SegmentInfo;

export type DG1FieldName = typeof DG1SegmentDef.fields[number];
