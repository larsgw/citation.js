/**
 * @namespace register
 * @memberof Cite.CSL
 */

/**
 * Internal custom templates register.
 *
 * @access private
 * @constant templates
 * @memberof Cite.CSL.register
 * @default {}
 */
const templates = {}

/**
 * Add a template to the register.
 *
 * @access public
 * @method addTemplate
 * @memberof Cite.CSL.register
 *
 * @param {String} templateName - template name (used as 'citation-NAME' in Cite#get() style options)
 * @param {String} template - CSL template string
 */
const addTemplate = (templateName, template) => { templates[templateName] = template }

/**
 * Get a template from the register.
 *
 * @access protected
 * @method getTemplate
 * @memberof Cite.CSL.register
 *
 * @param {String} templateName - template name (used as 'citation-NAME' in Cite#get() style options)
 * @return {String} CSL template string
 */
const getTemplate = templateName => templates[templateName]

/**
 * Check if the register has a template (identified by name).
 *
 * @access protected
 * @method hasTemplate
 * @memberof Cite.CSL.register
 *
 * @param {String} templateName - template name (used as 'citation-NAME' in Cite#get() style options)
 * @return {Boolean} true if register has template
 */
const hasTemplate = templateName => templates.hasOwnProperty(templateName)

/**
 * Internal custom locales register.
 *
 * @access private
 * @constant locales
 * @memberof Cite.CSL.register
 * @default {}
 */
const locales = {}

/**
 * Add a locale to the register.
 *
 * @access public
 * @method addLocale
 * @memberof Cite.CSL.register
 *
 * @param {String} localeName - locale name (used as lang in Cite#get() options)
 * @param {String} locale - CSL locale string
 */
const addLocale = (localeName, locale) => { locales[localeName] = locale }

/**
 * Get a locale from the register.
 *
 * @access protected
 * @method getLocale
 * @memberof Cite.CSL.register
 *
 * @param {String} localeName - locale name (used as lang in Cite#get() options)
 * @return {String} CSL locale string
 */
const getLocale = localeName => locales[localeName]

/**
 * Check if the register has a locale (identified by name).
 *
 * @access protected
 * @method hasLocale
 * @memberof Cite.CSL.register
 *
 * @param {String} localeName - locale name (used as lang in Cite#get() options)
 * @return {Boolean} true if register has locale
 */
const hasLocale = localeName => locales.hasOwnProperty(localeName)

export {addTemplate, addLocale, getTemplate, getLocale, hasTemplate, hasLocale}
