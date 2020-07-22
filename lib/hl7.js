/* https://www.hl7.org/documentcenter/public_temp_B4666D56-1C23-BA17-0C6D54722F8A5135/wg/conf/Msgadt.pdf */
var hl7Lib = {};
(function(module, process, console){
	'use strict';
	var EventEmitter = require('events').EventEmitter
		, inherits = require('util').inherits
		//, fs = require('graceful-fs')
		, encoding = require('encoding')
		, fs = require('fs')
		, path = require('path');

	var validSegmentsName = [];

	var shallowClone = function(obj) {
		var copy = {};
		for (var name in obj){
			copy[name] = obj[name];
		}
		return copy;
	};

	function Hl7Message (segments, delimiters, friendlyID){
		this.segments = segments;
		this.delimiters = delimiters;
		this.friendlyID = friendlyID;
	}
	function HL7Segment (typeofSegment, order, parts){
		this.typeofSegment = typeofSegment;
		this.order = order;
		this.parts = parts;
	}

	var endsWith = function(str, searchString, position) {
		var subjectString = str.toString();
		if (position === undefined || position > subjectString.length) {
			position = subjectString.length;
		}
		position -= searchString.length;
		var lastIndex = subjectString.indexOf(searchString, position);
		return lastIndex !== -1 && lastIndex === position;
	};


	var hl7Parser = function(options){
		EventEmitter.call(this);
		options = shallowClone(options);
		this.options = options;
		this.logger = this.options.logger;
		if (typeof this.options.mapping === 'undefined'){
			this.options.mapping = false;
		}
		if (typeof this.options.logger === 'undefined'){
			this.logger = console;
		}
		if (typeof this.options.fs === 'undefined'){
			this.options.fs = require('fs');
		}else if (typeof this.options.fs === 'string'){
			this.options.fs = require(this.options.fs); /* @deprecated: dangerous, I will consider not support this functionality */
		}
	};

	inherits(hl7Parser, EventEmitter);

	function getDelimiters (mshsegment){
		if (mshsegment.length < 9){ return null; }
		return {
			composite: mshsegment.substring(3, 4), // |
			subComposite: mshsegment.substring(4, 5), // ^
			repetitions: mshsegment.substring(5, 6), // ~
			escapeChar: mshsegment.substring(6, 7), // \
			subComponent: mshsegment.substring(7, 8)  // &
		};
	}



	var escapeChars = function(text, equivalences){
		for (var e in equivalences){
			text = text.replace(equivalences[e].key, equivalences[e].value);
		}
		return text;
	};

	function validSegmentType(segmentname, ID, logger){
		if (validSegmentsName.indexOf(segmentname) < 0){
			if (typeof logger === 'object' && typeof logger.error === 'function'){
				logger.error('Unkown segmentType (' + ID + '): ' + segmentname);
			}
			return (segmentname.length === 3);
		}
		return true;
	}

	function isRecoverable(typeofSegment, parts, isFirst){
		return	(
					(parts.length > 0 &&
						( endsWith(parts[parts.length - 1], '\\X000d\\') ) ) || endsWith(typeofSegment, '\\X000d\\')
				) && !isFirst;
	}
	function escapeRegExp(string) {
		return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
	}
	hl7Parser.prototype.EMPTY = 1000;
	hl7Parser.prototype.INVALID = 2000;
	hl7Parser.prototype.IOERROR = 3000;

	hl7Parser.prototype.parse = function( messageContent, ID, wrappedDone ){
		var self = this;

		var fn = function(donefn, resultValue){
			return function(){
				donefn(null, resultValue);
			};
		};

		var done = function(err, hl7msg){
			if (err){
				if (self.listeners('error').length > 0){
					self.emit('error', err);
				}
			}else {
				if (self.listeners('message').length > 0) {
					self.emit('message', hl7msg);
				}
				var tipoMsg = hl7msg.get('EVN', 'Event Type Code');

				if (tipoMsg !== null && self.listeners(tipoMsg).length > 0){
					self.emit(tipoMsg, hl7msg);
				}
			}
			if (wrappedDone){
				wrappedDone(err, hl7msg);
			}
		};


		var segmentslines = messageContent.trim().split('\r');
		var result = [];
		if (segmentslines.length === 0)
		{
			done({errortype: self.EMPTY});
		} else {
			var delimiters = getDelimiters(segmentslines[0]);
			//@TODO: http://docs.intersystems.com/ens20131/csp/docbook/DocBook.UI.Page.cls?KEY=EHL72_escape_sequences
			var equivalences = [
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


			var previousTypeOfSegment = '', previousparts = [], previousorder = -1;
			for (var segmentnumber = 0, segmentmax = segmentslines.length; segmentnumber < segmentmax; segmentnumber++)
			{
				var line = segmentslines[segmentnumber].trim();
				if (line !== '')
				{
					var parts = line.split(delimiters.composite);
					if (parts.length > 0){
						var typeofSegment = parts.shift().trim();

						if (!validSegmentType(typeofSegment, ID, self.logger)){
							if (isRecoverable(previousTypeOfSegment, previousparts, segmentnumber === 0)){
								previousparts[ previousparts.length - 1 ] += '\\X000a\\' + typeofSegment;
								if (parts.length > 0){
									previousparts = previousparts.concat(parts);
								}
								result[ result.length - 1] = {segmentType: previousTypeOfSegment, order: previousorder, parts: previousparts};
								continue;
							} else {
								done({errortype: self.INVALID});
								return;
							}
						}

						for (var numberOfPart = 0, numberOfParts = parts.length; numberOfPart < numberOfParts; numberOfPart++){
							var part = parts[numberOfPart];

							if (((segmentnumber === 0 && numberOfPart !== 0) || segmentnumber !== 0) && part.indexOf(delimiters.subComposite) >= 0 ){
								var subdivisions = part.split(delimiters.subComposite);
								for (var subdivisionsIdx = 0, numberOfSubdivisions = subdivisions.length; subdivisionsIdx < numberOfSubdivisions; subdivisionsIdx++){
									subdivisions[subdivisionsIdx] = escapeChars(subdivisions[subdivisionsIdx], equivalences );
								}
								parts[numberOfPart] = subdivisions;
							} else {
								parts[numberOfPart] = escapeChars(part, equivalences);
							}
						}

						result.push( new HL7Segment(typeofSegment, previousorder + 1, parts) );

						previousTypeOfSegment = typeofSegment;
						previousparts = parts;
						previousorder = previousorder + 1;
					}
				}
			}
			var r = new Hl7Message(result, delimiters, ID);
			process.nextTick(fn(done, r));
		}
	};

	Hl7Message.prototype.get = function(segmentName, fieldName, joinChar){
		var returningValue = null;
		for (var i = 0, j = this.segments.length; i < j; i++){
			if (this.segments[i].typeofSegment === segmentName){
				if (typeof fieldName === 'undefined'){
					return this.segments[i];
				}
				return this.segments[i].get(fieldName, joinChar);
			}
		}
		return returningValue;
	};
	Hl7Message.prototype.set = function(segmentName, fieldName, value){
		for (var i = 0, j = this.segments.length; i < j; i++){
			if (this.segments[i].typeofSegment === segmentName){
				if (typeof fieldName === 'undefined'){
					return;
				}
				this.segments[i].set(fieldName, value);
			}
		}
	};
	Hl7Message.prototype.getSegmentAt = function(counter){
		return (typeof this.segments[counter] === 'object') ? this.segments[counter] : null;
	};
	Hl7Message.prototype.size = function(){
		return this.segments.length;
	};
	Hl7Message.prototype.getSegments = function(segmentName, nmbr, fieldName, joinChar){
		var returningValue = [];
		for (var i = 0, j = this.segments.length; i < j; i++){
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
	};

	hl7Parser.prototype.parseFile = function ( path, wrappedDone ) {
		var self = this,
			fileEncoding = self.options.fileEncoding;

		self.options.fs.stat(path, function(err, stats) {
			if (err){
				if (self.listeners('error').length > 0){
					self.emit('error', err);
				}
				if (typeof wrappedDone === 'function'){
					wrappedDone(err);
				}
				return;
			}

			self.options.fs.open(path, 'r', function(erro, fd) {
				if (erro || !fd) {
					if (fd){
						self.options.fs.close(fd);
					}
					if (self.listeners('error').length > 0){
						self.emit('error', erro);
					}
					if (typeof wrappedDone === 'function'){
						wrappedDone(erro);
					}
					return;
				}
				var size = stats.size;
				if (size <= 0){
					if (fd){
						self.options.fs.close(fd);
					}
					erro = { msg: 'Size <=0 (' + size + ')', friendlyID: path};
					if (self.listeners('error').length > 0){
						self.emit('error', erro);
					}
					if (typeof wrappedDone === 'function'){
						wrappedDone(erro);
					}
					return;
				}
				var readBuffer = Buffer.alloc(size),
					bufferOffset = 0,
					bufferLength = readBuffer.length,
					filePosition = 0;
				self.options.fs.read(fd, readBuffer, bufferOffset, bufferLength, filePosition,
					function (fail, readBytes) {
						if (fd) {
							self.options.fs.close(fd, function(err){
								if (err){
									logger.error(err);
								}
							});
						}
						if (fail) {
							var ioerro = { errortype: self.IOERROR, details: fail };
							if (self.listeners('error').length > 0){
								self.emit('error', ioerro);
							}
							if (typeof wrappedDone === 'function'){
								wrappedDone(ioerro);
							}
							return;
						}
						if (readBytes > 0) {
							var msg = fileEncoding !== 'utf8' ? encoding.convert(readBuffer, 'utf8', fileEncoding).toString('utf8') : readBuffer.toString('utf8');
							self.parse( msg, path, wrappedDone);
						}
					}
				);
			});
		});
	};
	HL7Segment.prototype.toMappedObject = function(compact){
		if (typeof this.segmentsFields[ this.typeofSegment ] === 'object')
		{
			if (typeof compact === 'undefined'){
				compact = false;
			}

			var obj = {},
				fields = this.segmentsFields[ this.typeofSegment ];

			for (var i = 0; i < this.parts.length && i < fields.length; i++){
				if (!compact || this.parts[i] !== ''){
					obj[ fields[i] ] = this.parts[i];
				}
			}
			return obj;
		} else {
			this.logger.error('ERROR, unkown segmentType: ' + this.typeofSegment);
			return {};
		}
	};
	HL7Segment.prototype.get = function(nameField, joinChar){
		var returningValue = null;
		if (typeof this.segmentsFields[this.typeofSegment] !== 'undefined'){
			var idx = this.segmentsFields[this.typeofSegment].indexOf(nameField);
			if (idx >= 0 && typeof joinChar !== 'undefined' && (typeof this.parts[idx] === 'object')){
				return this.parts[idx].join(joinChar);
			} else {
				return (idx < 0) ? returningValue : this.parts[idx];
			}
		}
		return returningValue;
	};
	HL7Segment.prototype.set = function(nameField, value){
		if (typeof this.segmentsFields[this.typeofSegment] !== 'undefined'){
			var idx = this.segmentsFields[this.typeofSegment].indexOf(nameField);
			if (idx >= 0){
				this.parts[idx] = value;
			}
		}
	};

	function getSegmentsInformation(){
		var files = fs.readdirSync(path.join(__dirname, 'segments'));
		var segmentsinfo = files.filter(function(filename){
			return filename.endsWith('.json');
		}).map(function(filename){
			return String(fs.readFileSync(path.join(__dirname, 'segments', filename), 'utf8'));
		}).map(function(content){
			return JSON.parse(content);
		});

		validSegmentsName = segmentsinfo.reduce(function(p, c){
			p.push(c.name);

			return p;
		}, []);

		HL7Segment.prototype.segmentsFields = segmentsinfo.reduce(function(p, c){
			p[c.name] = c.fields;

			return p;
		}, {});
	}

	getSegmentsInformation();

	hl7Parser.prototype.HL7Segment = HL7Segment;

	module.exports = hl7Parser;
})(typeof module !== 'undefined' ? module : hl7Lib, process, console);
