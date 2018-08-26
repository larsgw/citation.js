/**
 * Convert date to CSL date. Supported formats:
 *
 *   * Epoch time (in number form)
 *   * `YYYY-MM-DD`
 *   * `[+-]YYYYYY[Y...]-MM-DD`
 *   * `[DDD, ]DD MMM YYYY`
 *   * `M[M]/D[D]/YY[YY]       (1)`
 *   * `D[D] M[M] Y[Y...]      (2, 1)`
 *   * `[-]Y[Y...] M[M] D[D]   (2)`
 *   * `D[D] MMM Y[Y...]       (2)`
 *   * `[-]Y[Y...] MMM D[D]    (2)`
 *   * `M[M] [-]Y[Y...]        (3, 5)`
 *   * `[-]Y[Y...] M[M]        (3, 4, 5)`
 *   * `MMM [-]Y[Y...]         (3, 5)`
 *   * `[-]Y[Y...] MMM         (3, 5)`
 *   * `[-]Y[Y...]             (5)`
 *
 * Generally, formats support trailing parts, which are disregarded.
 *
 *   1. When the former of these formats overlaps with the latter, the
 *      former is preferred
 *   2. " ", ".", "-" and "/" are all supported as separator
 *   3. Any sequence of non-alphanumerical characters are supported as
 *      separator
 *   4. This format is only assumed if the year is bigger than the month
 *   5. This format doesn't support trailing parts
 *
 * @access protected
 * @memberof Cite.parse
 *
 * @param {Number|String} value - date in supported format, see above
 *
 * @return {Object} Object with property "date-parts" with the value [[ YYYY, MM, DD ]]
 * @return {Object} If unparsable, object with property "raw" with the inputted value
 */
import {parse as parseDate} from '@citation-js/date'

export const scope = '@date'
export const types = '@date'
export {
  parseDate as parse,
  parseDate as default
}
