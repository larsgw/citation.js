const array = 'abcde'.split``

const getProm = (v, i) => new Promise(res => setTimeout(() => res(v + '+'), 1e3 - (i * 1e2)))

Promise.all([
  (async function () {
    const a = []
    const s = Date.now()
    for (let i = 0; i < array.length; i++) {
      a.push(await getProm(array[i], i))
    }
    const e = Date.now()
    
    return {a, t: e - s}
  })(),
  (async function () {
    const s = Date.now()
    const a = await Promise.all(array.map(getProm))
    const e = Date.now()
    
    return {a, t: e - s}
  })()
]).then(([a, b]) => console.log(`
orig: ${array}

for
  elapsed: ${a.t}
  new: ${a.a}

map
  elapsed: ${b.t}
  new: ${b.a}
`))