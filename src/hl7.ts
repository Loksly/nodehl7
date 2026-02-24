/* https://www.hl7.org/documentcenter/public_temp_B4666D56-1C23-BA17-0C6D54722F8A5135/wg/conf/Msgadt.pdf */
import { EventEmitter } from 'events';
import * as encoding from 'encoding';
import * as fs from 'fs';
import { allSegmentDefs, SegmentName, SegmentTypeMap, SegmentsFields } from './segments';

export { SegmentName, SegmentTypeMap, SegmentsFields } from './segments';
export type { SegmentFieldNameMap, HL7SegmentBase } from './segments';

let validSegmentsName: string[] = [];

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

interface Equivalence {
	key: RegExp;
	value: string;
}

const shallowClone = function<T>(obj: T): T {
	const copy = {} as T;
	for (const name in obj){
		copy[name] = obj[name];
	}
	return copy;
};

class Hl7Message {
	segments: HL7Segment[];
	delimiters: Delimiters;
	friendlyID: string;

	constructor(segments: HL7Segment[], delimiters: Delimiters, friendlyID: string) {
		this.segments = segments;
		this.delimiters = delimiters;
		this.friendlyID = friendlyID;
	}

	get<S extends SegmentName>(segmentName: S): SegmentTypeMap[S] | null;
	get<S extends SegmentName>(segmentName: S, fieldName: string, joinChar?: string): string | string[] | null;
	get(segmentName: string): HL7Segment | null;
	get(segmentName: string, fieldName: string, joinChar?: string): string | string[] | null;
	get(segmentName: string, fieldName?: string, joinChar?: string): HL7Segment | string | string[] | null {
		for (let i = 0, j = this.segments.length; i < j; i++){
			if (this.segments[i].typeofSegment === segmentName){
				if (typeof fieldName === 'undefined'){
					return this.segments[i];
				}
				return this.segments[i].get(fieldName, joinChar);
			}
		}
		return null;
	}

	set(segmentName: string, fieldName?: string, value?: string | string[]): void {
		for (let i = 0, j = this.segments.length; i < j; i++){
			if (this.segments[i].typeofSegment === segmentName){
				if (typeof fieldName === 'undefined' || typeof value === 'undefined'){
					return;
				}
				this.segments[i].set(fieldName, value);
			}
		}
	}

	getSegmentAt(counter: number): HL7Segment | null {
		return (typeof this.segments[counter] === 'object') ? this.segments[counter] : null;
	}

	size(): number {
		return this.segments.length;
	}

	getSegments(segmentName: string): HL7Segment[];
	getSegments(segmentName: string, nmbr: number): HL7Segment | null;
	getSegments(segmentName: string, nmbr: number, fieldName: string, joinChar?: string): string | string[] | null;
	getSegments(segmentName: string, nmbr?: number, fieldName?: string, joinChar?: string): HL7Segment[] | HL7Segment | string | string[] | null {
		const returningValue: HL7Segment[] = [];
		for (let i = 0, j = this.segments.length; i < j; i++){
			if (this.segments[i].typeofSegment === segmentName){
				if (typeof nmbr === 'undefined'){
					returningValue.push(this.segments[i]);
				} else {
					if (nmbr === returningValue.length){
						if (typeof fieldName === 'undefined'){
							return this.segments[i];
						}
						return this.segments[i].get(fieldName, joinChar);
					}
					returningValue.push(this.segments[i]);
				}
			}
		}
		if (typeof nmbr === 'undefined'){
			return returningValue;
		}
		return null;
	}
}

class HL7Segment {
	typeofSegment: string;
	order: number;
	parts: (string | string[])[];
	segmentsFields: SegmentsFields;
	logger: HL7Logger;

	constructor(typeofSegment: string, order: number, parts: (string | string[])[]) {
		this.typeofSegment = typeofSegment;
		this.order = order;
		this.parts = parts;
	}

