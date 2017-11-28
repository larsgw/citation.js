To format data in a `Cite` instance, you use the `Cite#get()` method. First, let's create the `Cite` instance itself:

```js
const example = new Cite('10.5281/zenodo.1005176')
```

Now, we can choose different {@tutorial output_options} as a parameter to `Cite#get()`. Some examples:


  * Get output in default format: CSL-JSON as a JS object

```js
> example.get()

< [{title: 'Citation.js', ...}]
```

  * Get output in HTML in APA-style

```js
> example.get({
    format: 'string', // Otherwise it tries to return a DOM element
    type: 'html',
    style: 'citation-apa'
  })

< <div class="csl-bib-body">
    <div data-csl-entry-id="https://doi.org/10.5281/zenodo.1005176" class="csl-entry">Willighagen, L., &#38; Willighagen, E. (2017, October 9). Larsgw/Citation.Js V0.3.3. Zenodo. https://doi.org/10.5281/zenodo.1005176</div>
  </div>
```

  * Get output as a plain text BibTeX entry

```js
> example.get({
    type: 'string',
    style: 'bibtex'
  })

< @article{Willighagen2017Larsgw/Citation.Js,
    author={Willighagen, Lars and Willighagen, Egon},
    doi={10.5281/zenodo.1005176},
    pages={--},
    publisher={Zenodo},
    title={{Larsgw/Citation.Js V0.3.3}},
    year=2017,
  }
```

  * Get output as RTF in APA-style

```js
// First, a different source, because the other source doesn't show much text styling
const example = new Cite('Q30000000')

> example.get({
    type: 'rtf',
    style: 'citation-apa'
  })

< {\rtf Miccadei, S., De Leo, R., Zammarchi, E., Natali, P. G., & Civitareale, D. (2002). The Synergistic Activity of Thyroid Transcription Factor 1 and Pax 8 Relies on the Promoter/Enhancer Interplay. {\i{}Molecular Endocrinology}, {\i{}16}(4), 837\uc0\u8211{}846. https://doi.org/10.1210/MEND.16.4.0808}
```
