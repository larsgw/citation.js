CSL Plugins rely on extending the [citeproc engine](https://github.com/Juris-M/citeproc-js/), which does all the formatting, currently only by feeding it different templates and locales.

### CSL Template Plugins

Different [CSL Templates](https://github.com/citation-style-language/styles) can be registered like this:

```js
let templateName = 'custom'
let template = '<?xml version="1.0" encoding="utf-8"?><style ...>...</style>' // The actual XML file

let config = Cite.plugins.output.config.get('csl')
config.templates.add(templateName, template)

let example = new Cite(...)
example.format('bibliography', {
  format: 'html',
  template: templateName,
  lang: 'en-US'
})
```

### CSL Locale Plugins

Replace `templateName` with the template name you want to use.

Different [CSL Locales](https://github.com/citation-style-language/locales) can be registered like this:

```js
let language = 'en-GB'
let locale = '<?xml version="1.0" encoding="utf-8"?><locale ...>...</locale>' // The actual XML file

let config = Cite.plugins.output.config.get('csl')
config.locales.add(language, locale)

let example = new Cite(...)
example.format('bibliography', {
  format: 'html',
  template: 'apa',
  lang: language
})
```
