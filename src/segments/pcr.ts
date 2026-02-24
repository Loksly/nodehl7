import { SegmentInfo } from './types';

export const PCRSegmentDef = {
  name: 'PCR' as const,
  fields: [
  "Implicated Product",
  "Generic Product",
  "Product Class",
  "Total Duration Of Therapy",
  "Product Manufacture Date",
  "Product Expiration Date",
  "Product Implantation Date",
  "Product Explantation Date",
  "Single Use Device",
  "Indication For Product Use",
  "Product Problem",
  "Product Serial/Lot Number",
  "Product Available For Inspection",
  "Product Evaluation Performed",
  "Product Evaluation Status",
  "Product Evaluation Results",
  "Evaluated Product Source",
  "Date Product Returned To Manufacturer",
  "Device Operator Qualifications",
  "Relatedness Assessment",
  "Action Taken In Response To The Event",
  "Event Causality Observations",
  "Indirect Exposure Mechanism",
  ] as const,
} satisfies SegmentInfo;

export type PCRFieldName = typeof PCRSegmentDef.fields[number];
