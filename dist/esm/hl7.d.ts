import { EventEmitter } from 'events';
interface Delimiters {
    composite: string;
    subComposite: string;
    repetitions: string;
    escapeChar: string;
    subComponent: string;
}
interface HL7ParserOptions {
    mapping?: boolean;
    logger?: any;
    fs?: any;
    fileEncoding?: string;
}
interface SegmentsFields {
    [key: string]: string[];
}
declare class Hl7Message {
    segments: HL7Segment[];
    delimiters: Delimiters;
    friendlyID: string;
    constructor(segments: HL7Segment[], delimiters: Delimiters, friendlyID: string);
    get(segmentName: string, fieldName?: string, joinChar?: string): any;
    set(segmentName: string, fieldName?: string, value?: any): void;
    getSegmentAt(counter: number): HL7Segment | null;
    size(): number;
    getSegments(segmentName: string, nmbr?: number, fieldName?: string, joinChar?: string): HL7Segment[] | HL7Segment | any | null;
}
declare class HL7Segment {
    typeofSegment: string;
    order: number;
    parts: any[];
    segmentsFields: SegmentsFields;
    logger: any;
    constructor(typeofSegment: string, order: number, parts: any[]);
    toMappedObject(compact?: boolean): any;
    get(nameField: string, joinChar?: string): any;
    set(nameField: string, value: any): void;
}
declare class hl7Parser extends EventEmitter {
    options: HL7ParserOptions;
    logger: any;
    readonly EMPTY: number;
    readonly INVALID: number;
    readonly IOERROR: number;
    HL7Segment: typeof HL7Segment;
    constructor(options?: HL7ParserOptions);
    parse(messageContent: string, ID: string, wrappedDone?: (err: any, hl7msg?: Hl7Message) => void): Promise<Hl7Message>;
    parseFile(filepath: string, wrappedDone?: (err: any, message?: Hl7Message) => void): Promise<Hl7Message>;
}
export default hl7Parser;
//# sourceMappingURL=hl7.d.ts.map