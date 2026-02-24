import { SegmentInfo } from './types';

export const MSHSegmentDef = {
  name: 'MSH' as const,
  fields: [
  "Encoding characters",
  "Sending application",
  "Sending facility",
  "Receiving application",
  "Receiving facility",
  "Date/time of message",
  "Security",
  "Message type",
  "Message control ID",
  "Processing ID",
  "Version ID",
  "Sequence number",
  "Continuation pointer",
  "Accept acknowledgement type",
  "Application acknowledgement type",
  "Country code",
  "Character set",
  "Principal language of message",
  "Alternate character set handling",
  ] as const,
} satisfies SegmentInfo;

export type MSHFieldName = typeof MSHSegmentDef.fields[number];
