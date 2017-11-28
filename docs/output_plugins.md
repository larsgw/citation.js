Output plugins are currently limited to adding different CSL templates and locales.

## CSL Plugins

CSL Plugins rely on extending the citeproc engine, currently only by feeding it different templates and locales.

### CSL Template Plugins

Different [CSL Templates](https://github.com/citation-style-language/styles) can be registered like this:

```js
const templateName = 'custom'
const template = '<?xml version="1.0" encoding="utf-8"?><style ...>...</style>' // The actual XML file

Cite.CSL.register.addTemplate(templateName, template)

const data = new Cite(...)
data.get({
  format: 'string',
  type: 'html',
  style: 'citation-' + templateName,
  lang: 'en-US'
})
```

### CSL Locale Plugins

Replace `templateName` with the template name you want to use.

Different [CSL Locales](https://github.com/citation-style-language/locales) can be registered like this:

```js
const language = 'en-GB'
const locale = '<?xml version="1.0" encoding="utf-8"?><locale ...>...</locale>' // The actual XML file

Cite.CSL.register.addLocale(language, locale)

const data = new Cite(...)
data.get({
  format: 'string',
  type: 'html',
  style: 'citation-apa',
  lang: language
})
```
