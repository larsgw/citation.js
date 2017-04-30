const fs = require('fs'),
      Cite = require('../index.js')

const file_1 = fs.readFileSync(__dirname + '/Q21972834.json', 'utf8'),
      file_2 = fs.readFileSync(__dirname + '/Q27795847.json', 'utf8')

const testOutput = {
  wd: {
    id: 'Q21972834',
    simple: [{"wikiID":"Q21972834","id":"Q21972834","type":"article-journal","title":"Assembling the 20 Gb white spruce (Picea glauca) genome from whole-genome shotgun sequencing data","volume":"29","issue":"12","issued":[{"date-parts":[2013,6,15]}],"page":"1492-7","container-title":"Bioinformatics","DOI":"10.1093/BIOINFORMATICS/BTT178","author":[{"given":"Inanc","family":"Birol"},{"given":"Anthony","family":"Raymond"},{"given":"Shaun D","family":"Jackman"},{"given":"Stephen","family":"Pleasance"},{"given":"Robin","family":"Coope"},{"given":"Greg A","family":"Taylor"},{"given":"Macaire Man Saint","family":"Yuen"},{"given":"Christopher I","family":"Keeling"},{"given":"Dana","family":"Brand"},{"given":"Benjamin P","family":"Vandervalk"},{"given":"Heather","family":"Kirk"},{"given":"Pawan","family":"Pandoh"},{"given":"Richard A","family":"Moore"},{"given":"Yongjun","family":"Zhao"},{"given":"Andrew J","family":"Mungall"},{"given":"Barry","family":"Jaquish"},{"given":"Alvin","family":"Yanchuk"},{"given":"Carol","family":"Ritland"},{"given":"Brian","family":"Boyle"},{"given":"Jean","family":"Bousquet"},{"given":"Kermit","family":"Ritland"},{"given":"John","family":"Mackay"},{"given":"Jörg","family":"Bohlmann"},{"given":"Steven J M","family":"Jones"}]}],
    author: [{"wikiID":"Q27795847","id":"Q27795847","type":"article-journal","issued":[{"date-parts":[2016,11,8]}],"title":"SPLASH, a hashed identifier for mass spectra","volume":"34","page":"1099–1101","container-title":"Nature Biotechnology","URL":"http://rdcu.be/msZj","DOI":"10.1038/NBT.3689","author":[{"given":"Gert","family":"Wohlgemuth"},{"given":"Sajjan S","family":"Mehta"},{"given":"Ramon F","family":"Mejia"},{"given":"Steffen","family":"Neumann"},{"given":"Diego","family":"Pedrosa"},{"given":"Tomáš","family":"Pluskal"},{"given":"Emma","family":"Schymanski"},{"given":"Egon","family":"Willighagen"},{"given":"Michael","family":"Wilson"},{"given":"David S","family":"Wishart"},{"given":"Masanori","family":"Arita"},{"given":"Pieter C","family":"Dorrestein"},{"given":"Nuno","family":"Bandeira"},{"given":"Mingxun","family":"Wang"},{"given":"Tobias","family":"Schulze"},{"given":"Reza M","family":"Salek"},{"given":"Christoph","family":"Steinbeck"},{"given":"Venkata Chandrasekhar","family":"Nainala"},{"given":"Robert","family":"Mistrik"},{"given":"Takaaki","family":"Nishioka"},{"given":"Oliver","family":"Fiehn"}]}],
    api: [
      'https://www.wikidata.org/w/api.php?action=wbgetentities&ids=Q21972834&format=json&languages=en',
      'https://www.wikidata.org/w/api.php?action=wbgetentities&ids=Q21972834%7CQ27795847&format=json&languages=en'
    ]
  },
  bibtex: {
    simple: [{"type":"article-journal","author":[{"given":"Christoph","family":"Steinbeck"},{"given":"Yongquan","family":"Han"},{"given":"Stefan","family":"Kuhn"},{"given":"Oliver","family":"Horlacher"},{"given":"Edgar","family":"Luttmann"},{"given":"Egon","family":"Willighagen"}],"year":"2003","title":"The Chemistry Development Kit (CDK): an open-source Java library for Chemo- and Bioinformatics","container-title":"Journal of chemical information and computer sciences","volume":"43","issue":"2","page":"493-500","DOI":"10.1021/ci025584y","ISBN":"2214707786","ISSN":"0095-2338","URL":"http://www.ncbi.nlm.nih.gov/pubmed/12653513","id":"Steinbeck2003"}],
    whitespace: [{"type":"paper-conference","author":[{"given":"Michael D.","family":"Ekstrand"},{"given":"John T.","family":"Riedl"}],"title":"rv you\'re dumb: Identifying Discarded Work in Wiki Article History","container-title":"Proceedings of the 5th International Symposium on Wikis and Open Collaboration","collection-title":"WikiSym \'09","year":"2009","ISBN":"978-1-60558-730-1","publisher-place":"New York, NY, USA","page":"4:1-4:10","URL":"https://dx.doi.org/10.1145/1641309.1641317","DOI":"10.1145/1641309.1641317","publisher":"ACM","id":"Ekstrand:2009:RYD"}],
    
    plain: '@article{Hall1957Correlation, author={H. K. Hall}, doi={10.1021/ja01577a030}, journal={Journal of the American Chemical Society}, issue=20, pages={5441--5444}, title={{Correlation of the Base Strengths of Amines 1}}, volume=79, year=1957, }',
    json: [{"label":"Hall1957Correlation","type":"article","properties":{"author":"H. K. Hall","doi":"10.1021/ja01577a030","journal":"Journal of the American Chemical Society","issue":"20","pages":"5441--5444","title":"Correlation of the Base Strengths of Amines 1","volume":"79","year":"1957"}}]
  },
  bibjson: {
    simple: [{"publisher":"BioMed Central","journal":"Journal of Ethnobiology and Ethnomedicine","title":"Gitksan medicinal plants-cultural choice and efficacy","authors":"Leslie Main Johnson","date":"2006-06-21","doi":"10.1186/1746-4269-2-29","volume":"2","issue":"1","firstpage":"1","fulltext_html":"http://ethnobiomed.biomedcentral.com/articles/10.1186/1746-4269-2-29","fulltext_pdf":"http://ethnobiomed.biomedcentral.com/track/pdf/10.1186/1746-4269-2-29?site=http://ethnobiomed.biomedcentral.com","license":"This article is published under license to BioMed Central Ltd. This is an Open Access article distributed under the terms of the Creative Commons Attribution License (http://creativecommons.org/licenses/by/2.0), which permits unrestricted use, distribution, and reproduction in any medium, provided the original work is properly cited.","copyright":"2006 Johnson; licensee BioMed Central Ltd.","type":"article-journal","author":[{"given":"Leslie Main","family":"Johnson"}],"page-first":"1","page":"1","issued":[{"date-parts":[2006,6,21]}],"container-title":"Journal of Ethnobiology and Ethnomedicine","id":"10.1186/1746-4269-2-29","DOI":"10.1186/1746-4269-2-29"}]
  },
  csl: {
    apa: 'Hall, H. K. Correlation of the Base Strengths of Amines 1. Journal of the American Chemical Society, 79(20), 5441–5444. https://doi.org/10.1021/ja01577a030',
    vancouver: '1. Hall HK. Correlation of the Base Strengths of Amines 1. Journal of the American Chemical Society. 79(20):5441–4.',
    title: 'Correlation of the Base Strengths of Amines 1',
    html: {
      apa: '<div class="csl-bib-body">\n\
  <div data-csl-entry-id="Q23571040" class="csl-entry">Hall, H. K. Correlation of the Base Strengths of Amines 1. <i>Journal of the American Chemical Society</i>, <i>79</i>(20), 5441–5444. https://doi.org/10.1021/ja01577a030</div>\n\
</div>',
      vancouver: '<div class="csl-bib-body">\n\
  <div data-csl-entry-id="Q23571040" class="csl-entry">\n\
    <div class="csl-left-margin">1. </div><div class="csl-right-inline">Hall HK. Correlation of the Base Strengths of Amines 1. Journal of the American Chemical Society. 79(20):5441–4.</div>\n\
   </div>\n\
</div>',
      title: '<div class="csl-bib-body">\n\
  <div data-csl-entry-id="Q23571040" class="csl-entry">Correlation of the Base Strengths of Amines 1</div>\n\
</div>'
    }
  }
}

