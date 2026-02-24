import { SegmentInfo } from './types';

export const OM7SegmentDef = {
  name: 'OM7' as const,
  fields: [
  "Sequence Number - Test/Observation Master File",
  "Universal Service Identifier",
  "Category Identifier",
  "Category Description",
  "Category Synonym",
  "Effective Test/Service Start Date/Time",
  "Effective Test/Service End Date/Time",
  "Test/Service Default Duration Amount",
  "Test/Service Default Duration Units",
  "Test/Service Default Frequency",
  "Consent Indicator",
  "Consent Identifier",
  "Consent Effective Start Date/Time",
  "Consent Effective End Date/Time",
  "Consent Interval Quantity",
  "Consent Interval Units",
  "Consent Waiting Period Quantity",
  "Consent Waiting Period Units",
  "Effective Date/Time of Change",
  "Entered By",
  "Orderable-at Location",
  "Formulary Status",
  "Special Order Indicator",
  "Primary Key Value - CDM",
  ] as const,
} satisfies SegmentInfo;

export type OM7FieldName = typeof OM7SegmentDef.fields[number];
