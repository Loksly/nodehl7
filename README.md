
 [![Known Vulnerabilities](https://snyk.io/test/github/loksly/nodehl7/badge.svg)](https://snyk.io/test/github/loksly/nodehl7)



# nodehl7
NodeJS Library for parsing HL7 Messages

**Homepage:** [https://loksly.github.io/nodehl7/](https://loksly.github.io/nodehl7/)

This library provides an easy way to parse HL7 Messages v.2.x, text-based, no XML format.
Note there is another package named [node-hl7](https://github.com/ekryski/node-hl7) that provides a different API. 

## Features

- ✅ **TypeScript Support**: Full TypeScript definitions with type safety
- ✅ **Promise-based API**: Modern async/await support with backward-compatible callbacks
- ✅ **Dual Module Format**: Both CommonJS and ES Modules supported
- ✅ **Event Emitter**: Subscribe to parse events
- ✅ **HL7 v2.x**: Support for HL7 version 2.x text-based messages
- ✅ **MLLP Network Transport**: Built-in MLLP server and client for real-time HL7 message exchange over TCP/IP
- ✅ **TLS/SSL Support**: Optional encrypted connections for secure HL7 communication

## Installation

```bash
npm install nodehl7 --save
```

## Quick Start

### Using Promises (Recommended)

```javascript
const Hl7lib = require('nodehl7');
const hl7parser = new Hl7lib();

// Parse a file with async/await
async function parseHL7File() {
  try {
    const message = await hl7parser.parseFile('./path/to/file.hl7');
    
    const pidSegment = message.get('PID');
    const patientIDs = pidSegment.get('Patient identifier list');
    
    console.log(patientIDs);
  } catch (err) {
    console.error(err);
  }
}

// Parse message content directly
async function parseHL7String() {
  const hl7Content = "MSH|^~\\&|...";
  
  try {
    const message = await hl7parser.parse(hl7Content, 'message-id');
    console.log(message.get('MSH', 'Version ID'));
  } catch (err) {
    console.error(err);
  }
}

// Using .then() and .catch()
hl7parser.parseFile('./path/to/file.hl7')
  .then(message => {
    console.log(message.get('MSH', 'Sending application'));
  })
  .catch(err => {
    console.error(err);
  });
```

### Using Callbacks (Legacy, still supported)

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

### TypeScript Usage

```typescript
import Hl7Parser from 'nodehl7';

const hl7parser = new Hl7Parser({
  fileEncoding: 'iso-8859-1'
});

async function parseFile(filepath: string) {
  const message = await hl7parser.parseFile(filepath);
  const versionId = message.get('MSH', 'Version ID');
  console.log(versionId);
}
```

### MLLP Network Transport

The library includes built-in support for [MLLP (Minimal Lower Layer Protocol)](https://www.hl7.org/implement/standards/product_brief.cfm?product_id=55), the standard transport protocol for HL7 v2.x messages over TCP/IP. MLLP wraps each HL7 message with framing bytes:

- **Start Block**: `0x0B` (VT - Vertical Tab)
- **Payload**: The HL7 message
- **End Block**: `0x1C` (FS - File Separator) followed by `0x0D` (CR - Carriage Return)

#### MLLP Server

```javascript
const { MLLPServer } = require('nodehl7');

const server = new MLLPServer((message, reply) => {
  console.log('Received:', message.toString());
  // Send an ACK response
  reply('MSH|^~\\&|REC_APP||SEND_APP||202305101000||ACK|456|P|2.3\rMSA|AA|123');
});

server.listen(2575, '0.0.0.0', () => {
  console.log('MLLP server listening on port 2575');
});
```

You can also use the event-based API:

```javascript
const server = new MLLPServer();

server.on('hl7_message', (message, reply) => {
  console.log('Received:', message.toString());
  reply('MSH|^~\\&|...||...||...||ACK|...\rMSA|AA|...');
});

server.listen(2575);
```

#### MLLP Client

```javascript
const { MLLPClient } = require('nodehl7');

const client = new MLLPClient('127.0.0.1', 2575);

const hl7Message = 'MSH|^~\\&|SENDING_APP|SENDING_FAC|REC_APP|REC_FAC|202305101000||ADT^A01|123|P|2.3';

client.send(hl7Message).then(response => {
  console.log('ACK:', response.toString());
  client.close();
}).catch(err => {
  console.error('Error:', err);
  client.close();
});
```

#### MLLP with TLS/SSL

For secure encrypted connections, both server and client support optional TLS configuration:

```javascript
const fs = require('fs');
const { MLLPServer, MLLPClient } = require('nodehl7');

// TLS Server
const server = new MLLPServer((message, reply) => {
  reply('MSH|^~\\&|...||...||...||ACK|...\rMSA|AA|...');
}, {
  tls: {
    key: fs.readFileSync('server-key.pem'),
    cert: fs.readFileSync('server-cert.pem')
  }
});

server.listen(2576, () => {
  console.log('Secure MLLP server listening on port 2576');
});

// TLS Client
const client = new MLLPClient('127.0.0.1', 2576, {
  tls: {
    rejectUnauthorized: true,
    ca: fs.readFileSync('ca-cert.pem')
  }
});

const response = await client.send(hl7Message);
console.log('ACK:', response.toString());
client.close();
```

#### TypeScript MLLP Usage

```typescript
import { MLLPServer, MLLPClient } from 'nodehl7';

const server = new MLLPServer((message, reply) => {
  const hl7String = message.toString();
  console.log('Received:', hl7String);
  reply('MSH|^~\\&|...||...||...||ACK|...\rMSA|AA|...');
});

server.listen(2575, '0.0.0.0', () => {
  console.log('Server ready');
});

async function sendMessage() {
  const client = new MLLPClient('127.0.0.1', 2575);
  const response = await client.send('MSH|^~\\&|...');
  console.log(response.toString());
  client.close();
}
```

## Testing

To run tests:
```bash
npm test
```

To run tests with code coverage:
```bash
npm run coverage
```

This will generate coverage reports in the `coverage/` directory:
- `coverage/lcov.info` - LCOV format for CI/GitHub Actions integration
- `coverage/lcov-report/index.html` - HTML report for local viewing
- `coverage/coverage-final.json` - JSON format for programmatic access

## API Documentation

### Hl7Parser

An hl7Parser is an EventEmitter so it provides events like:

- **error**: Whenever a new error happens.
- **message**: Whenever a new message has been parsed.
- **Event Type Code**: Events named after the _Event Type Code_ field from the _EVN_ Segment (e.g., _A01_, _A02_, _A03_). 

#### Constructor

```javascript
new Hl7Parser(config?)
```

**Configuration options:**
- `mapping` (boolean): Enable field mapping
- `profiling` (boolean): Enable profiling
- `debug` (boolean): Enable debug mode
- `fileEncoding` (string): File encoding (default: 'utf8', example: 'iso-8859-1')
- `logger` (object): Custom logger object
- `fs` (object): Custom filesystem object

#### Methods

##### `parse(messageContent, ID, callback?)`

Parses an HL7 message string.

**Returns:** `Promise<Hl7Message>`

**Parameters:**
- `messageContent` (string): The HL7 message content
- `ID` (string): An identifier for the message
- `callback` (function, optional): Callback function `(err, Hl7Message) => void`

```javascript
// Promise
const message = await hl7parser.parse(messageContent, 'msg-001');

// Callback
hl7parser.parse(messageContent, 'msg-001', (err, message) => {
  // ...
});
```

##### `parseFile(filepath, callback?)`

Parses an HL7 message from a file.

**Returns:** `Promise<Hl7Message>`

**Parameters:**
- `filepath` (string): Path to the HL7 file
- `callback` (function, optional): Callback function `(err, Hl7Message) => void`

```javascript
// Promise
const message = await hl7parser.parseFile('./file.hl7');

// Callback
hl7parser.parseFile('./file.hl7', (err, message) => {
  // ...
});
```

### Hl7Message

#### Methods

- **`size()`**: Returns the number of segments in the message.
- **`get(segmentname)`**: Returns an Hl7Segment.
- **`get(segmentname, fieldname)`**: Returns a field value (can be a string, array, or null).
- **`get(segmentname, fieldname, joinChar)`**: Returns the field value. If it's an array, joins it using `joinChar` as separator.
- **`getSegmentAt(index)`**: Returns the segment at the specified position.
- **`getSegments(segmentname)`**: Returns all segments with the specified name.

```javascript
const message = await hl7parser.parseFile('./file.hl7');

// Get a segment
const pidSegment = message.get('PID');

// Get a field value
const patientName = message.get('PID', 'Patient name');

// Get a field and join if array
const phoneNumbers = message.get('PID', 'Phone number (home)', ' / ');

// Get segment by index
const firstSegment = message.getSegmentAt(0);

// Get number of segments
const segmentCount = message.size();
```

### Hl7Segment

#### Methods

- **`get(fieldname)`**: Returns a field value (can be a string, array, or null).
- **`set(fieldname, value)`**: Sets the value of a field.
- **`toMappedObject(compact?)`**: Converts the segment to a JavaScript object.

```javascript
const pidSegment = message.get('PID');

// Get field value
const patientId = pidSegment.get('Patient identifier list');

// Set field value
pidSegment.set('Patient name', 'John Doe');

// Convert to object
const pidObject = pidSegment.toMappedObject();
```

### MLLPServer

An MLLP server that handles incoming HL7 messages over TCP or TLS connections.

#### Constructor

```javascript
new MLLPServer(handler?, options?)
```

**Parameters:**
- `handler` (function, optional): A callback `(message: Buffer, reply: Function) => void` invoked for each received message
- `options` (object, optional): Configuration options
  - `tls` (object, optional): TLS options passed to `tls.createServer()` (e.g., `{ key, cert, ca }`)

**Events:**
- `'hl7_message'` — Emitted with `(message: Buffer, reply: Function, socket: net.Socket)` when a complete MLLP-framed message is received

**Methods:**
- **`listen(port, hostname?, callback?)`**: Start listening for connections.
- **`close(callback?)`**: Stop accepting new connections and close the server.
- **`address()`**: Returns the bound address of the server.

### MLLPClient

A client for sending HL7 messages to an MLLP server and receiving responses.

#### Constructor

```javascript
new MLLPClient(host, port, options?)
```

**Parameters:**
- `host` (string): The server hostname or IP address
- `port` (number): The server port
- `options` (object, optional): Configuration options
  - `tls` (object, optional): TLS options passed to `tls.connect()` (e.g., `{ rejectUnauthorized, ca }`)

**Methods:**

##### `send(data)`

Sends an HL7 message and waits for the server's response.

**Returns:** `Promise<Buffer>`

**Parameters:**
- `data` (string | Buffer): The HL7 message to send

```javascript
const response = await client.send(hl7Message);
```

##### `close()`

Closes the client connection.

### MLLP Framing Utilities

Low-level utilities for MLLP message framing:

```javascript
const { mllpWrap, mllpUnwrap } = require('nodehl7');

// Wrap a message with MLLP framing bytes
const framed = mllpWrap('MSH|^~\\&|...');

// Extract messages from a buffer containing MLLP-framed data
const { messages, remainder } = mllpUnwrap(framed);
```

## Supported Segments

The library includes field mappings for **81 HL7 v2.x segments**, providing comprehensive support for various healthcare message types:

### Message Structure & Control (10 segments)
- **MSH** - Message Header
- **MSA** - Message Acknowledgment
- **ERR** - Error
- **BHS** - Batch Header Segment
- **BTS** - Batch Trailer Segment
- **FHS** - File Header Segment
- **FTS** - File Trailer Segment
- **DSC** - Continuation Pointer
- **DSP** - Display Data
- **NDS** - Notification Detail

### Patient Demographics & Administration (13 segments)
- **PID** - Patient Identification
- **PD1** - Patient Additional Demographic
- **NK1** - Next of Kin / Associated Parties
- **PV1** - Patient Visit
- **PV2** - Patient Visit - Additional Information
- **MRG** - Merge Patient Information
- **DB1** - Disability
- **ACC** - Accident
- **AL1** - Patient Allergy Information
- **UB1** - UB82 Data
- **UB2** - UB92 Data
- **DRG** - Diagnosis Related Group
- **EVN** - Event Type

### Orders & Observations (10 segments)
- **ORC** - Common Order
- **OBR** - Observation Request
- **OBX** - Observation/Result
- **NTE** - Notes and Comments
- **TQ1** - Timing/Quantity
- **TQ2** - Timing/Quantity Relationship
- **CTI** - Clinical Trial Identification
- **FT1** - Financial Transaction
- **BLG** - Billing
- **ABS** - Abstract

### Clinical Procedures & Diagnosis (4 segments)
- **PR1** - Procedures
- **DG1** - Diagnosis
- **GOL** - Goal Detail
- **PRB** - Problem Details

### Pharmacy & Medications (7 segments)
- **RXA** - Pharmacy/Treatment Administration
- **RXD** - Pharmacy/Treatment Dispense
- **RXE** - Pharmacy/Treatment Encoded Order
- **RXG** - Pharmacy/Treatment Give
- **RXO** - Pharmacy/Treatment Order
- **RXC** - Pharmacy/Treatment Component Order
- **RXR** - Pharmacy/Treatment Route

### Scheduling & Resources (6 segments)
- **SCH** - Scheduling Activity Information
- **AIG** - Appointment Information - General Resource
- **AIL** - Appointment Information - Location Resource
- **AIP** - Appointment Information - Personnel Resource
- **AIS** - Appointment Information - Service
- **RGS** - Resource Group

### Staff & Personnel (3 segments)
- **STF** - Staff Identification
- **PRA** - Practitioner Detail
- **ROL** - Role

### Financial & Insurance (3 segments)
- **GT1** - Guarantor
- **IN1** - Insurance
- **IN2** - Insurance Additional Information

### Query & Response (6 segments)
- **QRD** - Query Definition
- **QRF** - Query Filter
- **URD** - Results/Unsolicited Display Update Definition
- **URS** - Unsolicited Selection

### Master Files & Observations (7 segments)
- **OM1** - General Segment
- **OM2** - Numeric Observation
- **OM3** - Categorical Service/Test/Observation
- **OM4** - Observations that Require Specimens
- **OM5** - Observation Batteries
- **OM6** - Observations that are Calculated
- **OM7** - Additional Basic Attributes

### Documents & Reports (3 segments)
- **TXA** - Transcription Document Header
- **PTH** - Pathway
- **VAR** - Variance

### Dietary (2 segments)
- **ODS** - Dietary Orders, Supplements, Preferences
- **ODT** - Diet Tray Instructions

### Specimen & Inventory (3 segments)
- **SPM** - Specimen
- **SAC** - Specimen Container Detail
- **INV** - Inventory Detail

### Product Experience & Safety (4 segments)
- **PEO** - Product Experience Observation
- **PCR** - Possible Causal Relationship
- **PSH** - Product Summary Header
- **PDC** - Product Detail Country

### Facility & Security (2 segments)
- **FAC** - Facility
- **CER** - Certificate Data

### Field Mappings Reference

<details>
<summary>Click to expand complete field mappings</summary>

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



</details>

## Migration Guide

### From Callbacks to Promises

If you're upgrading from an older version, the API is fully backward compatible. You can migrate to promises gradually:

**Before (Callbacks):**
```javascript
hl7parser.parseFile('./file.hl7', (err, message) => {
  if (err) return console.error(err);
  console.log(message.get('MSH', 'Version ID'));
});
```

**After (Promises):**
```javascript
try {
  const message = await hl7parser.parseFile('./file.hl7');
  console.log(message.get('MSH', 'Version ID'));
} catch (err) {
  console.error(err);
}
```

## Contributing

Contributions are welcome! Here's how you can help:

### How to Contribute

1. **Fork the repository** and create your branch from `master`.
2. **Install dependencies**: `npm install`
3. **Make your changes** in the `src/` directory.
4. **Add tests** for any new functionality in the `test/` directory.
5. **Run tests**: `npm test` to ensure all tests pass.
6. **Run coverage**: `npm run coverage` to check code coverage.
7. **Submit a pull request** with a clear description of your changes.

### Reporting Issues

- Use the [GitHub Issues](https://github.com/Loksly/nodehl7/issues) page to report bugs.
- Include a clear description of the issue, steps to reproduce, and expected behavior.
- If possible, include a sample HL7 message that demonstrates the problem.

### Development Setup

```bash
git clone https://github.com/Loksly/nodehl7.git
cd nodehl7
npm install
npm test
```

### Code Style

- Follow the existing code style and conventions.
- Use TypeScript for all source files in `src/`.
- Ensure TypeScript compiles without errors before submitting.

## License

MIT

## Credits

Original author: [Loksly](https://github.com/Loksly)
