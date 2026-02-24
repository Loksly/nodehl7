import { SegmentInfo } from './types';

export const NDSSegmentDef = {
  name: 'NDS' as const,
  fields: [
  "Notification Reference Number",
  "Notification Date/Time",
  "Notification Alert Severity",
  "Notification Code",
  ] as const,
} satisfies SegmentInfo;

export type NDSFieldName = typeof NDSSegmentDef.fields[number];
