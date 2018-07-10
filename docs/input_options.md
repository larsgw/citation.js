Input options are the ones below.

| Name             | Default value | Description                                                            |
|------------------|---------------|------------------------------------------------------------------------|
| `output`         | {}            | Default {@tutorial output_options}, used when calling `Cite#get()`     |
| `maxChainLength` | 10            | Max number of parsing iterations used when parsing                     |
| `generateGraph`  | true          | Generate a parsing chain graph. Holds info on how an entry was parsed. |
| `forceType`      | undefined     | Force parsing as a certain {@tutorial input_types}, if the type checking methods fail (or are slow, and you already know what the input type is, etc.) |
