var testCases = [
	{
		"type": "import",
		"input": "@article{Adams2001,\nauthor = {Adams, Nancy K and DeSilva, Shanaka L and Self, Steven and Salas, Guido and Schubring, Steven and Permenter, Jason L and Arbesman, Kendra},\nfile = {:Users/heatherwright/Documents/Scientific Papers/Adams\\_Huaynaputina.pdf:pdf;::},\njournal = {Bulletin of Volcanology},\nkeywords = {Vulcanian eruptions,breadcrust,plinian},\npages = {493--518},\ntitle = {{The physical volcanology of the 1600 eruption of Huaynaputina, southern Peru}},\nvolume = {62},\nyear = {2001}\n}",
		"items": [
			{
				"itemType": "journalArticle",
				"creators": [
					{
						"firstName": "Nancy K",
						"lastName": "Adams",
						"creatorType": "author"
					},
					{
						"firstName": "Shanaka L",
						"lastName": "DeSilva",
						"creatorType": "author"
					},
					{
						"firstName": "Steven",
						"lastName": "Self",
						"creatorType": "author"
					},
					{
						"firstName": "Guido",
						"lastName": "Salas",
						"creatorType": "author"
					},
					{
						"firstName": "Steven",
						"lastName": "Schubring",
						"creatorType": "author"
					},
					{
						"firstName": "Jason L",
						"lastName": "Permenter",
						"creatorType": "author"
					},
					{
						"firstName": "Kendra",
						"lastName": "Arbesman",
						"creatorType": "author"
					}
				],
				"notes": [],
				"tags": [
					"Vulcanian eruptions",
					"breadcrust",
					"plinian"
				],
				"seeAlso": [],
				"attachments": [
					{
						"path": "Users/heatherwright/Documents/Scientific Papers/Adams_Huaynaputina.pdf",
						"mimeType": "application/pdf",
						"title": "Attachment"
					}
				],
				"itemID": "Adams2001",
				"publicationTitle": "Bulletin of Volcanology",
				"pages": "493–518",
				"title": "The physical volcanology of the 1600 eruption of Huaynaputina, southern Peru",
				"volume": "62",
				"date": "2001"
			}
		]
	},
	{
		"type": "import",
		"input": "@Book{abramowitz+stegun,\n author    = \"Milton {Abramowitz} and Irene A. {Stegun}\",\n title     = \"Handbook of Mathematical Functions with\n              Formulas, Graphs, and Mathematical Tables\",\n publisher = \"Dover\",\n year      =  1964,\n address   = \"New York\",\n edition   = \"ninth Dover printing, tenth GPO printing\"\n}\n\n@Book{Torre2008,\n author    = \"Joe Torre and Tom Verducci\",\n publisher = \"Doubleday\",\n title     = \"The Yankee Years\",\n year      =  2008,\n isbn      = \"0385527403\"\n}\n",
		"items": [
			{
				"itemType": "book",
				"creators": [
					{
						"firstName": "Milton",
						"lastName": "Abramowitz",
						"creatorType": "author"
					},
					{
						"firstName": "Irene A.",
						"lastName": "Stegun",
						"creatorType": "author"
					}
				],
				"notes": [],
				"tags": [],
				"seeAlso": [],
				"attachments": [],
				"itemID": "abramowitz+stegun",
				"place": "New York",
				"edition": "ninth Dover printing, tenth GPO printing",
				"title": "Handbook of Mathematical Functions with Formulas, Graphs, and Mathematical Tables",
				"publisher": "Dover",
				"date": "1964"
			},
			{
				"itemType": "book",
				"creators": [
					{
						"firstName": "Joe",
						"lastName": "Torre",
						"creatorType": "author"
					},
					{
						"firstName": "Tom",
						"lastName": "Verducci",
						"creatorType": "author"
					}
				],
				"notes": [],
				"tags": [],
				"seeAlso": [],
				"attachments": [],
				"itemID": "Torre2008",
				"ISBN": "0385527403",
				"publisher": "Doubleday",
				"title": "The Yankee Years",
				"date": "2008"
			}
		]
	},
	{
		"type": "import",
		"input": "@INPROCEEDINGS {author:06,\n title    = {Some publication title},\n author   = {First Author and Second Author},\n crossref = {conference:06},\n pages    = {330—331},\n}\n@PROCEEDINGS {conference:06,\n editor    = {First Editor and Second Editor},\n title     = {Proceedings of the Xth Conference on XYZ},\n booktitle = {Proceedings of the Xth Conference on XYZ},\n year      = {2006},\n month     = oct,\n}",
		"items": [
			{
				"itemType": "conferencePaper",
				"creators": [
					{
						"firstName": "First",
						"lastName": "Author",
						"creatorType": "author"
					},
					{
						"firstName": "Second",
						"lastName": "Author",
						"creatorType": "author"
					}
				],
				"notes": [],
				"tags": [],
				"seeAlso": [],
				"attachments": [],
				"itemID": "author:06",
				"title": "Some publication title",
				"pages": "330—331"
			},
			{
				"itemType": "book",
				"creators": [
					{
						"firstName": "First",
						"lastName": "Editor",
						"creatorType": "editor"
					},
					{
						"firstName": "Second",
						"lastName": "Editor",
						"creatorType": "editor"
					}
				],
				"notes": [],
				"tags": [],
				"seeAlso": [],
				"attachments": [],
				"itemID": "conference:06",
				"title": "Proceedings of the Xth Conference on XYZ",
				"date": "October 2006"
			}
		]
	},
	{
		"type": "import",
		"input": "@Book{hicks2001,\n author    = \"von Hicks, III, Michael\",\n title     = \"Design of a Carbon Fiber Composite Grid Structure for the GLAST\n              Spacecraft Using a Novel Manufacturing Technique\",\n publisher = \"Stanford Press\",\n year      =  2001,\n address   = \"Palo Alto\",\n edition   = \"1st,\",\n isbn      = \"0-69-697269-4\"\n}",
		"items": [
			{
				"itemType": "book",
				"creators": [
					{
						"firstName": "Michael, III",
						"lastName": "von Hicks",
						"creatorType": "author"
					}
				],
				"notes": [],
				"tags": [],
				"seeAlso": [],
				"attachments": [],
				"itemID": "hicks2001",
				"place": "Palo Alto",
				"edition": "1st,",
				"ISBN": "0-69-697269-4",
				"title": "Design of a Carbon Fiber Composite Grid Structure for the GLAST Spacecraft Using a Novel Manufacturing Technique",
				"publisher": "Stanford Press",
				"date": "2001"
			}
		]
	},
	{
		"type": "import",
		"input": "@article{Oliveira_2009, title={USGS monitoring ecological impacts}, volume={107}, number={29}, journal={Oil & Gas Journal}, author={Oliveira, A}, year={2009}, pages={29}}",
		"items": [
			{
				"itemType": "journalArticle",
				"creators": [
					{
						"firstName": "A",
						"lastName": "Oliveira",
						"creatorType": "author"
					}
				],
				"notes": [],
				"tags": [],
				"seeAlso": [],
				"attachments": [],
				"itemID": "Oliveira_2009",
				"issue": "29",
				"title": "USGS monitoring ecological impacts",
				"volume": "107",
				"publicationTitle": "Oil & Gas Journal",
				"date": "2009",
				"pages": "29"
			}
		]
	},
	{
		"type": "import",
		"input": "@article{test-ticket1661,\ntitle={non-braking space: ~; accented characters: {\\~n} and \\~{n}; tilde operator: \\~},\n} ",
		"items": [
			{
				"itemType": "journalArticle",
				"creators": [],
				"notes": [],
				"tags": [],
				"seeAlso": [],
				"attachments": [],
				"itemID": "test-ticket1661",
				"title": "non-braking space: ; accented characters: ñ and ñ; tilde operator: ∼"
			}
		]
	},
	{
		"type": "import",
		"input": "@ARTICLE{Frit2,\n  author = {Fritz, U. and Corti, C. and P\\\"{a}ckert, M.},\n  title = {Test of markupconversion: Italics, bold, superscript, subscript, and small caps: Mitochondrial DNA$_{\\textrm{2}}$ sequences suggest unexpected phylogenetic position\n        of Corso-Sardinian grass snakes (\\textit{Natrix cetti}) and \\textbf{do not}\n        support their \\textsc{species status}, with notes on phylogeography and subspecies\n        delineation of grass snakes.},\n  journal = {Actes du $4^{\\textrm{ème}}$ Congrès Français d'Acoustique},\n  year = {2012},\n  volume = {12},\n  pages = {71-80},\n  doi = {10.1007/s13127-011-0069-8}\n}\n",
		"items": [
			{
				"itemType": "journalArticle",
				"creators": [
					{
						"firstName": "U.",
						"lastName": "Fritz",
						"creatorType": "author"
					},
					{
						"firstName": "C.",
						"lastName": "Corti",
						"creatorType": "author"
					},
					{
						"firstName": "M.",
						"lastName": "Päckert",
						"creatorType": "author"
					}
				],
				"notes": [],
				"tags": [],
				"seeAlso": [],
				"attachments": [],
				"itemID": "Frit2",
				"DOI": "10.1007/s13127-011-0069-8",
				"title": "Test of markupconversion: Italics, bold, superscript, subscript, and small caps: Mitochondrial DNA<sub>2</sub>$ sequences suggest unexpected phylogenetic position of Corso-Sardinian grass snakes (<i>Natrix cetti</i>) and <b>do not</b> support their <span style=\"small-caps\">species status</span>, with notes on phylogeography and subspecies delineation of grass snakes.",
				"publicationTitle": "Actes du <sup>ème</sup>$ Congrès Français d'Acoustique",
				"date": "2012",
				"volume": "12",
				"pages": "71-80"
			}
		]
	},
	{
		"type": "import",
		"input": "@misc{american_rights_at_work_public_2012,\n    title = {Public Service Research Foundation},\n\turl = {http://www.americanrightsatwork.org/blogcategory-275/},\n\turldate = {2012-07-27},\n\tauthor = {American Rights at Work},\n\tyear = {2012},\n\thowpublished = {http://www.americanrightsatwork.org/blogcategory-275/},\n}",
		"items": [
			{
				"itemType": "book",
				"creators": [
					{
						"firstName": "American Rights at",
						"lastName": "Work",
						"creatorType": "author"
					}
				],
				"notes": [],
				"tags": [],
				"seeAlso": [],
				"attachments": [],
				"itemID": "american_rights_at_work_public_2012",
				"url": "http://www.americanrightsatwork.org/blogcategory-275/",
				"title": "Public Service Research Foundation",
				"date": "2012"
			}
		]
	},
	{
		"type": "import",
		"input": "@article{zoteroFilePath1,\n    title = {Zotero: single attachment},\n    file = {Test:files/47/test2.pdf:application/pdf}\n}\n\n@article{zoteroFilePaths2,\n    title = {Zotero: multiple attachments},\n    file = {Test1:files/47/test2.pdf:application/pdf;Test2:files/46/test2-min.pdf:application/pdf}\n}\n\n@article{zoteroFilePaths3,\n    title = {Zotero: linked attachments (old)},\n    file = {Test:E:\\some\\random\\folder\\test2.pdf:application/pdf}\n}\n\n@article{zoteroFilePaths4,\n    title = {Zotero: linked attachments},\n    file = {Test:E\\:\\\\some\\\\random\\\\folder\\\\test2.pdf:application/pdf}\n}\n\n@article{mendeleyFilePaths1,\n    title = {Mendeley: single attachment},\n    url = {https://forums.zotero.org/discussion/28347/unable-to-get-pdfs-stored-on-computer-into-zotero-standalone/},\n    file = {:C$\\backslash$:/Users/somewhere/AppData/Local/Mendeley Ltd./Mendeley Desktop/Downloaded/test.pdf:pdf}\n}\n\n@article{mendeleyFilePaths2,\ntitle = {Mendeley: escaped characters}\nfile = {:C$\\backslash$:/some/path/,.$\\backslash$;'[]\\{\\}`-=\\~{}!@\\#\\$\\%\\^{}\\&()\\_+.pdf:pdf},\n}\n\n@article{citaviFilePaths1,\n    title = {Citavi: single attachment},\n    url = {https://forums.zotero.org/discussion/35909/bibtex-import-from-citavi-including-pdf-attachments/},\n    file = {Test:Q\\:\\\\some\\\\random\\\\folder\\\\test.pdf:pdf}\n}",
		"items": [
			{
				"itemType": "journalArticle",
				"creators": [],
				"notes": [],
				"tags": [],
				"seeAlso": [],
				"attachments": [
					{
						"title": "Test",
						"path": "files/47/test2.pdf",
						"mimeType": "application/pdf"
					}
				],
				"itemID": "zoteroFilePath1",
				"title": "Zotero: single attachment"
			},
			{
				"itemType": "journalArticle",
				"creators": [],
				"notes": [],
				"tags": [],
				"seeAlso": [],
				"attachments": [
					{
						"title": "Test1",
						"path": "files/47/test2.pdf",
						"mimeType": "application/pdf"
					},
					{
						"title": "Test2",
						"path": "files/46/test2-min.pdf",
						"mimeType": "application/pdf"
					}
				],
				"itemID": "zoteroFilePaths2",
				"title": "Zotero: multiple attachments"
			},
			{
				"itemType": "journalArticle",
				"creators": [],
				"notes": [],
				"tags": [],
				"seeAlso": [],
				"attachments": [],
				"itemID": "zoteroFilePaths3",
				"title": "Zotero: linked attachments (old)"
			},
			{
				"itemType": "journalArticle",
				"creators": [],
				"notes": [],
				"tags": [],
				"seeAlso": [],
				"attachments": [
					{
						"title": "Test",
						"path": "E:\\some\\random\\folder\\test2.pdf",
						"mimeType": "application/pdf"
					}
				],
				"itemID": "zoteroFilePaths4",
				"title": "Zotero: linked attachments"
			},
			{
				"itemType": "journalArticle",
				"creators": [],
				"notes": [],
				"tags": [],
				"seeAlso": [],
				"attachments": [
					{
						"title": "Attachment",
						"path": "C:/Users/somewhere/AppData/Local/Mendeley Ltd./Mendeley Desktop/Downloaded/test.pdf",
						"mimeType": "application/pdf"
					}
				],
				"itemID": "mendeleyFilePaths1",
				"url": "https://forums.zotero.org/discussion/28347/unable-to-get-pdfs-stored-on-computer-into-zotero-standalone/",
				"title": "Mendeley: single attachment"
			},
			{
				"itemType": "journalArticle",
				"creators": [],
				"notes": [],
				"tags": [],
				"seeAlso": [],
				"attachments": [
					{
						"title": "Attachment",
						"path": "C:/some/path/,.;'[]{}`-=~!@#$%^&()_+.pdf",
						"mimeType": "application/pdf"
					}
				],
				"itemID": "mendeleyFilePaths2",
				"title": "Mendeley: escaped characters"
			},
			{
				"itemType": "journalArticle",
				"creators": [],
				"notes": [],
				"tags": [],
				"seeAlso": [],
				"attachments": [
					{
						"title": "Test",
						"path": "Q:\\some\\random\\folder\\test.pdf",
						"mimeType": "application/pdf"
					}
				],
				"itemID": "citaviFilePaths1",
				"url": "https://forums.zotero.org/discussion/35909/bibtex-import-from-citavi-including-pdf-attachments/",
				"title": "Citavi: single attachment"
			}
		]
	},
	{
		"type": "import",
		"input": "@article{BibTeXEscapeTest1,\n    title = {\textbackslash\textbackslash\\{\\}: \\\\{}}\n}",
		"items": [
			{
				"itemType": "journalArticle",
				"creators": [],
				"notes": [],
				"tags": [],
				"seeAlso": [],
				"attachments": [],
				"itemID": "BibTeXEscapeTest1",
				"title": "extbackslash extbackslash{}: {"
			}
		]
	},
	{
		"type": "import",
		"input": "@article{sasson_increasing_2013,\n    title = {Increasing cardiopulmonary resuscitation provision in communities with low bystander cardiopulmonary resuscitation rates: a science advisory from the American Heart Association for healthcare providers, policymakers, public health departments, and community leaders},\n\tvolume = {127},\n\tissn = {1524-4539},\n\tshorttitle = {Increasing cardiopulmonary resuscitation provision in communities with low bystander cardiopulmonary resuscitation rates},\n\tdoi = {10.1161/CIR.0b013e318288b4dd},\n\tlanguage = {eng},\n\tnumber = {12},\n\tjournal = {Circulation},\n\tauthor = {Sasson, Comilla and Meischke, Hendrika and Abella, Benjamin S and Berg, Robert A and Bobrow, Bentley J and Chan, Paul S and Root, Elisabeth Dowling and Heisler, Michele and Levy, Jerrold H and Link, Mark and Masoudi, Frederick and Ong, Marcus and Sayre, Michael R and Rumsfeld, John S and Rea, Thomas D and {American Heart Association Council on Quality of Care and Outcomes Research} and {Emergency Cardiovascular Care Committee} and {Council on Cardiopulmonary, Critical Care, Perioperative and Resuscitation} and {Council on Clinical Cardiology} and {Council on Cardiovascular Surgery and Anesthesia}},\n\tmonth = mar,\n\tyear = {2013},\n\tnote = {{PMID:} 23439512},\n\tkeywords = {Administrative Personnel, American Heart Association, Cardiopulmonary Resuscitation, Community Health Services, Health Personnel, Heart Arrest, Humans, Leadership, Public Health, United States},\n\tpages = {1342--1350}\n}",
		"items": [
			{
				"itemType": "journalArticle",
				"creators": [
					{
						"firstName": "Comilla",
						"lastName": "Sasson",
						"creatorType": "author"
					},
					{
						"firstName": "Hendrika",
						"lastName": "Meischke",
						"creatorType": "author"
					},
					{
						"firstName": "Benjamin S",
						"lastName": "Abella",
						"creatorType": "author"
					},
					{
						"firstName": "Robert A",
						"lastName": "Berg",
						"creatorType": "author"
					},
					{
						"firstName": "Bentley J",
						"lastName": "Bobrow",
						"creatorType": "author"
					},
					{
						"firstName": "Paul S",
						"lastName": "Chan",
						"creatorType": "author"
					},
					{
						"firstName": "Elisabeth Dowling",
						"lastName": "Root",
						"creatorType": "author"
					},
					{
						"firstName": "Michele",
						"lastName": "Heisler",
						"creatorType": "author"
					},
					{
						"firstName": "Jerrold H",
						"lastName": "Levy",
						"creatorType": "author"
					},
					{
						"firstName": "Mark",
						"lastName": "Link",
						"creatorType": "author"
					},
					{
						"firstName": "Frederick",
						"lastName": "Masoudi",
						"creatorType": "author"
					},
					{
						"firstName": "Marcus",
						"lastName": "Ong",
						"creatorType": "author"
					},
					{
						"firstName": "Michael R",
						"lastName": "Sayre",
						"creatorType": "author"
					},
					{
						"firstName": "John S",
						"lastName": "Rumsfeld",
						"creatorType": "author"
					},
					{
						"firstName": "Thomas D",
						"lastName": "Rea",
						"creatorType": "author"
					},
					{
						"lastName": "American Heart Association Council on Quality of Care and Outcomes Research",
						"creatorType": "author",
						"fieldMode": 1
					},
					{
						"lastName": "Emergency Cardiovascular Care Committee",
						"creatorType": "author",
						"fieldMode": 1
					},
					{
						"lastName": "Council on Cardiopulmonary, Critical Care, Perioperative and Resuscitation",
						"creatorType": "author",
						"fieldMode": 1
					},
					{
						"lastName": "Council on Clinical Cardiology",
						"creatorType": "author",
						"fieldMode": 1
					},
					{
						"lastName": "Council on Cardiovascular Surgery and Anesthesia",
						"creatorType": "author",
						"fieldMode": 1
					}
				],
				"notes": [],
				"tags": [
					"Administrative Personnel",
					"American Heart Association",
					"Cardiopulmonary Resuscitation",
					"Community Health Services",
					"Health Personnel",
					"Heart Arrest",
					"Humans",
					"Leadership",
					"Public Health",
					"United States"
				],
				"seeAlso": [],
				"attachments": [],
				"itemID": "sasson_increasing_2013",
				"ISSN": "1524-4539",
				"shortTitle": "Increasing cardiopulmonary resuscitation provision in communities with low bystander cardiopulmonary resuscitation rates",
				"DOI": "10.1161/CIR.0b013e318288b4dd",
				"language": "eng",
				"issue": "12",
				"extra": "PMID: 23439512",
				"title": "Increasing cardiopulmonary resuscitation provision in communities with low bystander cardiopulmonary resuscitation rates: a science advisory from the American Heart Association for healthcare providers, policymakers, public health departments, and community leaders",
				"volume": "127",
				"publicationTitle": "Circulation",
				"date": "March 2013",
				"pages": "1342–1350"
			}
		]
	},
	{
		"type": "import",
		"input": "@article{smith_testing_????,\n    title = {Testing identifier import},\n\tauthor = {Smith, John},\n\tlccn = {L123456},\n\tmrnumber = {MR123456},\n\tzmnumber = {ZM123456},\n\tpmid = {P123456},\n\tpmcid = {PMC123456},\n\teprinttype = {arxiv},\n\teprint = {AX123456}\n}",
		"items": [
			{
				"itemType": "journalArticle",
				"creators": [
					{
						"firstName": "John",
						"lastName": "Smith",
						"creatorType": "author"
					}
				],
				"notes": [],
				"tags": [],
				"seeAlso": [],
				"attachments": [],
				"itemID": "smith_testing_????",
				"extra": "LCCN: L123456\nMR: MR123456\nZbl: ZM123456\nPMID: P123456\nPMCID: PMC123456\narXiv: AX123456",
				"title": "Testing identifier import"
			}
		]
	}
]