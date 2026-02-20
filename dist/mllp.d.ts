import * as net from 'net';
import { EventEmitter } from 'events';
declare const VT: Buffer<ArrayBuffer>;
declare const FS_CR: Buffer<ArrayBuffer>;
/**
 * Wraps an HL7 message with MLLP framing bytes.
 * @param data - The HL7 message string or Buffer to wrap.
 * @returns A Buffer containing the MLLP-framed message.
 */
declare function wrap(data: string | Buffer): Buffer;
/**
 * Extracts HL7 messages from a buffer containing MLLP-framed data.
 * Returns an object with extracted messages and any remaining (incomplete) data.
 * @param buffer - The buffer to extract messages from.
 * @returns An object with `messages` array and `remainder` Buffer.
 */
declare function unwrap(buffer: Buffer): {
    messages: Buffer[];
    remainder: Buffer;
};
type MessageHandler = (message: Buffer, reply: (response: string | Buffer) => void) => void;
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
declare class MLLPServer extends net.Server {
    private _messageHandler;
    constructor(handler?: MessageHandler);
}
/**
 * MLLP Client - connects to an MLLP server, sends HL7 messages,
 * and returns the server's response.
 *
 * Usage:
 *   const client = new MLLPClient('127.0.0.1', 2575);
 *   const response = await client.send(hl7Message);
 *   client.close();
 */
declare class MLLPClient extends EventEmitter {
    private _host;
    private _port;
    private _socket;
    private _connected;
    constructor(host: string, port: number);
    private _connect;
    /**
     * Send an HL7 message and wait for the server's response.
     * @param data - The HL7 message string or Buffer to send.
     * @returns A Promise that resolves with the response Buffer.
     */
    send(data: string | Buffer): Promise<Buffer>;
    /**
     * Close the client connection.
     */
    close(): void;
}
export { VT, FS_CR, wrap, unwrap, MLLPServer, MLLPClient };
//# sourceMappingURL=mllp.d.ts.map