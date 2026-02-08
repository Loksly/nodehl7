/*global describe */
/*global before */
/*global it */
/*global after */

(function(logger){
	'use strict';
	var path = require('path'),
		fs = require('fs'),
		expect = require('chai').expect,
		should = require('chai').should,
		Hl7lib = require(path.join(__dirname, '..', 'dist', 'hl7')),
		config = {
			"mapping": false,
			"profiling": true,
			"debug": true,
			"fileEncoding": "iso-8859-1"
		};

	if (typeof describe === 'function'){
		describe('Hl7Lib promise-based API test', function(){
			var	hl7parser;
			before(function(){
				hl7parser = new Hl7lib(config);
			});

			it('should be able to parse existing files using promises', async function(){
				const message = await hl7parser.parseFile(path.join(__dirname, './testfiles/ADTA01.adm'));
				expect(message).to.have.a.property('segments');
			});

			it('should be able to parse HL7 2.3.1 files and get field values using promises', async function(){
				const message = await hl7parser.parseFile(path.join(__dirname, './testfiles/ADTA01.adm'));
				expect(message).to.have.a.property('segments');
				expect(message.get('MSH', 'Version ID')).equal('2.3.1');
			});

			it('should be able to parse HL7 2.3.1 files and set field values using promises', async function(){
				const message = await hl7parser.parseFile(path.join(__dirname, './testfiles/ADTA01.adm'));
				expect(message).to.have.a.property('segments');
				message.set('MSH', 'Version ID', '2.3.2');
				expect(message.get('MSH', 'Version ID')).equal('2.3.2');
			});

			it('should reject promise when parsing non existing files', async function(){
				try {
					await hl7parser.parseFile(path.join(__dirname, './testfiles/ADTA01RAND.adm'));
					throw new Error('Should have thrown an error');
				} catch (err) {
					expect(err).to.exist;
				}
			});

			it('should be able to parse large files using promises', async function(){
				const message = await hl7parser.parseFile(path.join(__dirname, './testfiles/birp_ORUR01.adm'));
				expect(message).to.have.a.property('segments');
				expect(message.size()).to.be.above(0);
			});

			it('should be able to parse message content directly using promises', async function(){
				const originalMessage = fs.readFileSync(path.join(__dirname, './testfiles/ADTA01.adm'), "latin1");
				const message = await hl7parser.parse(originalMessage, './testfiles/ADTA01.adm');
				expect(message).to.have.a.property('segments');
				expect(message.get('MSH', 'Version ID')).equal('2.3.1');
			});

			it('should support .then() and .catch() promise methods', function(done){
				hl7parser.parseFile(path.join(__dirname, './testfiles/ADTA01.adm'))
					.then(function(message){
						expect(message).to.have.a.property('segments');
						expect(message.get('MSH', 'Version ID')).equal('2.3.1');
						done();
					})
					.catch(function(err){
						done(err);
					});
			});

			it('should reject with error for invalid message content', async function(){
				try {
					await hl7parser.parse('', 'test');
					throw new Error('Should have thrown an error');
				} catch (err) {
					expect(err).to.exist;
					expect(err).to.have.property('errortype');
				}
			});
		});
	}
})();