	toMappedObject(compact?: boolean): Record<string, string | string[]> {
		if (typeof this.segmentsFields[ this.typeofSegment ] === 'object')
		{
			if (typeof compact === 'undefined'){
				compact = false;
			}

			const obj: Record<string, string | string[]> = {};
			const fields = this.segmentsFields[ this.typeofSegment ];

			for (let i = 0; i < this.parts.length && i < fields.length; i++){
				if (!compact || this.parts[i] !== ''){
					obj[ fields[i] ] = this.parts[i];
				}
			}
			return obj;
		} else {
			if (this.logger) {
				this.logger.error('ERROR, unknown segmentType: ' + this.typeofSegment);
			}
			return {};
		}
	}

	get(nameField: string, joinChar?: string): string | string[] | null {
		if (typeof this.segmentsFields[this.typeofSegment] !== 'undefined'){
			const idx = this.segmentsFields[this.typeofSegment].indexOf(nameField);
			if (idx >= 0 && typeof joinChar !== 'undefined' && (typeof this.parts[idx] === 'object')){
				return (this.parts[idx] as string[]).join(joinChar);
			} else {
				return (idx < 0) ? null : this.parts[idx];
			}
		}
		return null;
	}

	set(nameField: string, value: string | string[]): void {
		if (typeof this.segmentsFields[this.typeofSegment] !== 'undefined'){
			const idx = this.segmentsFields[this.typeofSegment].indexOf(nameField);
			if (idx >= 0){
				this.parts[idx] = value;
			}
		}
	}
}

const endsWith = function(str: string, searchString: string, position?: number): boolean {
	const subjectString = str.toString();
	if (position === undefined || position > subjectString.length) {
		position = subjectString.length;
	}
	position -= searchString.length;
	const lastIndex = subjectString.indexOf(searchString, position);
	return lastIndex !== -1 && lastIndex === position;
};

function getDelimiters(mshsegment: string): Delimiters | null {
	if (mshsegment.length < 9){ return null; }
	return {
		composite: mshsegment.substring(3, 4), // |
		subComposite: mshsegment.substring(4, 5), // ^
		repetitions: mshsegment.substring(5, 6), // ~
		escapeChar: mshsegment.substring(6, 7), // \
		subComponent: mshsegment.substring(7, 8)  // &
	};
}

const escapeChars = function(text: string, equivalences: Equivalence[]): string {
	for (const e in equivalences){
		text = text.replace(equivalences[e].key, equivalences[e].value);
	}
	return text;
};

function validSegmentType(segmentname: string, ID: string, logger: HL7Logger): boolean {
	if (validSegmentsName.indexOf(segmentname) < 0){
		if (logger){
			logger.error('Unknown segmentType (' + ID + '): ' + segmentname);
		}
		return (segmentname.length === 3);
	}
	return true;
}

function isRecoverable(typeofSegment: string, parts: (string | string[])[], isFirst: boolean): boolean {
	return	(
				(parts.length > 0 &&
					( endsWith(String(parts[parts.length - 1]), '\\X000d\\') ) ) || endsWith(typeofSegment, '\\X000d\\')
			) && !isFirst;
}

function escapeRegExp(string: string): string {
	return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
}

class hl7Parser extends EventEmitter {
	options: HL7ParserOptions;
	logger: HL7Logger;
	readonly EMPTY: number = 1000;
	readonly INVALID: number = 2000;
	readonly IOERROR: number = 3000;
	HL7Segment: typeof HL7Segment;

	constructor(options: HL7ParserOptions = {}) {
		super();
		options = shallowClone(options);
		this.options = options;
		this.logger = this.options.logger || console;
		if (typeof this.options.mapping === 'undefined'){
			this.options.mapping = false;
		}
		if (typeof this.options.fs === 'undefined'){
			this.options.fs = fs;
		}
		this.HL7Segment = HL7Segment;
	}

