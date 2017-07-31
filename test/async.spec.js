/* global context, describe, it */

import expect from 'expect.js'
import Cite from './cite'
import {input, output} from './input.json'

describe('.async()', () => {
  context('with callback', () => {
    it('works', () => {
      return new Promise(resolve => {
        Cite.async(input.wd.url, data => {
          expect(data).to.be.a(Cite)
          expect(data.data[0].wikiId).to.be(output.wd.id)
          resolve()
        })
      })
    })

    it('works with options', () => {
      return new Promise(resolve => {
        Cite.async([], {}, data => {
          expect(data).to.be.a(Cite)
          expect(data.data.length).to.be(0)
          resolve()
        })
      })
    })
  })

  context('as promise', () => {
    it('works', async () => {
      const data = await Cite.async(input.wd.url)
      expect(data).to.be.a(Cite)
      expect(data.data[0].wikiId).to.be(output.wd.id)
    })

    it('works with options', async () => {
      const data = await Cite.async([], {})
      expect(data).to.be.a(Cite)
      expect(data.data.length).to.be(0)
    })
  })
})
