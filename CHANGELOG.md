# Changelog
All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- **TypeScript Support**: Full TypeScript migration with type definitions
  - Created `src/` directory for TypeScript source code
  - Created `dist/` directory for compiled JavaScript output
  - Added TypeScript interfaces for all core types (Delimiters, HL7ParserOptions, Equivalence, SegmentInfo, SegmentsFields)
  - Generated `.d.ts` declaration files for TypeScript consumers
  - Converted prototypal classes to ES6 classes

- **Dual Module Format Support**: Package now supports both CommonJS and ES Modules
  - CommonJS build in `dist/hl7.js` (AMD-compatible via module.exports)
  - ES Module build in `dist/esm/hl7.js`
  - Properly configured `package.json` with `main`, `module`, `types`, and `exports` fields

- **Promise-Based API**: Both `parse()` and `parseFile()` methods now return Promises
  - Full async/await support
  - Support for `.then()` and `.catch()` promise methods
  - **Backward Compatible**: Optional callback parameters still supported for existing code
  - Event emitter functionality maintained (emits 'message', 'error', and event type events)
  - Added comprehensive promise-based test suite (8 new tests in `testHl7Promises.js`)

### Changed
- Build system now includes TypeScript compilation (`build:cjs`, `build:esm`, `prepare` scripts)
- Package structure reorganized with clear separation between source (`src/`) and build output (`dist/`)

### Fixed
- Fixed spelling errors: "Unkown" → "Unknown" in error messages

### Security
- Removed deprecated dynamic `require()` functionality that allowed arbitrary module loading with user-provided paths

### Breaking Changes
- None! All changes are backward compatible with existing callback-based code

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