	parse(messageContent: string, ID: string, wrappedDone?: (err: unknown, hl7msg?: Hl7Message) => void): Promise<Hl7Message> {
		const self = this;

		return new Promise<Hl7Message>((resolve, reject) => {
			const fn = function(donefn: (err: unknown, result?: Hl7Message) => void, resultValue: Hl7Message){
				return function(){
					donefn(null, resultValue);
				};
			};

			const done = function(err: unknown, hl7msg?: Hl7Message){
				if (err){
					if (self.listeners('error').length > 0){
						self.emit('error', err);
					}
					// Call callback if provided
					if (wrappedDone){
						wrappedDone(err, hl7msg);
					}
					// Reject promise
					reject(err);
				}else {
					if (self.listeners('message').length > 0) {
						self.emit('message', hl7msg);
					}
					if (hl7msg) {
						const tipoMsg = hl7msg.get('EVN', 'Event Type Code');

						if (tipoMsg !== null && typeof tipoMsg === 'string' && self.listeners(tipoMsg).length > 0){
							self.emit(tipoMsg, hl7msg);
						}
					}
					// Call callback if provided
					if (wrappedDone){
						wrappedDone(null, hl7msg);
					}
					// Resolve promise
					resolve(hl7msg!);
				}
			};


		const segmentslines = messageContent.trim().split('\r');
		const result: HL7Segment[] = [];
		if (segmentslines.length === 0)
		{
			done({errortype: self.EMPTY});
		} else {
			const delimiters = getDelimiters(segmentslines[0]);
			if (!delimiters) {
				done({errortype: self.INVALID});
				return;
			}
			//@TODO: http://docs.intersystems.com/ens20131/csp/docbook/DocBook.UI.Page.cls?KEY=EHL72_escape_sequences
			const equivalences: Equivalence[] = [
				{
					key: new RegExp(escapeRegExp(delimiters.escapeChar + 'F' + delimiters.escapeChar), 'g'),
					value: delimiters.subComposite // |
				},
				{
					key: new RegExp(escapeRegExp(delimiters.escapeChar + 'S' + delimiters.escapeChar), 'g'),
					value: delimiters.composite // |
				},
				{
					key: new RegExp(escapeRegExp(delimiters.escapeChar + 'R' + delimiters.escapeChar), 'g'),
					value: delimiters.repetitions // ~
				},
				{
					key: new RegExp(escapeRegExp(delimiters.escapeChar + 'E' + delimiters.escapeChar), 'g'),
					value: delimiters.escapeChar // \
				},
				{
					key: new RegExp(escapeRegExp(delimiters.escapeChar + 'T' + delimiters.escapeChar), 'g'),
					value: delimiters.subComponent // &
				},
				{
					key: new RegExp(escapeRegExp(delimiters.escapeChar + 'X000d' + delimiters.escapeChar), 'g'),
					value: '\r'
				},
				{
					key: new RegExp(escapeRegExp(delimiters.escapeChar + 'X0d' + delimiters.escapeChar), 'g'),
					value: '\r'
				}
			];


			let previousTypeOfSegment = '', previousparts: (string | string[])[] = [], previousorder = -1;
			for (let segmentnumber = 0, segmentmax = segmentslines.length; segmentnumber < segmentmax; segmentnumber++)
			{
				const line = segmentslines[segmentnumber].trim();
				if (line !== '')
				{
					const parts: (string | string[])[] = line.split(delimiters.composite);
					if (parts.length > 0){
						let typeofSegment = (parts.shift() as string).trim();

						if (!validSegmentType(typeofSegment, ID, self.logger)){
							if (isRecoverable(previousTypeOfSegment, previousparts, segmentnumber === 0)){
								previousparts[ previousparts.length - 1 ] += '\\X000a\\' + typeofSegment;
								if (parts.length > 0){
									previousparts = previousparts.concat(parts);
								}
								result[ result.length - 1] = new HL7Segment(previousTypeOfSegment, previousorder, previousparts);
								continue;
							} else {
								done({errortype: self.INVALID});
								return;
							}
						}

						for (let numberOfPart = 0, numberOfParts = parts.length; numberOfPart < numberOfParts; numberOfPart++){
							const part = parts[numberOfPart] as string;

							if (((segmentnumber === 0 && numberOfPart !== 0) || segmentnumber !== 0) && part.indexOf(delimiters.subComposite) >= 0 ){
								let subdivisions = part.split(delimiters.subComposite);
								for (let subdivisionsIdx = 0, numberOfSubdivisions = subdivisions.length; subdivisionsIdx < numberOfSubdivisions; subdivisionsIdx++){
									subdivisions[subdivisionsIdx] = escapeChars(subdivisions[subdivisionsIdx], equivalences );
								}
								parts[numberOfPart] = subdivisions;
							} else {
								parts[numberOfPart] = escapeChars(part as string, equivalences);
							}
						}

						result.push( new HL7Segment(typeofSegment, previousorder + 1, parts) );

						previousTypeOfSegment = typeofSegment;
						previousparts = parts;
						previousorder = previousorder + 1;
					}
				}
			}
			const r = new Hl7Message(result, delimiters, ID);
			process.nextTick(fn(done, r));
		}
		});
	}

