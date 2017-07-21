/**
 * Object containing a list of CrossRef types and it's corresponding name as specified by the docs
 *
 * From deep-review: https://github.com/greenelab/deep-review/blob/b2f21a8cf0f5657e464871a985b1b2889ea48ce9/build/citations.py#L128-L147
 *   Licensed CC BY 4.0 + CC0 1.0
 *
 * @access private
 * @constant varDoiTypes
 * @default
 */
const varDoiTypes = {
  'journal-article': 'article-journal',
  'book-chapter': 'chapter',
  'posted-content': 'manuscript',
  'proceedings-article': 'paper-conference'
}

/**
 * Get CSL type from CrossRef type
 *
 * @access protected
 * @method fetchDoiType
 *
 * @param {String} value - Input CrossRef type
 *
 * @return {String} Output CSL type
 */
const fetchDoiType = value => varDoiTypes[value] || value

export default fetchDoiType
