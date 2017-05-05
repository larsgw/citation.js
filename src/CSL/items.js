/**
 * Retrieve CSL item callback function
 *
 * @access private
 * @method fetchCSLItemCallback
 *
 * @param {CSL[]} data - CSL array
 *
 * @return {Cite~retrieveItem} Code to retreive item
 */
const fetchCSLItemCallback = function (data) {
  var _data = data

  return (id) => _data.find(entry => entry.id === id)
}

export default fetchCSLItemCallback
