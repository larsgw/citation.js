var Cite = typeof Cite !== 'undefined' ?
  Cite
:
  require( '../../../index.js' )

describe( 'Cite object', function () {
  
  describe( 'init', function () {
    
    it( 'can be executed', function () {
      var spy = jasmine.createSpy( 'Cite' )
        , tst = new spy()
      
      expect( spy ).wasCalled()
    } )
    it( 'returns a Cite object', function () {
      var tst = new Cite()
      expect( tst instanceof Cite ).toBe( true )
    } )
  
  } )
  
  describe( 'function', function () {
    var input = '[ { id: "Q23571040", type: "article-journal", title: "Correlation of the Base Strengths of Amines 1", DOI: "10.1021/ja01577a030", author: [ { given: "H. K.", family: "Hall" } ], issued: [ { date-parts: [ "1957", "1", "1" ] } ], container-title: "Journal of the American Chemical Society", volume: "79", issue: "20", page: "5441-5444" } ]'
    
    describe( 'add()', function () {
      var test = new Cite( input )
      
      test.add( {} )
      
      it( 'works', function () {
	expect( test.data.length ).toBe( 2 )
	expect( test._log.length ).toBe( 2 )
      } )
    } )
    
    describe( 'set()', function () {
      var test = new Cite( input )
      
      test.set( {} )
      
      it( 'works', function () {
	expect( test.data.length ).toBe( 1 )
	expect( test._log.length ).toBe( 2 )
      } )
    } )
    
    describe( 'reset()', function () {
      var test = new Cite( input )
      
      test.reset()
      
      it( 'works', function () {
	expect( test.data.length ).toBe( 0 )
	expect( test._log.length ).toBe( 2 )
      } )
    } )
    
    describe( 'options()', function () {
      var test = new Cite( input )
      
      test.options( { format: 'string' } )
      
      it( 'works', function () {
	expect( test._options.format ).toBe( 'string' )
	expect( test._log.length ).toBe( 2 )
      } )
    } )
    
    describe( 'currentVersion()', function () {
      var test = new Cite( input )
      
      it( 'works', function () {
	expect( test.currentVersion() ).toBe( 0 )
	test.add( {} )
	expect( test.currentVersion() ).toBe( 1 )
      } )
    } )
    
    describe( 'retrieveVersion()', function () {
      var test = new Cite( input )
      
      it( 'works', function () {
	expect( test._log.length ).toBe( 1 )
	expect( test.data.length ).toBe( 1 )
	
	test.add( {} )
	
	expect( test._log.length ).toBe( 2 )
	expect( test.data.length ).toBe( 2 )
	
	test = test.retrieveVersion( 0 )
	
	expect( test._log.length ).toBe( 1 )
	expect( test.data.length ).toBe( 1 )
      } )
    } )
    
    describe( 'undo()', function () {
      var test = new Cite( input )
      
      it( 'works', function () {
	expect( test._log.length ).toBe( 1 )
	expect( test.data.length ).toBe( 1 )
	
	test.add( {} )
	
	expect( test._log.length ).toBe( 2 )
	expect( test.data.length ).toBe( 2 )
	
	test = test.undo()
	
	expect( test._log.length ).toBe( 1 )
	expect( test.data.length ).toBe( 1 )
      } )
    } )
    
    describe( 'sort()', function () {
      var test = new Cite( [
	{ author: [ { family: 'b' } ], id: 'b' }
      , { author: [ { family: 'a' } ], id: 'a' }
      ] )
      
      it( 'works', function () {
	expect( test.data[ 0 ].author[ 0 ].family ).toBe( 'b' )
	expect( test.data[ 1 ].author[ 0 ].family ).toBe( 'a' )
	
	test.sort()
	
	expect( test.data[ 0 ].author[ 0 ].family ).toBe( 'a' )
	expect( test.data[ 1 ].author[ 0 ].family ).toBe( 'b' )
      } )
    } )
    
  } )
  
  describe( 'input', function () {
    
    describe( 'Wikidata URL', function () {
      var test_1 = new Cite( 'https://www.wikidata.org/wiki/Q21972834' )
        , test_2 = new Cite( 'https://www.wikidata.org/wiki/Q27795847' )
      
      it( 'handles input type', function () {
        expect( test_1._input.format ).toBe( 'url/wikidata' )
        expect( test_2._input.format ).toBe( 'url/wikidata' )
      } )
      
      it( 'parses input', function () {
        expect( JSON.stringify( test_1.data ) ).toBe( '[{"wikiID":"Q21972834","id":"Q21972834","DOI":"10.1093/bioinformatics/btt178","type":"article-journal","title":"Assembling the 20 Gb white spruce (Picea glauca) genome from whole-genome shotgun sequencing data","volume":"29","issue":"12","issued":[{"date-parts":[2013,6,15]}],"page":"1492-7","container-title":"Bioinformatics","author":[{"given":"Inanc","family":"Birol"},{"given":"Anthony","family":"Raymond"},{"given":"Shaun D","family":"Jackman"},{"given":"Stephen","family":"Pleasance"},{"given":"Robin","family":"Coope"},{"given":"Greg A","family":"Taylor"},{"given":"Macaire Man Saint","family":"Yuen"},{"given":"Christopher I","family":"Keeling"},{"given":"Dana","family":"Brand"},{"given":"Benjamin P","family":"Vandervalk"},{"given":"Heather","family":"Kirk"},{"given":"Pawan","family":"Pandoh"},{"given":"Richard A","family":"Moore"},{"given":"Yongjun","family":"Zhao"},{"given":"Andrew J","family":"Mungall"},{"given":"Barry","family":"Jaquish"},{"given":"Alvin","family":"Yanchuk"},{"given":"Carol","family":"Ritland"},{"given":"Brian","family":"Boyle"},{"given":"Jean","family":"Bousquet"},{"given":"Kermit","family":"Ritland"},{"given":"John","family":"Mackay"},{"given":"Jörg","family":"Bohlmann"},{"given":"Steven J M","family":"Jones"}]}]' )
      } )
      
      describe( 'with linked authors', function () {
        it( 'parses input', function () {
          expect( JSON.stringify( test_2.data ) ).toBe( '[{"wikiID":"Q27795847","id":"Q27795847","DOI":"10.1038/nbt.3689","type":"article-journal","issued":[{"date-parts":[2016,11,8]}],"title":"SPLASH, a hashed identifier for mass spectra","volume":"34","page":"1099–1101","container-title":"Nature Biotechnology","author":[{"given":"Gert","family":"Wohlgemuth"},{"given":"Sajjan S","family":"Mehta"},{"given":"Ramon F","family":"Mejia"},{"given":"Steffen","family":"Neumann"},{"given":"Diego","family":"Pedrosa"},{"given":"Tomáš","family":"Pluskal"},{"given":"Michael","family":"Wilson"},{"given":"Masanori","family":"Arita"},{"given":"Pieter C","family":"Dorrestein"},{"given":"Nuno","family":"Bandeira"},{"given":"Mingxun","family":"Wang"},{"given":"Tobias","family":"Schulze"},{"given":"Reza M","family":"Salek"},{"given":"Venkata Chandrasekhar","family":"Nainala"},{"given":"Robert","family":"Mistrik"},{"given":"Takaaki","family":"Nishioka"},{"given":"Oliver","family":"Fiehn"}]}]' )
        } )
      } )
    } )
    
    describe( 'BibTeX string', function () {
      var test = new Cite( '@article{Steinbeck2003, author = {Steinbeck, Christoph and Han, Yongquan and Kuhn, Stefan and Horlacher, Oliver and Luttmann, Edgar and Willighagen, Egon}, year = {2003}, title = {{The Chemistry Development Kit (CDK): an open-source Java library for Chemo- and Bioinformatics.}}, journal = {Journal of chemical information and computer sciences}, volume = {43}, number = {2}, pages = {493--500}, doi = {10.1021/ci025584y}, isbn = {2214707786}, issn = {0095-2338}, pmid = {12653513}, url = {http://www.ncbi.nlm.nih.gov/pubmed/12653513} }' )
      
      it( 'handles input type', function () {
	expect( test._input.format ).toBe( 'string/bibtex' )
      } )
      it( 'parses input', function () {
	expect( JSON.stringify( test.data ) ).toBe( '[{"type":"article-journal","author":[{"given":"Christoph","family":"Steinbeck"},{"given":"Yongquan","family":"Han"},{"given":"Stefan","family":"Kuhn"},{"given":"Oliver","family":"Horlacher"},{"given":"Edgar","family":"Luttmann"},{"given":"Egon","family":"Willighagen"}],"year":"2003","title":"The Chemistry Development Kit (CDK): an open-source Java library for Chemo- and Bioinformatics","container-title":"Journal of chemical information and computer sciences","volume":"43","issue":"2","page":"493-500","DOI":"10.1021/ci025584y","ISBN":"0095-2338","id":"Steinbeck2003"}]' )
      } )
    } )
    
    describe( 'CSL-JSON', function () {
      var test = new Cite( '[ { id: "Q23571040", type: "article-journal", title: "Correlation of the Base Strengths of Amines 1", DOI: "10.1021/ja01577a030", author: [ { given: "H. K.", family: "Hall" } ], issued: [ { date-parts: [ "1957", "1", "1" ] } ], container-title: "Journal of the American Chemical Society", volume: "79", issue: "20", page: "5441-5444" } ]' )
      
      it( 'handles input type', function () {
	expect( test._input.format ).toBe( 'string/json' )
      } )
      it( 'parses input', function () {
	expect( JSON.stringify( test.data ) ).toBe( '[{"id":"Q23571040","type":"article-journal","title":"Correlation of the Base Strengths of Amines 1","DOI":"10.1021/ja01577a030","author":[{"given":"H. K.","family":"Hall"}],"issued":[{"date-parts":["1957","1","1"]}],"container-title":"Journal of the American Chemical Society","volume":"79","issue":"20","page":"5441-5444"}]' )
      } )
    } )
    
    describe( 'ContentMine JSON', function () {
      var test = new Cite( JSON.parse( '{ "publisher": { "value": [ "BioMed Central" ] }, "journal": { "value": [ "Journal of Ethnobiology and Ethnomedicine" ] }, "title": { "value": [ "Gitksan medicinal plants-cultural choice and efficacy" ] }, "authors": { "value": [ "Leslie Main Johnson" ] }, "date": { "value": [ "2006-06-21" ] }, "doi": { "value": [ "10.1186/1746-4269-2-29" ] }, "volume": { "value": [ "2" ] }, "issue": { "value": [ "1" ] }, "firstpage": { "value": [ "1" ] }, "fulltext_html": { "value": [ "http://ethnobiomed.biomedcentral.com/articles/10.1186/1746-4269-2-29" ] }, "fulltext_pdf": { "value": [ "http://ethnobiomed.biomedcentral.com/track/pdf/10.1186/1746-4269-2-29?site=http://ethnobiomed.biomedcentral.com" ] }, "license": { "value": [ "This article is published under license to BioMed Central Ltd. This is an Open Access article distributed under the terms of the Creative Commons Attribution License (http://creativecommons.org/licenses/by/2.0), which permits unrestricted use, distribution, and reproduction in any medium, provided the original work is properly cited." ] }, "copyright": { "value": [ "2006 Johnson; licensee BioMed Central Ltd." ] } }' ) )
      
      it( 'handles input type', function () {
	expect( test._input.format ).toBe( 'json/contentmine' )
      } )
      it( 'parses input', function () {
	expect( JSON.stringify( test.data ) ).toBe( '[{"publisher":"BioMed Central","journal":"Journal of Ethnobiology and Ethnomedicine","title":"Gitksan medicinal plants-cultural choice and efficacy","authors":"Leslie Main Johnson","date":"2006-06-21","doi":"10.1186/1746-4269-2-29","volume":"2","issue":"1","firstpage":"1","fulltext_html":"http://ethnobiomed.biomedcentral.com/articles/10.1186/1746-4269-2-29","fulltext_pdf":"http://ethnobiomed.biomedcentral.com/track/pdf/10.1186/1746-4269-2-29?site=http://ethnobiomed.biomedcentral.com","license":"This article is published under license to BioMed Central Ltd. This is an Open Access article distributed under the terms of the Creative Commons Attribution License (http://creativecommons.org/licenses/by/2.0), which permits unrestricted use, distribution, and reproduction in any medium, provided the original work is properly cited.","copyright":"2006 Johnson; licensee BioMed Central Ltd.","type":"article-journal","author":[{"given":"Leslie Main","family":"Johnson"}],"page-first":"1","page":"1","issued":[{"date-parts":[2006,6,21]}],"container-title":"Journal of Ethnobiology and Ethnomedicine","id":"10.1186/1746-4269-2-29","DOI":"10.1186/1746-4269-2-29"}]' )
      } )
    } )
    
  } )
  
  describe( 'output', function () {
    
    var test = new Cite( '[ { id: "Q23571040", type: "article-journal", title: "Correlation of the Base Strengths of Amines 1", DOI: "10.1021/ja01577a030", author: [ { given: "H. K.", family: "Hall" } ], issued: [ { date-parts: [ "1957", "1", "1" ] } ], container-title: "Journal of the American Chemical Society", volume: "79", issue: "20", page: "5441-5444" } ]' )
    
    describe( 'CSL APA plain text', function () {
      var out = test.get( {
	format: 'string',
	type: 'string',
	style: 'citation-apa'
      } ).trim()
      
      it( 'outputs correctly', function () {
	expect( out ).toBe( 'Hall, H. K. Correlation of the Base Strengths of Amines 1. Journal of the American Chemical Society, 79(20), 5441–5444. https://doi.org/10.1021/ja01577a030' )
      } )
    } )
    
    describe( 'CSL JSON plain text', function () {
      var out = test.get( {
	format: 'string',
	type: 'json',
	style: 'csl'
      } ).trim()
      
      it( 'outputs correctly', function () {
	expect( out ).toBe( '[{"id":"Q23571040","type":"article-journal","title":"Correlation of the Base Strengths of Amines 1","DOI":"10.1021/ja01577a030","author":[{"given":"H. K.","family":"Hall"}],"issued":[{"date-parts":["1957","1","1"]}],"container-title":"Journal of the American Chemical Society","volume":"79","issue":"20","page":"5441-5444"}]' )
      } )
    } )
    
    describe( 'BibTeX plain text', function () {
      var out = test.get( {
	format: 'string',
	type: 'string',
	style: 'bibtex'
      } ).trim().replace( /\s+/g, ' ' )
      
      it( 'outputs correctly', function () {
	expect( out ).toBe( '@article{Hall1957Correlation, author={H. K. Hall}, doi={10.1021/ja01577a030}, journal={Journal of the American Chemical Society}, issue=20, pages={5441--5444}, title={{Correlation of the Base Strengths of Amines 1}}, volume=79, year=1957, }' )
      } )
    } )
    
    describe( 'BibTeX JSON', function () {
      var out = test.get( {
	format: 'string',
	type: 'json',
	style: 'bibtex'
      } ).trim()
      
      it( 'outputs correctly', function () {
	expect( out ).toBe( '[{"label":"Hall1957Correlation","type":"article","properties":{"author":"H. K. Hall","doi":"10.1021/ja01577a030","journal":"Journal of the American Chemical Society","issue":"20","pages":"5441--5444","title":"Correlation of the Base Strengths of Amines 1","volume":"79","year":"1957"}}]' )
      } )
    } )
    
  } )
  
} )