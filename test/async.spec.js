/* global context, describe, it */

import expect from 'expect.js'
import Cite from './cite'
import {input, output} from './input.json'

describe('.async()', () => {
  const noGraph = {generateGraph: false}

  context('with callback', () => {
    it('works', () => {
      return new Promise(resolve => {
        Cite.async(input.wd.url, noGraph, data => {
          expect(data).to.be.a(Cite)
          expect(data.data).to.eql(output.wd.simple)
          resolve()
        })
      })
    })
  })

  context('as promise', () => {
    it('works', async () => {
      const data = await Cite.async(input.wd.url, noGraph)
      expect(data).to.be.a(Cite)
      expect(data.data).to.eql(output.wd.simple)
    })
  })
})
