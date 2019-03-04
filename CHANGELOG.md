# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="0.8.2"></a>
## [0.8.2](https://github.com/srg-kostyrko/BML/compare/v0.8.1...v0.8.2) (2019-03-04)



<a name="0.8.1"></a>

## [0.8.1](https://github.com/srg-kostyrko/BML/compare/v0.8.0...v0.8.1) (2019-02-26)

### Bug Fixes

- **typings:** Fix typings ([cc549ff](https://github.com/srg-kostyrko/BML/commit/cc549ff))

<a name="0.8.0"></a>

# [0.8.0](https://github.com/srg-kostyrko/BML/compare/v0.7.0...v0.8.0) (2019-01-15)

### Bug Fixes

- **stream:** Fix using Buffer in node with some byteOffset ([abe5758](https://github.com/srg-kostyrko/BML/commit/abe5758))
- **tap:** Remove context to string convertion in tap tag ([4adcd8f](https://github.com/srg-kostyrko/BML/commit/4adcd8f))

### Code Refactoring

- Typescript rewrite ([550242e](https://github.com/srg-kostyrko/BML/commit/550242e))
- **tags:** Rename jump -> seek, seek -> skip ([0e675b8](https://github.com/srg-kostyrko/BML/commit/0e675b8))
- Extract constants ([e68b61d](https://github.com/srg-kostyrko/BML/commit/e68b61d))

### BREAKING CHANGES

- - parse/pack tag methods moved to separate functions
- **tags:** Tags renamed jump -> seek, seek -> skip
- BMLStream.LE -> ENDIAN.LE

<a name="0.7.0"></a>

# [0.7.0](https://github.com/srg-kostyrko/BML/compare/v0.6.0...v0.7.0) (2018-12-02)

### Features

- **context:** Allow Context instance to passed on parsing/packing start ([cdace1d](https://github.com/srg-kostyrko/BML/commit/cdace1d))
- **tags:** Add bit_mask tag ([7d985b7](https://github.com/srg-kostyrko/BML/commit/7d985b7))
- **tags:** Add endian tag ([b13d087](https://github.com/srg-kostyrko/BML/commit/b13d087))
- **tags:** Add flag tag ([a4e690c](https://github.com/srg-kostyrko/BML/commit/a4e690c))
- **tags:** Add peek tag ([b0f7e15](https://github.com/srg-kostyrko/BML/commit/b0f7e15))

<a name="0.6.0"></a>

# [0.6.0](https://github.com/srg-kostyrko/BML/compare/v0.5.0...v0.6.0) (2018-11-27)

### Bug Fixes

- **greedy_bytes:** Remove unnessesary call in greedy_bytes ([902ba95](https://github.com/srg-kostyrko/BML/commit/902ba95))

### Features

- **constant:** Support arrays in constant tag ([af3ee41](https://github.com/srg-kostyrko/BML/commit/af3ee41))
- **context:** Support dot notation in context get/set ([d2a752f](https://github.com/srg-kostyrko/BML/commit/d2a752f))
- **tag:** Add aligned tag ([73a6f1e](https://github.com/srg-kostyrko/BML/commit/73a6f1e))
- **tags:** Add repeat_while and repeat_untill tags ([1614aa8](https://github.com/srg-kostyrko/BML/commit/1614aa8))

### BREAKING CHANGES

- **greedy_bytes:** greedy_bytes()`test` => greedy_bytes`test`

<a name="0.5.0"></a>

# 0.5.0 (2018-11-22)

Initial release.
