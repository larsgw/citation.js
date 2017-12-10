/**
 * Retrieve CSL item callback function
 *
 * @access protected
 * @method item
 * @memberof Cite.CSL
 *
 * @param {Array<CSL>} data - CSL array
 *
 * @return {Cite.CSL~retrieveItem} Code to retreive item
 */
const fetchCSLItemCallback = data => id => data.find(entry => entry.id === id)

export default fetchCSLItemCallback
