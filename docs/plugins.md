Plugins to Citation.js are slowly getting support too. You can either publish this code as a module like this:

_module.js_

```js
const Cite = require('citation-js')

// Some plugin code as described below
Cite.parse.add(...)
Cite.CSL.register.addTemplate(...)
Cite.CSL.register.addLocale(...)
```

_your-file.js_

```js
require('module.js')
const Cite = require('citation-js')

Cite // Should be pre-loaded with plugins
```

---

Or just include the plugin code somewhere in one of your files:

_your-file.js_

```js
const Cite = require('citation-js')

// Some plugin code as described below
Cite.parse.add(...)
Cite.CSL.register.addTemplate(...)
Cite.CSL.register.addLocale(...)

Cite // Should have plugins
```

## Supported plugins

Currently, Citation.js supports the following plugins:

  * {@tutorial input_plugins} add to or change the parsing process
  * {@tutorial output_plugins} extend CSL with different locales and templates
