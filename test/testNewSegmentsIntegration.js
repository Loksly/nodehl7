const { expect } = require('chai');
const Hl7Parser = require('../dist/hl7.js');

describe('Integration test - New segments in practice', function() {
	it('should parse a pharmacy order message with RXE segment', async function() {
		const hl7parser = new Hl7Parser();
		
		// Sample HL7 message with pharmacy order (simplified)
		const message = `MSH|^~\\&|PHARMACY|HOSPITAL|RX_SYS|HOSPITAL|20240210103512||RDE^O11|MSG001|P|2.5\rEVN|O11|20240210103512\rPID|1||12345^^^HOSPITAL^MR||DOE^JOHN^A||19800101|M\rRXE|1|12345^Aspirin 81mg|1||TAB||PO|||||||||||||`;
		
		const parsedMessage = await hl7parser.parse(message, 'TEST-001');
		
		expect(parsedMessage).to.not.be.null;
		const messageType = parsedMessage.get('MSH', 'Message type');
		expect(messageType).to.be.an('array');
		expect(messageType[0]).to.equal('RDE');
		
		const patientName = parsedMessage.get('PID', 'Patient name');
		expect(patientName).to.be.an('array');
		expect(patientName[0]).to.equal('DOE');
		
		// Test that RXE segment can be retrieved
		const rxeSegment = parsedMessage.get('RXE');
		expect(rxeSegment).to.not.be.null;
		expect(rxeSegment.typeofSegment).to.equal('RXE');
	});

	it('should parse a message with MSA acknowledgment segment', async function() {
		const hl7parser = new Hl7Parser();
		
		// Sample HL7 acknowledgment message
		const message = `MSH|^~\\&|RECEIVING_APP|RECEIVING_FAC|SENDING_APP|SENDING_FAC|20240210103512||ACK^A01|MSG002|P|2.5\rMSA|AA|MSG001|Message accepted`;
		
		const parsedMessage = await hl7parser.parse(message, 'TEST-002');
		
		expect(parsedMessage).to.not.be.null;
		
		// Test that MSA segment can be retrieved and fields accessed
		const msaSegment = parsedMessage.get('MSA');
		expect(msaSegment).to.not.be.null;
		expect(msaSegment.get('Acknowledgment Code')).to.equal('AA');
		expect(msaSegment.get('Message Control ID')).to.equal('MSG001');
		expect(msaSegment.get('Text Message')).to.equal('Message accepted');
	});

	it('should parse a scheduling message with SCH and AIS segments', async function() {
		const hl7parser = new Hl7Parser();
		
		// Sample HL7 scheduling message
		const message = `MSH|^~\\&|SCHEDULING|HOSPITAL|SCHEDULING_APP|HOSPITAL|20240210103512||SIU^S12|MSG003|P|2.5\rSCH|12345|67890|||||||20240215090000||||||||||||||\rAIS|1||RADIOLOGY^Radiology^HOSPITAL|20240215090000||||||`;
		
		const parsedMessage = await hl7parser.parse(message, 'TEST-003');
		
		expect(parsedMessage).to.not.be.null;
		
		// Test that SCH segment exists
		const schSegment = parsedMessage.get('SCH');
		expect(schSegment).to.not.be.null;
		expect(schSegment.typeofSegment).to.equal('SCH');
		
		// Test that AIS segment exists
		const aisSegment = parsedMessage.get('AIS');
		expect(aisSegment).to.not.be.null;
		expect(aisSegment.typeofSegment).to.equal('AIS');
	});

	it('should handle segments with field mappings correctly', function() {
		const hl7parser = new Hl7Parser();
		
		// Create segments and test field mappings
		const rxaSegment = new hl7parser.HL7Segment('RXA', 0, ['1', '2', '20240210103512', '20240210104512', 'ASPIRIN^81MG']);
		expect(rxaSegment.get('Give Sub-ID Counter')).to.equal('1');
		expect(rxaSegment.get('Date/Time Start of Administration')).to.equal('20240210103512');
		
		const tq1Segment = new hl7parser.HL7Segment('TQ1', 0, ['1', '100', 'QID']);
		expect(tq1Segment.get('Set ID - TQ1')).to.equal('1');
		expect(tq1Segment.get('Quantity')).to.equal('100');
		expect(tq1Segment.get('Repeat Pattern')).to.equal('QID');
		
		const errSegment = new hl7parser.HL7Segment('ERR', 0, ['', '', '101^Application error', 'E']);
		expect(errSegment.get('Severity')).to.equal('E');
	});

	it('should support all segment categories in a complex message', async function() {
		const hl7parser = new Hl7Parser();
		
		// Complex message with multiple segment types
		const message = `MSH|^~\\&|SENDING_APP|SENDING_FAC|RECEIVING_APP|RECEIVING_FAC|20240210103512||ADT^A01|MSG004|P|2.5\rEVN|A01|20240210103512\rPID|1||12345^^^HOSPITAL^MR||DOE^JOHN^A||19800101|M\rPV1|1|I|ICU^101^1|||||||||||||||\rDG1|1||I10^Hypertension^ICD10\rPR1|1||36.06^Coronary angioplasty^ICD9\rOBR|1||LAB123|CBC^Complete Blood Count\rOBX|1|NM|WBC^White Blood Count||7.5|10^3/uL|4.5-11.0||||F\rNTE|1||Patient is stable`;
		
		const parsedMessage = await hl7parser.parse(message, 'TEST-004');
		
		// Verify multiple segments are parsed correctly
		expect(parsedMessage.get('MSH')).to.not.be.null;
		expect(parsedMessage.get('EVN')).to.not.be.null;
		expect(parsedMessage.get('PID')).to.not.be.null;
		expect(parsedMessage.get('PV1')).to.not.be.null;
		expect(parsedMessage.get('DG1')).to.not.be.null;
		expect(parsedMessage.get('PR1')).to.not.be.null;
		expect(parsedMessage.get('OBR')).to.not.be.null;
		expect(parsedMessage.get('OBX')).to.not.be.null;
		expect(parsedMessage.get('NTE')).to.not.be.null;
		
		// Verify segment count
		expect(parsedMessage.size()).to.equal(9);
	});
});
