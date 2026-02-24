import { SegmentInfo } from './types';

export const RXGSegmentDef = {
  name: 'RXG' as const,
  fields: [
  "Give Sub-ID Counter",
  "Dispense Sub-ID Counter",
  "Quantity/Timing",
  "Give Code",
  "Give Amount - Minimum",
  "Give Amount - Maximum",
  "Give Units",
  "Give Dosage Form",
  "Administration Notes",
  "Substitution Status",
  "Dispense-to Location",
  "Needs Human Review",
  "Pharmacy/Treatment Supplier's Special Administration Instructions",
  "Give Per (Time Unit)",
  "Give Rate Amount",
  "Give Rate Units",
  "Give Strength",
  "Give Strength Units",
  "Substance Lot Number",
  "Substance Expiration Date",
  "Substance Manufacturer Name",
  "Indication",
  "Give Drug Strength Volume",
  "Give Drug Strength Volume Units",
  "Give Barcode Identifier",
  "Pharmacy Order Type",
  ] as const,
} satisfies SegmentInfo;

export type RXGFieldName = typeof RXGSegmentDef.fields[number];
