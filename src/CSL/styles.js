import { getTemplate as getCustomStyle, hasTemplate as hasCustomStyle } from './register'

/**
 * Object containing CSL templates
 *
 * Templates from the [CSL Project](http://citationstyles.org/)<br>
 * [REPO](https://github.com/citation-style-language/styles), [LICENSE](https://creativecommons.org/licenses/by-sa/3.0/)
 *
 * Accesed 10/22/2016
 *
 * @access private
 * @constant varCSLStyles
 * @default
 */
import varCSLStyles from './styles.json'

/**
 * Retrieve CSL style
 *
 * @access protected
 * @method fetchCSLStyle
 *
 * @param {String} [style="apa"] - style name
 *
 * @return {String} CSL style
 */
const fetchCSLStyle = style => hasCustomStyle(style)
  ? getCustomStyle(style)
  : varCSLStyles.hasOwnProperty(style)
  ? varCSLStyles[style]
  : varCSLStyles['apa']

export default fetchCSLStyle
