# Changelog
All notable changes to this project will be documented in this file.

## [2.1.0] - 2026-02-24

### Added
- **XML Parser**: New `parseXML(xmlContent, ID, [callback])` method on `hl7Parser` that parses HL7 v2 XML-encoded messages (namespace `urn:hl7-org:v2xml`) and returns a standard `Hl7Message` object, fully compatible with all existing methods (`get`, `getSegments`, `toMappedObject`, etc.).
- **FHIR Transformation**: New `toFHIR()` method on `Hl7Message` that converts a parsed HL7 v2 message into a FHIR R4 Bundle (JSON), mapping:
  - MSH segment → `MessageHeader` resource (id, eventCoding, source, destination)
  - PID segment → `Patient` resource (identifier, name, birthDate, gender, address, telecom)
- **33 new unit tests** covering XML parsing, FHIR output, error handling, callback API, and `toMappedObject` compatibility.
- `toFHIR()` works on both XML-parsed and ER7-parsed messages.

## [2.0.0] - 2026-02-24

### Changed
- **Typed Segment Definitions**: Segment definitions converted from JSON files to TypeScript files, one for each segment, exporting types and interfaces for better type checking and autocompletion in IDEs.
- **Typed Segment Access**: `message.get('PID')` now returns a `PIDSegment` type (or `null`) instead of a generic `Segment` type, providing better type safety and easier access to segment-specific fields via method overloads and `SegmentTypeMap`.
- **Improved Type Safety**: Replaced all `any` and `unknown` types with specific types:
  - `logger` option is now typed as `Pick<Console, 'error'>` instead of `unknown`, matching the `console.error` interface.
  - `fs` option is now typed as `Pick<typeof fs, 'stat' | 'open' | 'close' | 'read'>` instead of `unknown`, matching the required Node.js `fs` methods.
  - Segment parts typed as `(string | string[])[]` instead of `any[]`.
  - Simplified logger usage throughout the codebase by removing runtime type-checking casts.

### Added
- Exported `SegmentName`, `SegmentTypeMap`, `SegmentsFields`, `SegmentFieldNameMap`, and `HL7SegmentBase` types for library consumers.
- Per-segment TypeScript type definitions (e.g., `PIDFieldName`, `MSHFieldName`) for IDE autocompletion of field names.
- 28 new unit tests covering edge cases for get/set, getSegments, getSegmentAt, size, toMappedObject, error handling, delimiters, events, and more.
- Contributing guidelines section in README.
- Project homepage link in README.

### Breaking Changes
- `HL7ParserOptions.logger` type changed from `unknown` to `Pick<Console, 'error'>`. Custom loggers must provide an `error()` method compatible with `Console.error`.
- `HL7ParserOptions.fs` type changed from `unknown` to `Pick<typeof fs, 'stat' | 'open' | 'close' | 'read'>`. Custom filesystem implementations must provide these four methods.

## [1.1.0] - 2025-06-15

### Added
- **MLLP Network Transport**: Built-in MLLP (Minimal Lower Layer Protocol) server and client for real-time HL7 message exchange over TCP/IP.
- **TLS/SSL Support**: Optional encrypted connections for secure HL7 communication in both MLLP server and client.
- **MLLP Framing Utilities**: Low-level `wrap()` and `unwrap()` functions for MLLP message framing.
- MLLP test suite covering framing, server/client, fragmentation, concurrent connections, and TLS.

## [1.0.0] - 2025-01-15

### Added
- **TypeScript Support**: Full TypeScript migration with type definitions.
  - Created `src/` directory for TypeScript source code.
  - Created `dist/` directory for compiled JavaScript output.
  - Added TypeScript interfaces for all core types (Delimiters, HL7ParserOptions, Equivalence, SegmentInfo, SegmentsFields).
  - Generated `.d.ts` declaration files for TypeScript consumers.
  - Converted prototypal classes to ES6 classes.
- **Dual Module Format Support**: Package now supports both CommonJS and ES Modules.
  - CommonJS build in `dist/hl7.js`.
  - ES Module build in `dist/esm/hl7.js`.
  - Properly configured `package.json` with `main`, `module`, `types`, and `exports` fields.
- **Promise-Based API**: Both `parse()` and `parseFile()` methods now return Promises.
  - Full async/await support.
  - Support for `.then()` and `.catch()` promise methods.
  - **Backward Compatible**: Optional callback parameters still supported for existing code.
  - Event emitter functionality maintained (emits 'message', 'error', and event type events).
- **More Segment Types**: Support expanded to 81 HL7 v2.x segments across all major categories.

### Changed
- Build system now includes TypeScript compilation (`build:cjs`, `build:esm`, `prepare` scripts).
- Package structure reorganized with clear separation between source (`src/`) and build output (`dist/`).

### Fixed
- Fixed spelling errors: "Unkown" → "Unknown" in error messages.

### Security
- Removed deprecated dynamic `require()` functionality that allowed arbitrary module loading with user-provided paths.

## [0.2.6] - 2022-01-10
- inv and sac segments support. Thanks to @evvo https://github.com/Loksly/nodehl7/pull/12


## [0.2.5] - 2021-05-04
- Increase support for SPM segment. Thanks to @kapv89 https://github.com/Loksly/nodehl7/pull/10

## [0.2.4] - 2021-05-03
- Added support for SPM segment

## [0.2.3] - 2021-05-03
- Updated dependencies

## [0.2.2] - 2020-07-22
- Updated mocha version
- Updated chai version
- Change _Buffer_ usage to prevent warning: DEP0005

## [0.2.1] - 2019-07-31
### Updated
- Updated mocha version

## [0.2.0] - 2017-11-06
### Improved
- Now hl7 segments have their own directory. This makes easy to add support to new segments.
