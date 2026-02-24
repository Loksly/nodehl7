"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.FS_CR = exports.VT = exports.mllpUnwrap = exports.mllpWrap = exports.MLLPClient = exports.MLLPServer = void 0;
/* https://www.hl7.org/documentcenter/public_temp_B4666D56-1C23-BA17-0C6D54722F8A5135/wg/conf/Msgadt.pdf */
const events_1 = require("events");
const encoding = __importStar(require("encoding"));
const fs = __importStar(require("fs"));
const segments_1 = require("./segments");
let validSegmentsName = [];
function decodeXMLEntities(text) {
    return text
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&amp;/g, '&');
}
function parseXMLDocument(xmlStr) {
    xmlStr = xmlStr.replace(/<\?[\s\S]*?\?>/g, '');
    let commentStart = xmlStr.indexOf('<!--');
    while (commentStart >= 0) {
        const commentEnd = xmlStr.indexOf('-->', commentStart);
        if (commentEnd < 0) {
            xmlStr = xmlStr.slice(0, commentStart);
            break;
        }
        xmlStr = xmlStr.slice(0, commentStart) + xmlStr.slice(commentEnd + 3);
        commentStart = xmlStr.indexOf('<!--');
    }
    xmlStr = xmlStr.trim();
    const stack = [];
    let root = null;
    let pos = 0;
    while (pos < xmlStr.length) {
        const ltPos = xmlStr.indexOf('<', pos);
        if (ltPos < 0)
            break;
        if (ltPos > pos) {
            const text = decodeXMLEntities(xmlStr.slice(pos, ltPos));
            if (text.trim() && stack.length > 0) {
                stack[stack.length - 1].text += text;
            }
        }
        const gtPos = xmlStr.indexOf('>', ltPos);
        if (gtPos < 0)
            break;
        const tagStr = xmlStr.slice(ltPos + 1, gtPos);
        if (tagStr.startsWith('/')) {
            const closed = stack.pop();
            if (closed) {
                if (stack.length > 0) {
                    stack[stack.length - 1].children.push(closed);
                }
                else {
                    root = closed;
                }
            }
        }
        else {
            const isSelfClosing = tagStr.endsWith('/');
            const rawName = isSelfClosing ? tagStr.slice(0, -1).trimEnd() : tagStr;
            const spaceIdx = rawName.search(/\s/);
            const name = spaceIdx >= 0 ? rawName.slice(0, spaceIdx) : rawName.trim();
            const node = { name, children: [], text: '' };
            if (isSelfClosing) {
                if (stack.length > 0) {
                    stack[stack.length - 1].children.push(node);
                }
                else {
                    root = node;
                }
            }
            else {
                stack.push(node);
            }
        }
        pos = gtPos + 1;
    }
    return root;
}
function xmlFieldValue(fieldNode) {
    if (fieldNode.children.length === 0) {
        return fieldNode.text;
    }
    let maxIdx = 0;
    for (const child of fieldNode.children) {
        const dot = child.name.lastIndexOf('.');
        if (dot >= 0) {
            const n = parseInt(child.name.slice(dot + 1), 10);
            if (!isNaN(n) && n > maxIdx)
                maxIdx = n;
        }
    }
    if (maxIdx === 0) {
        return fieldNode.children.map(c => c.text).join('');
    }
    const components = new Array(maxIdx).fill('');
    for (const child of fieldNode.children) {
        const dot = child.name.lastIndexOf('.');
        if (dot >= 0) {
            const n = parseInt(child.name.slice(dot + 1), 10);
            if (!isNaN(n) && n >= 1 && n <= maxIdx) {
                components[n - 1] = child.text || '';
            }
        }
    }
    return components.length === 1 ? components[0] : components;
}
function extractHL7SegmentNodes(node, validSegs) {
    const result = [];
    for (const child of node.children) {
        if (validSegs.indexOf(child.name.toUpperCase()) >= 0) {
            result.push(child);
        }
        else {
            result.push(...extractHL7SegmentNodes(child, validSegs));
        }
    }
    return result;
}
// --- FHIR helpers ---
function hl7DateToFHIR(d) {
    const s = Array.isArray(d) ? d[0] : d;
    if (!s || s.length < 8)
        return undefined;
    return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
}
// ---
const shallowClone = function (obj) {
    const copy = {};
    for (const name in obj) {
        copy[name] = obj[name];
    }
    return copy;
};
class Hl7Message {
    constructor(segments, delimiters, friendlyID) {
        this.segments = segments;
        this.delimiters = delimiters;
        this.friendlyID = friendlyID;
    }
    get(segmentName, fieldName, joinChar) {
        for (let i = 0, j = this.segments.length; i < j; i++) {
            if (this.segments[i].typeofSegment === segmentName) {
                if (typeof fieldName === 'undefined') {
                    return this.segments[i];
                }
                return this.segments[i].get(fieldName, joinChar);
            }
        }
        return null;
    }
    set(segmentName, fieldName, value) {
        for (let i = 0, j = this.segments.length; i < j; i++) {
            if (this.segments[i].typeofSegment === segmentName) {
                if (typeof fieldName === 'undefined' || typeof value === 'undefined') {
                    return;
                }
                this.segments[i].set(fieldName, value);
            }
        }
    }
    getSegmentAt(counter) {
        return (typeof this.segments[counter] === 'object') ? this.segments[counter] : null;
    }
    size() {
        return this.segments.length;
    }
    getSegments(segmentName, nmbr, fieldName, joinChar) {
        const returningValue = [];
        for (let i = 0, j = this.segments.length; i < j; i++) {
            if (this.segments[i].typeofSegment === segmentName) {
                if (typeof nmbr === 'undefined') {
                    returningValue.push(this.segments[i]);
                }
                else {
                    if (nmbr === returningValue.length) {
                        if (typeof fieldName === 'undefined') {
                            return this.segments[i];
                        }
                        return this.segments[i].get(fieldName, joinChar);
                    }
                    returningValue.push(this.segments[i]);
                }
            }
        }
        if (typeof nmbr === 'undefined') {
            return returningValue;
        }
        return null;
    }
    toFHIR() {
        const toStr = (v) => {
            if (v === null)
                return undefined;
            return Array.isArray(v) ? v[0] : v;
        };
        const bundle = {
            resourceType: 'Bundle',
            type: 'message',
            entry: []
        };
        const entries = bundle.entry;
        const mshSeg = this.get('MSH');
        if (mshSeg) {
            const msgControlId = mshSeg.get('Message control ID');
            const msgType = mshSeg.get('Message type');
            const sendingApp = mshSeg.get('Sending application');
            const sendingFacility = mshSeg.get('Sending facility');
            const receivingApp = mshSeg.get('Receiving application');
            const msgHeader = {
                resourceType: 'MessageHeader',
                id: toStr(msgControlId),
                eventCoding: {
                    system: 'http://terminology.hl7.org/CodeSystem/v2-0003',
                    code: Array.isArray(msgType) ? `${msgType[0]}^${msgType[1]}` : (msgType || undefined)
                },
                source: {
                    name: toStr(sendingApp),
                    software: toStr(sendingFacility)
                }
            };
            if (receivingApp) {
                msgHeader.destination = [{ name: toStr(receivingApp) }];
            }
            entries.push({ resource: msgHeader });
        }
        const pidSeg = this.get('PID');
        if (pidSeg) {
            const patientId = pidSeg.get('Patient identifier list');
            const patientName = pidSeg.get('Patient name');
            const dob = pidSeg.get('Date of birth');
            const gender = pidSeg.get('Gender');
            const address = pidSeg.get('Patient Address');
            const homePhone = pidSeg.get('Phone number (home)');
            const genderMap = { M: 'male', F: 'female', O: 'other', U: 'unknown' };
            const patient = {
                resourceType: 'Patient'
            };
            if (patientId) {
                patient.identifier = [{ value: toStr(patientId) }];
            }
            if (patientName) {
                const nameArr = Array.isArray(patientName) ? patientName : [patientName];
                patient.name = [{
                        family: nameArr[0] || undefined,
                        given: nameArr[1] ? [nameArr[1]] : undefined
                    }];
            }
            const birthDate = hl7DateToFHIR(dob);
            if (birthDate)
                patient.birthDate = birthDate;
            const genderStr = toStr(gender);
            if (genderStr)
                patient.gender = genderMap[genderStr] || 'unknown';
            if (address) {
                const addrArr = Array.isArray(address) ? address : [address];
                patient.address = [{
                        line: addrArr[0] ? [addrArr[0]] : undefined,
                        city: addrArr[2] || undefined,
                        state: addrArr[3] || undefined,
                        postalCode: addrArr[4] || undefined
                    }];
            }
            if (homePhone) {
                patient.telecom = [{
                        system: 'phone',
                        value: toStr(homePhone),
                        use: 'home'
                    }];
            }
            entries.push({ resource: patient });
        }
        return bundle;
    }
}
class HL7Segment {
    constructor(typeofSegment, order, parts) {
        this.typeofSegment = typeofSegment;
        this.order = order;
        this.parts = parts;
    }
    toMappedObject(compact) {
        if (typeof this.segmentsFields[this.typeofSegment] === 'object') {
            if (typeof compact === 'undefined') {
                compact = false;
            }
            const obj = {};
            const fields = this.segmentsFields[this.typeofSegment];
            for (let i = 0; i < this.parts.length && i < fields.length; i++) {
                if (!compact || this.parts[i] !== '') {
                    obj[fields[i]] = this.parts[i];
                }
            }
            return obj;
        }
        else {
            if (this.logger) {
                this.logger.error('ERROR, unknown segmentType: ' + this.typeofSegment);
            }
            return {};
        }
    }
    get(nameField, joinChar) {
        if (typeof this.segmentsFields[this.typeofSegment] !== 'undefined') {
            const idx = this.segmentsFields[this.typeofSegment].indexOf(nameField);
            if (idx >= 0 && typeof joinChar !== 'undefined' && (typeof this.parts[idx] === 'object')) {
                return this.parts[idx].join(joinChar);
            }
            else {
                return (idx < 0) ? null : this.parts[idx];
            }
        }
        return null;
    }
    set(nameField, value) {
        if (typeof this.segmentsFields[this.typeofSegment] !== 'undefined') {
            const idx = this.segmentsFields[this.typeofSegment].indexOf(nameField);
            if (idx >= 0) {
                this.parts[idx] = value;
            }
        }
    }
}
const endsWith = function (str, searchString, position) {
    const subjectString = str.toString();
    if (position === undefined || position > subjectString.length) {
        position = subjectString.length;
    }
    position -= searchString.length;
    const lastIndex = subjectString.indexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
};
function getDelimiters(mshsegment) {
    if (mshsegment.length < 9) {
        return null;
    }
    return {
        composite: mshsegment.substring(3, 4), // |
        subComposite: mshsegment.substring(4, 5), // ^
        repetitions: mshsegment.substring(5, 6), // ~
        escapeChar: mshsegment.substring(6, 7), // \
        subComponent: mshsegment.substring(7, 8) // &
    };
}
const escapeChars = function (text, equivalences) {
    for (const e in equivalences) {
        text = text.replace(equivalences[e].key, equivalences[e].value);
    }
    return text;
};
function validSegmentType(segmentname, ID, logger) {
    if (validSegmentsName.indexOf(segmentname) < 0) {
        if (logger) {
            logger.error('Unknown segmentType (' + ID + '): ' + segmentname);
        }
        return (segmentname.length === 3);
    }
    return true;
}
function isRecoverable(typeofSegment, parts, isFirst) {
    return ((parts.length > 0 &&
        (endsWith(String(parts[parts.length - 1]), '\\X000d\\'))) || endsWith(typeofSegment, '\\X000d\\')) && !isFirst;
}
function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
}
class hl7Parser extends events_1.EventEmitter {
    constructor(options = {}) {
        super();
        this.EMPTY = 1000;
        this.INVALID = 2000;
        this.IOERROR = 3000;
        options = shallowClone(options);
        this.options = options;
        this.logger = this.options.logger || console;
        if (typeof this.options.mapping === 'undefined') {
            this.options.mapping = false;
        }
        if (typeof this.options.fs === 'undefined') {
            this.options.fs = fs;
        }
        this.HL7Segment = HL7Segment;
    }
    parse(messageContent, ID, wrappedDone) {
        const self = this;
        return new Promise((resolve, reject) => {
            const fn = function (donefn, resultValue) {
                return function () {
                    donefn(null, resultValue);
                };
            };
            const done = function (err, hl7msg) {
                if (err) {
                    if (self.listeners('error').length > 0) {
                        self.emit('error', err);
                    }
                    // Call callback if provided
                    if (wrappedDone) {
                        wrappedDone(err, hl7msg);
                    }
                    // Reject promise
                    reject(err);
                }
                else {
                    if (self.listeners('message').length > 0) {
                        self.emit('message', hl7msg);
                    }
                    if (hl7msg) {
                        const tipoMsg = hl7msg.get('EVN', 'Event Type Code');
                        if (tipoMsg !== null && typeof tipoMsg === 'string' && self.listeners(tipoMsg).length > 0) {
                            self.emit(tipoMsg, hl7msg);
                        }
                    }
                    // Call callback if provided
                    if (wrappedDone) {
                        wrappedDone(null, hl7msg);
                    }
                    // Resolve promise
                    resolve(hl7msg);
                }
            };
            const segmentslines = messageContent.trim().split('\r');
            const result = [];
            if (segmentslines.length === 0) {
                done({ errortype: self.EMPTY });
            }
            else {
                const delimiters = getDelimiters(segmentslines[0]);
                if (!delimiters) {
                    done({ errortype: self.INVALID });
                    return;
                }
                //@TODO: http://docs.intersystems.com/ens20131/csp/docbook/DocBook.UI.Page.cls?KEY=EHL72_escape_sequences
                const equivalences = [
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
                let previousTypeOfSegment = '', previousparts = [], previousorder = -1;
                for (let segmentnumber = 0, segmentmax = segmentslines.length; segmentnumber < segmentmax; segmentnumber++) {
                    const line = segmentslines[segmentnumber].trim();
                    if (line !== '') {
                        const parts = line.split(delimiters.composite);
                        if (parts.length > 0) {
                            let typeofSegment = parts.shift().trim();
                            if (!validSegmentType(typeofSegment, ID, self.logger)) {
                                if (isRecoverable(previousTypeOfSegment, previousparts, segmentnumber === 0)) {
                                    previousparts[previousparts.length - 1] += '\\X000a\\' + typeofSegment;
                                    if (parts.length > 0) {
                                        previousparts = previousparts.concat(parts);
                                    }
                                    result[result.length - 1] = new HL7Segment(previousTypeOfSegment, previousorder, previousparts);
                                    continue;
                                }
                                else {
                                    done({ errortype: self.INVALID });
                                    return;
                                }
                            }
                            for (let numberOfPart = 0, numberOfParts = parts.length; numberOfPart < numberOfParts; numberOfPart++) {
                                const part = parts[numberOfPart];
                                if (((segmentnumber === 0 && numberOfPart !== 0) || segmentnumber !== 0) && part.indexOf(delimiters.subComposite) >= 0) {
                                    let subdivisions = part.split(delimiters.subComposite);
                                    for (let subdivisionsIdx = 0, numberOfSubdivisions = subdivisions.length; subdivisionsIdx < numberOfSubdivisions; subdivisionsIdx++) {
                                        subdivisions[subdivisionsIdx] = escapeChars(subdivisions[subdivisionsIdx], equivalences);
                                    }
                                    parts[numberOfPart] = subdivisions;
                                }
                                else {
                                    parts[numberOfPart] = escapeChars(part, equivalences);
                                }
                            }
                            result.push(new HL7Segment(typeofSegment, previousorder + 1, parts));
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
    parseXML(xmlContent, ID, wrappedDone) {
        const self = this;
        return new Promise((resolve, reject) => {
            const done = function (err, hl7msg) {
                if (err) {
                    if (self.listeners('error').length > 0) {
                        self.emit('error', err);
                    }
                    if (wrappedDone)
                        wrappedDone(err, hl7msg);
                    reject(err);
                }
                else {
                    if (self.listeners('message').length > 0) {
                        self.emit('message', hl7msg);
                    }
                    if (hl7msg) {
                        const tipoMsg = hl7msg.get('EVN', 'Event Type Code');
                        if (tipoMsg !== null && typeof tipoMsg === 'string' && self.listeners(tipoMsg).length > 0) {
                            self.emit(tipoMsg, hl7msg);
                        }
                    }
                    if (wrappedDone)
                        wrappedDone(null, hl7msg);
                    resolve(hl7msg);
                }
            };
            const xmlDoc = parseXMLDocument(xmlContent);
            if (!xmlDoc) {
                done({ errortype: self.INVALID });
                return;
            }
            const delimiters = {
                composite: '|',
                subComposite: '^',
                repetitions: '~',
                escapeChar: '\\',
                subComponent: '&'
            };
            const segmentNodes = extractHL7SegmentNodes(xmlDoc, validSegmentsName);
            if (segmentNodes.length === 0) {
                done({ errortype: self.EMPTY });
                return;
            }
            const result = [];
            for (let order = 0; order < segmentNodes.length; order++) {
                const segNode = segmentNodes[order];
                const segName = segNode.name.toUpperCase();
                const isMSH = segName === 'MSH';
                const parts = [];
                for (const fieldNode of segNode.children) {
                    const dot = fieldNode.name.lastIndexOf('.');
                    if (dot < 0)
                        continue;
                    const fieldNum = parseInt(fieldNode.name.slice(dot + 1), 10);
                    if (isNaN(fieldNum))
                        continue;
                    if (isMSH && fieldNum === 1) {
                        const sep = fieldNode.text.trim();
                        if (sep)
                            delimiters.composite = sep;
                        continue;
                    }
                    const arrayIdx = isMSH ? fieldNum - 2 : fieldNum - 1;
                    if (arrayIdx < 0)
                        continue;
                    while (parts.length <= arrayIdx) {
                        parts.push('');
                    }
                    parts[arrayIdx] = xmlFieldValue(fieldNode);
                }
                if (isMSH && parts.length > 0 && typeof parts[0] === 'string' && parts[0].length >= 4) {
                    delimiters.subComposite = parts[0][0];
                    delimiters.repetitions = parts[0][1];
                    delimiters.escapeChar = parts[0][2];
                    delimiters.subComponent = parts[0][3];
                }
                result.push(new HL7Segment(segName, order, parts));
            }
            const hl7msg = new Hl7Message(result, delimiters, ID);
            process.nextTick(() => done(null, hl7msg));
        });
    }
    parseFile(filepath, wrappedDone) {
        const self = this;
        const fileEncoding = self.options.fileEncoding;
        const fsModule = self.options.fs;
        return new Promise((resolve, reject) => {
            fsModule.stat(filepath, function (err, stats) {
                if (err) {
                    if (self.listeners('error').length > 0) {
                        self.emit('error', err);
                    }
                    if (typeof wrappedDone === 'function') {
                        wrappedDone(err);
                    }
                    reject(err);
                    return;
                }
                fsModule.open(filepath, 'r', function (erro, fd) {
                    if (erro || !fd) {
                        if (fd) {
                            fsModule.close(fd, () => { });
                        }
                        if (self.listeners('error').length > 0) {
                            self.emit('error', erro);
                        }
                        if (typeof wrappedDone === 'function') {
                            wrappedDone(erro);
                        }
                        reject(erro);
                        return;
                    }
                    const size = stats.size;
                    if (size <= 0) {
                        if (fd) {
                            fsModule.close(fd, () => { });
                        }
                        const error = { msg: 'Size <=0 (' + size + ')', friendlyID: filepath };
                        if (self.listeners('error').length > 0) {
                            self.emit('error', error);
                        }
                        if (typeof wrappedDone === 'function') {
                            wrappedDone(error);
                        }
                        reject(error);
                        return;
                    }
                    const readBuffer = Buffer.alloc(size);
                    const bufferOffset = 0;
                    const bufferLength = readBuffer.length;
                    const filePosition = 0;
                    fsModule.read(fd, readBuffer, bufferOffset, bufferLength, filePosition, function (fail, readBytes) {
                        if (fd) {
                            fsModule.close(fd, function (err) {
                                if (err) {
                                    self.logger.error(err);
                                }
                            });
                        }
                        if (fail) {
                            const ioerro = { errortype: self.IOERROR, details: fail };
                            if (self.listeners('error').length > 0) {
                                self.emit('error', ioerro);
                            }
                            if (typeof wrappedDone === 'function') {
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
                    });
                });
            });
        });
    }
}
function getSegmentsInformation() {
    validSegmentsName = segments_1.allSegmentDefs.map(function (segDef) {
        return segDef.name;
    });
    HL7Segment.prototype.segmentsFields = segments_1.allSegmentDefs.reduce(function (p, c) {
        p[c.name] = c.fields;
        return p;
    }, {});
}
getSegmentsInformation();
// Re-export MLLP module
var mllp_1 = require("./mllp");
Object.defineProperty(exports, "MLLPServer", { enumerable: true, get: function () { return mllp_1.MLLPServer; } });
Object.defineProperty(exports, "MLLPClient", { enumerable: true, get: function () { return mllp_1.MLLPClient; } });
Object.defineProperty(exports, "mllpWrap", { enumerable: true, get: function () { return mllp_1.wrap; } });
Object.defineProperty(exports, "mllpUnwrap", { enumerable: true, get: function () { return mllp_1.unwrap; } });
Object.defineProperty(exports, "VT", { enumerable: true, get: function () { return mllp_1.VT; } });
Object.defineProperty(exports, "FS_CR", { enumerable: true, get: function () { return mllp_1.FS_CR; } });
// CommonJS export
const mllp = require('./mllp');
module.exports = hl7Parser;
module.exports.MLLPServer = mllp.MLLPServer;
module.exports.MLLPClient = mllp.MLLPClient;
module.exports.mllpWrap = mllp.wrap;
module.exports.mllpUnwrap = mllp.unwrap;
// ES module default export for TypeScript
exports.default = hl7Parser;
//# sourceMappingURL=hl7.js.map