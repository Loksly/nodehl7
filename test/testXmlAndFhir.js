/*global describe */
/*global before */
/*global it */

'use strict';

const path = require('path');
const fs = require('fs');
const { expect } = require('chai');
const Hl7Parser = require('../dist/hl7.js');

describe('XML parsing and FHIR transformation', function () {
	let hl7parser;

	before(function () {
		hl7parser = new Hl7Parser();
	});

	describe('parseXML – basic parsing', function () {
		it('should parse a valid HL7 v2 XML string and return an Hl7Message', async function () {
			const xml = fs.readFileSync(path.join(__dirname, 'testfiles/ADTA01.xml'), 'utf8');
			const message = await hl7parser.parseXML(xml, 'TEST-XML');
			expect(message).to.have.property('segments');
			expect(message.segments).to.be.an('array');
		});

		it('should parse MSH Version ID from XML message', async function () {
			const xml = fs.readFileSync(path.join(__dirname, 'testfiles/ADTA01.xml'), 'utf8');
			const message = await hl7parser.parseXML(xml, 'TEST-XML');
			expect(message.get('MSH', 'Version ID')).to.equal('2.3.1');
		});

		it('should parse MSH Sending application from XML message', async function () {
			const xml = fs.readFileSync(path.join(__dirname, 'testfiles/ADTA01.xml'), 'utf8');
			const message = await hl7parser.parseXML(xml, 'TEST-XML');
			expect(message.get('MSH', 'Sending application')).to.equal('EPICADT');
		});

		it('should parse MSH Receiving application from XML message', async function () {
			const xml = fs.readFileSync(path.join(__dirname, 'testfiles/ADTA01.xml'), 'utf8');
			const message = await hl7parser.parseXML(xml, 'TEST-XML');
			expect(message.get('MSH', 'Receiving application')).to.equal('LABADT');
		});

		it('should parse MSH Message control ID from XML message', async function () {
			const xml = fs.readFileSync(path.join(__dirname, 'testfiles/ADTA01.xml'), 'utf8');
			const message = await hl7parser.parseXML(xml, 'TEST-XML');
			expect(message.get('MSH', 'Message control ID')).to.equal('HL7MSG00001');
		});

		it('should parse MSH Message type as array from XML message', async function () {
			const xml = fs.readFileSync(path.join(__dirname, 'testfiles/ADTA01.xml'), 'utf8');
			const message = await hl7parser.parseXML(xml, 'TEST-XML');
			const msgType = message.get('MSH', 'Message type');
			expect(msgType).to.deep.equal(['ADT', 'A01']);
		});

		it('should parse EVN Event Type Code from XML message', async function () {
			const xml = fs.readFileSync(path.join(__dirname, 'testfiles/ADTA01.xml'), 'utf8');
			const message = await hl7parser.parseXML(xml, 'TEST-XML');
			expect(message.get('EVN', 'Event Type Code')).to.equal('A01');
		});

		it('should parse PID patient name as array from XML message', async function () {
			const xml = fs.readFileSync(path.join(__dirname, 'testfiles/ADTA01.xml'), 'utf8');
			const message = await hl7parser.parseXML(xml, 'TEST-XML');
			const name = message.get('PID', 'Patient name');
			expect(name).to.deep.equal(['APPLESEED', 'JOHN']);
		});

		it('should parse PID gender from XML message', async function () {
			const xml = fs.readFileSync(path.join(__dirname, 'testfiles/ADTA01.xml'), 'utf8');
			const message = await hl7parser.parseXML(xml, 'TEST-XML');
			expect(message.get('PID', 'Gender')).to.equal('M');
		});

		it('should parse PID date of birth from XML message', async function () {
			const xml = fs.readFileSync(path.join(__dirname, 'testfiles/ADTA01.xml'), 'utf8');
			const message = await hl7parser.parseXML(xml, 'TEST-XML');
			expect(message.get('PID', 'Date of birth')).to.equal('19710101');
		});

		it('should correctly count segments in XML message', async function () {
			const xml = fs.readFileSync(path.join(__dirname, 'testfiles/ADTA01.xml'), 'utf8');
			const message = await hl7parser.parseXML(xml, 'TEST-XML');
			expect(message.size()).to.equal(5);
		});

		it('should support message.get() to retrieve a segment object', async function () {
			const xml = fs.readFileSync(path.join(__dirname, 'testfiles/ADTA01.xml'), 'utf8');
			const message = await hl7parser.parseXML(xml, 'TEST-XML');
			const pid = message.get('PID');
			expect(pid).to.not.be.null;
			expect(pid.typeofSegment).to.equal('PID');
		});

		it('should return null for a non-existent segment in XML message', async function () {
			const xml = fs.readFileSync(path.join(__dirname, 'testfiles/ADTA01.xml'), 'utf8');
			const message = await hl7parser.parseXML(xml, 'TEST-XML');
			expect(message.get('ZZZ')).to.be.null;
		});

		it('should support encoding characters decoded from XML entities', async function () {
			const xml = fs.readFileSync(path.join(__dirname, 'testfiles/ADTA01.xml'), 'utf8');
			const message = await hl7parser.parseXML(xml, 'TEST-XML');
			expect(message.get('MSH', 'Encoding characters')).to.equal('^~\\&');
		});

		it('should have standard delimiters after XML parse', async function () {
			const xml = fs.readFileSync(path.join(__dirname, 'testfiles/ADTA01.xml'), 'utf8');
			const message = await hl7parser.parseXML(xml, 'TEST-XML');
			expect(message.delimiters.composite).to.equal('|');
			expect(message.delimiters.subComposite).to.equal('^');
		});
	});

	describe('parseXML – callback API', function () {
		it('should call callback with message on success', function (done) {
			const xml = fs.readFileSync(path.join(__dirname, 'testfiles/ADTA01.xml'), 'utf8');
			hl7parser.parseXML(xml, 'TEST-CB', function (err, message) {
				expect(err).to.be.null;
				expect(message).to.have.property('segments');
				done();
			});
		});

		it('should call callback with error on invalid XML', function (done) {
			hl7parser.parseXML('not xml at all', 'TEST-BAD', function (err) {
				expect(err).to.have.property('errortype');
				done();
			});
		});
	});

	describe('parseXML – error handling', function () {
		it('should reject promise on invalid XML', async function () {
			try {
				await hl7parser.parseXML('not xml', 'TEST-INVALID');
				expect.fail('Should have thrown');
			} catch (err) {
				expect(err).to.have.property('errortype');
			}
		});

		it('should reject promise on XML with no known HL7 segments', async function () {
			const emptyXml = '<root><UnknownElement>value</UnknownElement></root>';
			try {
				await hl7parser.parseXML(emptyXml, 'TEST-EMPTY');
				expect.fail('Should have thrown');
			} catch (err) {
				expect(err).to.have.property('errortype');
			}
		});
	});

	describe('toFHIR – FHIR Bundle conversion', function () {
		it('should return a FHIR Bundle with resourceType Bundle', async function () {
			const xml = fs.readFileSync(path.join(__dirname, 'testfiles/ADTA01.xml'), 'utf8');
			const message = await hl7parser.parseXML(xml, 'TEST-FHIR');
			const fhir = message.toFHIR();
			expect(fhir).to.have.property('resourceType', 'Bundle');
			expect(fhir).to.have.property('type', 'message');
			expect(fhir).to.have.property('entry');
		});

		it('should include a MessageHeader resource in the FHIR Bundle', async function () {
			const xml = fs.readFileSync(path.join(__dirname, 'testfiles/ADTA01.xml'), 'utf8');
			const message = await hl7parser.parseXML(xml, 'TEST-FHIR');
			const fhir = message.toFHIR();
			const msgHeader = fhir.entry[0].resource;
			expect(msgHeader).to.have.property('resourceType', 'MessageHeader');
		});

		it('should map MSH Message control ID to MessageHeader id', async function () {
			const xml = fs.readFileSync(path.join(__dirname, 'testfiles/ADTA01.xml'), 'utf8');
			const message = await hl7parser.parseXML(xml, 'TEST-FHIR');
			const fhir = message.toFHIR();
			const msgHeader = fhir.entry[0].resource;
			expect(msgHeader.id).to.equal('HL7MSG00001');
		});

		it('should map MSH Sending application to MessageHeader source.name', async function () {
			const xml = fs.readFileSync(path.join(__dirname, 'testfiles/ADTA01.xml'), 'utf8');
			const message = await hl7parser.parseXML(xml, 'TEST-FHIR');
			const fhir = message.toFHIR();
			const msgHeader = fhir.entry[0].resource;
			expect(msgHeader.source.name).to.equal('EPICADT');
		});

		it('should include a Patient resource in the FHIR Bundle', async function () {
			const xml = fs.readFileSync(path.join(__dirname, 'testfiles/ADTA01.xml'), 'utf8');
			const message = await hl7parser.parseXML(xml, 'TEST-FHIR');
			const fhir = message.toFHIR();
			const patient = fhir.entry[1].resource;
			expect(patient).to.have.property('resourceType', 'Patient');
		});

		it('should map PID patient name to Patient.name family and given', async function () {
			const xml = fs.readFileSync(path.join(__dirname, 'testfiles/ADTA01.xml'), 'utf8');
			const message = await hl7parser.parseXML(xml, 'TEST-FHIR');
			const fhir = message.toFHIR();
			const patient = fhir.entry[1].resource;
			expect(patient.name[0].family).to.equal('APPLESEED');
			expect(patient.name[0].given).to.deep.equal(['JOHN']);
		});

		it('should map PID gender M to FHIR male', async function () {
			const xml = fs.readFileSync(path.join(__dirname, 'testfiles/ADTA01.xml'), 'utf8');
			const message = await hl7parser.parseXML(xml, 'TEST-FHIR');
			const fhir = message.toFHIR();
			const patient = fhir.entry[1].resource;
			expect(patient.gender).to.equal('male');
		});

		it('should map PID date of birth to FHIR birthDate in YYYY-MM-DD format', async function () {
			const xml = fs.readFileSync(path.join(__dirname, 'testfiles/ADTA01.xml'), 'utf8');
			const message = await hl7parser.parseXML(xml, 'TEST-FHIR');
			const fhir = message.toFHIR();
			const patient = fhir.entry[1].resource;
			expect(patient.birthDate).to.equal('1971-01-01');
		});

		it('should map PID patient address to Patient.address', async function () {
			const xml = fs.readFileSync(path.join(__dirname, 'testfiles/ADTA01.xml'), 'utf8');
			const message = await hl7parser.parseXML(xml, 'TEST-FHIR');
			const fhir = message.toFHIR();
			const patient = fhir.entry[1].resource;
			expect(patient.address[0].city).to.equal('MADISON');
			expect(patient.address[0].state).to.equal('WI');
		});

		it('should map PID phone number to Patient.telecom', async function () {
			const xml = fs.readFileSync(path.join(__dirname, 'testfiles/ADTA01.xml'), 'utf8');
			const message = await hl7parser.parseXML(xml, 'TEST-FHIR');
			const fhir = message.toFHIR();
			const patient = fhir.entry[1].resource;
			expect(patient.telecom[0].system).to.equal('phone');
			expect(patient.telecom[0].value).to.equal('(414)379-1212');
			expect(patient.telecom[0].use).to.equal('home');
		});

		it('should work on ER7-parsed messages too', async function () {
			const hl7Content = 'MSH|^~\\&|EPICADT|DH|LABADT|DH|201301011226||ADT^A01|HL7MSG00001|P|2.3.1|\rPID|||MRN12345^5^M11||APPLESEED^JOHN^A^III||19710101|M';
			const message = await hl7parser.parse(hl7Content, 'TEST-ER7');
			const fhir = message.toFHIR();
			expect(fhir.resourceType).to.equal('Bundle');
			const patient = fhir.entry[1].resource;
			expect(patient.gender).to.equal('male');
			expect(patient.birthDate).to.equal('1971-01-01');
		});

		it('should return a Bundle with only MessageHeader when no PID segment', async function () {
			const hl7Content = 'MSH|^~\\&|SENDING|FAC|RECEIVING|FAC|20240101||ADT^A01|123|P|2.5';
			const message = await hl7parser.parse(hl7Content, 'TEST-NOPID');
			const fhir = message.toFHIR();
			expect(fhir.entry).to.have.lengthOf(1);
			expect(fhir.entry[0].resource.resourceType).to.equal('MessageHeader');
		});

		it('should map destination when MSH Receiving application is present', async function () {
			const hl7Content = 'MSH|^~\\&|SENDING|FAC|RECEIVING|FAC|20240101||ADT^A01|123|P|2.5';
			const message = await hl7parser.parse(hl7Content, 'TEST-DEST');
			const fhir = message.toFHIR();
			const msgHeader = fhir.entry[0].resource;
			expect(msgHeader.destination[0].name).to.equal('RECEIVING');
		});
	});

	describe('parseXML – segments via toMappedObject', function () {
		it('should support toMappedObject on XML-parsed segments', async function () {
			const xml = fs.readFileSync(path.join(__dirname, 'testfiles/ADTA01.xml'), 'utf8');
			const message = await hl7parser.parseXML(xml, 'TEST-MAP');
			const msh = message.get('MSH');
			const mapped = msh.toMappedObject();
			expect(mapped).to.have.property('Version ID', '2.3.1');
			expect(mapped).to.have.property('Sending application', 'EPICADT');
		});
	});
});
