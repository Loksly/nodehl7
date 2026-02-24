import { SegmentInfo } from './types';

export const OBXSegmentDef = {
  name: 'OBX' as const,
  fields: [
  "Set ID - OBX",
  "Value Type",
  "Observation Identifier",
  "Observation Sub-ID",
  "Observation Value",
  "Units",
  "References Range",
  "Abnormal Flags",
  "Probability",
  "Nature of Abnormal Test",
  "Observ Result Status",
  "Date Last Obs Normal Values",
  "User Defined Access Checks",
  "Date/Time of the Observation",
  "Producer's ID",
  "Responsible Observer",
  "Observation Method",
  ] as const,
} satisfies SegmentInfo;

export type OBXFieldName = typeof OBXSegmentDef.fields[number];
