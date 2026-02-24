import { SegmentInfo } from './types';

export const RXCSegmentDef = {
  name: 'RXC' as const,
  fields: [
  "RX Component Type",
  "Component Code",
  "Component Amount",
  "Component Units",
  "Component Strength",
  "Component Strength Units",
  "Supplementary Code",
  "Component Drug Strength Volume",
  "Component Drug Strength Volume Units",
  ] as const,
} satisfies SegmentInfo;

export type RXCFieldName = typeof RXCSegmentDef.fields[number];
