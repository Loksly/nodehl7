import { SegmentInfo } from './types';
import { ABSFieldName } from './abs';
import { ACCFieldName } from './acc';
import { AIGFieldName } from './aig';
import { AILFieldName } from './ail';
import { AIPFieldName } from './aip';
import { AISFieldName } from './ais';
import { AL1FieldName } from './al1';
import { BHSFieldName } from './bhs';
import { BLGFieldName } from './blg';
import { BTSFieldName } from './bts';
import { CERFieldName } from './cer';
import { CTIFieldName } from './cti';
import { DB1FieldName } from './db1';
import { DG1FieldName } from './dg1';
import { DRGFieldName } from './drg';
import { DSCFieldName } from './dsc';
import { DSPFieldName } from './dsp';
import { ERRFieldName } from './err';
import { EVNFieldName } from './evn';
import { FACFieldName } from './fac';
import { FHSFieldName } from './fhs';
import { FT1FieldName } from './ft1';
import { FTSFieldName } from './fts';
import { GOLFieldName } from './gol';
import { GT1FieldName } from './gt1';
import { IN1FieldName } from './in1';
import { IN2FieldName } from './in2';
import { INVFieldName } from './inv';
import { MRGFieldName } from './mrg';
import { MSAFieldName } from './msa';
import { MSHFieldName } from './msh';
import { NDSFieldName } from './nds';
import { NK1FieldName } from './nk1';
import { NTEFieldName } from './nte';
import { OBRFieldName } from './obr';
import { OBXFieldName } from './obx';
import { ODSFieldName } from './ods';
import { ODTFieldName } from './odt';
import { OM1FieldName } from './om1';
import { OM2FieldName } from './om2';
import { OM3FieldName } from './om3';
import { OM4FieldName } from './om4';
import { OM5FieldName } from './om5';
import { OM6FieldName } from './om6';
import { OM7FieldName } from './om7';
import { ORCFieldName } from './orc';
import { PCRFieldName } from './pcr';
import { PD1FieldName } from './pd1';
import { PDCFieldName } from './pdc';
import { PEOFieldName } from './peo';
import { PIDFieldName } from './pid';
import { PR1FieldName } from './pr1';
import { PRAFieldName } from './pra';
import { PRBFieldName } from './prb';
import { PSHFieldName } from './psh';
import { PTHFieldName } from './pth';
import { PV1FieldName } from './pv1';
import { PV2FieldName } from './pv2';
import { QRDFieldName } from './qrd';
import { QRFFieldName } from './qrf';
import { RGSFieldName } from './rgs';
import { ROLFieldName } from './rol';
import { RXAFieldName } from './rxa';
import { RXCFieldName } from './rxc';
import { RXDFieldName } from './rxd';
import { RXEFieldName } from './rxe';
import { RXGFieldName } from './rxg';
import { RXOFieldName } from './rxo';
import { RXRFieldName } from './rxr';
import { SACFieldName } from './sac';
import { SCHFieldName } from './sch';
import { SPMFieldName } from './spm';
import { STFFieldName } from './stf';
import { TQ1FieldName } from './tq1';
import { TQ2FieldName } from './tq2';
import { TXAFieldName } from './txa';
import { UB1FieldName } from './ub1';
import { UB2FieldName } from './ub2';
import { URDFieldName } from './urd';
import { URSFieldName } from './urs';
import { VARFieldName } from './var';
export { SegmentInfo } from './types';
export declare const allSegmentDefs: SegmentInfo[];
export type SegmentName = 'ABS' | 'ACC' | 'AIG' | 'AIL' | 'AIP' | 'AIS' | 'AL1' | 'BHS' | 'BLG' | 'BTS' | 'CER' | 'CTI' | 'DB1' | 'DG1' | 'DRG' | 'DSC' | 'DSP' | 'ERR' | 'EVN' | 'FAC' | 'FHS' | 'FT1' | 'FTS' | 'GOL' | 'GT1' | 'IN1' | 'IN2' | 'INV' | 'MRG' | 'MSA' | 'MSH' | 'NDS' | 'NK1' | 'NTE' | 'OBR' | 'OBX' | 'ODS' | 'ODT' | 'OM1' | 'OM2' | 'OM3' | 'OM4' | 'OM5' | 'OM6' | 'OM7' | 'ORC' | 'PCR' | 'PD1' | 'PDC' | 'PEO' | 'PID' | 'PR1' | 'PRA' | 'PRB' | 'PSH' | 'PTH' | 'PV1' | 'PV2' | 'QRD' | 'QRF' | 'RGS' | 'ROL' | 'RXA' | 'RXC' | 'RXD' | 'RXE' | 'RXG' | 'RXO' | 'RXR' | 'SAC' | 'SCH' | 'SPM' | 'STF' | 'TQ1' | 'TQ2' | 'TXA' | 'UB1' | 'UB2' | 'URD' | 'URS' | 'VAR';
export interface SegmentFieldNameMap {
    ABS: ABSFieldName;
    ACC: ACCFieldName;
    AIG: AIGFieldName;
    AIL: AILFieldName;
    AIP: AIPFieldName;
    AIS: AISFieldName;
    AL1: AL1FieldName;
    BHS: BHSFieldName;
    BLG: BLGFieldName;
    BTS: BTSFieldName;
    CER: CERFieldName;
    CTI: CTIFieldName;
    DB1: DB1FieldName;
    DG1: DG1FieldName;
    DRG: DRGFieldName;
    DSC: DSCFieldName;
    DSP: DSPFieldName;
    ERR: ERRFieldName;
    EVN: EVNFieldName;
    FAC: FACFieldName;
    FHS: FHSFieldName;
    FT1: FT1FieldName;
    FTS: FTSFieldName;
    GOL: GOLFieldName;
    GT1: GT1FieldName;
    IN1: IN1FieldName;
    IN2: IN2FieldName;
    INV: INVFieldName;
    MRG: MRGFieldName;
    MSA: MSAFieldName;
    MSH: MSHFieldName;
    NDS: NDSFieldName;
    NK1: NK1FieldName;
    NTE: NTEFieldName;
    OBR: OBRFieldName;
    OBX: OBXFieldName;
    ODS: ODSFieldName;
    ODT: ODTFieldName;
    OM1: OM1FieldName;
    OM2: OM2FieldName;
    OM3: OM3FieldName;
    OM4: OM4FieldName;
    OM5: OM5FieldName;
    OM6: OM6FieldName;
    OM7: OM7FieldName;
    ORC: ORCFieldName;
    PCR: PCRFieldName;
    PD1: PD1FieldName;
    PDC: PDCFieldName;
    PEO: PEOFieldName;
    PID: PIDFieldName;
    PR1: PR1FieldName;
    PRA: PRAFieldName;
    PRB: PRBFieldName;
    PSH: PSHFieldName;
    PTH: PTHFieldName;
    PV1: PV1FieldName;
    PV2: PV2FieldName;
    QRD: QRDFieldName;
    QRF: QRFFieldName;
    RGS: RGSFieldName;
    ROL: ROLFieldName;
    RXA: RXAFieldName;
    RXC: RXCFieldName;
    RXD: RXDFieldName;
    RXE: RXEFieldName;
    RXG: RXGFieldName;
    RXO: RXOFieldName;
    RXR: RXRFieldName;
    SAC: SACFieldName;
    SCH: SCHFieldName;
    SPM: SPMFieldName;
    STF: STFFieldName;
    TQ1: TQ1FieldName;
    TQ2: TQ2FieldName;
    TXA: TXAFieldName;
    UB1: UB1FieldName;
    UB2: UB2FieldName;
    URD: URDFieldName;
    URS: URSFieldName;
    VAR: VARFieldName;
}
export interface HL7SegmentBase {
    typeofSegment: string;
    order: number;
    parts: (string | string[])[];
    segmentsFields: SegmentsFields;
    logger: unknown;
    get(nameField: string, joinChar?: string): string | string[] | null;
    set(nameField: string, value: string | string[]): void;
    toMappedObject(compact?: boolean): Record<string, string | string[]>;
}
export interface SegmentsFields {
    [key: string]: string[];
}
export interface ABSSegment extends HL7SegmentBase {
    typeofSegment: 'ABS';
    get(nameField: ABSFieldName, joinChar?: string): string | string[] | null;
    set(nameField: ABSFieldName, value: string | string[]): void;
}
export interface ACCSegment extends HL7SegmentBase {
    typeofSegment: 'ACC';
    get(nameField: ACCFieldName, joinChar?: string): string | string[] | null;
    set(nameField: ACCFieldName, value: string | string[]): void;
}
export interface AIGSegment extends HL7SegmentBase {
    typeofSegment: 'AIG';
    get(nameField: AIGFieldName, joinChar?: string): string | string[] | null;
    set(nameField: AIGFieldName, value: string | string[]): void;
}
export interface AILSegment extends HL7SegmentBase {
    typeofSegment: 'AIL';
    get(nameField: AILFieldName, joinChar?: string): string | string[] | null;
    set(nameField: AILFieldName, value: string | string[]): void;
}
export interface AIPSegment extends HL7SegmentBase {
    typeofSegment: 'AIP';
    get(nameField: AIPFieldName, joinChar?: string): string | string[] | null;
    set(nameField: AIPFieldName, value: string | string[]): void;
}
export interface AISSegment extends HL7SegmentBase {
    typeofSegment: 'AIS';
    get(nameField: AISFieldName, joinChar?: string): string | string[] | null;
    set(nameField: AISFieldName, value: string | string[]): void;
}
export interface AL1Segment extends HL7SegmentBase {
    typeofSegment: 'AL1';
    get(nameField: AL1FieldName, joinChar?: string): string | string[] | null;
    set(nameField: AL1FieldName, value: string | string[]): void;
}
export interface BHSSegment extends HL7SegmentBase {
    typeofSegment: 'BHS';
    get(nameField: BHSFieldName, joinChar?: string): string | string[] | null;
    set(nameField: BHSFieldName, value: string | string[]): void;
}
export interface BLGSegment extends HL7SegmentBase {
    typeofSegment: 'BLG';
    get(nameField: BLGFieldName, joinChar?: string): string | string[] | null;
    set(nameField: BLGFieldName, value: string | string[]): void;
}
export interface BTSSegment extends HL7SegmentBase {
    typeofSegment: 'BTS';
    get(nameField: BTSFieldName, joinChar?: string): string | string[] | null;
    set(nameField: BTSFieldName, value: string | string[]): void;
}
export interface CERSegment extends HL7SegmentBase {
    typeofSegment: 'CER';
    get(nameField: CERFieldName, joinChar?: string): string | string[] | null;
    set(nameField: CERFieldName, value: string | string[]): void;
}
export interface CTISegment extends HL7SegmentBase {
    typeofSegment: 'CTI';
    get(nameField: CTIFieldName, joinChar?: string): string | string[] | null;
    set(nameField: CTIFieldName, value: string | string[]): void;
}
export interface DB1Segment extends HL7SegmentBase {
    typeofSegment: 'DB1';
    get(nameField: DB1FieldName, joinChar?: string): string | string[] | null;
    set(nameField: DB1FieldName, value: string | string[]): void;
}
export interface DG1Segment extends HL7SegmentBase {
    typeofSegment: 'DG1';
    get(nameField: DG1FieldName, joinChar?: string): string | string[] | null;
    set(nameField: DG1FieldName, value: string | string[]): void;
}
export interface DRGSegment extends HL7SegmentBase {
    typeofSegment: 'DRG';
    get(nameField: DRGFieldName, joinChar?: string): string | string[] | null;
    set(nameField: DRGFieldName, value: string | string[]): void;
}
export interface DSCSegment extends HL7SegmentBase {
    typeofSegment: 'DSC';
    get(nameField: DSCFieldName, joinChar?: string): string | string[] | null;
    set(nameField: DSCFieldName, value: string | string[]): void;
}
export interface DSPSegment extends HL7SegmentBase {
    typeofSegment: 'DSP';
    get(nameField: DSPFieldName, joinChar?: string): string | string[] | null;
    set(nameField: DSPFieldName, value: string | string[]): void;
}
export interface ERRSegment extends HL7SegmentBase {
    typeofSegment: 'ERR';
    get(nameField: ERRFieldName, joinChar?: string): string | string[] | null;
    set(nameField: ERRFieldName, value: string | string[]): void;
}
export interface EVNSegment extends HL7SegmentBase {
    typeofSegment: 'EVN';
    get(nameField: EVNFieldName, joinChar?: string): string | string[] | null;
    set(nameField: EVNFieldName, value: string | string[]): void;
}
export interface FACSegment extends HL7SegmentBase {
    typeofSegment: 'FAC';
    get(nameField: FACFieldName, joinChar?: string): string | string[] | null;
    set(nameField: FACFieldName, value: string | string[]): void;
}
export interface FHSSegment extends HL7SegmentBase {
    typeofSegment: 'FHS';
    get(nameField: FHSFieldName, joinChar?: string): string | string[] | null;
    set(nameField: FHSFieldName, value: string | string[]): void;
}
export interface FT1Segment extends HL7SegmentBase {
    typeofSegment: 'FT1';
    get(nameField: FT1FieldName, joinChar?: string): string | string[] | null;
    set(nameField: FT1FieldName, value: string | string[]): void;
}
export interface FTSSegment extends HL7SegmentBase {
    typeofSegment: 'FTS';
    get(nameField: FTSFieldName, joinChar?: string): string | string[] | null;
    set(nameField: FTSFieldName, value: string | string[]): void;
}
export interface GOLSegment extends HL7SegmentBase {
    typeofSegment: 'GOL';
    get(nameField: GOLFieldName, joinChar?: string): string | string[] | null;
    set(nameField: GOLFieldName, value: string | string[]): void;
}
export interface GT1Segment extends HL7SegmentBase {
    typeofSegment: 'GT1';
    get(nameField: GT1FieldName, joinChar?: string): string | string[] | null;
    set(nameField: GT1FieldName, value: string | string[]): void;
}
export interface IN1Segment extends HL7SegmentBase {
    typeofSegment: 'IN1';
    get(nameField: IN1FieldName, joinChar?: string): string | string[] | null;
    set(nameField: IN1FieldName, value: string | string[]): void;
}
export interface IN2Segment extends HL7SegmentBase {
    typeofSegment: 'IN2';
    get(nameField: IN2FieldName, joinChar?: string): string | string[] | null;
    set(nameField: IN2FieldName, value: string | string[]): void;
}
export interface INVSegment extends HL7SegmentBase {
    typeofSegment: 'INV';
    get(nameField: INVFieldName, joinChar?: string): string | string[] | null;
    set(nameField: INVFieldName, value: string | string[]): void;
}
export interface MRGSegment extends HL7SegmentBase {
    typeofSegment: 'MRG';
    get(nameField: MRGFieldName, joinChar?: string): string | string[] | null;
    set(nameField: MRGFieldName, value: string | string[]): void;
}
export interface MSASegment extends HL7SegmentBase {
    typeofSegment: 'MSA';
    get(nameField: MSAFieldName, joinChar?: string): string | string[] | null;
    set(nameField: MSAFieldName, value: string | string[]): void;
}
export interface MSHSegment extends HL7SegmentBase {
    typeofSegment: 'MSH';
    get(nameField: MSHFieldName, joinChar?: string): string | string[] | null;
    set(nameField: MSHFieldName, value: string | string[]): void;
}
export interface NDSSegment extends HL7SegmentBase {
    typeofSegment: 'NDS';
    get(nameField: NDSFieldName, joinChar?: string): string | string[] | null;
    set(nameField: NDSFieldName, value: string | string[]): void;
}
export interface NK1Segment extends HL7SegmentBase {
    typeofSegment: 'NK1';
    get(nameField: NK1FieldName, joinChar?: string): string | string[] | null;
    set(nameField: NK1FieldName, value: string | string[]): void;
}
export interface NTESegment extends HL7SegmentBase {
    typeofSegment: 'NTE';
    get(nameField: NTEFieldName, joinChar?: string): string | string[] | null;
    set(nameField: NTEFieldName, value: string | string[]): void;
}
export interface OBRSegment extends HL7SegmentBase {
    typeofSegment: 'OBR';
    get(nameField: OBRFieldName, joinChar?: string): string | string[] | null;
    set(nameField: OBRFieldName, value: string | string[]): void;
}
export interface OBXSegment extends HL7SegmentBase {
    typeofSegment: 'OBX';
    get(nameField: OBXFieldName, joinChar?: string): string | string[] | null;
    set(nameField: OBXFieldName, value: string | string[]): void;
}
export interface ODSSegment extends HL7SegmentBase {
    typeofSegment: 'ODS';
    get(nameField: ODSFieldName, joinChar?: string): string | string[] | null;
    set(nameField: ODSFieldName, value: string | string[]): void;
}
export interface ODTSegment extends HL7SegmentBase {
    typeofSegment: 'ODT';
    get(nameField: ODTFieldName, joinChar?: string): string | string[] | null;
    set(nameField: ODTFieldName, value: string | string[]): void;
}
export interface OM1Segment extends HL7SegmentBase {
    typeofSegment: 'OM1';
    get(nameField: OM1FieldName, joinChar?: string): string | string[] | null;
    set(nameField: OM1FieldName, value: string | string[]): void;
}
export interface OM2Segment extends HL7SegmentBase {
    typeofSegment: 'OM2';
    get(nameField: OM2FieldName, joinChar?: string): string | string[] | null;
    set(nameField: OM2FieldName, value: string | string[]): void;
}
export interface OM3Segment extends HL7SegmentBase {
    typeofSegment: 'OM3';
    get(nameField: OM3FieldName, joinChar?: string): string | string[] | null;
    set(nameField: OM3FieldName, value: string | string[]): void;
}
export interface OM4Segment extends HL7SegmentBase {
    typeofSegment: 'OM4';
    get(nameField: OM4FieldName, joinChar?: string): string | string[] | null;
    set(nameField: OM4FieldName, value: string | string[]): void;
}
export interface OM5Segment extends HL7SegmentBase {
    typeofSegment: 'OM5';
    get(nameField: OM5FieldName, joinChar?: string): string | string[] | null;
    set(nameField: OM5FieldName, value: string | string[]): void;
}
export interface OM6Segment extends HL7SegmentBase {
    typeofSegment: 'OM6';
    get(nameField: OM6FieldName, joinChar?: string): string | string[] | null;
    set(nameField: OM6FieldName, value: string | string[]): void;
}
export interface OM7Segment extends HL7SegmentBase {
    typeofSegment: 'OM7';
    get(nameField: OM7FieldName, joinChar?: string): string | string[] | null;
    set(nameField: OM7FieldName, value: string | string[]): void;
}
export interface ORCSegment extends HL7SegmentBase {
    typeofSegment: 'ORC';
    get(nameField: ORCFieldName, joinChar?: string): string | string[] | null;
    set(nameField: ORCFieldName, value: string | string[]): void;
}
export interface PCRSegment extends HL7SegmentBase {
    typeofSegment: 'PCR';
    get(nameField: PCRFieldName, joinChar?: string): string | string[] | null;
    set(nameField: PCRFieldName, value: string | string[]): void;
}
export interface PD1Segment extends HL7SegmentBase {
    typeofSegment: 'PD1';
    get(nameField: PD1FieldName, joinChar?: string): string | string[] | null;
    set(nameField: PD1FieldName, value: string | string[]): void;
}
export interface PDCSegment extends HL7SegmentBase {
    typeofSegment: 'PDC';
    get(nameField: PDCFieldName, joinChar?: string): string | string[] | null;
    set(nameField: PDCFieldName, value: string | string[]): void;
}
export interface PEOSegment extends HL7SegmentBase {
    typeofSegment: 'PEO';
    get(nameField: PEOFieldName, joinChar?: string): string | string[] | null;
    set(nameField: PEOFieldName, value: string | string[]): void;
}
export interface PIDSegment extends HL7SegmentBase {
    typeofSegment: 'PID';
    get(nameField: PIDFieldName, joinChar?: string): string | string[] | null;
    set(nameField: PIDFieldName, value: string | string[]): void;
}
export interface PR1Segment extends HL7SegmentBase {
    typeofSegment: 'PR1';
    get(nameField: PR1FieldName, joinChar?: string): string | string[] | null;
    set(nameField: PR1FieldName, value: string | string[]): void;
}
export interface PRASegment extends HL7SegmentBase {
    typeofSegment: 'PRA';
    get(nameField: PRAFieldName, joinChar?: string): string | string[] | null;
    set(nameField: PRAFieldName, value: string | string[]): void;
}
export interface PRBSegment extends HL7SegmentBase {
    typeofSegment: 'PRB';
    get(nameField: PRBFieldName, joinChar?: string): string | string[] | null;
    set(nameField: PRBFieldName, value: string | string[]): void;
}
export interface PSHSegment extends HL7SegmentBase {
    typeofSegment: 'PSH';
    get(nameField: PSHFieldName, joinChar?: string): string | string[] | null;
    set(nameField: PSHFieldName, value: string | string[]): void;
}
export interface PTHSegment extends HL7SegmentBase {
    typeofSegment: 'PTH';
    get(nameField: PTHFieldName, joinChar?: string): string | string[] | null;
    set(nameField: PTHFieldName, value: string | string[]): void;
}
export interface PV1Segment extends HL7SegmentBase {
    typeofSegment: 'PV1';
    get(nameField: PV1FieldName, joinChar?: string): string | string[] | null;
    set(nameField: PV1FieldName, value: string | string[]): void;
}
export interface PV2Segment extends HL7SegmentBase {
    typeofSegment: 'PV2';
    get(nameField: PV2FieldName, joinChar?: string): string | string[] | null;
    set(nameField: PV2FieldName, value: string | string[]): void;
}
export interface QRDSegment extends HL7SegmentBase {
    typeofSegment: 'QRD';
    get(nameField: QRDFieldName, joinChar?: string): string | string[] | null;
    set(nameField: QRDFieldName, value: string | string[]): void;
}
export interface QRFSegment extends HL7SegmentBase {
    typeofSegment: 'QRF';
    get(nameField: QRFFieldName, joinChar?: string): string | string[] | null;
    set(nameField: QRFFieldName, value: string | string[]): void;
}
export interface RGSSegment extends HL7SegmentBase {
    typeofSegment: 'RGS';
    get(nameField: RGSFieldName, joinChar?: string): string | string[] | null;
    set(nameField: RGSFieldName, value: string | string[]): void;
}
export interface ROLSegment extends HL7SegmentBase {
    typeofSegment: 'ROL';
    get(nameField: ROLFieldName, joinChar?: string): string | string[] | null;
    set(nameField: ROLFieldName, value: string | string[]): void;
}
export interface RXASegment extends HL7SegmentBase {
    typeofSegment: 'RXA';
    get(nameField: RXAFieldName, joinChar?: string): string | string[] | null;
    set(nameField: RXAFieldName, value: string | string[]): void;
}
export interface RXCSegment extends HL7SegmentBase {
    typeofSegment: 'RXC';
    get(nameField: RXCFieldName, joinChar?: string): string | string[] | null;
    set(nameField: RXCFieldName, value: string | string[]): void;
}
export interface RXDSegment extends HL7SegmentBase {
    typeofSegment: 'RXD';
    get(nameField: RXDFieldName, joinChar?: string): string | string[] | null;
    set(nameField: RXDFieldName, value: string | string[]): void;
}
export interface RXESegment extends HL7SegmentBase {
    typeofSegment: 'RXE';
    get(nameField: RXEFieldName, joinChar?: string): string | string[] | null;
    set(nameField: RXEFieldName, value: string | string[]): void;
}
export interface RXGSegment extends HL7SegmentBase {
    typeofSegment: 'RXG';
    get(nameField: RXGFieldName, joinChar?: string): string | string[] | null;
    set(nameField: RXGFieldName, value: string | string[]): void;
}
export interface RXOSegment extends HL7SegmentBase {
    typeofSegment: 'RXO';
    get(nameField: RXOFieldName, joinChar?: string): string | string[] | null;
    set(nameField: RXOFieldName, value: string | string[]): void;
}
export interface RXRSegment extends HL7SegmentBase {
    typeofSegment: 'RXR';
    get(nameField: RXRFieldName, joinChar?: string): string | string[] | null;
    set(nameField: RXRFieldName, value: string | string[]): void;
}
export interface SACSegment extends HL7SegmentBase {
    typeofSegment: 'SAC';
    get(nameField: SACFieldName, joinChar?: string): string | string[] | null;
    set(nameField: SACFieldName, value: string | string[]): void;
}
export interface SCHSegment extends HL7SegmentBase {
    typeofSegment: 'SCH';
    get(nameField: SCHFieldName, joinChar?: string): string | string[] | null;
    set(nameField: SCHFieldName, value: string | string[]): void;
}
export interface SPMSegment extends HL7SegmentBase {
    typeofSegment: 'SPM';
    get(nameField: SPMFieldName, joinChar?: string): string | string[] | null;
    set(nameField: SPMFieldName, value: string | string[]): void;
}
export interface STFSegment extends HL7SegmentBase {
    typeofSegment: 'STF';
    get(nameField: STFFieldName, joinChar?: string): string | string[] | null;
    set(nameField: STFFieldName, value: string | string[]): void;
}
export interface TQ1Segment extends HL7SegmentBase {
    typeofSegment: 'TQ1';
    get(nameField: TQ1FieldName, joinChar?: string): string | string[] | null;
    set(nameField: TQ1FieldName, value: string | string[]): void;
}
export interface TQ2Segment extends HL7SegmentBase {
    typeofSegment: 'TQ2';
    get(nameField: TQ2FieldName, joinChar?: string): string | string[] | null;
    set(nameField: TQ2FieldName, value: string | string[]): void;
}
export interface TXASegment extends HL7SegmentBase {
    typeofSegment: 'TXA';
    get(nameField: TXAFieldName, joinChar?: string): string | string[] | null;
    set(nameField: TXAFieldName, value: string | string[]): void;
}
export interface UB1Segment extends HL7SegmentBase {
    typeofSegment: 'UB1';
    get(nameField: UB1FieldName, joinChar?: string): string | string[] | null;
    set(nameField: UB1FieldName, value: string | string[]): void;
}
export interface UB2Segment extends HL7SegmentBase {
    typeofSegment: 'UB2';
    get(nameField: UB2FieldName, joinChar?: string): string | string[] | null;
    set(nameField: UB2FieldName, value: string | string[]): void;
}
export interface URDSegment extends HL7SegmentBase {
    typeofSegment: 'URD';
    get(nameField: URDFieldName, joinChar?: string): string | string[] | null;
    set(nameField: URDFieldName, value: string | string[]): void;
}
export interface URSSegment extends HL7SegmentBase {
    typeofSegment: 'URS';
    get(nameField: URSFieldName, joinChar?: string): string | string[] | null;
    set(nameField: URSFieldName, value: string | string[]): void;
}
export interface VARSegment extends HL7SegmentBase {
    typeofSegment: 'VAR';
    get(nameField: VARFieldName, joinChar?: string): string | string[] | null;
    set(nameField: VARFieldName, value: string | string[]): void;
}
export interface SegmentTypeMap {
    ABS: ABSSegment;
    ACC: ACCSegment;
    AIG: AIGSegment;
    AIL: AILSegment;
    AIP: AIPSegment;
    AIS: AISSegment;
    AL1: AL1Segment;
    BHS: BHSSegment;
    BLG: BLGSegment;
    BTS: BTSSegment;
    CER: CERSegment;
    CTI: CTISegment;
    DB1: DB1Segment;
    DG1: DG1Segment;
    DRG: DRGSegment;
    DSC: DSCSegment;
    DSP: DSPSegment;
    ERR: ERRSegment;
    EVN: EVNSegment;
    FAC: FACSegment;
    FHS: FHSSegment;
    FT1: FT1Segment;
    FTS: FTSSegment;
    GOL: GOLSegment;
    GT1: GT1Segment;
    IN1: IN1Segment;
    IN2: IN2Segment;
    INV: INVSegment;
    MRG: MRGSegment;
    MSA: MSASegment;
    MSH: MSHSegment;
    NDS: NDSSegment;
    NK1: NK1Segment;
    NTE: NTESegment;
    OBR: OBRSegment;
    OBX: OBXSegment;
    ODS: ODSSegment;
    ODT: ODTSegment;
    OM1: OM1Segment;
    OM2: OM2Segment;
    OM3: OM3Segment;
    OM4: OM4Segment;
    OM5: OM5Segment;
    OM6: OM6Segment;
    OM7: OM7Segment;
    ORC: ORCSegment;
    PCR: PCRSegment;
    PD1: PD1Segment;
    PDC: PDCSegment;
    PEO: PEOSegment;
    PID: PIDSegment;
    PR1: PR1Segment;
    PRA: PRASegment;
    PRB: PRBSegment;
    PSH: PSHSegment;
    PTH: PTHSegment;
    PV1: PV1Segment;
    PV2: PV2Segment;
    QRD: QRDSegment;
    QRF: QRFSegment;
    RGS: RGSSegment;
    ROL: ROLSegment;
    RXA: RXASegment;
    RXC: RXCSegment;
    RXD: RXDSegment;
    RXE: RXESegment;
    RXG: RXGSegment;
    RXO: RXOSegment;
    RXR: RXRSegment;
    SAC: SACSegment;
    SCH: SCHSegment;
    SPM: SPMSegment;
    STF: STFSegment;
    TQ1: TQ1Segment;
    TQ2: TQ2Segment;
    TXA: TXASegment;
    UB1: UB1Segment;
    UB2: UB2Segment;
    URD: URDSegment;
    URS: URSSegment;
    VAR: VARSegment;
}
//# sourceMappingURL=index.d.ts.map