import { SegmentInfo } from './types';

export const OM2SegmentDef = {
  name: 'OM2' as const,
  fields: [
  "Sequence Number - Test/Observation Master File",
  "Units of Measure",
  "Range of Decimal Precision",
  "Corresponding SI Units of Measure",
  "SI Conversion Factor",
  "Reference (Normal) Range - Ordinal and Continuous Observations",
  "Critical Range for Ordinal and Continuous Observations",
  "Absolute Range for Ordinal and Continuous Observations",
  "Delta Check Criteria",
  "Minimum Meaningful Increments",
  ] as const,
} satisfies SegmentInfo;

export type OM2FieldName = typeof OM2SegmentDef.fields[number];
