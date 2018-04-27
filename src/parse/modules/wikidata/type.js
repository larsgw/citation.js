/**
 * @module input/wikidata
 */

/**
 * Object containing a list of Wikidata Instances and it's corresponding name as specified by the docs
 *
 * @access private
 * @constant varWikidataTypes
 * @default
 */
const varWikidataTypes = {
  Q49848: 'article',
  Q191067: 'article',
  Q13442814: 'article-journal',
  Q18918145: 'article-journal',
  Q38926: 'article-newspaper',
  Q5707594: 'article-newspaper',
  Q30070590: 'article-magazine',
  Q686822: 'bill',
  Q3331189: 'book',
  Q571: 'book',
  Q1555508: 'broadcast',
  Q15416: 'broadcast',
  Q1980247: 'chapter',
  Q1172284: 'dataset',
  Q10389811: 'entry',
  Q19389637: 'entry',
  Q17329259: 'entry-encyclopedia',
  Q30070753: 'figure',
  Q1027879: 'graphic',
  Q4502142: 'graphic',
  Q478798: 'graphic',
  Q838948: 'graphic',
  Q178651: 'interview',
  Q49371: 'legislation',
  Q820655: 'legislation',
  Q2334719: 'legal_case',
  Q87167: 'manuscript',
  Q4006: 'map',
  Q11424: 'motion_picture',
  Q30070675: 'motion_picture',
  Q187947: 'musical_score',
  Q18536349: 'pamphlet',
  Q190399: 'pamphlet',
  Q26973022: 'paper-conference',
  Q23927052: 'paper-conference',
  Q253623: 'patent',
  Q30070565: 'personal_communication',
  Q30070439: 'personal_communication',
  Q133492: 'personal_communication',
  Q628523: 'personal_communication',
  Q7216866: 'post',
  Q17928402: 'post-blog',
  Q10870555: 'report',
  Q265158: 'review',
  Q637866: 'review-book',
  Q7366: 'song',
  Q3741908: 'song',
  Q30070318: 'song',
  Q24634210: 'song',
  Q861911: 'speech',
  Q1266946: 'thesis',
  Q187685: 'thesis',
  Q131569: 'treaty',
  Q36774: 'webpage'
}

/**
 * Get CSL type from Wikidata type (P31)
 *
 * @access protected
 * @method fetchWikidataType
 *
 * @param {String} value - Input P31 Wikidata ID
 *
 * @return {String} Output CSL type
 */
const fetchWikidataType = value => varWikidataTypes[value]

export {
  fetchWikidataType as parse,
  fetchWikidataType as default
}
