const { expect } = require('chai');
const Hl7Parser = require('../dist/hl7.js');

describe('New segments support test', function() {
	it('should have all 81 segments loaded', function() {
		const hl7parser = new Hl7Parser();
		const segment = new hl7parser.HL7Segment('MSH', 0, ['test']);
		const segmentCount = Object.keys(segment.segmentsFields).length;
		expect(segmentCount).equal(81);
	});

	it('should support pharmacy segments (RXA, RXE, RXD, RXO, RXG, RXC, RXR)', function() {
		const hl7parser = new Hl7Parser();
		const segment = new hl7parser.HL7Segment('RXA', 0, ['test']);
		
		expect(segment.segmentsFields['RXA']).to.be.an('array');
		expect(segment.segmentsFields['RXE']).to.be.an('array');
		expect(segment.segmentsFields['RXD']).to.be.an('array');
		expect(segment.segmentsFields['RXO']).to.be.an('array');
		expect(segment.segmentsFields['RXG']).to.be.an('array');
		expect(segment.segmentsFields['RXC']).to.be.an('array');
		expect(segment.segmentsFields['RXR']).to.be.an('array');
	});

	it('should support acknowledgment segment (MSA)', function() {
		const hl7parser = new Hl7Parser();
		const segment = new hl7parser.HL7Segment('MSA', 0, ['AA', 'MSG12345']);
		
		expect(segment.segmentsFields['MSA']).to.be.an('array');
		expect(segment.segmentsFields['MSA']).to.include('Acknowledgment Code');
		expect(segment.segmentsFields['MSA']).to.include('Message Control ID');
	});

	it('should support error segment (ERR)', function() {
		const hl7parser = new Hl7Parser();
		const segment = new hl7parser.HL7Segment('ERR', 0, ['test']);
		
		expect(segment.segmentsFields['ERR']).to.be.an('array');
		expect(segment.segmentsFields['ERR']).to.include('HL7 Error Code');
		expect(segment.segmentsFields['ERR']).to.include('Severity');
	});

	it('should support timing/quantity segments (TQ1, TQ2)', function() {
		const hl7parser = new Hl7Parser();
		const segment = new hl7parser.HL7Segment('TQ1', 0, ['test']);
		
		expect(segment.segmentsFields['TQ1']).to.be.an('array');
		expect(segment.segmentsFields['TQ2']).to.be.an('array');
	});

	it('should support scheduling segments (SCH, AIG, AIL, AIP, AIS, RGS)', function() {
		const hl7parser = new Hl7Parser();
		const segment = new hl7parser.HL7Segment('SCH', 0, ['test']);
		
		expect(segment.segmentsFields['SCH']).to.be.an('array');
		expect(segment.segmentsFields['AIG']).to.be.an('array');
		expect(segment.segmentsFields['AIL']).to.be.an('array');
		expect(segment.segmentsFields['AIP']).to.be.an('array');
		expect(segment.segmentsFields['AIS']).to.be.an('array');
		expect(segment.segmentsFields['RGS']).to.be.an('array');
	});

	it('should support observation master segments (OM1-OM7)', function() {
		const hl7parser = new Hl7Parser();
		const segment = new hl7parser.HL7Segment('OM1', 0, ['test']);
		
		expect(segment.segmentsFields['OM1']).to.be.an('array');
		expect(segment.segmentsFields['OM2']).to.be.an('array');
		expect(segment.segmentsFields['OM3']).to.be.an('array');
		expect(segment.segmentsFields['OM4']).to.be.an('array');
		expect(segment.segmentsFields['OM5']).to.be.an('array');
		expect(segment.segmentsFields['OM6']).to.be.an('array');
		expect(segment.segmentsFields['OM7']).to.be.an('array');
	});

	it('should support batch/file segments (BHS, BTS, FHS, FTS)', function() {
		const hl7parser = new Hl7Parser();
		const segment = new hl7parser.HL7Segment('BHS', 0, ['test']);
		
		expect(segment.segmentsFields['BHS']).to.be.an('array');
		expect(segment.segmentsFields['BTS']).to.be.an('array');
		expect(segment.segmentsFields['FHS']).to.be.an('array');
		expect(segment.segmentsFields['FTS']).to.be.an('array');
	});

	it('should support query segments (QRD, QRF, URD, URS)', function() {
		const hl7parser = new Hl7Parser();
		const segment = new hl7parser.HL7Segment('QRD', 0, ['test']);
		
		expect(segment.segmentsFields['QRD']).to.be.an('array');
		expect(segment.segmentsFields['QRF']).to.be.an('array');
		expect(segment.segmentsFields['URD']).to.be.an('array');
		expect(segment.segmentsFields['URS']).to.be.an('array');
	});

	it('should support staff segments (STF, PRA, ROL)', function() {
		const hl7parser = new Hl7Parser();
		const segment = new hl7parser.HL7Segment('STF', 0, ['test']);
		
		expect(segment.segmentsFields['STF']).to.be.an('array');
		expect(segment.segmentsFields['PRA']).to.be.an('array');
		expect(segment.segmentsFields['ROL']).to.be.an('array');
	});

	it('should support additional clinical segments (DRG, TXA, ACC, DB1)', function() {
		const hl7parser = new Hl7Parser();
		const segment = new hl7parser.HL7Segment('DRG', 0, ['test']);
		
		expect(segment.segmentsFields['DRG']).to.be.an('array');
		expect(segment.segmentsFields['TXA']).to.be.an('array');
		expect(segment.segmentsFields['ACC']).to.be.an('array');
		expect(segment.segmentsFields['DB1']).to.be.an('array');
	});
});
