/*global describe */
/*global before */
/*global it */
/*global after */

(function(logger){
	'use strict';
	var path = require('path'),
		expect = require('chai').expect,
		should = require('chai').should,
		Hl7lib = require(path.join(__dirname, '..', 'lib', 'hl7')),
		config = config = {
			"mapping": false,
			"profiling": true,
			"debug": true,
			"fileEncoding": "iso-8859-1"
		};

	if (typeof describe === 'function'){
		describe('Hl7Lib test', function(){
			var	hl7parser;
			before(function(){
				hl7parser = new Hl7lib(config.hl7parser);
			});
			it('should be able to parse existing files', function(done){
				hl7parser
					.parseFile(path.join(__dirname, './testfiles/ADTA01.adm'),
						function(err, message){
							should(err).not.exist();
							expect(message).to.have.a.property('segments');
							done();
						}
					);
			});
			it('should be able to parse HL7 2.3.1 files and get field values', function(done){
				hl7parser
					.parseFile(path.join(__dirname, './testfiles/ADTA01.adm'),
						function(err, message){
							should(err).not.exist();
							expect(message).to.have.a.property('segments');
							expect(message.get('MSH', 'Version ID')).equal('2.3.1');
							done();
						}
					);
			});
			it('should be able to parse HL7 2.3.1 files and set field values', function(done){
				hl7parser
					.parseFile(path.join(__dirname, './testfiles/ADTA01.adm'),
						function(err, message){
							should(err).not.exist();
							expect(message).to.have.a.property('segments');
							message.set('MSH', 'Version ID', '2.3.2');
							expect(message.get('MSH', 'Version ID')).equal('2.3.2');
							done();
						}
					);
			});
			it('expect to warn when it parses non existing files', function(done){
				hl7parser
					.parseFile(path.join(__dirname, './testfiles/ADTA01RAND.adm'),
						function(err){
							expect(err).to.have.a.property('errno');
							done();
						}
					);
			});
			it('expect to parse large files', function(done){
				hl7parser
					.parseFile(path.join(__dirname, './testfiles/birp_ORUR01.adm'),
						function(err, message){
							should(err).not.exist;
							expect(message).to.have.a.property('segments');
							//logger.log(message);
							//expect(message.segments).to.have.a.property('segments');
							done();
						}
					);
			});

			after(function(){

			});
		});
	}
})(console);
