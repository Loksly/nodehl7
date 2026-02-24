import { SegmentInfo } from './types';

export const UB2SegmentDef = {
  name: 'UB2' as const,
  fields: [
  "Set ID - UB2",
  "Co-Insurance Days",
  "Condition Code",
  "Covered Days",
  "Non-Covered Days",
  "Value Amount & Code",
  "Occurrence Code & Date",
  "Occurrence Span Code/Dates",
  "UB92 Locator 2 (State)",
  "UB92 Locator 11 (State)",
  "UB92 Locator 31 (National)",
  "Document Control Number",
  "UB92 Locator 49 (National)",
  "UB92 Locator 56 (State)",
  "UB92 Locator 57 (National)",
  "UB92 Locator 78 (State)",
  "Special Visit Count",
  ] as const,
} satisfies SegmentInfo;

export type UB2FieldName = typeof UB2SegmentDef.fields[number];
