import getLabel from '../get/label'

/**
  * Sort the datasets alphabetically, on basis of it's BibTeX label
  * 
  * @method sort
  * @memberof Cite
  * @this Cite
  * 
  * @param {Boolean} nolog - Hide this call from the log (i.e. when used internally)
  * 
  * @return {Cite} The updated parent object
  */
var sort = function ( nolog ) {
  if( !nolog )
    this._log.push( { name: 'sort', version: this.currentVersion() + 1, arguments: [] } )
  
  this.data = this.data.sort( function ( a, b ) {
    var labela = getLabel( a )
      , labelb = getLabel( b )
    
    return labela != labelb ?
      ( labela > labelb ? 1 : -1 )
    : 0 ;
  } )
  
  return this
}

export { sort }