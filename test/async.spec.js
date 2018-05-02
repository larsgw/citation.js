/* eslint-env mocha */

import expect from 'expect.js'
import Cite from './citation'
import input from './input/parse'
import output from './output/parse'

describe('.async()', () => {
  const noGraph = {generateGraph: false}

  context('with callback', async () => {
    it('works', () => {
      return new Promise(resolve => {
        Cite.async(input.wd.id, noGraph, instance => {
          expect(instance).to.be.a(Cite)
          expect(instance.data).to.eql(output.wd.simple)
          resolve()
        })
      })
    })
  })

  context('as promise', () => {
    it('works', async () => {
      const instance = await Cite.async(input.wd.id, noGraph)
      expect(instance).to.be.a(Cite)
      expect(instance.data).to.eql(output.wd.simple)
    })
  })
})