	parseFile(filepath: string, wrappedDone?: (err: unknown, message?: Hl7Message) => void): Promise<Hl7Message> {
		const self = this;
		const fileEncoding = self.options.fileEncoding;
		const fsModule = self.options.fs!;

		return new Promise<Hl7Message>((resolve, reject) => {
			fsModule.stat(filepath, function(err: NodeJS.ErrnoException | null, stats: fs.Stats) {
				if (err){
					if (self.listeners('error').length > 0){
						self.emit('error', err);
					}
					if (typeof wrappedDone === 'function'){
						wrappedDone(err);
					}
					reject(err);
					return;
				}

				fsModule.open(filepath, 'r', function(erro: NodeJS.ErrnoException | null, fd: number) {
					if (erro || !fd) {
						if (fd){
							fsModule.close(fd, () => {});
						}
						if (self.listeners('error').length > 0){
							self.emit('error', erro);
						}
						if (typeof wrappedDone === 'function'){
							wrappedDone(erro);
						}
						reject(erro);
						return;
					}
					const size = stats.size;
					if (size <= 0){
						if (fd){
							fsModule.close(fd, () => {});
						}
						const error = { msg: 'Size <=0 (' + size + ')', friendlyID: filepath};
						if (self.listeners('error').length > 0){
							self.emit('error', error);
						}
						if (typeof wrappedDone === 'function'){
							wrappedDone(error);
						}
						reject(error);
						return;
					}
					const readBuffer = Buffer.alloc(size);
					const bufferOffset = 0;
					const bufferLength = readBuffer.length;
					const filePosition = 0;
					fsModule.read(fd, readBuffer, bufferOffset, bufferLength, filePosition,
						function (fail: NodeJS.ErrnoException | null, readBytes: number) {
							if (fd) {
								fsModule.close(fd, function(err: NodeJS.ErrnoException | null){
									if (err){
										self.logger.error(err);
									}
								});
							}
							if (fail) {
								const ioerro = { errortype: self.IOERROR, details: fail };
								if (self.listeners('error').length > 0){
									self.emit('error', ioerro);
								}
								if (typeof wrappedDone === 'function'){
									wrappedDone(ioerro);
								}
								reject(ioerro);
								return;
							}
							if (readBytes > 0) {
								const msg = fileEncoding !== 'utf8' ? encoding.convert(readBuffer, 'utf8', fileEncoding).toString('utf8') : readBuffer.toString('utf8');
								// Parse returns a promise now, so we need to handle it
								self.parse(msg, filepath, wrappedDone)
									.then(resolve)
									.catch(reject);
							}
						}
					);
				});
			});
		});
	}
}

function getSegmentsInformation(): void {
	validSegmentsName = allSegmentDefs.map(function(segDef) {
		return segDef.name;
	});

	HL7Segment.prototype.segmentsFields = allSegmentDefs.reduce(function(p: SegmentsFields, c) {
		p[c.name] = c.fields as unknown as string[];
		return p;
	}, {} as SegmentsFields);
}

getSegmentsInformation();

// Re-export MLLP module
export { MLLPServer, MLLPClient, wrap as mllpWrap, unwrap as mllpUnwrap, VT, FS_CR } from './mllp';

// CommonJS export
const mllp = require('./mllp');
module.exports = hl7Parser;
module.exports.MLLPServer = mllp.MLLPServer;
module.exports.MLLPClient = mllp.MLLPClient;
module.exports.mllpWrap = mllp.wrap;
module.exports.mllpUnwrap = mllp.unwrap;

// ES module default export for TypeScript
export default hl7Parser;
