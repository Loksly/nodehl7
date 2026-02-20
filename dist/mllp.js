"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.MLLPClient = exports.MLLPServer = exports.FS_CR = exports.VT = void 0;
exports.wrap = wrap;
exports.unwrap = unwrap;
const net = __importStar(require("net"));
const events_1 = require("events");
const VT = Buffer.from([0x0b]);
exports.VT = VT;
const FS_CR = Buffer.from([0x1c, 0x0d]);
exports.FS_CR = FS_CR;
/**
 * Wraps an HL7 message with MLLP framing bytes.
 * @param data - The HL7 message string or Buffer to wrap.
 * @returns A Buffer containing the MLLP-framed message.
 */
function wrap(data) {
    const payload = Buffer.isBuffer(data) ? data : Buffer.from(data);
    return Buffer.concat([VT, payload, FS_CR]);
}
/**
 * Extracts HL7 messages from a buffer containing MLLP-framed data.
 * Returns an object with extracted messages and any remaining (incomplete) data.
 * @param buffer - The buffer to extract messages from.
 * @returns An object with `messages` array and `remainder` Buffer.
 */
function unwrap(buffer) {
    const messages = [];
    let remainder = buffer;
    while (remainder.length > 0) {
        const startIdx = remainder.indexOf(VT[0]);
        if (startIdx < 0) {
            // No start byte found; discard everything
            remainder = Buffer.alloc(0);
            break;
        }
        // Discard any data before the start byte
        if (startIdx > 0) {
            remainder = remainder.subarray(startIdx);
        }
        // Look for end sequence (FS + CR)
        let endIdx = -1;
        for (let i = 1; i < remainder.length - 1; i++) {
            if (remainder[i] === FS_CR[0] && remainder[i + 1] === FS_CR[1]) {
                endIdx = i;
                break;
            }
        }
        if (endIdx < 0) {
            // No complete end sequence found yet; keep remainder for next read
            break;
        }
        // Extract message payload (between VT and FS+CR)
        const payload = remainder.subarray(1, endIdx);
        messages.push(Buffer.from(payload));
        remainder = remainder.subarray(endIdx + 2);
    }
    return { messages, remainder };
}
/**
 * MLLP Server - a TCP server that handles MLLP-framed HL7 messages.
 *
 * Emits:
 *  - 'hl7_message' with (message: Buffer, reply: Function, socket: net.Socket)
 *  - 'error' on framing or server errors
 *
 * Usage:
 *   const server = new MLLPServer((message, reply) => { ... });
 *   server.listen(port);
 *
 *   // OR event-based:
 *   const server = new MLLPServer();
 *   server.on('hl7_message', (message, reply) => { ... });
 *   server.listen(port);
 */
class MLLPServer extends net.Server {
    constructor(handler) {
        super();
        this._messageHandler = handler || null;
        this.on('connection', (socket) => {
            let buffer = Buffer.alloc(0);
            socket.on('data', (data) => {
                buffer = Buffer.concat([buffer, data]);
                const result = unwrap(buffer);
                buffer = Buffer.from(result.remainder);
                for (const msg of result.messages) {
                    const reply = (response) => {
                        socket.write(wrap(response));
                    };
                    this.emit('hl7_message', msg, reply, socket);
                    if (this._messageHandler) {
                        this._messageHandler(msg, reply);
                    }
                }
            });
            socket.on('error', (err) => {
                this.emit('error', err);
            });
        });
    }
}
exports.MLLPServer = MLLPServer;
/**
 * MLLP Client - connects to an MLLP server, sends HL7 messages,
 * and returns the server's response.
 *
 * Usage:
 *   const client = new MLLPClient('127.0.0.1', 2575);
 *   const response = await client.send(hl7Message);
 *   client.close();
 */
class MLLPClient extends events_1.EventEmitter {
    constructor(host, port) {
        super();
        this._host = host;
        this._port = port;
        this._socket = null;
        this._connected = false;
    }
    _connect() {
        return new Promise((resolve, reject) => {
            if (this._socket && this._connected) {
                resolve(this._socket);
                return;
            }
            const socket = net.createConnection({ host: this._host, port: this._port }, () => {
                this._connected = true;
                resolve(socket);
            });
            socket.on('error', (err) => {
                this._connected = false;
                this.emit('error', err);
                reject(err);
            });
            socket.on('close', () => {
                this._connected = false;
                this._socket = null;
            });
            this._socket = socket;
        });
    }
    /**
     * Send an HL7 message and wait for the server's response.
     * @param data - The HL7 message string or Buffer to send.
     * @returns A Promise that resolves with the response Buffer.
     */
    send(data) {
        return new Promise((resolve, reject) => {
            this._connect().then((socket) => {
                let buffer = Buffer.alloc(0);
                const onData = (chunk) => {
                    buffer = Buffer.concat([buffer, chunk]);
                    const { messages } = unwrap(buffer);
                    if (messages.length > 0) {
                        socket.removeListener('data', onData);
                        socket.removeListener('error', onError);
                        resolve(messages[0]);
                    }
                };
                const onError = (err) => {
                    socket.removeListener('data', onData);
                    reject(err);
                };
                socket.on('data', onData);
                socket.on('error', onError);
                socket.write(wrap(data));
            }).catch(reject);
        });
    }
    /**
     * Close the client connection.
     */
    close() {
        if (this._socket) {
            this._socket.destroy();
            this._socket = null;
            this._connected = false;
        }
    }
}
exports.MLLPClient = MLLPClient;
//# sourceMappingURL=mllp.js.map