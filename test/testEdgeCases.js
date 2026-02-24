const { expect } = require('chai');
const Hl7Parser = require('../dist/hl7.js');

describe('Edge cases and additional tests', function() {

	describe('Hl7Message.get() edge cases', function() {
		it('should return null when requesting a non-existent segment', async function() {
			const hl7parser = new Hl7Parser();
			const message = `MSH|^~\\&|SENDING|FAC|RECEIVING|FAC|20240101||ADT^A01|123|P|2.5\rPID|1||12345||DOE^JOHN`;
			const parsed = await hl7parser.parse(message, 'TEST');
			expect(parsed.get('ZZZ')).to.be.null;
		});

		it('should return null for a non-existent field name on a valid segment', async function() {
			const hl7parser = new Hl7Parser();
			const message = `MSH|^~\\&|SENDING|FAC|RECEIVING|FAC|20240101||ADT^A01|123|P|2.5\rPID|1||12345||DOE^JOHN`;
			const parsed = await hl7parser.parse(message, 'TEST');
			expect(parsed.get('PID', 'Nonexistent Field')).to.be.null;
		});

		it('should return segment object when called with only segment name', async function() {
			const hl7parser = new Hl7Parser();
			const message = `MSH|^~\\&|SENDING|FAC|RECEIVING|FAC|20240101||ADT^A01|123|P|2.5\rPID|1||12345||DOE^JOHN`;
			const parsed = await hl7parser.parse(message, 'TEST');
			const pid = parsed.get('PID');
			expect(pid).to.not.be.null;
			expect(pid.typeofSegment).to.equal('PID');
		});
	});

	describe('Hl7Message.getSegments() edge cases', function() {
		it('should return an empty array when no matching segments exist', async function() {
			const hl7parser = new Hl7Parser();
			const message = `MSH|^~\\&|SENDING|FAC|RECEIVING|FAC|20240101||ADT^A01|123|P|2.5\rPID|1||12345||DOE^JOHN`;
			const parsed = await hl7parser.parse(message, 'TEST');
			const segments = parsed.getSegments('ZZZ');
			expect(segments).to.be.an('array').that.is.empty;
		});

		it('should return all matching segments when no index given', async function() {
			const hl7parser = new Hl7Parser();
			const message = `MSH|^~\\&|SENDING|FAC|RECEIVING|FAC|20240101||ADT^A01|123|P|2.5\rOBX|1|NM|WBC||7.5\rOBX|2|NM|RBC||4.5`;
			const parsed = await hl7parser.parse(message, 'TEST');
			const obxSegments = parsed.getSegments('OBX');
			expect(obxSegments).to.be.an('array');
			expect(obxSegments.length).to.equal(2);
		});

		it('should return specific segment by index', async function() {
			const hl7parser = new Hl7Parser();
			const message = `MSH|^~\\&|SENDING|FAC|RECEIVING|FAC|20240101||ADT^A01|123|P|2.5\rOBX|1|NM|WBC||7.5\rOBX|2|NM|RBC||4.5`;
			const parsed = await hl7parser.parse(message, 'TEST');
			const second = parsed.getSegments('OBX', 1);
			expect(second).to.not.be.null;
			expect(second.get('Set ID - OBX')).to.equal('2');
		});

		it('should return null for out-of-range index', async function() {
			const hl7parser = new Hl7Parser();
			const message = `MSH|^~\\&|SENDING|FAC|RECEIVING|FAC|20240101||ADT^A01|123|P|2.5\rOBX|1|NM|WBC||7.5`;
			const parsed = await hl7parser.parse(message, 'TEST');
			expect(parsed.getSegments('OBX', 5)).to.be.null;
		});
	});

	describe('Hl7Message.getSegmentAt() edge cases', function() {
		it('should return null for out-of-range index', async function() {
			const hl7parser = new Hl7Parser();
			const message = `MSH|^~\\&|SENDING|FAC|RECEIVING|FAC|20240101||ADT^A01|123|P|2.5`;
			const parsed = await hl7parser.parse(message, 'TEST');
			expect(parsed.getSegmentAt(100)).to.be.null;
		});

		it('should return first segment at index 0', async function() {
			const hl7parser = new Hl7Parser();
			const message = `MSH|^~\\&|SENDING|FAC|RECEIVING|FAC|20240101||ADT^A01|123|P|2.5`;
			const parsed = await hl7parser.parse(message, 'TEST');
			const seg = parsed.getSegmentAt(0);
			expect(seg).to.not.be.null;
			expect(seg.typeofSegment).to.equal('MSH');
		});
	});

	describe('Hl7Message.size()', function() {
		it('should return correct count for single-segment message', async function() {
			const hl7parser = new Hl7Parser();
			const message = `MSH|^~\\&|SENDING|FAC|RECEIVING|FAC|20240101||ADT^A01|123|P|2.5`;
			const parsed = await hl7parser.parse(message, 'TEST');
			expect(parsed.size()).to.equal(1);
		});

		it('should return correct count for multi-segment message', async function() {
			const hl7parser = new Hl7Parser();
			const message = `MSH|^~\\&|SENDING|FAC|RECEIVING|FAC|20240101||ADT^A01|123|P|2.5\rEVN|A01\rPID|1||12345\rPV1|1|I`;
			const parsed = await hl7parser.parse(message, 'TEST');
			expect(parsed.size()).to.equal(4);
		});
	});

	describe('HL7Segment.set() and get()', function() {
		it('should set and get a field value correctly', async function() {
			const hl7parser = new Hl7Parser();
			const message = `MSH|^~\\&|SENDING|FAC|RECEIVING|FAC|20240101||ADT^A01|123|P|2.5\rPID|1||12345||DOE^JOHN`;
			const parsed = await hl7parser.parse(message, 'TEST');
			const pid = parsed.get('PID');
			pid.set('Patient name', 'SMITH^JANE');
			expect(pid.get('Patient name')).to.equal('SMITH^JANE');
		});

		it('should not modify segment when setting non-existent field', async function() {
			const hl7parser = new Hl7Parser();
			const message = `MSH|^~\\&|SENDING|FAC|RECEIVING|FAC|20240101||ADT^A01|123|P|2.5\rPID|1||12345||DOE^JOHN`;
			const parsed = await hl7parser.parse(message, 'TEST');
			const pid = parsed.get('PID');
			const originalParts = [...pid.parts];
			pid.set('Nonexistent Field', 'value');
			expect(pid.parts).to.deep.equal(originalParts);
		});
	});

	describe('HL7Segment.toMappedObject()', function() {
		it('should convert segment to mapped object', async function() {
			const hl7parser = new Hl7Parser();
			const message = `MSH|^~\\&|SENDING|FAC|RECEIVING|FAC|20240101||ADT^A01|123|P|2.5\rPID|1||12345||DOE^JOHN`;
			const parsed = await hl7parser.parse(message, 'TEST');
			const pid = parsed.get('PID');
			const obj = pid.toMappedObject();
			expect(obj).to.be.an('object');
			expect(obj['Set ID – PID']).to.equal('1');
		});

		it('should return compact object excluding empty fields', async function() {
			const hl7parser = new Hl7Parser();
			const message = `MSH|^~\\&|SENDING|FAC|RECEIVING|FAC|20240101||ADT^A01|123|P|2.5\rPID|1||12345||DOE^JOHN`;
			const parsed = await hl7parser.parse(message, 'TEST');
			const pid = parsed.get('PID');
			const obj = pid.toMappedObject(true);
			expect(obj).to.be.an('object');
			expect(obj).to.not.have.property('Patient ID');
		});
	});

	describe('Parser error handling', function() {
		it('should reject on empty message', async function() {
			const hl7parser = new Hl7Parser();
			try {
				await hl7parser.parse('', 'TEST');
				throw new Error('Should have thrown');
			} catch (err) {
				expect(err).to.have.property('errortype');
				expect(err.errortype).to.equal(2000);
			}
		});

		it('should reject on message too short for delimiters', async function() {
			const hl7parser = new Hl7Parser();
			try {
				await hl7parser.parse('MSH', 'TEST');
				throw new Error('Should have thrown');
			} catch (err) {
				expect(err).to.have.property('errortype');
				expect(err.errortype).to.equal(2000);
			}
		});

		it('should reject on invalid segment type', async function() {
			const hl7parser = new Hl7Parser();
			try {
				await hl7parser.parse('MSH|^~\\&|A|B|C|D|20240101||ADT^A01|123|P|2.5\rXX|invalid', 'TEST');
				throw new Error('Should have thrown');
			} catch (err) {
				expect(err).to.have.property('errortype');
				expect(err.errortype).to.equal(2000);
			}
		});
	});

	describe('Delimiter handling', function() {
		it('should parse sub-components correctly', async function() {
			const hl7parser = new Hl7Parser();
			const message = `MSH|^~\\&|SENDING|FAC|RECEIVING|FAC|20240101||ADT^A01|123|P|2.5\rPID|1||12345||DOE^JOHN^A`;
			const parsed = await hl7parser.parse(message, 'TEST');
			const name = parsed.get('PID', 'Patient name');
			expect(name).to.be.an('array');
			expect(name[0]).to.equal('DOE');
			expect(name[1]).to.equal('JOHN');
			expect(name[2]).to.equal('A');
		});

		it('should join array fields with joinChar', async function() {
			const hl7parser = new Hl7Parser();
			const message = `MSH|^~\\&|SENDING|FAC|RECEIVING|FAC|20240101||ADT^A01|123|P|2.5\rPID|1||12345||DOE^JOHN^A`;
			const parsed = await hl7parser.parse(message, 'TEST');
			const name = parsed.get('PID', 'Patient name', ' ');
			expect(name).to.equal('DOE JOHN A');
		});
	});

	describe('Message.set() edge cases', function() {
		it('should set value via message.set()', async function() {
			const hl7parser = new Hl7Parser();
			const message = `MSH|^~\\&|SENDING|FAC|RECEIVING|FAC|20240101||ADT^A01|123|P|2.5\rPID|1||12345||DOE^JOHN`;
			const parsed = await hl7parser.parse(message, 'TEST');
			parsed.set('PID', 'Set ID – PID', '2');
			expect(parsed.get('PID', 'Set ID – PID')).to.equal('2');
		});

		it('should do nothing when segment name not found in set()', async function() {
			const hl7parser = new Hl7Parser();
			const message = `MSH|^~\\&|SENDING|FAC|RECEIVING|FAC|20240101||ADT^A01|123|P|2.5`;
			const parsed = await hl7parser.parse(message, 'TEST');
			parsed.set('ZZZ', 'field', 'value');
			expect(parsed.get('ZZZ')).to.be.null;
		});

		it('should do nothing when fieldName is undefined in set()', async function() {
			const hl7parser = new Hl7Parser();
			const message = `MSH|^~\\&|SENDING|FAC|RECEIVING|FAC|20240101||ADT^A01|123|P|2.5\rPID|1||12345||DOE^JOHN`;
			const parsed = await hl7parser.parse(message, 'TEST');
			parsed.set('PID');
			expect(parsed.get('PID', 'Set ID – PID')).to.equal('1');
		});
	});

	describe('Event emitter integration', function() {
		it('should emit message event on successful parse', function(done) {
			const hl7parser = new Hl7Parser();
			hl7parser.on('message', function(msg) {
				expect(msg).to.have.property('segments');
				done();
			});
			hl7parser.parse(`MSH|^~\\&|A|B|C|D|20240101||ADT^A01|123|P|2.5\rPID|1||12345`, 'TEST');
		});

		it('should emit error event on invalid parse', function(done) {
			const hl7parser = new Hl7Parser();
			hl7parser.on('error', function(err) {
				expect(err).to.have.property('errortype');
				done();
			});
			hl7parser.parse('', 'TEST').catch(() => {});
		});
	});

	describe('Delimiters property', function() {
		it('should expose delimiters from parsed message', async function() {
			const hl7parser = new Hl7Parser();
			const message = `MSH|^~\\&|SENDING|FAC|RECEIVING|FAC|20240101||ADT^A01|123|P|2.5`;
			const parsed = await hl7parser.parse(message, 'TEST');
			expect(parsed.delimiters).to.have.property('composite', '|');
			expect(parsed.delimiters).to.have.property('subComposite', '^');
			expect(parsed.delimiters).to.have.property('repetitions', '~');
			expect(parsed.delimiters).to.have.property('escapeChar', '\\');
			expect(parsed.delimiters).to.have.property('subComponent', '&');
		});
	});

	describe('FriendlyID property', function() {
		it('should expose friendlyID from parsed message', async function() {
			const hl7parser = new Hl7Parser();
			const message = `MSH|^~\\&|SENDING|FAC|RECEIVING|FAC|20240101||ADT^A01|123|P|2.5`;
			const parsed = await hl7parser.parse(message, 'MY-MSG-ID');
			expect(parsed.friendlyID).to.equal('MY-MSG-ID');
		});
	});

	describe('Segment order tracking', function() {
		it('should track correct order for each segment', async function() {
			const hl7parser = new Hl7Parser();
			const message = `MSH|^~\\&|A|B|C|D|20240101||ADT^A01|123|P|2.5\rEVN|A01\rPID|1||12345\rPV1|1|I`;
			const parsed = await hl7parser.parse(message, 'TEST');
			for (let i = 0; i < parsed.size(); i++) {
				expect(parsed.getSegmentAt(i).order).to.equal(i);
			}
		});
	});
});
