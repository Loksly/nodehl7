import { SegmentInfo } from './types';

export const QRDSegmentDef = {
  name: 'QRD' as const,
  fields: [
  "Query Date/Time",
  "Query Format Code",
  "Query Priority",
  "Query ID",
  "Deferred Response Type",
  "Deferred Response Date/Time",
  "Quantity Limited Request",
  "Who Subject Filter",
  "What Subject Filter",
  "What Department Data Code",
  "What Data Code Value Qualifier",
  "Query Results Level",
  ] as const,
} satisfies SegmentInfo;

export type QRDFieldName = typeof QRDSegmentDef.fields[number];
