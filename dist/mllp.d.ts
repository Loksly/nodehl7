import * as net from 'net';
import * as tls from 'tls';
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
interface MLLPServerOptions {
    tls?: tls.TlsOptions;
}
interface MLLPClientOptions {
    tls?: tls.ConnectionOptions;
}
/**
 * MLLP Server - a TCP/TLS server that handles MLLP-framed HL7 messages.
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
 *
 *   // With TLS:
 *   const server = new MLLPServer(handler, { tls: { key, cert } });
 *   server.listen(port);
 */
declare class MLLPServer extends EventEmitter {
    private _messageHandler;
    private _server;
    constructor(handler?: MessageHandler | MLLPServerOptions, options?: MLLPServerOptions);
    listen(port?: number, hostname?: string, backlog?: number, listeningListener?: () => void): this;
    listen(port?: number, hostname?: string, listeningListener?: () => void): this;
    listen(port?: number, listeningListener?: () => void): this;
    listen(options: net.ListenOptions, listeningListener?: () => void): this;
    close(callback?: (err?: Error) => void): this;
    address(): net.AddressInfo | string | null;
}
/**
 * MLLP Client - connects to an MLLP server, sends HL7 messages,
 * and returns the server's response.
 *
 * Usage:
 *   const client = new MLLPClient('127.0.0.1', 2575);
 *   const response = await client.send(hl7Message);
 *   client.close();
 *
 *   // With TLS:
 *   const client = new MLLPClient('127.0.0.1', 2575, { tls: { rejectUnauthorized: false } });
 *   const response = await client.send(hl7Message);
 *   client.close();
 */
declare class MLLPClient extends EventEmitter {
    private _host;
    private _port;
    private _socket;
    private _connected;
    private _tlsOptions;
    constructor(host: string, port: number, options?: MLLPClientOptions);
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