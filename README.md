# Description

Citation.js converts all your BibTeX and JSON to BibTeX, JSON and HTML in your very own webbrowser! You can now even implement in to your own page.

# Use

Use the object constructor `Cite()` with the parameters as listed [below](#input). Then just call one of the function, for example get, to get your [output](#output).

<a name="input">
## Input
</a>

**When making the `Cite()` object:**

1. In the first parameter you pass the string, object or array of objects you want to convert. For the properties supported in the objects, see [JSON](#json).
2. In the second parameter you pass an object containing options with the following properties. These are the default options for when [getting data](Cite.html#.get).
  1. `type`: The output datatype: `"html"`, `"string"` or `"json"` (default)
  2. `format`: The output format: `"html"`, `"string"` or `"json"` (default). This way, you can get a HTML or JSON string instead of an actual object.
  3. `style`: The output style. See [Output](#output). `"Vancouver"` is default
  4. `lan`: The language. Currently Dutch (`"nl"`) and English (`"en"`, default) are supported

**Example:**

    var citation = Cite(
      {}, //data
      {
        type:"string",
        format:"json"
      }
    );

Now, when you use the `.get()` function, the default options will get you the data as a JSON string.

<a name="bibtex">
### BibTeX
</a>

In the BibTeX-part of the input you simply pass a string of a citation in BibTeX-format. For the BibTeX documentation, see [wikipedia](https://en.wikipedia.org/wiki/BibTeX#Bibliographic_information_file).

<a name="json">
### JSON
</a>

In the JSON-part of the input you pass an object or the string of an object. Your JSON may be "relaxed"; You don't need to worry about double quotes around every single key. Properties are specified below. Note that not all properties are supported for all types.

* `type`: the type of citation. May be `"book"`, `"chapter"`, `"article"`, `"e-article"`, `"e-publication"`, `"paper"` or `"newspaper-article"`
* `author`: the author(s), listed in an array. Names don't have to be formatted
* `editor`: the editor(s), listed in an array. Names don't have to be formatted
* `chapterauthor`: the authors of the chapter. Names don't have to be formatted
* `title`: the title of the book, publication, etc
* `chapter`: the title or number of the chapter
* `pages`: the pagenumbers of the citated fragment, listed as integers in an array
* `year`: year of publication, as an integer
* `pubdate`: object containin following properties, concerning the date of publication
  * `from`: date of publication, format dd-mm-yyyy, listed as integers in an array
* `date`: object containin following properties, concerning the date of citation
  * `from`: date of citation or date of start of conference, format dd-mm-yyyy, listed as integers in an array
  * `to`: date of end of conference, format dd-mm-yyyy, listed as integers in an array
* `url`: URL of publication
* `conference`: object containin following properties, concerning the conference where the thing was presented
  * `name`: name of conference
  * `org`: name of organisation where conference was held
  * `place`: place where conference was held
  * `country`: country where conference was held
  * for the date of the conference, use `date` (outside of the `con` object)
* `journal`: journal the thing is published in
* `volume`: the volume of the journal the thing is published in
* `number`: the number of the journal the thing is published in 
* `place`: the place(s) of publication, listed in an array
* `publisher`: the publisher as a string

### Other input types

Other supported input types are:
* A jQuery or HTML element, where it will use the text content of the elements
* Wikidata JSON, where it will try to get as much relevant properties as possible
* An URL, where it wil use the fetched data. This uses an synchronous request.

<a name="output">
## Ouput
</a>

When using the `.get()` function, your output depends on the options you pass. If you don't pass any options, the values you passed as default are used. When you haven't passed those, standard options are passed.

**`Type` and `Format`**

* JSON: Outputs an object with properties as specified in [Input/JSON](#json). Specify as `"JSON"`. Supports all types. Languages are ignored.
* String: Outputs a single string with your formatted citation, in the styles below.
* HTML: Outputs a set of DOM nodes, containing your formatted citation, in the styles below.

**`Styles`**

* Vancouver style; specify as `"Vancouver"`. Supports all languages and all types except `"paper"`. Instead of `"paper"`, use `"article"`.
* APA style; specify as `"APA"`. Supports all types and languages.
* BibTeX: specify as `"BibTeX"`. Supports most types and has no languages. If a type is not supported, `misc` is used.
* JSON style: specify as `"JSON"`. Gets you a HMTL-formatted JSON string.

# Dependencies

* None!