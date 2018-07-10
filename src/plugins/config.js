/**
 * @namespace config
 * @memberof Cite.plugins
 */

const configs = {}

/**
 * @access public
 * @method add
 * @memberof Cite.plugins.config
 * @param {Cite.plugins~pluginRef} ref - plugin reference/name
 * @param {Object} config
 */
export const add = (ref, config) => { configs[ref] = config }
/**
 * @access public
 * @method get
 * @memberof Cite.plugins.config
 * @param {Cite.plugins~pluginRef} ref - plugin reference/name
 * @return {Object} config
 */
export const get = (ref) => configs[ref]
/**
 * @access public
 * @method remove
 * @memberof Cite.plugins.config
 * @param {Cite.plugins~pluginRef} ref - plugin reference/name
 */
export const remove = (ref) => { delete configs[ref] }
