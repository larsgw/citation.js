/**
 * @namespace input
 * @memberof Cite.parse
 *
 * @borrows Cite.parse.data as data
 * @borrows Cite.parse.dataAsync as dataAsync
 * @borrows Cite.parse.type as type
 *
 * @borrows Cite.parse.input.async.data as dataAsync
 * @borrows Cite.parse.input.async.chain as chainAsync
 * @borrows Cite.parse.input.async.chainLink as chainLinkAsync
 */

export {default as type} from './type'
export {default as data} from './data'
export {default as chain} from './chain'
export {default as chainLink} from './chainLink'

export * from './async/'
