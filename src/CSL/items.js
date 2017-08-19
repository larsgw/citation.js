/**
 * Retrieve CSL item callback function
 *
 * @access protected
 * @method fetchCSLItemCallback
 *
 * @param {Array<CSL>} data - CSL array
 *
 * @return {Cite~retrieveItem} Code to retreive item
 */
const fetchCSLItemCallback = data => id => data.find(entry => entry.id === id)

export default fetchCSLItemCallback
