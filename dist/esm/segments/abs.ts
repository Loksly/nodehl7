import { SegmentInfo } from './types';

export const ABSSegmentDef = {
  name: 'ABS' as const,
  fields: [
  "Discharge Care Provider",
  "Transfer Medical Service Code",
  "Severity of Illness Code",
  "Date/Time of Attestation",
  "Attested By",
  "Triage Code",
  "Abstract Completion Date/Time",
  "Abstracted By",
  "Case Category Code",
  "Cesarean Section Indicator",
  "Gestation Category Code",
  "Gestation Period - Weeks",
  "Newborn Code",
  "Stillborn Indicator",
  ] as const,
} satisfies SegmentInfo;

export type ABSFieldName = typeof ABSSegmentDef.fields[number];