const testInput = {
  wd: {
    simple: JSON.parse(file_1),
    author: JSON.parse(file_2),
    url: 'https://www.wikidata.org/wiki/Q21972834',
    list: {
      space: 'Q21972834 Q27795847',
      newline: 'Q21972834\nQ27795847',
      comma: 'Q21972834,Q27795847'
    }
  },
  bibtex: {
    simple: '@article{Steinbeck2003, author = {Steinbeck, Christoph and Han, Yongquan and Kuhn, Stefan and Horlacher, Oliver and Luttmann, Edgar and Willighagen, Egon}, year = {2003}, title = {{The Chemistry Development Kit (CDK): an open-source Java library for Chemo- and Bioinformatics.}}, journal = {Journal of chemical information and computer sciences}, volume = {43}, number = {2}, pages = {493--500}, doi = {10.1021/ci025584y}, isbn = {2214707786}, issn = {0095-2338}, pmid = {12653513}, url = {http://www.ncbi.nlm.nih.gov/pubmed/12653513} }',
    whitespace: '@inproceedings{Ekstrand:2009:RYD,\n author = {Michael D. Ekstrand and John T. Riedl},\n title = {rv you\'re dumb: Identifying Discarded Work in Wiki Article History},\n booktitle = {Proceedings of the 5th International Symposium on Wikis and Open Collaboration},\n series = {WikiSym \'09},\n year = {2009},\n isbn = {978-1-60558-730-1},\n location = {Orlando, Florida},\n pages = {4:1--4:10},\n articleno = {4},\n numpages = {10},\n url = {https://dx.doi.org/10.1145/1641309.1641317},\n doi = {10.1145/1641309.1641317},\n acmid = {1641317},\n publisher = {ACM},\n address = {New York, NY, USA},\n keywords = {Wiki, Wikipedia, article history, visualization},\n}\n'
  },
  bibjson: {
    simple: { "publisher": { "value": [ "BioMed Central" ] }, "journal": { "value": [ "Journal of Ethnobiology and Ethnomedicine" ] }, "title": { "value": [ "Gitksan medicinal plants-cultural choice and efficacy" ] }, "authors": { "value": [ "Leslie Main Johnson" ] }, "date": { "value": [ "2006-06-21" ] }, "doi": { "value": [ "10.1186/1746-4269-2-29" ] }, "volume": { "value": [ "2" ] }, "issue": { "value": [ "1" ] }, "firstpage": { "value": [ "1" ] }, "fulltext_html": { "value": [ "http://ethnobiomed.biomedcentral.com/articles/10.1186/1746-4269-2-29" ] }, "fulltext_pdf": { "value": [ "http://ethnobiomed.biomedcentral.com/track/pdf/10.1186/1746-4269-2-29?site=http://ethnobiomed.biomedcentral.com" ] }, "license": { "value": [ "This article is published under license to BioMed Central Ltd. This is an Open Access article distributed under the terms of the Creative Commons Attribution License (http://creativecommons.org/licenses/by/2.0), which permits unrestricted use, distribution, and reproduction in any medium, provided the original work is properly cited." ] }, "copyright": { "value": [ "2006 Johnson; licensee BioMed Central Ltd." ] } }
  },
  csl: {
    empty: {},
    sort: [
      { author: [ { family: 'b' } ], id: 'b' },
      { author: [ { family: 'a' } ], id: 'a' }
    ],
    ids: [
      { id: 'b' },
      { id: 'a' }
    ],
    simple: [
      {
        "id": "Q23571040",
        "type": "article-journal",
        "title": "Correlation of the Base Strengths of Amines 1",
        "DOI": "10.1021/ja01577a030",
        "author": [
          {"given": "H. K.", "family": "Hall"}
        ],
        "issued": [
          {"date-parts": ["1957", "1", "1"]}
        ],
        "container-title": "Journal of the American Chemical Society",
        "volume": "79",
        "issue": "20",
        "page": "5441-5444"
      }
    ]
  }
}

