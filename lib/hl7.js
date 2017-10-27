/* https://www.hl7.org/documentcenter/public_temp_B4666D56-1C23-BA17-0C6D54722F8A5135/wg/conf/Msgadt.pdf */
var hl7Lib = {};
(function(module, process, console){
	'use strict';
	var EventEmitter = require('events').EventEmitter
		, inherits = require('util').inherits
		//, fs = require('graceful-fs')
		, encoding = require('encoding');

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

	var validSegmentsName = [
		'MSH', 'EVN', 'PID', 'PV1', 'PV2', 'AL1', 'MRG', 'OBX', 'OBR', 'ORC', 'GT1', 'DG1', 'PR1', 'NTE', 'PD1', 'IN1', 'NK1', 'RXE'
	];

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
				var readBuffer = new Buffer(size),
					bufferOffset = 0,
					bufferLength = readBuffer.length,
					filePosition = 0;
				self.options.fs.read(fd, readBuffer, bufferOffset, bufferLength, filePosition,
					function (fail, readBytes) {
						if (fd) { self.options.fs.close(fd); }
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
	HL7Segment.prototype.segmentsFields = {
		'MSH':
			['Encoding characters', 'Sending application', 'Sending facility', 'Receiving application',
			'Receiving facility', 'Date/time of message', 'Security', 'Message type', 'Message control ID', 'Processing ID',
			'Version ID', 'Sequence number', 'Continuation pointer', 'Accept acknowledgement type', 'Application acknowledgement type',
			'Country code', 'Character set', 'Principal language of message', 'Alternate character set handling'],
		'EVN':
			['Event Type Code', 'Recorded Date/Time', 'Date/Time Planned Event', 'Event Reason Code', 'Operator ID', 'Event Occurred', 'Event Facility'],
		'PID':
			['Set ID – PID', 'Patient ID', 'Patient identifier list', 'Alternate patient ID – PID', 'Patient name', 'Mother\'s maiden name',
			'Date of birth', 'Gender', 'Patient alias', 'Race', 'Patient Address', 'County code', 'Phone number (home)', 'Phone number –business',
			'Primary language', 'Marital status', 'Religion', 'Patient account number', 'SSN number – patient', 'Driver\'s license number – patient',
			'Mother\'s identifier', 'Ethnic group', 'Birth place', 'Multiple birth indicator', 'Birth order', 'Citizenship', 'Veterans military status',
			'Nationality', 'Patient death date', 'Patient death indicator'],
		'PV1':
			['Set ID - PV1', 'Patient Class', 'Assigned Patient Location', 'Admission Type', 'Preadmit Number', 'Prior Patient Location',
			'Attending Doctor', 'Referring Doctor', 'Consulting Doctor', 'Hospital Service', 'Temporary Location', 'Preadmit Test Indicator', 'Re-admission Indicator',
			'Admit Source', 'Ambulatory Status', 'VIP Indicator', 'Admitting Doctor', 'Patient Type', 'Visit Number', 'Financial Class', 'Charge Price Indicator',
			'Courtesy Code', 'Credit Rating', 'Contract Code', 'Contract Effective Date', 'Contract Amount', 'Contract Period', 'Interest Code',
			'Transfer to Bad Debt Code', 'Transfer to Bad Debt Date', 'Bad Debt Agency Code', 'Bad Debt Transfer Amount', 'Bad Debt Recovery Amount',
			'Delete Account Indicator', 'Delete Account Date', 'Discharge Disposition', 'Discharged to Location', 'Diet Type', 'Servicing Facility', 'Bed Status',
			'Account Status', 'Pending Location', 'Prior Temporary Location', 'Admit Date/Time', 'Discharge Date/Time', 'Current Patient Balance', 'Total Charges',
			'Total Adjustments', 'Total Payments', 'Alternate Visit', 'Visit Indicator', 'Other Healthcare Provider'],
		'PV2':
			['Prior Pending Location', 'Accommodation Code', 'Admit Reason', 'Transfer Reason', 'Patient Valuables', 'Patient Valuables Location', 'Visit User Code',
			'Expected Admit Date', 'Expected Discharge Date', 'Estimated Length of Inpatient Stay', 'Actual Length of Inpatient Stay', 'Visit Description', 'Referral Source Code',
			'Previous Service Date', 'Employment Illness Related Indicator', 'Purge Status Code', 'Purge Status Date', 'Special Program Code', 'Retention Indicator', 'Expected Number of Insurance Plans',
			'Visit Publicity Code', 'Visit Protection Indicator', 'Clinic Organization Name', 'Patient Status Code', 'Visit Priority Code', 'Previous Treatment Date', 'Expected Discharge Disposition',
			'Signature on File Date', 'First Similar Illness Date', 'Patient Charge Adjustment Code', 'Recurring Service Code', 'Billing Media Code', 'Expected Surgery Date & Time',
			'Military Partnership Code', 'Military Non-Availability Code', 'Newborn Baby Indicator', 'Baby Detained Indicator'],
		'OBX':
			['Set ID - OBX', 'Value Type', 'Observation Identifier', 'Observation Sub-ID', 'Observation Value', 'Units', 'References Range', 'Abnormal Flags', 'Probability',
			'Nature of Abnormal Test', 'Observ Result Status', 'Date Last Obs Normal Values', 'User Defined Access Checks', 'Date/Time of the Observation', 'Producer\'s ID',
			'Responsible Observer', 'Observation Method'],
		'DG1':
			['Set ID - DG1', 'Diagnosis Coding Method', 'Diagnosis Code', 'Diagnosis Description', 'Diagnosis Date/Time', 'Diagnosis/DRG Type', 'Major Diagnostic Category',
			'Diagnostic Related Group', 'DRG Approval Indicator', 'DRG Grouper Review Code', 'Outlier Type', 'Outlier Days', 'Outlier Cost', 'Grouper Version and Type',
			'Diagnosis/DRG Priority', 'Diagnosing Clinician', 'Diagnosis Classification', 'Confidential Indicator', 'Attestation Date/Time'],
		'ORC':
			['Order Control', 'Placer Order Number', 'Filler Order Number', 'Placer Group Number', 'Order Status', 'Response Flag', 'Quantity/Timing', 'Parent', 'Date/Time of Transaction',
			'Entered By', 'Verified By', 'Ordering Provider', 'Enterer\'s Location', 'Call Back Phone Number', 'Order Effective Date/Time', 'Order Control Code Reason',
			'Entering Organization', 'Entering Device', 'Action By'],
		'PR1':
			['Set ID - PR1', 'Procedure Coding Method', 'Procedure Code', 'Procedure Description', 'Procedure Date/Time', 'Procedure Type', 'Procedure Minutes', 'Anesthesiologist',
			'Anesthesia Code', 'Anesthesia Minutes', 'Surgeon', 'Procedure Practitioner', 'Consent Code', 'Procedure Priority', 'Associated Diagnosis Code'],
		'PD1':
			['Living Dependency', 'Living Arrangement', 'Patient Primary Facility', 'Patient Primary Care Provider Name & ID No.', 'Student Indicator', 'Handicap', 'Living Will',
			'Organ Donor', 'Separate Bill', 'Duplicate Patient', 'Publicity Indicator', 'Protection Indicator'],
		'AL1':
			['Set ID - AL1', 'Allergen Type Code', 'Allergen Code/Mnemonic/Description', 'Allergy Severity Code', 'Allergy Reaction Code', 'Identification Date'],
		'MRG':
			['Prior Patient ID - Internal', 'Prior Alternate Patient ID', 'Prior Patient Account Number', 'Prior Patient ID - External', 'Prior Visit Number', 'Prior Alternate Visit ID', 'Prior Patient Name'],
		'GT1':
			['Set ID - GT1', 'Guarantor Number', 'Guarantor Name', 'Guarantor Spouse Name', 'Guarantor Address', 'Guarantor Ph Num- Home', 'Guarantor Ph Num-Business',
			'Guarantor Date/Time of Birth', 'Guarantor Sex', 'Guarantor Type', 'Guarantor Relationship', 'Guarantor SSN', 'Guarantor Date - Begin', 'Guarantor Date - End', 'Guarantor Priority',
			'Guarantor Employer Name', 'Guarantor Employer Address', 'Guarantor Employ Phone Number', 'Guarantor Employee ID Number', 'Guarantor Employment Status', 'Guarantor Organization',
			'Guarantor Billing Hold Flag', 'Guarantor Credit Rating Code', 'Guarantor Death Date And Time', 'Guarantor Death Flag', 'Guarantor Charge Adjustment Code', 'Guarantor Household Annual Income',
			'Guarantor Household Size', 'Guarantor Employer ID Number', 'Guarantor Marital Status Code', 'Guarantor Hire Effective Date', 'Employment Stop Date', 'Living Dependency', 'Ambulatory Status',
			'Citizenship', 'Primary Language', 'Living Arrangement', 'Publicity Indicator', 'Protection Indicator', 'Student Indicator', 'Religion', 'Mother\'s Maiden Name', 'Nationality', 'Ethnic Group',
			'Contact Person\'s Name', 'Contact Person\'s Telephone Number', 'Contact Reason', 'Contact Relationship Code', 'Job Title', 'Job Code/Class', 'Guarantor Employer\'s Organization Name', 'Handicap',
			'Job Status', 'Guarantor Financial Class', 'Guarantor Race'],
		'OBR':
			['Set ID - OBR', 'Placer Order Number', 'Filler Order Number', 'Universal Service ID', 'Priority', 'Requested Date/time', 'Observation Date/time', 'Observation End Date/time',
			'Collection Volume', 'Collector Identifier', 'Specimen Action Code', 'Danger Code', 'Relevant Clinical Info', 'Specimen Received Date/Time', 'Specimen Source', 'Ordering Provider',
			'Order Callback Phone Number', 'Placer field 1', 'Placer field 2', 'Filler Field 1', 'Filler Field 2', 'Results Rpt/Status Chng - Date/Time', 'Charge to Practice', 'Diagnostic Serv Sect ID',
			'Result Status', 'Parent Result', 'Quantity/Timing', 'Result Copies To', 'Parent', 'Transportation Mode', 'Reason for Study', 'Principal Result Interpreter', 'Assistant Result Interpreter',
			'Technician', 'Transcriptionist', 'Scheduled Date/Time', 'Number of Sample Containers', 'Transport Logistics of Collected Sample', 'Collector\'s Comment', 'Transport Arrangement Responsibility',
			'Transport Arranged', 'Escort Required', 'Planned Patient Transport Comment'],
		'NTE':
			['Set ID - NTE', 'Source of Comment', 'Comment', 'Comment Type'],
		'NK1':
			['Set ID - NK1', 'Name', 'Relationship', 'Address', 'Phone Number', 'Business Phone Number', 'Contact Role', 'Start Date', 'End Date', 'Next of Kin / Associated Parties Job Title',
			'Next of Kin / Associated Parties Job Code/Class', 'Next of Kin / Associated Parties Employee Number', 'Organization Name', 'Marital Status', 'Sex', 'Date/Time of Birth'],
		'IN1':
			['Set ID - IN1', 'Insurance Plan ID', 'Insurance Company ID', 'Insurance Company Name', 'Insurance Company Address', 'Insurance Co. Contact Person', 'Insurance Co Phone Number',
			'Group Number', 'Group Name', 'Insured\'s Group Emp ID', 'Insured\'s Group Emp Name', 'Plan Effective Date', 'Plan Expiration Date', 'Authorization Information', 'Plan Type',
			'Name Of Insured', 'Insured\'s Relationship To Patient', 'Insured\'s Date Of Birth', 'Insured’s Address', 'Assignment Of Benefits', 'Coordination Of Benefits', 'Coord Of Ben. Priority',
			'Notice Of Admission Flag', 'Notice Of Admission Date', 'Report Of Eligibility Flag', 'Report Of Eligibility Date', 'Release Information Code', 'Pre-Admit Cert (PAC)',
			'Verification Date/Time', 'Verification By', 'Type Of Agreement Code', 'Billing Status', 'Lifetime Reserve Days', 'Delay Before L.R. Day', 'Company Plan Code', 'Policy Number',
			'Policy Deductible', 'Policy Limit - Amount', 'Policy Limit - Days', 'Room Rate - Semi-Private', 'Room Rate - Private', 'Insured’s Employment Status', 'Insured\'s Sex',
			'Insured\'s Employer Address', 'Verification Status', 'Prior Insurance Plan ID', 'Coverage Type', 'Handicap', 'Insured’s ID Number'],
		'RXE':
			['Quantity/Timing', 'Give Code', 	'Give Amount - Minimum', 'Give Amount - Maximum', 'Give Units',
			 'Give Dosage Form', 'Provider Administration Instructions', 'Deliver-To Location', 'Substitution Status',
			  'Dispense Amount', 'Dispense Units', 'Number Of Refills', 'Ordering Providers DEA Number' ,
			'Pharmacist/Treatment Suppliers Verifier ID', 'Prescription Number', 'Number of Refills Remaining',
			 'Number of Refills or Doses Dispensed', 'Date time of most recent refill or dose dispensed',
			 'Total Daily Dose','Needs Human Review', 'Pharmacy/Treatment Supplier\'s Special Dispensing Instructions',
			  'Give Per', 'Give Rate Amount', 'Give Rate Units', 'Give Strength', 'Give Strength Units',
			 'Give Indication', 'Dispense Package Size', 'Dispense Package Size Unit', 'Dispense Package Method' ],
	};

	hl7Parser.prototype.HL7Segment = HL7Segment;

	module.exports = hl7Parser;
})(typeof module !== 'undefined' ? module : hl7Lib, process, console);
