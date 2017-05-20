const Cite = require('../lib/index')
const parse = Cite.parse
const input = Cite.parse.input

console.log(parse.bibtxt.text(`[Fau86]  
    
  author:    J.W. Goethe
  title:     Faust. Der Tragödie Erster Teil
  

  publisher: Reclam
  year:      1986
  address:   Stuttgart
`))