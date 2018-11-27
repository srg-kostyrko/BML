# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="0.5.0"></a>
# 0.5.0 (2018-11-27)


### Bug Fixes

* **greedy_bytes:** Remove unnessesary call in greedy_bytes ([902ba95](https://github.com/srg-kostyrko/BML/commit/902ba95))


### Features

* **constant:** Support arrays in constant tag ([af3ee41](https://github.com/srg-kostyrko/BML/commit/af3ee41))
* **context:** Support dot notation in context get/set ([d2a752f](https://github.com/srg-kostyrko/BML/commit/d2a752f))
* **tag:** Add aligned tag ([73a6f1e](https://github.com/srg-kostyrko/BML/commit/73a6f1e))
* **tags:** Add repeat_while and repeat_untill tags ([1614aa8](https://github.com/srg-kostyrko/BML/commit/1614aa8))


### BREAKING CHANGES

* **greedy_bytes:** greedy_bytes()`test` => greedy_bytes`test`



<a name="0.5.0"></a>
# 0.5.0 (2018-11-22)


### Bug Fixes

* Export stream class, rename toJSON method in context ([d99de40](https://github.com/srg-kostyrko/BML/commit/d99de40))


### Code Refactoring

* Remove size calculation ([d4a4603](https://github.com/srg-kostyrko/BML/commit/d4a4603))
* **floats:** Rename single to float ([c3c115b](https://github.com/srg-kostyrko/BML/commit/c3c115b))
* **tags:** Change tags interface to make composition easier ([460d75d](https://github.com/srg-kostyrko/BML/commit/460d75d))


### Features

* **context:** Add chaining to ctx tag for simple comparison operations ([21d346f](https://github.com/srg-kostyrko/BML/commit/21d346f))
* **context:** Add possibility tp prefill context on parse/pack ([d26e431](https://github.com/srg-kostyrko/BML/commit/d26e431))
* **enums:** Add possibility to define enums with array of strings if codes are sequential and 0 bas ([413afae](https://github.com/srg-kostyrko/BML/commit/413afae))
* **primitives:** Add possibility to define endianess in context ([8c1d447](https://github.com/srg-kostyrko/BML/commit/8c1d447))
* **stream:** Allow also typed arrays to be used as source of data ([f028f0c](https://github.com/srg-kostyrko/BML/commit/f028f0c))
* **strings:** Add string tags (ascii only) ([1f12b61](https://github.com/srg-kostyrko/BML/commit/1f12b61))
* **tags:** Add branch tag ([76c0557](https://github.com/srg-kostyrko/BML/commit/76c0557))
* **tags:** Add bytes alias ([7cc12a9](https://github.com/srg-kostyrko/BML/commit/7cc12a9))
* **tags:** Add computed tag ([d5e1c91](https://github.com/srg-kostyrko/BML/commit/d5e1c91))
* **tags:** Add constant tag ([ec22477](https://github.com/srg-kostyrko/BML/commit/ec22477))
* **tags:** Add greedy tags ([1835f62](https://github.com/srg-kostyrko/BML/commit/1835f62))
* **tags:** Add pass (noop) tag ([058c7b1](https://github.com/srg-kostyrko/BML/commit/058c7b1))
* **tags:** Add pointer tag ([98704f8](https://github.com/srg-kostyrko/BML/commit/98704f8))
* **tags:** Add seek tag ([13fcf5b](https://github.com/srg-kostyrko/BML/commit/13fcf5b))
* **tags:** Add tap tags ([5b7a454](https://github.com/srg-kostyrko/BML/commit/5b7a454))
* **tags:** Add when conditional tag ([a315f07](https://github.com/srg-kostyrko/BML/commit/a315f07))
* **tags:** Delay creation of class instances till root tag is called ([da75f6c](https://github.com/srg-kostyrko/BML/commit/da75f6c))
* **tags:** Rename list to array ([4601929](https://github.com/srg-kostyrko/BML/commit/4601929))
* **tags:** seek(relative) and jump(absolute) stream moves ([e05011a](https://github.com/srg-kostyrko/BML/commit/e05011a))
* Add initial set of tags ([8745523](https://github.com/srg-kostyrko/BML/commit/8745523))
* Add size estimation ([e58b17a](https://github.com/srg-kostyrko/BML/commit/e58b17a))
* Refactor base primitives to simplify interface ([353f75b](https://github.com/srg-kostyrko/BML/commit/353f75b))


### BREAKING CHANGES

* size method removed
* **floats:** single tag renamed to float
* **tags:** tags with params now should be called like ```array(byte, 1)`name` ``` instead of
```array`name`(byte, 1)```
* **tags:** list tag renamed to array
* Name is not longer required for tags
