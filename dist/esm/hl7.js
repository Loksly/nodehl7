/* https://www.hl7.org/documentcenter/public_temp_B4666D56-1C23-BA17-0C6D54722F8A5135/wg/conf/Msgadt.pdf */
import { EventEmitter } from 'events';
import * as encoding from 'encoding';
import * as fs from 'fs';
import * as path from 'path';
let validSegmentsName = [];
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
        let returningValue = null;
        for (let i = 0, j = this.segments.length; i < j; i++) {
            if (this.segments[i].typeofSegment === segmentName) {
                if (typeof fieldName === 'undefined') {
                    return this.segments[i];
                }
                return this.segments[i].get(fieldName, joinChar);
            }
        }
        return returningValue;
    }
    set(segmentName, fieldName, value) {
        for (let i = 0, j = this.segments.length; i < j; i++) {
            if (this.segments[i].typeofSegment === segmentName) {
                if (typeof fieldName === 'undefined') {
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
            this.logger.error('ERROR, unknown segmentType: ' + this.typeofSegment);
            return {};
        }
    }
    get(nameField, joinChar) {
        let returningValue = null;
        if (typeof this.segmentsFields[this.typeofSegment] !== 'undefined') {
            const idx = this.segmentsFields[this.typeofSegment].indexOf(nameField);
            if (idx >= 0 && typeof joinChar !== 'undefined' && (typeof this.parts[idx] === 'object')) {
                return this.parts[idx].join(joinChar);
            }
            else {
                return (idx < 0) ? returningValue : this.parts[idx];
            }
        }
        return returningValue;
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
        if (typeof logger === 'object' && typeof logger.error === 'function') {
            logger.error('Unknown segmentType (' + ID + '): ' + segmentname);
        }
        return (segmentname.length === 3);
    }
    return true;
}
function isRecoverable(typeofSegment, parts, isFirst) {
    return ((parts.length > 0 &&
        (endsWith(parts[parts.length - 1], '\\X000d\\'))) || endsWith(typeofSegment, '\\X000d\\')) && !isFirst;
}
function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
}
class hl7Parser extends EventEmitter {
    constructor(options = {}) {
        super();
        this.EMPTY = 1000;
        this.INVALID = 2000;
        this.IOERROR = 3000;
        options = shallowClone(options);
        this.options = options;
        this.logger = this.options.logger;
        if (typeof this.options.mapping === 'undefined') {
            this.options.mapping = false;
        }
        if (typeof this.options.logger === 'undefined') {
            this.logger = console;
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
                        if (tipoMsg !== null && self.listeners(tipoMsg).length > 0) {
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
    parseFile(filepath, wrappedDone) {
        const self = this;
        const fileEncoding = self.options.fileEncoding;
        return new Promise((resolve, reject) => {
            self.options.fs.stat(filepath, function (err, stats) {
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
                self.options.fs.open(filepath, 'r', function (erro, fd) {
                    if (erro || !fd) {
                        if (fd) {
                            self.options.fs.close(fd);
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
                            self.options.fs.close(fd);
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
                    self.options.fs.read(fd, readBuffer, bufferOffset, bufferLength, filePosition, function (fail, readBytes) {
                        if (fd) {
                            self.options.fs.close(fd, function (err) {
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
    const files = fs.readdirSync(path.join(__dirname, 'segments'));
    const segmentsinfo = files.filter(function (filename) {
        return filename.endsWith('.json');
    }).map(function (filename) {
        return String(fs.readFileSync(path.join(__dirname, 'segments', filename), 'utf8'));
    }).map(function (content) {
        return JSON.parse(content);
    });
    validSegmentsName = segmentsinfo.reduce(function (p, c) {
        p.push(c.name);
        return p;
    }, []);
    HL7Segment.prototype.segmentsFields = segmentsinfo.reduce(function (p, c) {
        p[c.name] = c.fields;
        return p;
    }, {});
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
//# sourceMappingURL=hl7.js.map