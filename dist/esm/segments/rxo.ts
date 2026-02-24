import { SegmentInfo } from './types';

export const RXOSegmentDef = {
  name: 'RXO' as const,
  fields: [
  "Requested Give Code",
  "Requested Give Amount - Minimum",
  "Requested Give Amount - Maximum",
  "Requested Give Units",
  "Requested Dosage Form",
  "Provider's Pharmacy/Treatment Instructions",
  "Provider's Administration Instructions",
  "Deliver-To Location",
  "Allow Substitutions",
  "Requested Dispense Code",
  "Requested Dispense Amount",
  "Requested Dispense Units",
  "Number of Refills",
  "Ordering Provider's DEA Number",
  "Pharmacist/Treatment Supplier's Verifier ID",
  "Needs Human Review",
  "Requested Give Per (Time Unit)",
  "Requested Give Strength",
  "Requested Give Strength Units",
  "Indication",
  "Requested Give Rate Amount",
  "Requested Give Rate Units",
  "Total Daily Dose",
  "Supplementary Code",
  "Requested Drug Strength Volume",
  "Requested Drug Strength Volume Units",
  "Pharmacy Order Type",
  "Dispensing Interval",
  ] as const,
} satisfies SegmentInfo;

export type RXOFieldName = typeof RXOSegmentDef.fields[number];
