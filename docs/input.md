With Citation.js, you can parse input in a number of different ways:

1. You can pass the data to the `Cite` constructor {@tutorial cite_constructor}
2. You can create a `Cite` instance asynchronously with `Cite.async()` {@tutorial cite_constructor}
3. You can pass the data to the `Cite#add()` and `Cite#set()` methods, returning the modified `Cite` instance. See {@tutorial cite_data}
4. You can pass the data to `Cite.parse()` and `Cite.parseAsync()`, returning CSL-JSON. See {@tutorial input_parsing}
