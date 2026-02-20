/*global describe */
/*global it */

(function () {
	'use strict';
	var path = require('path'),
		expect = require('chai').expect,
		net = require('net'),
		nodehl7 = require(path.join(__dirname, '..', 'dist', 'hl7'));

	var MLLPServer = nodehl7.MLLPServer;
	var MLLPClient = nodehl7.MLLPClient;
	var mllpWrap = nodehl7.mllpWrap;
	var mllpUnwrap = nodehl7.mllpUnwrap;

	var VT = Buffer.from([0x0b]);
	var FS_CR = Buffer.from([0x1c, 0x0d]);

	var HL7_SAMPLE = 'MSH|^~\\&|SENDING_APP|SENDING_FACILITY|REC_APP|REC_FACILITY|202305101000||ADT^A01|123|P|2.3';
	var HL7_ACK = 'MSH|^~\\&|REC_APP|REC_FACILITY|SENDING_APP|SENDING_FACILITY|202305101000||ACK|456|P|2.3\rMSA|AA|123';

	if (typeof describe === 'function') {
		describe('MLLP Framing Tests', function () {
			it('should wrap a message with VT prefix and FS+CR suffix', function () {
				var wrapped = mllpWrap(HL7_SAMPLE);
				expect(wrapped[0]).to.equal(0x0b);
				expect(wrapped[wrapped.length - 2]).to.equal(0x1c);
				expect(wrapped[wrapped.length - 1]).to.equal(0x0d);
				var payload = wrapped.subarray(1, wrapped.length - 2).toString();
				expect(payload).to.equal(HL7_SAMPLE);
			});

			it('should wrap a Buffer payload correctly', function () {
				var buf = Buffer.from(HL7_SAMPLE);
				var wrapped = mllpWrap(buf);
				expect(wrapped[0]).to.equal(0x0b);
				expect(wrapped[wrapped.length - 2]).to.equal(0x1c);
				expect(wrapped[wrapped.length - 1]).to.equal(0x0d);
			});

			it('should unwrap a single complete MLLP frame', function () {
				var wrapped = mllpWrap(HL7_SAMPLE);
				var result = mllpUnwrap(wrapped);
				expect(result.messages).to.have.lengthOf(1);
				expect(result.messages[0].toString()).to.equal(HL7_SAMPLE);
				expect(result.remainder).to.have.lengthOf(0);
			});

			it('should unwrap multiple messages in a single buffer', function () {
				var frame1 = mllpWrap('MSG1');
				var frame2 = mllpWrap('MSG2');
				var combined = Buffer.concat([frame1, frame2]);
				var result = mllpUnwrap(combined);
				expect(result.messages).to.have.lengthOf(2);
				expect(result.messages[0].toString()).to.equal('MSG1');
				expect(result.messages[1].toString()).to.equal('MSG2');
			});

			it('should return remainder for incomplete frames', function () {
				var partial = Buffer.concat([VT, Buffer.from('incomplete')]);
				var result = mllpUnwrap(partial);
				expect(result.messages).to.have.lengthOf(0);
				expect(result.remainder.length).to.be.greaterThan(0);
			});

			it('should discard data before start byte', function () {
				var garbage = Buffer.from('garbage');
				var wrapped = mllpWrap('VALID');
				var combined = Buffer.concat([garbage, wrapped]);
				var result = mllpUnwrap(combined);
				expect(result.messages).to.have.lengthOf(1);
				expect(result.messages[0].toString()).to.equal('VALID');
			});
		});

		describe('MLLP Server and Client Tests', function () {
			var TEST_PORT = 0; // Use port 0 to get an available port

			it('should send and receive an HL7 message correctly', function (done) {
				this.timeout(5000);
				var server = new MLLPServer(function (message, reply) {
					expect(message.toString()).to.equal(HL7_SAMPLE);
					reply(HL7_ACK);
				});

				server.listen(0, '127.0.0.1', function () {
					var port = server.address().port;
					var client = new MLLPClient('127.0.0.1', port);

					client.send(HL7_SAMPLE).then(function (response) {
						expect(response.toString()).to.contain('ACK');
						expect(response.toString()).to.contain('MSA|AA|123');
						client.close();
						server.close(done);
					}).catch(function (err) {
						client.close();
						server.close(function () { done(err); });
					});
				});
			});

			it('should handle fragmented messages across multiple TCP packets', function (done) {
				this.timeout(5000);
				var server = new MLLPServer(function (message, reply) {
					expect(message.toString()).to.equal(HL7_SAMPLE);
					reply(HL7_ACK);
				});

				server.listen(0, '127.0.0.1', function () {
					var port = server.address().port;
					// Use raw TCP socket to send fragmented data
					var socket = net.createConnection({ host: '127.0.0.1', port: port }, function () {
						var wrapped = mllpWrap(HL7_SAMPLE);
						// Send in 3 fragments
						var part1 = wrapped.subarray(0, 10);
						var part2 = wrapped.subarray(10, 30);
						var part3 = wrapped.subarray(30);

						socket.write(part1);
						setTimeout(function () {
							socket.write(part2);
							setTimeout(function () {
								socket.write(part3);
							}, 50);
						}, 50);
					});

					var responseBuffer = Buffer.alloc(0);
					socket.on('data', function (data) {
						responseBuffer = Buffer.concat([responseBuffer, data]);
						var result = mllpUnwrap(responseBuffer);
						if (result.messages.length > 0) {
							expect(result.messages[0].toString()).to.contain('ACK');
							socket.destroy();
							server.close(done);
						}
					});
				});
			});

			it('should handle multiple concurrent connections', function (done) {
				this.timeout(5000);
				var receivedMessages = 0;
				var totalMessages = 3;

				var server = new MLLPServer(function (message, reply) {
					receivedMessages++;
					reply(HL7_ACK);
				});

				server.listen(0, '127.0.0.1', function () {
					var port = server.address().port;
					var completed = 0;

					function onComplete() {
						completed++;
						if (completed === totalMessages) {
							expect(receivedMessages).to.equal(totalMessages);
							server.close(done);
						}
					}

					for (var i = 0; i < totalMessages; i++) {
						(function () {
							var client = new MLLPClient('127.0.0.1', port);
							client.send(HL7_SAMPLE).then(function (response) {
								expect(response.toString()).to.contain('ACK');
								client.close();
								onComplete();
							}).catch(function (err) {
								done(err);
							});
						})();
					}
				});
			});

			it('should emit hl7_message event on the server', function (done) {
				this.timeout(5000);
				var server = new MLLPServer();

				server.on('hl7_message', function (message, reply) {
					expect(message.toString()).to.equal(HL7_SAMPLE);
					reply(HL7_ACK);
				});

				server.listen(0, '127.0.0.1', function () {
					var port = server.address().port;
					var client = new MLLPClient('127.0.0.1', port);

					client.send(HL7_SAMPLE).then(function (response) {
						expect(response.toString()).to.contain('ACK');
						client.close();
						server.close(done);
					}).catch(function (err) {
						client.close();
						server.close(function () { done(err); });
					});
				});
			});

			it('should handle multiple messages on a single connection', function (done) {
				this.timeout(5000);
				var messageCount = 0;

				var server = new MLLPServer(function (message, reply) {
					messageCount++;
					reply('ACK' + messageCount);
				});

				server.listen(0, '127.0.0.1', function () {
					var port = server.address().port;
					// Use raw socket to send two messages in quick succession
					var socket = net.createConnection({ host: '127.0.0.1', port: port }, function () {
						var msg1 = mllpWrap('MSG_ONE');
						var msg2 = mllpWrap('MSG_TWO');
						// Send both frames concatenated in one write
						socket.write(Buffer.concat([msg1, msg2]));
					});

					var responseBuffer = Buffer.alloc(0);
					var responsesReceived = 0;
					socket.on('data', function (data) {
						responseBuffer = Buffer.concat([responseBuffer, data]);
						var result = mllpUnwrap(responseBuffer);
						responsesReceived += result.messages.length;
						responseBuffer = result.remainder;
						if (responsesReceived >= 2) {
							expect(messageCount).to.equal(2);
							socket.destroy();
							server.close(done);
						}
					});
				});
			});
		});
	}
})();
