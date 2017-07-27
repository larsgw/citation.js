/**
 * Internal custom templates register.
 *
 * @access private
 * @constant templates
 * @default {}
 */
const templates = {}

/**
 * Add a template to the register.
 *
 * @access public
 * @method addTemplate
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
 * @default {}
 */
const locales = {}

/**
 * Add a locale to the register.
 *
 * @access public
 * @method addLocale
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
 *
 * @param {String} localeName - locale name (used as lang in Cite#get() options)
 * @return {Boolean} true if register has locale
 */
const hasLocale = localeName => locales.hasOwnProperty(localeName)

export {addTemplate, addLocale, getTemplate, getLocale, hasTemplate, hasLocale}
