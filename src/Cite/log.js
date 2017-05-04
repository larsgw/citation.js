import Cite from './index'

/**
  * 
  * @method currentVersion
  * @memberof Cite
  * @this Cite
  * 
  * @return {Number} The latest version of the object
  */
var currentVersion = function () {
  var version = 0
  
  for ( var i = 0; i < this._log.length; i++ ) {
    if ( this._log[ i ].version > version )
      version = this._log[ i ].version
  }
  
  return version
}

/**
  * Does not change the current object.
  * 
  * @method retrieveVersion
  * @memberof Cite
  * @this Cite
  * 
  * @param {Number} versnum - The number of the version you want to retrieve. Illegel numbers: numbers under zero, floats, numbers above the current version of the object.
  * @param {Boolean} nolog - Hide this call from the log (i.e. when used internally)
  * 
  * @return {Cite} The version of the object with the version number passed. `undefined` if an illegal number is passed.
  */
var retrieveVersion = function ( versnum, nolog ) {
  if( !nolog )
    this._log.push( { name: 'retrieveVersion', arguments: [ versnum ] } )
  
  if ( versnum >= 0 && versnum <= this.currentVersion() ) {
    var obj = new Cite( this._log[ 0 ].arguments[ 0 ], this._log[ 0 ].arguments[ 1 ] ),
        arr = []
    
    for ( var i = 0; i < this._log.length; i++ ) {
      if ( this._log[ i ].version )
        arr.push( this._log[ i ] )
    }
    
    for ( var k = 1; k <= versnum; k++ ) {
      obj[ arr[ k ].name ].apply( obj, arr[ k ].arguments || [] )
    }
    
    return obj
  } else return undefined;
}

/**
  * Does not change the current object. Undoes the last edit made.
  * 
  * @method undo
  * @memberof Cite
  * @this Cite
  * 
  * @param {Boolean} nolog - Hide this call from the log (i.e. when used internally)
  * 
  * @return {Cite} The last version of the object. `undefined` if used on first version.
  */
var undo = function ( nolog ) {
  if( !nolog )
    this._log.push( { name: 'undo' } )
  
  return this.retrieveVersion( this.currentVersion() - 1, true )
}

export { currentVersion, retrieveVersion, undo }