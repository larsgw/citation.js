The dictionaries are a number of strings describing how to format and indent output in different markup languages. Built-in are the HTML and plain text formatting dictionaries. They can be added like this:

```js
Cite.plugins.dict.add(lang, {
  key: ['start', 'end']
})
```

Or with General Plugins, `ref` being the plugin name:

```js
Cite.plugins.add(ref, {
  dict: {
    lang: {
      key: ['start', 'end']
    }
  }
})
```

### Options

| Option | Description |
|--------|-------------|
| `lang` | Language    |
| `key`  | See below   |

#### `lang`

Markup language.

#### `key`

A number of keys describing certain formatting things. Standard are:

| Key                     | Describing      | HTML Example         |
|-------------------------|-----------------|----------------------|
| `bibliographyContainer` | Main container  | `<div>` and `</div>` |
| `entry`                 | Entry container | `<div>` and `</div>` |
| `list`                  | List container  | `<ul>` and `</ul>`   |
| `listItem`              | Item container  | `<li>` and `</li>`   |

Lists being lists of props for example, in the case of JSON.