const customTemplate = 
  '<?xml version="1.0" encoding="utf-8"?>' +
    '<style xmlns="http://purl.org/net/xbiblio/csl" class="in-text" version="1.0" demote-non-dropping-particle="sort-only" page-range-format="minimal">' +
      '<bibliography>' +
        '<layout>' +
          '<text variable="title"/>' +
        '</layout>' +
      '</bibliography>' +
  '</style>'

describe('Cite object', function () {
  
  describe('init', function () {
    
    it('can be executed', function () {
      const spy = jasmine.createSpy('Cite'),
            tst = new spy()
      
      expect(spy).toHaveBeenCalled()
    })
    
    it('returns a Cite object', function () {
      const tst = new Cite()
      expect(tst instanceof Cite).toBe(true)
    })
  
  })
  
  describe('function', function () {
    describe('add()', function () {
      const test = new Cite(testInput.csl.empty)
      
      test.add(testInput.csl.empty)
      
      it('works', function () {
        expect(test.data.length).toBe(2)
        expect(test._log.length).toBe(2)
      })
    })
    
    describe('set()', function () {
      const test = new Cite(testInput.csl.empty)
      
      test.set(testInput.csl.empty)
      
      it('works', function () {
        expect(test.data.length).toBe(1)
        expect(test._log.length).toBe(2)
      })
    })
    
    describe('reset()', function () {
      const test = new Cite(testInput.csl.empty)
      
      test.reset()
      
      it('works', function () {
        expect(test.data.length).toBe(0)
        expect(test._log.length).toBe(2)
      })
    })
    
    describe('options()', function () {
      const test = new Cite()
      
      test.options({format: 'string'})
      
      it('works', function () {
        expect(test._options.format).toBe('string')
        expect(test._log.length).toBe(2)
      })
    })
    
    describe('currentVersion()', function () {
      const test = new Cite(testInput.csl.empty)
      
      it('works', function () {
        expect(test.currentVersion()).toBe(0)
        test.add(testInput.csl.empty)
        expect(test.currentVersion()).toBe(1)
      })
    })
    
    describe('retrieveVersion()', function () {
      const test = new Cite(testInput.csl.empty)
      
      it('works', function () {
        expect(test._log.length).toBe(1)
        expect(test.data.length).toBe(1)
        
        test.add(testInput.csl.empty)
        
        expect(test._log.length).toBe(2)
        expect(test.data.length).toBe(2)
        
        const test_2 = test.retrieveVersion(0)
        
        expect(test_2._log.length).toBe(1)
        expect(test_2.data.length).toBe(1)
      })
      
      it('doesn\'t change parent data', function () {
        expect(test._log.length).toBe(3)
        expect(test._log[2].name).toBe('retrieveVersion')
        
        expect(test.data.length).toBe(2)
      })
    })
    
    describe('undo()', function () {
      const test = new Cite(testInput.csl.empty)
      
      it('works', function () {
        expect(test._log.length).toBe(1)
        expect(test.data.length).toBe(1)
        
        test.add(testInput.csl.empty)
        
        expect(test._log.length).toBe(2)
        expect(test.data.length).toBe(2)
        
        const test_2 = test.undo()
        
        expect(test_2._log.length).toBe(1)
        expect(test_2.data.length).toBe(1)
      })
      
      it('doesn\'t change parent data', function () {
        expect(test._log.length).toBe(3)
        expect(test._log[2].name).toBe('undo')
        
        expect(test.data.length).toBe(2)
      })
    })
    
    describe('sort()', function () {
      const test = new Cite(testInput.csl.sort)
      
      it('works', function () {
        expect(test.data[ 0 ].author[ 0 ].family).toBe('b')
        expect(test.data[ 1 ].author[ 0 ].family).toBe('a')
        
        test.sort()
        
        expect(test.data[ 0 ].author[ 0 ].family).toBe('a')
        expect(test.data[ 1 ].author[ 0 ].family).toBe('b')
      })
    })
    
    describe('getIds()', function () {
      const test = new Cite(testInput.csl.ids)
      
      it('works', function () {
        expect(test.data[ 0 ].id).toBe('b')
        expect(test.data[ 1 ].id).toBe('a')
        
        const out = test.getIds()
        
        expect(out[0]).toBe('b')
        expect(out[1]).toBe('a')
      })
      
      it('doesn\'t change parent data', function () {
        expect(test._log.length).toBe(2)
        expect(test._log[1].name).toBe('getIds')
        
        expect(test.data.length).toBe(2)
      })
    })
  })
  
  describe('input', function () {
    
    describe('Wikidata URL', function () {
      it('handles input type', function () {
        expect(Cite.parse.input.type(testInput.wd.url)).toBe('url/wikidata')
      })
      
      it('parses input correctly', function () {
        const test = Cite.parse.input.chainLink(testInput.wd.url)
        expect(test[0].replace(/[&?]origin=\*/,'')).toBe(testOutput.wd.api[0])
      })
    })
    
    describe('Wikidata ID list', function () {
      describe('separated by spaces', function () {
        it('handles input type', function () {
          expect(Cite.parse.input.type(testInput.wd.list.space)).toBe('list/wikidata')
        })
        
        it('parses input correctly', function () {
          const test = Cite.parse.input.chainLink(testInput.wd.list.space)
          expect(test[0].replace(/[&?]origin=\*/,'')).toBe(testOutput.wd.api[1])
        })
      })
      
      describe('separated by newlines', function () {
        it('handles input type', function () {
          expect(Cite.parse.input.type(testInput.wd.list.newline)).toBe('list/wikidata')
        })
        
        it('parses input correctly', function () {
          const test = Cite.parse.input.chainLink(testInput.wd.list.newline)
          expect(test[0].replace(/[&?]origin=\*/,'')).toBe(testOutput.wd.api[1])
        })
      })
      
      describe('separated by commas', function () {
        it('handles input type', function () {
          expect(Cite.parse.input.type(testInput.wd.list.comma)).toBe('list/wikidata')
        })
        
        it('parses input correctly', function () {
          const test = Cite.parse.input.chainLink(testInput.wd.list.comma)
          expect(test[0].replace(/[&?]origin=\*/,'')).toBe(testOutput.wd.api[1])
        })
      })
    })
    
    describe('Wikidata JSON', function () {
      const test_1 = new Cite(testInput.wd.simple),
            test_2 = new Cite(testInput.wd.author)
      
      it('handles input type', function () {
        expect(test_1._input.format).toBe('object/wikidata')
        expect(test_2._input.format).toBe('object/wikidata')
      })
      
      it('parses input correctly', function () {
        expect(test_1.data).toEqual(testOutput.wd.simple)
      })
      
      describe('with linked authors', function () {
        it('parses input correctly', function () {
          expect(test_2.data).toEqual(testOutput.wd.author)
        })
      })
    })
    
    describe('BibTeX string', function () {
      const test_1 = new Cite(testInput.bibtex.simple),
            test_2 = new Cite(testInput.bibtex.whitespace)
      
      it('handles input type', function () {
        expect(test_1._input.format).toBe('string/bibtex')
        expect(test_2._input.format).toBe('string/bibtex')
      })
      
      it('parses input correctly', function () {
        expect(test_1.data).toEqual(testOutput.bibtex.simple)
      })
      
      describe('with whitespace and unknown fields', function () {
        it('parses input correctly', function () {
          expect(test_2.data).toEqual(testOutput.bibtex.whitespace)
        })
      })
    })
    
    describe('CSL-JSON', function () {
      const test = new Cite(testInput.csl.simple[0])
      
      it('handles input type', function () {
        expect(test._input.format).toBe('object/csl')
      })
      it('parses input correctly', function () {
        expect(test.data).toEqual(testInput.csl.simple)
      })
    })
    
    describe('ContentMine JSON', function () {
      const test = new Cite(testInput.bibjson.simple)
      
      it('handles input type', function () {
        expect(test._input.format).toBe('object/contentmine')
      })
      it('parses input correctly', function () {
        expect(test.data).toEqual(testOutput.bibjson.simple)
      })
    })
    
    describe('Array', function () {
      const data = [{id: 'a'}, {id: 'b'}],
            test = new Cite(data)
      
      it('handles input type', function () {
        expect(test._input.format).toBe('array/csl')
      })
      it('parses input correctly', function () {
        expect(test.data).toEqual(data)
      })
      it('duplicates objects', function () {
        expect(test.data).not.toBe(data)
      })
      
      describe('nested', function () {
        const obj_1 = {id: 'a'},
              obj_2 = {id: 'b'},
              test = new Cite([[obj_1], obj_2])
        
        it('handles input type', function () {
          expect(test._input.format).toBe('array/else')
        })
        it('parses input correctly', function () {
          expect(test.data).toEqual([obj_1, obj_2])
        })
        it('duplicates objects', function () {
          expect(test.data[0]).not.toBe(obj_1)
          expect(test.data[1]).not.toBe(obj_2)
        })
      })
    })
    
    describe('Empty', function () {
      describe('string', function () {
        describe('empty', function () {
          const test = new Cite('')
          
          it('handles input type', function () {
            expect(test._input.format).toBe('string/empty')
          })
          it('parses input correctly', function () {
            expect(test.data).toEqual([])
          })
        })
        describe('whitespace', function () {
          const test = new Cite('   \t\n \r  ')
          
          it('handles input type', function () {
            expect(test._input.format).toBe('string/whitespace')
          })
          it('parses input correctly', function () {
            expect(test.data).toEqual([])
          })
        })
      })
      
      describe('null', function () {
        const test = new Cite(null)
        
        it('handles input type', function () {
          expect(test._input.format).toBe('empty')
        })
        it('parses input correctly', function () {
          expect(test.data).toEqual([])
        })
      })
      
      describe('undefined', function () {
        const test = new Cite(undefined)
        
        it('handles input type', function () {
          expect(test._input.format).toBe('empty')
        })
        it('parses input correctly', function () {
          expect(test.data).toEqual([])
        })
      })
    })
  })
  
  describe('output', function () {
    const test = new Cite(testInput.csl.simple)
    
    describe('Formatted CSL', function () {
      describe('html', function () {
        describe('default built-in template (APA)', function () {
          const out = test.get({
            format: 'string',
            type: 'html',
            style: 'citation-apa'
          }).trim()
          
          it('outputs correctly', function () {
            expect(out).toBe(testOutput.csl.html.apa)
          })
        })
        
        describe('non-default built-in template (Vancouver)', function () {
          const out = test.get({
            format: 'string',
            type: 'html',
            style: 'citation-vancouver'
          }).trim()
          
          it('outputs correctly', function () {
            expect(out).toBe(testOutput.csl.html.vancouver)
          })
        })
        
        describe('custom template', function () {
          it('outputs correctly', function () {
            const out = test.get({
              format: 'string',
              type: 'html',
              style: 'citation-custom',
              template: customTemplate
            }).trim()
            
            expect(out).toBe(testOutput.csl.html.title)
          })
          
          it('registers for subsequent calls', function () {
            const out = test.get({
              format: 'string',
              type: 'html',
              style: 'citation-custom'
            }).trim()
            
            expect(out).toBe(testOutput.csl.html.title)
          })
        })
      })
      
      describe('plain text', function () {
        describe('default built-in template (APA)', function () {
          const out = test.get({
            format: 'string',
            type: 'string',
            style: 'citation-apa'
          }).trim()
          
          it('outputs correctly', function () {
            expect(out).toBe(testOutput.csl.apa)
          })
        })
        
        describe('non-default built-in template (Vancouver)', function () {
          const out = test.get({
            format: 'string',
            type: 'string',
            style: 'citation-vancouver'
          }).trim()
          
          it('outputs correctly', function () {
            expect(out).toBe(testOutput.csl.vancouver)
          })
        })
        
        describe('custom template', function () {
          it('outputs correctly', function () {
            const out = test.get({
              format: 'string',
              type: 'string',
              style: 'citation-custom',
              template: customTemplate
            }).trim()
            
            expect(out).toBe(testOutput.csl.title)
          })
          
          it('registers for subsequent calls', function () {
            const out = test.get({
              format: 'string',
              type: 'string',
              style: 'citation-custom'
            }).trim()
            
            expect(out).toBe(testOutput.csl.title)
          })
        })
      })
    })
    
    describe('CSL-JSON', function () {
      describe('plain text', function () {
        const out = test.get({format: 'string'})
        
        it('outputs correctly', function () {
          expect(JSON.parse(out)).toEqual(testInput.csl.simple)
        })
      })
      
      describe('object', function () {
        const out = test.get()
        
        it('outputs correctly', function () {
          expect(out).toEqual(testInput.csl.simple)
        })
      })
    })
    
    describe('BibTeX', function () {
      describe('plain text', function () {
        const out = test.get({
          format: 'string',
          type: 'string',
          style: 'bibtex'
        }).trim().replace(/\s+/g, ' ')
        
        it('outputs correctly', function () {
          expect(out).toBe(testOutput.bibtex.plain)
        })
      })
      
      describe('JSON', function () {
        const out = test.get({
          style: 'bibtex'
        })
        
        it('outputs correctly', function () {
          expect(out).toEqual(testOutput.bibtex.json)
        })
      })
    })
  })
})