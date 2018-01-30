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
		Hl7lib = require(path.join(__dirname, '..', 'lib', 'hl7')),
		config = config = {
			"mapping": false,
			"profiling": true,
			"debug": true,
			"fileEncoding": "iso-8859-1"
		};

	/* Note this method is not fully supported as it doesn't escape any of the delimiters back */
	function fromObjectToHL7Message(message){
		return message.segments.map(function(segment){
			var parts = segment.parts.map(function(part){
				return Array.isArray(part) ? part.join(message.delimiters.subComposite) : part;
			});
			parts.unshift(segment.typeofSegment);

			return parts.join(message.delimiters.composite);
		}).join("\r\n");
	}

	if (typeof describe === 'function'){
		describe('Hl7Lib serialize test', function(){
			var	hl7parser;
			before(function(){
				hl7parser = new Hl7lib(config.hl7parser);
			});

			var testFiles = ['./testfiles/ADTA01.adm', './testfiles/bicp_ORUR01.adm', './testfiles/birp_ORUR01.adm'];

			testFiles.forEach(function(testfile){
				it('should be able to parse existing files like ' + testfile + ' and serialize them back', function(done){
					hl7parser
						.parseFile(path.join(__dirname, testfile),
							function(err, message){
								should(err).not.exist();
								expect(message).to.have.a.property('segments');

								var msg = fromObjectToHL7Message(message);
								var originalMessage = String(fs.readFileSync(path.join(__dirname, testfile)));

								expect(msg).to.be.equal(originalMessage);
								done();
							}
						);
				});
			});
			
			after(function(){

			});
		});
	}
})(console);
