When you've created a `Cite` instance, you can amend the contents with the following methods. These methods can be chained:

```js
const example = new Cite({id: 1})

example                // [{id: 1}]
    .add({id: 2})      // [{id: 1}, {id: 2}]
    .set({id: 3})      // [{id: 3}]
    .reset()           // []
```

## `Cite#add()`

To add one or multiple entries to your `Cite` instance, pass the data to `Cite#add()`:

```js
const example = new Cite({id: 1})
example.add({id: 2})

> example.data
< [{id: 1}, {id: 2}]
```

There is also an async variant, `Cite#addAsync()`, which does the same, but returns a `Promise`. This is recommended when fetching data from an API.

## `Cite#set()`

To replace all entries of your `Cite` instance, pass the data to `Cite#set()`:

```js
const example = new Cite({id: 1})
example.set({id: 2})

> example.data
< [{id: 2}]
```

There is also an async variant, `Cite#setAsync()`, which does the same, but returns a `Promise`. This is recommended when fetching data from an API.

## `Cite#reset()`

To remove all entries from your `Cite` instance, call `Cite#reset()`:

```js
const example = new Cite({id: 1})
example.reset()

> example.data
< []
```
