# Changelog

## [`0.7.11`](https://github.com/larsgw/citation.js/compare/v0.7.10...v0.7.11) - 2024-04-17

* Pin component versions to [`0.7.11`](https://github.com/citation-js/citation-js/blob/master/CHANGELOG.md#0711-2024-04-17):

> ### Bug Fixes
> 
> * **plugin-ris:** fall back to default type ([a3d0391](https://github.com/citation-js/citation-js/commit/a3d0391573b152d9df040de9eb2d0b271f39a48e)), closes [#225](https://github.com/citation-js/citation-js/issues/225)
> 
> 
> ### Features
> 
> * **core:** normalize non-lowercase type values ([1ab0d2f](https://github.com/citation-js/citation-js/commit/1ab0d2fc4aedc627892eba4de5d307aa9cb6776f)), closes [#225](https://github.com/citation-js/citation-js/issues/225)
> * **plugin-csl:** add option to hyperlink URLs and DOIs ([4c15804](https://github.com/citation-js/citation-js/commit/4c158045628a0028dce972005d647f050f5a43c5))

## [`0.7.10`](https://github.com/larsgw/citation.js/compare/v0.7.9...v0.7.10) - 2024-03-27

* Pin component versions to [`0.7.10`](https://github.com/citation-js/citation-js/blob/master/CHANGELOG.md#0710-2024-03-27):

> ### Bug Fixes
> 
> * **plugin-ris:** handle output of literal dates ([6f6b85a](https://github.com/citation-js/citation-js/commit/6f6b85ace62eb075f101616f249228a0b42741a2))
> 
> 
> ### Features
> 
> * **plugin-wikidata:** update type mappings ([e9493d1](https://github.com/citation-js/citation-js/commit/e9493d1c614b328017766162e49d3068cdee3767))

## [`0.7.9`](https://github.com/larsgw/citation.js/compare/v0.7.8...v0.7.9) - 2024-03-05

* Pin component versions to [`0.7.9`](https://github.com/citation-js/citation-js/blob/master/CHANGELOG.md#079-2024-03-05):

> ### Bug Fixes
> 
> * **plugin-bibtex:** allow list delimiters in text in environments ([da0c64b](https://github.com/citation-js/citation-js/commit/da0c64b5b721f0e70e76cae17a1231652fb7b8c5))
> 
> 
> ### Features
> 
> * **core:** normalize ORCIDs on authors ([e91b580](https://github.com/citation-js/citation-js/commit/e91b5808643a9f2d578ea0b376a5386f68b152c5))
> * **plugin-bibtex:** implement data annotations ([68a8ec6](https://github.com/citation-js/citation-js/commit/68a8ec699c68b2b1dfc6ce96a8e5a9efeb0dd801))
> * **plugin-bibtex:** map ORCIDs to data annotations ([5c3951a](https://github.com/citation-js/citation-js/commit/5c3951ab315c7ee83bae8e65e22d4c8f3fb45d5e))

## [`0.7.8`](https://github.com/larsgw/citation.js/compare/v0.7.7...v0.7.8) - 2024-01-22

* Pin component versions to [`0.7.8`](https://github.com/citation-js/citation-js/blob/master/CHANGELOG.md#078-2024-01-22):

> ### Bug Fixes
> 
> * **plugin-bibtex:** do not case-protect commands in output ([50333d1](https://github.com/citation-js/citation-js/commit/50333d1a4269de63a7bb052f717e7892ec6ae5f5))
> * **plugin-bibtex:** fix math-mode unicode escapes ([f05e45c](https://github.com/citation-js/citation-js/commit/f05e45c138c95b4bd734de5aead55175d2e58774)), closes [#192](https://github.com/citation-js/citation-js/issues/192)
> * **plugin-bibtex:** remove lone diacritics ([49e9100](https://github.com/citation-js/citation-js/commit/49e91005fab044fd33d123c3da3b72bc8dc1103a))
> * **plugin-wikidata:** handle no/unkown value claims ([673e35c](https://github.com/citation-js/citation-js/commit/673e35cf2f9604d74eb08c2f6652216eb39eb975)), closes [#217](https://github.com/citation-js/citation-js/issues/217)
> 
> 
> ### Features
> 
> * **plugin-bibtex:** add config to keep all unicode ([cd018f9](https://github.com/citation-js/citation-js/commit/cd018f97e4eede037b2371995e7f3fa25e747ae4)), closes [#177](https://github.com/citation-js/citation-js/issues/177)
> * **plugin-doi:** parse DOIs with square, angle brackets ([5434d5a](https://github.com/citation-js/citation-js/commit/5434d5a85171fdeff01cdfdced9d12367b674cbd)), closes [#182](https://github.com/citation-js/citation-js/issues/182)

## [0.7.7](https://github.com/citation-js/citation-js/compare/v0.7.6...v0.7.7) - 2024-01-20

* Pin component versions to [`0.7.7`](https://github.com/citation-js/citation-js/blob/master/CHANGELOG.md#077-2024-01-20):

> ### Features
> 
> * **plugin-wikidata:** meaningful errors for 404s ([280274a](https://github.com/citation-js/citation-js/commit/280274a4a9bd9c16eb86780c7e8325d3e83c33a2)), closes [#221](https://github.com/citation-js/citation-js/issues/221)

## [`0.7.6`](https://github.com/larsgw/citation.js/compare/v0.7.5...v0.7.6) - 2024-01-17

* Pin component versions to [`0.7.6`](https://github.com/citation-js/citation-js/blob/master/CHANGELOG.md#076-2024-01-17):

> ### Bug Fixes
> 
> * **plugin-doi:** map non-standard dissertation type ([5f75243](https://github.com/citation-js/citation-js/commit/5f75243cd4ef0f9d67fd28f7dbd31271ef579821)), closes [#220](https://github.com/citation-js/citation-js/issues/220)

## [`0.7.5`](https://github.com/larsgw/citation.js/compare/v0.7.4...v0.7.5) - 2024-01-06

* Pin component versions to [`0.7.5`](https://github.com/citation-js/citation-js/blob/master/CHANGELOG.md#075-2023-12-31):

> ### Features
> 
> * **plugin-bibtex:** add mappings for plainnat fields ([208bd96](https://github.com/citation-js/citation-js/commit/208bd9670572c83ee890c4b2e8d047fc9f02aefc)), closes [#204](https://github.com/citation-js/citation-js/issues/204)

## [`0.7.4`](https://github.com/larsgw/citation.js/compare/v0.7.3...v0.7.4) - 2023-11-01

* Pin component versions to [`0.7.4`](https://github.com/citation-js/citation-js/blob/master/CHANGELOG.md#074-2023-11-01):

> ### Bug Fixes
> 
> * **plugin-ris:** fix output of certain date fields ([796dce3](https://github.com/citation-js/citation-js/commit/796dce35c5cb7a90936d4ae9cefee1f87c9133be))
> * **plugin-ris:** parse year numbers on certain items ([d300c33](https://github.com/citation-js/citation-js/commit/d300c3391dd431e7d64c37a1d29074e255c07a62))

## [`0.7.3`](https://github.com/larsgw/citation.js/compare/v0.7.2...v0.7.3) - 2023-11-01

* Pin component versions to [`0.7.3`](https://github.com/citation-js/citation-js/blob/master/CHANGELOG.md#073-2023-11-01):

> ### Bug Fixes
> 
> * **plugin-ris:** always set PY in RIS output ([2979ae2](https://github.com/citation-js/citation-js/commit/2979ae250f42845c2d930623ab5b28b19ee16732)), closes [#213](https://github.com/citation-js/citation-js/issues/213)

## [`0.7.2`](https://github.com/larsgw/citation.js/compare/v0.7.1...v0.7.2) - 2023-11-01

* Pin component versions to [`0.7.1`](https://github.com/citation-js/citation-js/blob/master/CHANGELOG.md#072-2023-10-14):

> ### Bug Fixes
>
> * **plugin-bibtex:** do not map "howpublished" url to publisher ([d4e3296](https://github.com/citation-js/citation-js/commit/d4e32967cb14dc873ba66ac06ccd77d533d6a726))

## [`0.7.1`](https://github.com/larsgw/citation.js/compare/v0.7.0...v0.7.1) - 2023-09-23

* Pin component versions to [`0.7.1`](https://github.com/citation-js/citation-js/blob/master/CHANGELOG.md#071-2023-09-23):

> ### Bug Fixes
> 
> * update peer dependency statements ([95ea6bb](https://github.com/citation-js/citation-js/commit/95ea6bba5dc4159a2de7e0101654628291efa1e3))

## [`0.7.0`](https://github.com/larsgw/citation.js/compare/v0.6.9...v0.7.0) - 2023-09-23

* Pin component versions to [`0.7.0`](https://github.com/citation-js/citation-js/blob/master/CHANGELOG.md#070-2023-09-23):

> ### Bug Fixes
> 
> * **plugin-bibjson:** expand recognition of bibjson ([c80b9b9](https://github.com/citation-js/citation-js/commit/c80b9b902e8570d7aa94829bb95f7f7d4d859dc9))
> * **plugin-bibjson:** make parsing more resilient ([4f615f4](https://github.com/citation-js/citation-js/commit/4f615f451189a2093c6c7e1c50e57242709ed5eb))
> * **plugin-csl:** fix citation data object in `entry` ([6527db6](https://github.com/citation-js/citation-js/commit/6527db61290927d264533ceb5b34ad7291d98562))
> 
> ### BREAKING CHANGES
> 
> * Use Node.js 16 or above
> * **core:** Do not automatically fetch URLs, unless configured to do so. To continue
>   to automatically fetch and evaluate the response of URLs, install and
>   load the new URL plugin like so:
> 
>       require('@citation-js/plugin-url')
> 
>   This is a breaking change. This change does not apply to specific URLs,
>   like the DOI, ISBN, Pubmed, and Wikidata plugins. The @else/url input
>   type can still be used to build input types off of.

## [`0.6.9`](https://github.com/larsgw/citation.js/compare/v0.6.8...v0.6.9) - 2023-09-20

* Pin component versions to [`0.6.9`](https://github.com/citation-js/citation-js/blob/master/CHANGELOG.md#069-2023-09-20):

> ### Bug Fixes
> 
> * **plugin-wikidata:** do not use 'subject named as' for authors ([b6efe22](https://github.com/citation-js/citation-js/commit/b6efe229da65cc22c4ae2b98442485b42496c72b))
> 
> 
> ### Features
> 
> * **plugin-wikidata:** use Q5 to recognize literal names ([541d54c](https://github.com/citation-js/citation-js/commit/541d54cbc07dbb58d872594fc7c3890337000fc2)), closes [#199](https://github.com/citation-js/citation-js/issues/199)

## [`0.6.8`](https://github.com/larsgw/citation.js/compare/v0.6.7...v0.6.8) - 2023-05-10

* Pin component versions to [`0.6.8`](https://github.com/citation-js/citation-js/blob/master/CHANGELOG.md#068-2023-05-10):

> ### Bug Fixes
> 
> * **plugin-bibtex:** map addendum field to note ([e6d19c5](https://github.com/citation-js/citation-js/commit/e6d19c59cb62179449ab451e18b80cec41b0ebaf)), closes [#198](https://github.com/citation-js/citation-js/issues/198)
> * **plugin-bibtex:** map langid field to language ([ff00ea2](https://github.com/citation-js/citation-js/commit/ff00ea2f6896c4b5a91bd7e56a973a3c9fafda4d)), closes [#197](https://github.com/citation-js/citation-js/issues/197)

## [`0.6.7`](https://github.com/larsgw/citation.js/compare/v0.6.6...v0.6.7) - 2023-02-14

* Pin component versions to [`0.6.7`](https://github.com/citation-js/citation-js/blob/master/CHANGELOG.md#067-2023-02-14):

> ### Bug Fixes
> 
> * **plugin-csl:** fix citationsPre, citationsPost ([bfb9db8](https://github.com/citation-js/citation-js/commit/bfb9db8c435de01072cf1a93193320e840f640e4)), closes [#141](https://github.com/citation-js/citation-js/issues/141) [#190](https://github.com/citation-js/citation-js/issues/190)

## [`0.6.6`](https://github.com/larsgw/citation.js/compare/v0.6.5...v0.6.6) - 2023-01-31

* Pin component versions to [`0.6.6`](https://github.com/citation-js/citation-js/blob/master/CHANGELOG.md#066-2023-01-31):

> ### Bug Fixes
> 
> * **plugin-bibtex:** support mixed case "and" in lists ([8e262db](https://github.com/citation-js/citation-js/commit/8e262db49eb190d80bf9f9de4afbd82b23da2bba)), closes [#188](https://github.com/citation-js/citation-js/issues/188)
> 
> 
> ### Features
> 
> * **plugin-doi:** support URLs without scheme ([e84f7d8](https://github.com/citation-js/citation-js/commit/e84f7d88f93473d12589125162c18e23655d69c4))

## [`0.6.5`](https://github.com/larsgw/citation.js/compare/v0.6.4...v0.6.5) - 2022-12-31

* Pin component versions to [`0.6.5`](https://github.com/citation-js/citation-js/blob/master/CHANGELOG.md#065-2022-12-31):

> ### Bug Fixes
> 
> * **plugin-ris:** update priority of fields ([636b8e2](https://github.com/citation-js/citation-js/commit/636b8e20ef8a69b731f7d2a963d0d1098c82a4a3)), closes [#185](https://github.com/citation-js/citation-js/issues/185)

## [`0.6.4`](https://github.com/larsgw/citation.js/compare/v0.6.3...v0.6.4) - 2022-07-19

* Pin component versions to [`0.6.4`](https://github.com/citation-js/citation-js/blob/master/CHANGELOG.md#064-2022-07-19):

> ### Bug Fixes
> 
> * **plugin-csl:** fix typo ([dc92fb5](https://github.com/citation-js/citation-js/commit/dc92fb5177fbb560730874f7fe3ddf080e00b815))
> * **plugin-csl:** handle unknown cs:style default-locale ([974ea05](https://github.com/citation-js/citation-js/commit/974ea05bd65f7f0753e83d0544d47a818ed3e935)), closes [#166](https://github.com/citation-js/citation-js/issues/166)
> * **plugin-wikidata:** add missing mappings ([abdc0f3](https://github.com/citation-js/citation-js/commit/abdc0f380f3e3fad1462976e9a2ccea1313e51cd))
> * **plugin-wikidata:** fix mappings ([3f33e5b](https://github.com/citation-js/citation-js/commit/3f33e5b1b56a1037737a8f87e27ae9dca28bee08))
> 
> 
> ### Features
> 
> * **plugin-wikidata:** add software fields ([beb5dd9](https://github.com/citation-js/citation-js/commit/beb5dd98366ecc1e2ecd3553fdf73dc841f87fca))

## [`0.6.3`](https://github.com/larsgw/citation.js/compare/v0.6.2...v0.6.3) - 2022-06-23

* Pin component versions to [`0.6.3`](https://github.com/citation-js/citation-js/blob/master/CHANGELOG.md#063-2022-06-23):

> ### Bug Fixes
> 
> * **plugin-csl:** respect cs:style attribute default-locale ([8189854](https://github.com/citation-js/citation-js/commit/81898545e2d172b167aabb5aaa5d244794aebcc6)), closes [#166](https://github.com/citation-js/citation-js/issues/166)

## [`0.6.2`](https://github.com/larsgw/citation.js/compare/v0.6.1...v0.6.2) - 2022-06-02

* Pin component versions to [`0.6.2`](https://github.com/citation-js/citation-js/blob/master/CHANGELOG.md#062-2022-06-02):

> ### Bug Fixes
> 
> * **plugin-ris:** fix type constraints of mappings ([9be8f3b](https://github.com/citation-js/citation-js/commit/9be8f3bc677079d87f340e60a686ba23d245b294))

## [`0.6.1`](https://github.com/larsgw/citation.js/compare/v0.6.0...v0.6.1) - 2022-06-02

* Pin component versions to [`0.6.1`](https://github.com/citation-js/citation-js/blob/master/CHANGELOG.md#061-2022-06-02):

> ### Bug Fixes
>
> * **plugin-bibtex:** do not output empty s2id field ([ca58949](https://github.com/citation-js/citation-js/commit/ca589491752b6467f9de3a89146929a6d24235ca))
>
>
> ### Features
>
> * **plugin-wikidata:** include additional version information ([7b870b8](https://github.com/citation-js/citation-js/commit/7b870b8aefd91492863550faa539b9aaa4608d99))

## [`0.6.0`](https://github.com/larsgw/citation.js/compare/v0.5.7...v0.6.0) - 2022-05-30

* Pin component versions to [`0.6.0`](https://github.com/citation-js/citation-js/blob/master/CHANGELOG.md#060-2022-05-30):

> * chore!: drop Node 10, 12 support ([37ea76b](https://github.com/citation-js/citation-js/commit/37ea76b80bdba98e92232e49a36c9c850966dc74))
>
>
> ### Bug Fixes
>
> * **core:** avoid flatMap for Node 10 support ([8a65094](https://github.com/citation-js/citation-js/commit/8a650942bf90218124c84e8c538403470b4b1ef9))
> * **plugin-bibjson:** set correct generic type ([ec7de7f](https://github.com/citation-js/citation-js/commit/ec7de7f0c03057692eb84b25e9b6f45bed3c5bde))
> * **plugin-bibtex:** consider entries with no type ([a55fe60](https://github.com/citation-js/citation-js/commit/a55fe60b5a66046baa51d33f68c4ff3420d31519))
> * **plugin-bibtex:** fix biblatex handling of mastersthesis ([6196adf](https://github.com/citation-js/citation-js/commit/6196adfb0e2d26f11721580e338b54b87e5d4882))
> * **plugin-bibtex:** fix handling of bookpagination ([7f41e30](https://github.com/citation-js/citation-js/commit/7f41e3080ba6b9b57158fd6a8ce3b5110e042a1e))
> * **plugin-bibtex:** fix typo in crossref code ([3c377e4](https://github.com/citation-js/citation-js/commit/3c377e425bbf6a302d1957dfe31c0ee67167589e))
> * **plugin-bibtex:** map biblatex eid to number ([0eb15af](https://github.com/citation-js/citation-js/commit/0eb15af8db4ed4f1d894cffc3840cc2087479c9c)), closes [#140](https://github.com/citation-js/citation-js/issues/140)
> * **plugin-bibtex:** set default CSL type correctly ([94a402e](https://github.com/citation-js/citation-js/commit/94a402e7aadf0f9462fcd966eb0304545ef6cce7))
> * **plugin-bibtex:** set default CSL type correctly ([bcd11b3](https://github.com/citation-js/citation-js/commit/bcd11b3f419e56106d79a7e013099188673a9287))
> * **plugin-bibtex:** use CSL 1.0.2 'custom' field ([986f80b](https://github.com/citation-js/citation-js/commit/986f80b4fbf451688775f4fcc8ddc58c88ec2ef2))
> * **plugin-ris:** fix ISSN regex ([76402c1](https://github.com/citation-js/citation-js/commit/76402c1db0ae16ec27b1e084a931aea5088ccfa5))
> * **plugin-ris:** fix name parsing ([4382f31](https://github.com/citation-js/citation-js/commit/4382f31db4fc4586f71b2459552aa2b218f921f2))
> * **plugin-wikidata:** fall back to original-author ([1af1249](https://github.com/citation-js/citation-js/commit/1af12496e73934ace090c278235b8c1d473e2203)), closes [#106](https://github.com/citation-js/citation-js/issues/106)
>
>
> ### Features
>
> * **core:** output CSL 1.0.2 by default ([5acec19](https://github.com/citation-js/citation-js/commit/5acec192b873728df2e63aca6694e98ed2dcb942))
> * **core:** remove custom _ fields when cleaning ([c974ebc](https://github.com/citation-js/citation-js/commit/c974ebc2309aef9e6d37c474f3be544708f5bba6))
> * **core:** update internal format to CSL 1.0.2 ([7249425](https://github.com/citation-js/citation-js/commit/72494257001d424fb345f26e44e973c0d65aea52))
> * **plugin-bibjson:** update mapping to CSL 1.0.2 ([d04aacf](https://github.com/citation-js/citation-js/commit/d04aacfd735067653a8bad2ad3620bcbe069fd0c))
> * **plugin-bibtex:** add Semantic Scholar s2id mapping ([#159](https://github.com/citation-js/citation-js/issues/159)) ([f116cde](https://github.com/citation-js/citation-js/commit/f116cdef14f73a8d2714502c613d6b7816d61076))
> * **plugin-bibtex:** implement crossref properly ([f9cdf5b](https://github.com/citation-js/citation-js/commit/f9cdf5b7cbb4b09d23c757f0b3e95a6899e18d89)), closes [#115](https://github.com/citation-js/citation-js/issues/115)
> * **plugin-bibtex:** update mapping to CSL 1.0.2 ([6c68aff](https://github.com/citation-js/citation-js/commit/6c68aff80d3e04e132c722ef508d0a45fad40a29))
> * **plugin-csl:** adapt to CSL 1.0.2 input ([4090164](https://github.com/citation-js/citation-js/commit/40901640a12961b32e4cf373b7fa70361be5e064))
> * **plugin-csl:** update styles and locales ([1ede64b](https://github.com/citation-js/citation-js/commit/1ede64bce8cbab5697b10cdd03a1494d38ff253c))
> * **plugin-ris:** update mapping to CSL 1.0.2 ([b59bd12](https://github.com/citation-js/citation-js/commit/b59bd12eacf068d5b6c42325ff1c643e79fddac7))
> * **plugin-wikidata:** import issue/vol/etc. from qualifiers ([dc7e270](https://github.com/citation-js/citation-js/commit/dc7e270b8a4a1deeb8716ee4a66270dde3e1a170))
> * **plugin-wikidata:** update mapping to CSL 1.0.2 ([09f2e2d](https://github.com/citation-js/citation-js/commit/09f2e2ddf47bc4bddf16022cdef37b0c40d92ee5)), closes [#142](https://github.com/citation-js/citation-js/issues/142)
>
>
> ### BREAKING CHANGES
>
> * use Node.js 14 or above
> * **core:** to get CSL 1.0.1 output, use the 'version' option
> * **plugin-csl:** output of updated styles and locales may differ
> * **core:** use the 'custom' object instead of fields starting with
> an underscore.

### BREAKING CHANGES

* use Node.js 14 or above

## [`0.5.7`](https://github.com/larsgw/citation.js/compare/v0.5.6...v0.5.7) - 2022-04-17

* Pin component versions to [`0.5.7`](https://github.com/citation-js/citation-js/blob/master/CHANGELOG.md#057-2022-04-17):

> ### Bug Fixes
>
> * **core:** do not use process variable in browser ([d779267](https://github.com/citation-js/citation-js/commit/d779267d8579e0e50390834b447c6b83cd446645)), closes [#156](https://github.com/citation-js/citation-js/issues/156)

## [`0.5.6`](https://github.com/larsgw/citation.js/compare/v0.5.5...v0.5.6) - 2022-02-12

* Pin component versions to [`0.5.6`](https://github.com/citation-js/citation-js/blob/master/CHANGELOG.md#056-2022-02-12):

> ### Bug Fixes
>
> * **plugin-bibtex:** fix handling of literal dates ([701526d](https://github.com/citation-js/citation-js/commit/701526d6c46a5c5dc9783a686ac04c09d9448b8b))

## [`0.5.5`](https://github.com/larsgw/citation.js/compare/v0.5.4...v0.5.5) - 2021-12-31

* Pin component versions to [`0.5.5`](https://github.com/citation-js/citation-js/blob/master/CHANGELOG.md#055-2021-12-31):

> ### Bug Fixes
>
> * **plugin-bibtex:** ignore empty fields ([6badc93](https://github.com/citation-js/citation-js/commit/6badc9361df2bc35a6b804821e5196b0783e5147))
> * **plugin-csl:** error for unknown output format ([b9a2b7d](https://github.com/citation-js/citation-js/commit/b9a2b7dce4204d45e4c742596a45b21452db739e))
> * **plugin-ris:** add non-standard issue mapping ([fb6ae32](https://github.com/citation-js/citation-js/commit/fb6ae3257bee7e3a721d2631592195f706fce39f))
> * **plugin-ris:** map publisher-place ([89cb3f2](https://github.com/citation-js/citation-js/commit/89cb3f25c4e12e10d65adf101dba2af9beb0e92d))

## [`0.5.4`](https://github.com/larsgw/citation.js/compare/v0.5.3...v0.5.4) - 2021-12-11

* Pin component versions to [`0.5.4`](https://github.com/citation-js/citation-js/blob/master/CHANGELOG.md#054-2021-12-11):

> ### Bug Fixes
>
> * **core:** do not convert string id to numbers ([6490200](https://github.com/citation-js/citation-js/commit/6490200d256c047cabbfaff899c158ad5a017427))
> * **plugin-bibtex:** fix numeric id in bibtex label ([6291843](https://github.com/citation-js/citation-js/commit/62918432f1ad9cf9a0f7a1a243689506c3511e4b))
> * **plugin-bibtex:** replace use of moo.keywords ([efb9586](https://github.com/citation-js/citation-js/commit/efb958674bba4f39abc848053b88e1c7d16ce1ac))

## [`0.5.3`](https://github.com/larsgw/citation.js/compare/v0.5.1...v0.5.3) - 2021-11-24

* Pin component versions to [`0.5.3`](https://github.com/citation-js/citation-js/blob/master/CHANGELOG.md#053-2021-11-24):

> * chore!: drop Node 8, add Node 14 ([a5ceb07](https://github.com/citation-js/citation-js/commit/a5ceb07496900e66de30e405523ec315cfbc0a89))
>
>
> ### Bug Fixes
>
> * **plugin-csl:** handle missing entries ([93400d6](https://github.com/citation-js/citation-js/commit/93400d62d6fa38ce1f6a18f1728b07091f5643d1))
> * remove named imports of JSON files ([9b8315b](https://github.com/citation-js/citation-js/commit/9b8315bd8352dc9a4bf1866ac71bb65a9df994d0))
> * **plugin-doi:** handle crossref preprints ([0927f43](https://github.com/citation-js/citation-js/commit/0927f43deb07e512d828e5415a7d649d2d9b966a))
> * **plugin-csl:** check for non-normalised language codes ([3928f70](https://github.com/citation-js/citation-js/commit/3928f70065f3a802270182d1f0251deb317d4416))
>
>
> ### Features
>
> * **core:** throw more descriptive errors in Translator ([c35b40f](https://github.com/citation-js/citation-js/commit/c35b40f3badf81ed9b475979673be284b1407ab4))
> * **plugin-csl:** allow citation context options ([c5c3e8c](https://github.com/citation-js/citation-js/commit/c5c3e8c6de1a562ec7128e74cc6560d7c5ed2347))
> * **plugin-csl:** allow cite-items ([48fb79c](https://github.com/citation-js/citation-js/commit/48fb79c9b81e93ec6e44186e064eaca0fac57f1c))
> * **plugin-bibtex:** allow non-standard day field ([96f8d43](https://github.com/citation-js/citation-js/commit/96f8d43a261efb1ceeffe0f4d8e346e958d867f7)), closes [#134](https://github.com/citation-js/citation-js/issues/134)
>
>
> ### BREAKING CHANGES
>
> * drops Node 8 support

## [`0.5.2`](https://github.com/larsgw/citation.js/compare/v0.5.1...v0.5.2) - 2021-11-24

* Pin component versions to [`0.5.2`](https://github.com/citation-js/citation-js/blob/master/CHANGELOG.md#052-2021-09-21):

> ### Bug Fixes
>
> * **plugin-csl:** check for non-normalised language codes ([3928f70](https://github.com/citation-js/citation-js/commit/3928f70065f3a802270182d1f0251deb317d4416))
>
>
> ### Features
>
> * **plugin-bibtex:** allow non-standard day field ([96f8d43](https://github.com/citation-js/citation-js/commit/96f8d43a261efb1ceeffe0f4d8e346e958d867f7)), closes [#134](https://github.com/citation-js/citation-js/issues/134)

## [`0.5.1`](https://github.com/larsgw/citation.js/compare/v0.5.0...v0.5.1) - 2021-05-11

* Pin component versions to [`0.5.1`](https://github.com/citation-js/citation-js/blob/main/CHANGELOG.md#051-2021-05-11)

## [`0.5.0`](https://github.com/larsgw/citation.js/compare/v0.5.0-alpha.10...v0.5.0) - 2021-04-01

* Pin component versions to [`0.5.0`](https://github.com/citation-js/citation-js/blob/main/CHANGELOG.md#050-2021-04-01):

> ### Bug Fixes
>
> * **plugin-bibtex:** remove CSL 1.0.2 types ([365fe1c](https://github.com/citation-js/citation-js/commit/365fe1c0a950de5f333ed8fc7e70ba17c59b7c21))
> * **plugin-bibtex:** remove lookbehind regex ([fe20199](https://github.com/citation-js/citation-js/commit/fe2019901f60bbfa89c2676c4eebae24e8dbfb79))
>
>
> ### Features
>
> * **plugin-bibtex:** allow URL in howpublished ([3884e08](https://github.com/citation-js/citation-js/commit/3884e0807c9509b585b8e0ce82ec746915886c63))
> * **plugin-ris:** add formatting 'spec' option ([ec0bbad](https://github.com/citation-js/citation-js/commit/ec0bbada4019be7f92e33c82d1870b7a4052f089))

## [`0.5.0-alpha.10`](https://github.com/larsgw/citation.js/compare/v0.5.0-alpha.9...v0.5.0-alpha.10) - 2021-01-28

* Pin component versions to [`0.5.0-alpha.10`](https://github.com/citation-js/citation-js/blob/main/CHANGELOG.md#050-alpha10-2021-01-28):

> ### Bug Fixes
>
> * **core:** clean `type` as regular string ([6982ae6](https://github.com/citation-js/citation-js/commit/6982ae627b8ceb0f1fb3ac59ff5351b27912769f))
> * **core:** do not snapshot initial Cite() state ([19afac7](https://github.com/citation-js/citation-js/commit/19afac7ff22f5a5ea23852374a33aaf879317a1d))
> * **core:** reset Grammar log on each run ([68d8a2a](https://github.com/citation-js/citation-js/commit/68d8a2a61a4f745d0acf38ec590ba7643d3a8f61))
> * **core:** reset Grammar state on each run ([834f679](https://github.com/citation-js/citation-js/commit/834f679dfbd0ddd2dcb7d2e0e0488fc4c9aba3da))
> * **plugin-bibtex:** apply upstream changes ([f5a1514](https://github.com/citation-js/citation-js/commit/f5a15144a78af2c8538eef9465f50a904d55ee17))
> * **plugin-bibtex:** apply various fixes ([861cb36](https://github.com/citation-js/citation-js/commit/861cb36504cb6f20ae859d220d437dc58c53a086))
> * **plugin-bibtex:** apply various fixes ([86e55df](https://github.com/citation-js/citation-js/commit/86e55df2261170efba4ff2106569d8cd5e8fcc02))
> * **plugin-bibtex:** do not escape verbatim value ([a90f4a5](https://github.com/citation-js/citation-js/commit/a90f4a50a99a27bd61469487e003054ea5181e75))
> * **plugin-bibtex:** do not ignore month after day ([4914797](https://github.com/citation-js/citation-js/commit/4914797c3333f0fe898c538080bf3c98e0b79fcb))
> * **plugin-bibtex:** escape more unicode in output ([1647734](https://github.com/citation-js/citation-js/commit/1647734903430d483db9b47349dcecb01a70c88e))
> * **plugin-bibtex:** fix howpublished/url mapping ([b655bec](https://github.com/citation-js/citation-js/commit/b655becf004825fc12d174cc8c2625d57d020804))
> * **plugin-bibtex:** fix mapping bugs ([a644b3a](https://github.com/citation-js/citation-js/commit/a644b3af3f7dc280875f1ac7efcadaccfa9bb3b6))
> * **plugin-bibtex:** output w/ case protection ([07f99b5](https://github.com/citation-js/citation-js/commit/07f99b5ba15b672f059f0384dbc75354c40bcc66))
> * **plugin-bibtex:** remove unicode from label ([81d657d](https://github.com/citation-js/citation-js/commit/81d657d2eb73b3eb022bb58133923f8824181835))
> * **plugin-bibtex:** update BibTeX mappings ([db79896](https://github.com/citation-js/citation-js/commit/db7989659742cc5473e236cae3bde78d9ba1a1b2))
>
>
> ### Features
>
> * **core:** add mainRule param to Grammar ([e8679d5](https://github.com/citation-js/citation-js/commit/e8679d5c33edd7251de1d1779293219754b4b2da))
> * **core:** move DOI corrections to core ([03b804b](https://github.com/citation-js/citation-js/commit/03b804b5d07841cfab4234dac648bb67c0c18e45))
> * **plugin-bibtex:** add -subtitle, -titleaddon ([eef0e6c](https://github.com/citation-js/citation-js/commit/eef0e6cf5c01b00a46c4f46b206f667a713bb3b2)), closes [#116](https://github.com/citation-js/citation-js/issues/116)
> * **plugin-bibtex:** add 'strict' parser option ([64f0c38](https://github.com/citation-js/citation-js/commit/64f0c38605eb9119c9344e8e1296fc3add4d8378))
> * **plugin-bibtex:** add BibLaTex mappings ([84655a4](https://github.com/citation-js/citation-js/commit/84655a4aa14ae4f4ad9f70ff8541d6f3da1052c4))
> * **plugin-bibtex:** rename sentenceCase option ([35943d2](https://github.com/citation-js/citation-js/commit/35943d21aad0458010ccb3c33ec51b6a624a0d38))
> * **plugin-bibtex:** update BibTeX mappings ([987b75c](https://github.com/citation-js/citation-js/commit/987b75c80e6bd6d5ff35afe3a3a8100de45b88d4))
> * **plugin-bibtex:** update BibTeX parser ([9df7558](https://github.com/citation-js/citation-js/commit/9df75585579560332b7d495c695c72f6e553ae1f))
> * **plugin-csl:** add 'asEntryArray' option to bibliography ([8039967](https://github.com/citation-js/citation-js/commit/8039967e65565d8b3fd49b91deaef82a0cf1d39d))
> * **plugin-csl:** add 'entry' option to bibliography ([298819b](https://github.com/citation-js/citation-js/commit/298819bd6b37ad8e622e3d6f7a2b5c5ee6a3e52f))
>
>
> ### BREAKING CHANGES
>
> * **core:** Constructing a Cite instance no longer automatically creates a snapshot.
> You can do this manually instead.
> * **plugin-bibtex:**   - The @bibtex input type prefix has been
>     changed to @biblatex
>   - The @bibtex input type prefix is now used for
>     parsing as pure @bibtex. These types have no
>     type parser so are not automatically used.
>   - The `bibtex` output format now outputs valid
>     BibTeX, use the `biblatex` output format for
>     BibLaTeX output.
>   - The output option `generateLabel` has been
>     replaced by the config option
>     `format.useIdAsLabel`
> * **plugin-bibtex:** Although the file parsing has been tested extensively,
> the mapping has not. In addition, since the mapping has been created
> from scratch according to the BibLaTeX documentation behaviour might
> change. Please report any problems at
> https://github.com/citation-js/citation-js/issues

## [`0.5.0-alpha.9`](https://github.com/larsgw/citation.js/compare/v0.5.0-alpha.8...v0.5.0-alpha.9) - 2020-10-20

* Pin component versions to [`0.5.0-alpha.9`](https://github.com/citation-js/citation-js/blob/main/CHANGELOG.md#050-alpha9-2020-10-20)

## [`0.5.0-alpha.8`](https://github.com/larsgw/citation.js/compare/v0.5.0-alpha.7...v0.5.0-alpha.8) - 2020-10-20

* Pin component versions to [`0.5.0-alpha.8`](https://github.com/citation-js/citation-js/blob/main/CHANGELOG.md#050-alpha8-2020-10-20):

> ### Bug Fixes
>
> * **plugin-bibtex:** fix closing tag behavior ([466d5b1](https://github.com/citation-js/citation-js/commit/466d5b1d234c8e327cfabb6528f8e72b065e2469))
> * **plugin-csl:** fix disambig error ([35ec98d](https://github.com/citation-js/citation-js/commit/35ec98de69ce8b24f45a37139a989cd6754b2200))

## [`0.5.0-alpha.7`](https://github.com/larsgw/citation.js/compare/v0.5.0-alpha.6...v0.5.0-alpha.7) - 2020-08-29

* Pin component versions to [`0.5.0-alpha.7`](https://github.com/citation-js/citation-js/blob/main/CHANGELOG.md#050-alpha7-2020-08-29):

> ### Bug Fixes
>
> * **cli:** fix check for prefixed options ([4b7fe6b](https://github.com/citation-js/citation-js/commit/4b7fe6b1f6b908b3304929b1c1f05a09d137cf34))
> * **plugin-bibtex:** avoid error on non-utf-8 webpages ([c09a9e4](https://github.com/citation-js/citation-js/commit/c09a9e467e85f6a8c52eb78c36a98734e32ee14c))
> * **plugin-csl:** remove entry caching ([efa648b](https://github.com/citation-js/citation-js/commit/efa648ba570de7dabf0651442ca8ffdf52fcd5fe))

## [`0.5.0-alpha.6`](https://github.com/larsgw/citation.js/compare/v0.5.0-alpha.5...v0.5.0-alpha.6) - 2020-07-05

* Pin component versions to [`0.5.0-alpha.6`](https://github.com/citation-js/citation-js/blob/main/CHANGELOG.md#050-alpha6-2020-07-04):

> ### Bug Fixes
>
> * **plugin-bibtex:** fix combining tilde ([cc9fd8b](https://github.com/citation-js/citation-js/commit/cc9fd8bf12cb1f62b6a631d18ebc7eba0e05abfe))
> * **plugin-bibtex:** normalize strings ([447b0b4](https://github.com/citation-js/citation-js/commit/447b0b419abe0719e89bd16e189fe58f4f62cc01))
> * **plugin-bibtex:** support all 10 escaped characters ([#75](https://github.com/citation-js/citation-js/issues/75)) ([da016b4](https://github.com/citation-js/citation-js/commit/da016b41ac67793f3613e263658551817d7a2e70))
> * **plugin-ris:** format literal names ([893d144](https://github.com/citation-js/citation-js/commit/893d144d21d665a3a70b5412fdfa44a5514d722c)), closes [#87](https://github.com/citation-js/citation-js/issues/87)
>
>
> ### Features
>
> * **plugin-bibtex:** improve BibTeX mappings ([#76](https://github.com/citation-js/citation-js/issues/76)) ([214e77b](https://github.com/citation-js/citation-js/commit/214e77b6eda586e519ddc774dbf7054466472216))
> * **plugin-csl:** update apa to 7th edition ([#89](https://github.com/citation-js/citation-js/issues/89)) ([2b5f2c5](https://github.com/citation-js/citation-js/commit/2b5f2c59ddefadd1e8c6ad78efde8f331a8e5332))
>
>
> ### BREAKING CHANGES
>
> * **plugin-csl:** default APA style is now 7th edition

## [`0.5.0-alpha.5`](https://github.com/larsgw/citation.js/compare/v0.5.0-alpha.4...v0.5.0-alpha.5) - 2020-03-08

* Pin component versions to [`0.5.0-alpha.5`](https://github.com/citation-js/citation-js/blob/main/CHANGELOG.md#050-alpha5-2019-10-28):

> ### Bug Fixes
>
> * **core:** do not use User-Agent in CORS ([047847d](https://github.com/citation-js/citation-js/commit/047847d))
> * **plugin-bibtex:** ignore braces for grouping command ([#64](https://github.com/citation-js/citation-js/issues/64)) ([20763dc](https://github.com/citation-js/citation-js/commit/20763dc))
> * **plugin-ris:** allow string for keyword component ([#70](https://github.com/citation-js/citation-js/issues/70)) ([0294999](https://github.com/citation-js/citation-js/commit/0294999)), closes [#67](https://github.com/citation-js/citation-js/issues/67)
> * **plugin-ris:** normalize DOIs ([#68](https://github.com/citation-js/citation-js/issues/68)) ([eb97fa5](https://github.com/citation-js/citation-js/commit/eb97fa5))
> * **plugin-ris:** trim lines in parse function ([#71](https://github.com/citation-js/citation-js/issues/71)) ([f81b845](https://github.com/citation-js/citation-js/commit/f81b845)), closes [#66](https://github.com/citation-js/citation-js/issues/66)

## [`0.5.0-alpha.4`](https://github.com/larsgw/citation.js/compare/v0.5.0-alpha.3...v0.5.0-alpha.4) - 2019-10-15

* Pin component versions to [`0.5.0-alpha.4`](https://github.com/citation-js/citation-js/blob/main/CHANGELOG.md#050-alpha4-2019-10-15):

> ### Bug Fixes
>
> * **core:** fix normalising headers code for the browser ([d4693a7](https://github.com/citation-js/citation-js/commit/d4693a7))
> * **plugin-bibtex:** do not try to format raw dates ([b28eca8](https://github.com/citation-js/citation-js/commit/b28eca8))
> * **plugin-bibtex:** warn for umatched entry braces ([7905667](https://github.com/citation-js/citation-js/commit/7905667))

## [`0.5.0-alpha.3`](https://github.com/larsgw/citation.js/compare/v0.5.0-alpha.2...v0.5.0-alpha.3) - 2019-10-08

* Pin component versions to [`0.5.0-alpha.3`](https://github.com/citation-js/citation-js/blob/main/CHANGELOG.md#050-alpha3-2019-10-07):

> ### Bug Fixes
>
> * **plugin-bibtex:** remove nocase from diacritics ([7f7e52f](https://github.com/citation-js/citation-js/commit/7f7e52f))
> * **plugin-bibtex:** replace trimEnd() with trim() ([b59da57](https://github.com/citation-js/citation-js/commit/b59da57))
> * **plugin-ris:** fix handling of multiline values ([eba2bfe](https://github.com/citation-js/citation-js/commit/eba2bfe))
> * **plugin-ris:** handle \r\n line endings ([f0a3b29](https://github.com/citation-js/citation-js/commit/f0a3b29))
>
>
> ### Features
>
> * **bibtex:** add new BibTeX parser ([3c3588e](https://github.com/citation-js/citation-js/commit/3c3588e))
> * **core:** add Grammar class to utils ([052754f](https://github.com/citation-js/citation-js/commit/052754f))

## [`0.5.0-alpha.2`](https://github.com/larsgw/citation.js/compare/v0.5.0-alpha.0...v0.5.0-alpha.2) - 2019-09-10

* Pin component versions to [`0.5.0-alpha.2`](https://github.com/citation-js/citation-js/blob/main/CHANGELOG.md#050-alpha2-2019-09-10):

> ### Bug Fixes
>
> * **core:** fix date value null check ([f6a3ab2](https://github.com/citation-js/citation-js/commit/f6a3ab2))
> * **core:** fix cleaning 'null' date values ([c927f81](https://github.com/citation-js/citation-js/commit/c927f81)), closes [/github.com/larsgw/citation.js/issues/190#issuecomment-529917382](https://github.com//github.com/larsgw/citation.js/issues/190/issues/issuecomment-529917382)
> * **core:** fix cleaning 'null' name values ([2d59a32](https://github.com/citation-js/citation-js/commit/2d59a32))

## [`0.5.0-alpha.0`](https://github.com/larsgw/citation.js/compare/v0.4.10...v0.5.0-alpha.0) - 2019-09-07

* Pin component versions to [`v0.5.0-alpha.0`](https://github.com/citation-js/citation-js/blob/main/CHANGELOG.md#050-alpha0-2019-09-07):

> * chore!: drop Node 6 support ([f27d812](https://github.com/citation-js/citation-js/commit/f27d812)), closes [#55](https://github.com/citation-js/citation-js/issues/55)
>
>
> ### Bug Fixes
>
> * **core:** do not return empty name lists when cleaning ([d31ca8a](https://github.com/citation-js/citation-js/commit/d31ca8a))
> * **core:** fix Cite#sort handling of multi-value props ([3a7751c](https://github.com/citation-js/citation-js/commit/3a7751c))
> * **core:** fix handling of generic best guesses ([c8e8c78](https://github.com/citation-js/citation-js/commit/c8e8c78))
> * **core:** fix util.fetchId ([7850e75](https://github.com/citation-js/citation-js/commit/7850e75))
> * **core:** improve date handling when cleaning ([08da3e7](https://github.com/citation-js/citation-js/commit/08da3e7))
> * **core:** only overwrite individual headers in fetchFile ([8d47684](https://github.com/citation-js/citation-js/commit/8d47684))
> * **core:** pass around bestGuessConversions ([50fa283](https://github.com/citation-js/citation-js/commit/50fa283))
> * **core:** pass checkContentType in fetchFile ([e415f76](https://github.com/citation-js/citation-js/commit/e415f76))
> * **core:** set userAgent properly in fetchFile ([a91fd7b](https://github.com/citation-js/citation-js/commit/a91fd7b))
> * **plugin-bibtex:** fix label for incomplete author ([352ca4f](https://github.com/citation-js/citation-js/commit/352ca4f)), closes [#56](https://github.com/citation-js/citation-js/issues/56)
>
>
> ### Features
>
> * **core:** complete input option validation ([d9be626](https://github.com/citation-js/citation-js/commit/d9be626))
> * **core:** support has() & list() on plugins.config ([fe7f59f](https://github.com/citation-js/citation-js/commit/fe7f59f))
>
>
> ### BREAKING CHANGES
>
> * drops Node 6 support

## [`0.4.10`](https://github.com/larsgw/citation.js/compare/v0.4.9...v0.4.10) - 2019-08-27

* Pin component versions to [`v0.4.10`](https://github.com/citation-js/citation-js/blob/main/CHANGELOG.md#0410-2019-08-27):

> ### Bug Fixes
>
> * **plugin-csl:** use global symbol registry (dd8e839)

## [`0.4.9`](https://github.com/larsgw/citation.js/compare/v0.4.8...v0.4.9) - 2019-08-27

* Pin component versions to [`v0.4.9`](https://github.com/citation-js/citation-js/blob/main/CHANGELOG.md#049-2019-08-27):

> ### Bug Fixes
>
> * **core:** cap sync-rpc version ([2157335](https://github.com/citation-js/citation-js/commit/2157335)), closes [#54](https://github.com/citation-js/citation-js/issues/54)
> * **core:** remove Object.entries call ([c38e3b9](https://github.com/citation-js/citation-js/commit/c38e3b9))
> * **core:** remove use of object spread ([d82342a](https://github.com/citation-js/citation-js/commit/d82342a)), closes [#53](https://github.com/citation-js/citation-js/issues/53)
> * **plugin-csl:** defer error to citeproc-js ([0f76fcb](https://github.com/citation-js/citation-js/commit/0f76fcb))
> * **plugin-csl:** only proxy @bibliography/style once ([a372012](https://github.com/citation-js/citation-js/commit/a372012))
> * **plugin-csl:** pass 'this' in getWrapperProxy ([c3e670a](https://github.com/citation-js/citation-js/commit/c3e670a))
> * **plugin-csl:** return proxy in getWrapperProxy ([39e57a3](https://github.com/citation-js/citation-js/commit/39e57a3))
> * **plugin-ris:** fix legacy EP tag ([d7c6ea5](https://github.com/citation-js/citation-js/commit/d7c6ea5))
>
>
> ### Features
>
> * **core:** add match=none to propertyConstraint ([9bafb58](https://github.com/citation-js/citation-js/commit/9bafb58))
> * **core:** add Translator to utils ([0dd4963](https://github.com/citation-js/citation-js/commit/0dd4963))
> * **plugin-ris:** add RIS input support ([1c49bcb](https://github.com/citation-js/citation-js/commit/1c49bcb))

## [`0.4.8`](https://github.com/larsgw/citation.js/compare/v0.4.7...v0.4.8) - 2019-07-06

* Pin component versions to [`v0.4.8`](https://github.com/citation-js/citation-js/blob/main/CHANGELOG.md#048-2019-07-06):

> ### Bug Fixes
>
> * **core:** do not attempt to clone non-standard objects ([5309d08](https://github.com/citation-js/citation-js/commit/5309d08)), closes [#52](https://github.com/citation-js/citation-js/issues/52)
> * **plugin-wikidata:** properly collect id from fetched items ([710a276](https://github.com/citation-js/citation-js/commit/710a276))
>
>
> ### Features
>
> * **core:** use central User-Agent in fetchFile ([3fa8863](https://github.com/citation-js/citation-js/commit/3fa8863)), closes [#39](https://github.com/citation-js/citation-js/issues/39)

## [`0.4.7`](https://github.com/larsgw/citation.js/compare/v0.4.6...v0.4.7) - 2019-06-29

* Pin component versions to [`v0.4.7`](https://github.com/citation-js/citation-js/blob/main/CHANGELOG.md#047-2019-06-29):

> ### Bug Fixes
>
> * **core:** make fetchFile checkResponse optional ([a51a185](https://github.com/citation-js/citation-js/commit/a51a185))
> * **plugin-doi:** use new checkContentType option ([92df863](https://github.com/citation-js/citation-js/commit/92df863))

## [`0.4.6`](https://github.com/larsgw/citation.js/compare/v0.4.5...v0.4.6) - 2019-06-29

* Pin component versions to [`v0.4.6`](https://github.com/citation-js/citation-js/blob/main/CHANGELOG.md#046-2019-06-28):

> ### Bug Fixes
>
> * **core:** check if fetchFile response matches request ([e9f9132](https://github.com/citation-js/citation-js/commit/e9f9132)), closes [#36](https://github.com/citation-js/citation-js/issues/36)
> * **core:** fix getBody in fetchFile ([e4247da](https://github.com/citation-js/citation-js/commit/e4247da))
> * **core:** remove console.log call ([e0b1790](https://github.com/citation-js/citation-js/commit/e0b1790))
> * **plugin-wikidata:** fix typo ([8916446](https://github.com/citation-js/citation-js/commit/8916446))
>
>
> ### Features
>
> * **core:** support POST in fetchFile ([ece8a2d](https://github.com/citation-js/citation-js/commit/ece8a2d))

## [`0.4.5`](https://github.com/larsgw/citation.js/compare/v0.4.4...v0.4.5) - 2019-06-13

* Pin component versions to [`v0.4.5`](https://github.com/citation-js/citation-js/blob/main/CHANGELOG.md#045-2019-06-12):

> ### Bug Fixes
>
> * **plugin-bibtex:** fix parsing of name lists ([11d7dd7](https://github.com/citation-js/citation-js/commit/11d7dd7))
> * **plugin-bibtex:** fix safe labels for unicode names ([8167958](https://github.com/citation-js/citation-js/commit/8167958))
> * **plugin-bibtex:** safe author name ([a232fe7](https://github.com/citation-js/citation-js/commit/a232fe7))
> * **plugin-bibtex:** strip unknown commands in input ([5b3508e](https://github.com/citation-js/citation-js/commit/5b3508e))
> * **plugin-wikidata:** exclude emoji flags as country names ([73b0e84](https://github.com/citation-js/citation-js/commit/73b0e84))
> * **plugin-wikidata:** fix cache fetching ([63a4f0d](https://github.com/citation-js/citation-js/commit/63a4f0d)), closes [#41](https://github.com/citation-js/citation-js/issues/41)
> * **plugin-wikidata:** fix country name check ([90d1c07](https://github.com/citation-js/citation-js/commit/90d1c07))
>
>
> ### Features
>
> * **cli:** add --plugins option ([229c95c](https://github.com/citation-js/citation-js/commit/229c95c)), closes [#40](https://github.com/citation-js/citation-js/issues/40)
> * **cli:** plugin config & format options ([8bd2a4a](https://github.com/citation-js/citation-js/commit/8bd2a4a))
> * **cli:** support for input options ([87d8eb5](https://github.com/citation-js/citation-js/commit/87d8eb5))
> * **plugin-bibtex:** add generateLabel option ([d10631c](https://github.com/citation-js/citation-js/commit/d10631c))
>
>
> ### BREAKING CHANGES
>
> * **plugin-bibtex:** strips unkown commands entirely instead of replacing
> the braces with no-case tags

## [`0.4.4`](https://github.com/larsgw/citation.js/compare/v0.4.2...v0.4.4) - 2019-06-13

* Pin component versions to [`v0.4.4`](https://github.com/citation-js/citation-js/blob/main/CHANGELOG.md#044-2019-05-24):

> * **plugin-wikidata:** additional mappings ([01be936](https://github.com/citation-js/citation-js/commit/01be936)), closes [#18](https://github.com/citation-js/citation-js/issues/18)

## [`0.4.2`](https://github.com/larsgw/citation.js/compare/v0.4.1...v0.4.2) - 2019-06-13

* Pin component versions to [`v0.4.2`](https://github.com/citation-js/citation-js/blob/main/CHANGELOG.md#042-2019-04-26):

> ### Bug Fixes
>
> * **plugin-bibtex:** fix label creation ([c7cde40](https://github.com/citation-js/citation-js/commit/c7cde40)), closes [#35](https://github.com/citation-js/citation-js/issues/35)
> * **plugin-wikidata:** support imprecise dates ([c898db7](https://github.com/citation-js/citation-js/commit/c898db7)), closes [#33](https://github.com/citation-js/citation-js/issues/33)
>
>
> ### Features
>
> * **plugin-wikidata:** support more URL properties ([#34](https://github.com/citation-js/citation-js/issues/34)) ([d489843](https://github.com/citation-js/citation-js/commit/d489843))

## [`0.4.1`](https://github.com/larsgw/citation.js/compare/v0.4.0...v0.4.1) - 2019-06-13

Pin component versions to [`v0.4.1`](https://github.com/citation-js/citation-js/blob/main/CHANGELOG.md#041-2019-04-14):

> * **plugin-wikidata:** fix getting label if no title exists ([#32](https://github.com/citation-js/citation-js/issues/32)) ([69243c5](https://github.com/citation-js/citation-js/commit/69243c5))

## [`0.4.0`](https://github.com/larsgw/citation.js/compare/v0.4.0-12...v0.4.0) - 2019-04-13

Updated components to `v0.4.0`, release `v0.4`.

## [`0.4.0-12`](https://github.com/larsgw/citation.js/compare/v0.4.0-11...v0.4.0-12) - 2019-03-17

Updated components from `v0.4.0-rc.1` to `v0.4.0-rc.4`, see [that changelog](https://github.com/citation-js/citation-js/blob/main/CHANGELOG.md).

## [`0.4.0-11`](https://github.com/larsgw/citation.js/compare/v0.4.0-10...v0.4.0-11) - 2018-12-27

### BREAKING

* Moved all code to '@citation-js' components. There should be full backwards compatibility, apart from the structure of files.

## [`0.4.0-10`](https://github.com/larsgw/citation.js/compare/v0.4.0-9...v0.4.0-10) - 2018-11-02

### Added

* [meta] More test work
* `util.Register`: Alias `remove` to `delete`
* `input/@wikidata`: Support 'stated as' (P1932) qualifier, if possible preferring that over fetching author labels (#131)
* `output/@csl`: Bibliography `nosort` option
* `input/@bibtex`: Support for comma-delimited entries (#157)

### Changed

* Deprecated wrapper CSL locale and template methods

### Fixed

* `output/@csl`: Affixes now work reliably for all formats (#84)

## [`0.4.0-9`](https://github.com/larsgw/citation.js/compare/v0.4.0-8...v0.4.0-9) - 2018-07-19

### Added
* Support for styled text in title fields in BibTeX input (see #150). Values wrapped in double brackets are treated as values wrapped in single brackets (see #155)

### Changed
* BibTeX title fields are no longer wrapped in double brackets when creating output (#155)

### Fixed
* Handling of styled text in CSL-JSON title fields when creating BibTeX output (#150)
* Bug introduced when fixing REDOS that made the @else/url type not match @wikidata/api in some cases (#156)

## [`0.4.0-8`](https://github.com/larsgw/citation.js/compare/v0.4.0-7...v0.4.0-8) - 2018-07-14

Bug fixes.

### Added
* [meta] Point `unpkg` & `jsdelivr` field to citation.min.js

### Changed
* Update for BibJSON parsing (#32). Including tests & documentation.

### Fixed
* Cite option validation (and tests that broke because of it)
* Handling incomplete dates in output formatters (https://github.com/larsgw/citation.js/issues/53#issuecomment-404995961). It was caused by #139, a fix for #138 of which #127 is part of
* Make a check when polishing API data not fail when a date field is an empty object (#147)
* [meta] Docs index issue (070cf12)

## [`0.4.0-7`](https://github.com/larsgw/citation.js/compare/v0.4.0-6...v0.4.0-7) - 2018-07-12

### Added

* [meta] A lot of tests cases regarding input parsing mechanisms (#123)
* General plugin system (#88)
* Alias `type` option to `format` in most output formats
* CSL config is now registered with the general plugin system
* CSL `citation` support (see #148)

### Changed

* Reformed input plugin system (again) (#106)
* The `parseDate` method now has an internal parsing implementation (#127, #138)
* Updated documentation (both in-code JSDoc and guides)

### Testing

* Tests now support HTTP(S) request mocking (#134, #136)
* Added REDOS flagging tools
* Tests for global plugin system

### Fixed

* `@else/url` blocking type recognition (#104)
* `@else/json` type predicate for empty objects:
  ```js
  '{}'     // didn't work
  '{a: 1}' // worked
  '{ }'    // worked as well
  ```
* REDOS (mostly, anyway) (see #107, 7c52beff44b37443b812ee5864733e441e29a812)
* JSON output still being invalid (#143, see also #144)
* [meta] Invalid Babel `browsers` target

## [`0.4.0-6`](https://github.com/larsgw/citation.js/compare/v0.4.0-5...v0.4.0-6) - 2018-07-01

### Fixed
* BibTeX output typo, trying to find the non-existent `url` CSL property, instead of the `URL` one (#153)

## [`0.4.0-5`](https://github.com/larsgw/citation.js/compare/v0.4.0-4...v0.4.0-5) - 2018-06-03

### Fixed
* Webpack error because of browserify-centric setup (#151)

## [`0.4.0-4`](https://github.com/larsgw/citation.js/compare/v0.4.0-3...v0.4.0-4) - 2018-05-19

### Fixed
* DOI bug due to a regression in 0.4.0-3 (dda2360f4d91af1d48e1bf859d784b2bdc694c6d)

## [`0.4.0-3`](https://github.com/larsgw/citation.js/compare/v0.4.0-2...v0.4.0-3) - 2018-05-12

### Added
* RIS output support (#125)

### Refactored
* A lot of the building scripts
* All code uses the util fetchFile(Async) functions, to make testing easier

### Fixed
* Subtle type checking bug in translation scheme parsing code (#128)
* Logging API not supported on Node.js v6 (#124)

## [`0.4.0-2`](https://github.com/larsgw/citation.js/compare/v0.4.0-1...v0.4.0-2) - 2018-05-12

> Was skipped due to publishing the wrong files.

## [`0.4.0-1`](https://github.com/larsgw/citation.js/compare/v0.4.0-0...v0.4.0-1) - 2017-12-31

### Added

* New formatting system w/ plugins (#82)
* `Register` class for general-purpose registers (already used in 4 places) (#115)
* `Cite#format` (a `Cite` formatting method for output plugins)

### Changed

* Modularised most output formatting code
* Adding CSL locales and templates now overwrites existing ones. Previously, it didn't, but there wasn't any way of getting them back anyway
* Generalised formatting functions (there are still backwards-compatible wrappers)
* Expanded output options validation issue error messages
* Deprecated `Cite#get`

### Refactored

* Use ESLint envs instead of listing globals (#114)

### Fixed

* Docs issues (#112)
* CLI ouptut file extensions (#121)
* `Cite.async` behaviour w/ callback & no options (#122)
* Output options validation issues (#120)
* Moved input parsing to actual respective test cases

## [`0.4.0-0`](https://github.com/larsgw/citation.js/compare/v0.3.4...v0.4.0-0) - 2017-12-22

### Added
* New parsing system w/ plugins

> This change should be mostly backwards-compatible, although certain workarounds may stop working. If there's an issue, please report it [here](https://github.com/larsgw/citation.js/issues)

* Support for dynamic output types
* Greatly improved docs
* Map namespaces in JSDoc comments
* Add tutorials

### Changed
* `Cite#options()` now doesn't update options when they are invalid
* Improved BibTeX field mappings
* Support month names in BibTeX
* CLI logging now on stderr (instead of stdout)

## [`0.3.4`](https://github.com/larsgw/citation.js/compare/v0.3.3...v0.3.4) - 2017-09-12

### Changed
* Updated README

### Fixed
* Command sequence normalisation in BibTeX
* BibTeX test case output

## [`0.3.3`](https://github.com/larsgw/citation.js/compare/v0.3.2...v0.3.3) - 2017-09-12

### Added
* A lot of Wikidata entry type mappings
* Support for option-less piping stdin -> stdout in the CLI

### Changed
* Greatly improve name parsing
* Wikidata entry type default is now `book` to align with, among other things, BibTeX

### Fixed
* Unknown Wikidata entry type now actually defaults to something
* CLI now uses the API changed in 0.3.1

## [`0.3.2`](https://github.com/larsgw/citation.js/compare/v0.3.1...v0.3.2) - 2017-09-10

### Added
* New Wikidata field mappings (see [#76](https://github.com/larsgw/citation.js/issues/76))

### Changed
* BibTeX name field output now uses reverse notation
* Main parsing function aliases/shortcuts:
  * `Cite.normalise()` -> `Cite.input()`
  * `Cite.normaliseAsync()` -> `Cite.inputAsync()`

## [`0.3.1`](https://github.com/larsgw/citation.js/compare/v0.3.0...v0.3.1) - 2017-09-02

### Added
* Options parameter in `parseInput` and `parseInputAsync`
* Option for max parsing chain length
* Option to generate parsing chain data in `_graph` property
* Option to force type when parsing

### Changed
* Options API in `Cite` and `Cite.async`

```js
Cite(data, outputOptions)

// BECOMES

Cite(data, {
  ...parsingOptions,
  output: outputOptions
})
```

* Author ordinal in Wikidata props is now a property `_ordinal` instead of an array element
* Parsing invalid dates now returns input as literal date instead of an empty `date-parts`

### Refactored
* Simplify code to normalise CSL-JSON
* Mock APIs for async tests

### Fixed
* Parsing names with lowercase particles now doesn't omit family names
* Better error messaging when API/file requests fails

## [`0.3.0`](https://github.com/larsgw/citation.js/compare/v0.3.0-14...v0.3.0) - 2017-08-25

See `0.3.0-14`.

## [`0.3.0-14`](https://github.com/larsgw/citation.js/compare/v0.3.0-13...v0.3.0-14) - 2017-08-24

### Added
* Alias for main parsing functions: `Cite.parse.input.chain -> Cite.normalise` and `Cite.parse.input.async.chain -> Cite.normaliseAsync`
* Async versions of `Cite#set()` and `Cite#add()` (only Promise, no callback)

### Refactored
* Wikidata JSON parsing system

### Fixed
* Wikidata prop parsing function now returns with the proper field name when parsing an author prop

## [`0.3.0-13`](https://github.com/larsgw/citation.js/compare/v0.3.0-12...v0.3.0-13) - 2017-08-22

### Added
* Support for matching several tokens in a row with TokenStack

### Refactored
* Add explanation to complex code
* BibTeX publication type parsing now uses a type map

### Fixed
* Typo in BibTeX de-escaping code, now correctly parsing % signs in author fields
* False positive parsing Array JSON string as Bib.TXT

## [`0.3.0-12`](https://github.com/larsgw/citation.js/compare/v0.3.0-11...v0.3.0-12) - 2017-08-01

### Added
* Support for BibTeX literals in author and date fields
* Support for BibTeX fields year and month

### Changed
* `Cite#retrieveVersion()` now returns `null` on all invalid versions

### Refactored
* Testing now with the mocha framework
* BibTeX parser

### Fixed
* Sorting by any date field

## [`0.3.0-11`](https://github.com/larsgw/citation.js/compare/v0.3.0-10...v0.3.0-11) - 2017-07-28

### Added
* Custom templates & locales register

### Fixed
* Use correct date format

## [`0.3.0-10`](https://github.com/larsgw/citation.js/compare/v0.3.0-9...v0.3.0-10) - 2017-07-28

### Added
* DOI support
* CSL normaliser

### Fixed
* Async prop parsing

## [`0.3.0-9`](https://github.com/larsgw/citation.js/compare/v0.3.0-8...v0.3.0-9) - 2017-07-06

### Added
* CLI stdin input

### Fixed
* DOM HTML output
* CLI non-file input

## [`0.3.0-8`](https://github.com/larsgw/citation.js/compare/v0.3.0-7...v0.3.0-8) - 2017-06-03

### Added
* Iterator to Cite

### Fixed
* CLI Windows support
* Wikidata input when value is empty
* DOM HTML output
* Output JSON is now valid JSON
* Sorting by callback and custom props
* Input support for BibTeX JSON

## [`0.3.0-7`](https://github.com/larsgw/citation.js/compare/v0.3.0-6...v0.3.0-7) - 2017-05-22

### Added
* Bib.TXT i/o support

### Fixed
* CLI Citation.js v0.3.0-7 support

## [`0.3.0-6`](https://github.com/larsgw/citation.js/compare/v0.3.0-5...v0.3.0-6) - 2017-05-15

### Added
* Async support

### Fixed
* Increased browser support

## [`0.3.0-5`](https://github.com/larsgw/citation.js/compare/v0.3.0-4...v0.3.0-5) - 2017-05-08

### Added
* Exposition of most Cite functions to users

### Changed
* Logging non-standard

### Removed
* Remove `Cite#_input`

### Refactored
* Code style and ES6+

## Older changelogs coming later
I really don't recommend using those versions anyway.
