import { EventEmitter } from 'events';
import * as fs from 'fs';
import { SegmentName, SegmentTypeMap, SegmentsFields } from './segments';
export { SegmentName, SegmentTypeMap, SegmentsFields } from './segments';
export type { SegmentFieldNameMap, HL7SegmentBase } from './segments';
type HL7Logger = Pick<Console, 'error'>;
type HL7FileSystem = Pick<typeof fs, 'stat' | 'open' | 'close' | 'read'>;
interface Delimiters {
    composite: string;
    subComposite: string;
    repetitions: string;
    escapeChar: string;
    subComponent: string;
}
interface HL7ParserOptions {
    mapping?: boolean;
    logger?: HL7Logger;
    fs?: HL7FileSystem;
    fileEncoding?: string;
}
declare class Hl7Message {
    segments: HL7Segment[];
    delimiters: Delimiters;
    friendlyID: string;
    constructor(segments: HL7Segment[], delimiters: Delimiters, friendlyID: string);
    get<S extends SegmentName>(segmentName: S): SegmentTypeMap[S] | null;
    get<S extends SegmentName>(segmentName: S, fieldName: string, joinChar?: string): string | string[] | null;
    get(segmentName: string): HL7Segment | null;
    get(segmentName: string, fieldName: string, joinChar?: string): string | string[] | null;
    set(segmentName: string, fieldName?: string, value?: string | string[]): void;
    getSegmentAt(counter: number): HL7Segment | null;
    size(): number;
    getSegments(segmentName: string): HL7Segment[];
    getSegments(segmentName: string, nmbr: number): HL7Segment | null;
    getSegments(segmentName: string, nmbr: number, fieldName: string, joinChar?: string): string | string[] | null;
    toFHIR(): Record<string, unknown>;
}
declare class HL7Segment {
    typeofSegment: string;
    order: number;
    parts: (string | string[])[];
    segmentsFields: SegmentsFields;
    logger: HL7Logger;
    constructor(typeofSegment: string, order: number, parts: (string | string[])[]);
    toMappedObject(compact?: boolean): Record<string, string | string[]>;
    get(nameField: string, joinChar?: string): string | string[] | null;
    set(nameField: string, value: string | string[]): void;
}
declare class hl7Parser extends EventEmitter {
    options: HL7ParserOptions;
    logger: HL7Logger;
    readonly EMPTY: number;
    readonly INVALID: number;
    readonly IOERROR: number;
    HL7Segment: typeof HL7Segment;
    constructor(options?: HL7ParserOptions);
    parse(messageContent: string, ID: string, wrappedDone?: (err: unknown, hl7msg?: Hl7Message) => void): Promise<Hl7Message>;
    parseXML(xmlContent: string, ID: string, wrappedDone?: (err: unknown, hl7msg?: Hl7Message) => void): Promise<Hl7Message>;
    parseFile(filepath: string, wrappedDone?: (err: unknown, message?: Hl7Message) => void): Promise<Hl7Message>;
}
export { MLLPServer, MLLPClient, wrap as mllpWrap, unwrap as mllpUnwrap, VT, FS_CR } from './mllp';
export default hl7Parser;
//# sourceMappingURL=hl7.d.ts.map