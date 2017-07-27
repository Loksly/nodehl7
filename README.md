
 [![Known Vulnerabilities](https://snyk.io/test/github/loksly/nodehl7/badge.svg)](https://snyk.io/test/github/loksly/nodehl7)



# nodehl7
NodeJS Library for parsing HL7 Messages

This library provides an easy way to parse HL7 Messages v.2.x, text-based, no XML format.
Note there is another package named [node-hl7](https://github.com/ekryski/node-hl7) that provides a different API. 


Usage:

```bash
npm install nodehl7 --save
```

To run tests:
```bash
npm test

```


```javascript
	const Hl7lib = require('nodehl7');
	const config = {
		"mapping": false,
		"profiling": true,
		"debug": true,
		"fileEncoding": "iso-8859-1"
	};

	let hl7parser = new Hl7lib(config);

	let callback = function(err, message){
		if (err){
			console.error(err);
		} else {

			let pidSegment = message.get('PID');
			let patientIDs = pidSegment.get('Patient identifier list');

			console.log(patientIDs);
		}
	};

	hl7parser.parseFile(path, callback);

```


Api:

An hl7Parser is an eventEmitter so it provides events like:

- error: Whenever a new error happens.
- message: Whenever a new message has been parsed.
- "Event Type Code": I mean _A01_, _A02_, _A03_ or so. When a message is parsed it emit a event with the name of the field _Event Type Code_ from the _EVN_ Segment. 


Hl7Parser methods:
- parse(messageContent, ID, callback): method that will call callback whenever it ends parsing an string called messageContent.
- parseFile(path, callback): method that will parse a file located in path with hl7 format.

Both callbacks have the syntax:
```javascript
function(err, Hl7Message)
```


Hl7Message methods:

- size(): returns the number of segments of the message.
- get(segmentname): returns a Hl7Segment.
- get(segmentname, fieldname): returns a field (take on count it can be both an string an array or null).
- get(segmentname, fieldname, joinChar): returns the same as get(segmentname, fieldname) but in case it is an array then it is converted to an string using join with the _joinChar_ as separator. 
- getSegmentAt(numberofsegment): returns the segment that was located on _numberofsegment_ position.


Hl7Segment methods:
- get(fieldname): returns a field (take on count it can be both an string an array or null).
- set(fieldname, value): sets this value at _fieldname_.



This is the name of the fields:
```javascript
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
			'Insured\'s Employer Address', 'Verification Status', 'Prior Insurance Plan ID', 'Coverage Type', 'Handicap', 'Insured’s ID Number']
	}
```


