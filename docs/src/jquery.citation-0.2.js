/** 
 * @file jquery.Citation-0.2.js
 * 
 * @description jquery.Citation-0.2.js
 * 
 * @projectname Citationjs
 * 
 * @author Lars Willighagen
 * @version 0.2
 * @license
 * Copyright (c) 2015-2016 Lars Willighagen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * [jQuery](https://jquery.com/) element
 * 
 * @class jQuery
 */

/**
 * Add new fields of a certain type based on which ones are filled in
 * 
 * @method CJSMultipleInput
 * @memberof jQuery
 * @this jQuery
 * 
 * @return {jQuery} this
 */
jQuery.fn.CJSMultipleInput = function () {
  this.each( function () {
    
    var elm = $(this)
    
    elm.addClass( 'cjs-multipleinput' )
    
    elm.focus( function () {
      
      var $this = $( this )
        , $last = $this.parent().children( 'input' ).last()
      
      if ( $this.is( $last ) )
        $this.after( $this.clone( true ).val( '' ) )
      
    } )
    
    elm.blur( function () {
      
      var $this = $( this )
        , $last = $this.parent().children( 'input' ).last()
      
      if ( !( $this.is( $last ) || ( $this.is( $last.prev() ) && $this.val() !== '' ) ) )
        $last.remove()
      
    } )
    
  } )
  
  return this
}

/**
 * Set values of a set of MultipleInput inputs
 * 
 * @method CJSMultipleInputVal
 * @memberof jQuery
 * @this jQuery
 * 
 * @param {String[]} array - List of values to set
 * 
 * @return {jQuery} this
 */
jQuery.fn.CJSMultipleInputVal = function ( array ) {
  var array = JSON.parse( JSON.stringify( array ) )
    , elm = this.siblings( 'input.cjs-multipleinput' ).andSelf().first()
  
  elm.val( array.shift() )
  
  $.each( array, function ( i, val ) {
    elm
      .clone( true )
      .val( val )
      .insertAfter( elm )
  } )
  
  return elm
}

/**
 * Clear a set of MultipleInput inputs
 * 
 * @method CJSMultipleInputClear
 * @memberof jQuery
 * @this jQuery
 * 
 * @return {jQuery} this
 */
jQuery.fn.CJSMultipleInputClear = function () {
  var sib = this.siblings( 'input.cjs-multipleinput' ).andSelf()
  
  sib.not( ':first' ).remove()
  
  return this
}

/**
 * Get text only level deep from a set
 * 
 * @method CJSShallowText
 * @memberof jQuery
 * @this jQuery
 * 
 * @param {...String} except - jQuery selector of elements to except
 * 
 * @return {String} text
 */
jQuery.fn.CJSShallowText = function () {
  var str = ''
    , elms= this
    , except= Array.prototype.slice.apply( arguments ).join( ',' )
  
  elms.each( function () {
    str += $( this )
    .clone()
      .children()
        .not( except )
          .remove()
        .end()
      .end()
      .text()
    str += '\n'
  } )
  
  return str
}

var jQueryCite = (function(){
  
  /**
   * Get CSL from name
   * 
   * @access private
   * @method parseName
   * 
   * @param {String} str - string 
   * 
   * @return {Object} The CSL name object
   */
  var parseName = function ( str ) {
    if ( str.indexOf( ', ' ) > -1 )
      var arr = str.split( ', ' ).reverse()
    else
      var arr = str.match( /^(?:((?:[A-Z][a-z]*[ -])*[A-Z][a-z]*) )?(?:((?:[a-z]+ )*[a-z]+) )?((?:[A-Z][a-z]*[ -])*[A-Z][a-z]*)$/ ) || []
    
    var obj = {}
    
    if ( arr.length ) {
      if ( arr[ 1 ] )
        obj.given = arr[ 1 ]
      if ( arr[ 2 ] )
        obj[ 'non-dropping-particle' ] = arr[ 2 ]
      if ( arr[ 3 ])
        obj.family = arr[ 3 ]
    }
    else
      obj.family = str
    
    return obj
  }
  
  /**
   * Get CSL from date
   * 
   * @access private
   * @method parseDate
   * 
   * @param {String} value - value
   * 
   * @return {Object} The CSL name object
   */
  var parseDate = function ( value ) {
    var rValue
      , date = new Date( value )
    
    rValue = [
      date.getFullYear()
    , date.getMonth   () + 1
    , date.getDate    ()
    ]
    
    return [ { 'date-parts': rValue } ]
  }
  
  /**
   * Get name from CSL
   * 
   * @access private
   * @method getName
   * 
   * @param {Object} obj - CSL input
   * 
   * @return {String} Full name
   */
  var getName = function ( obj ) {
    var arr = [ 'dropping-particle', 'given', 'suffix', 'non-dropping-particle', 'family' ]
      , res = ''
    
    for ( var i = 0; i < arr.length; i++ ) {
      if ( obj.hasOwnProperty( arr[ i ] ) )
        res += obj[ arr[ i ] ] + ' '
    }
    
    if ( res.length )
      res = res.slice( 0, -1 )
    else if ( res.hasOwnProperty( 'literal' ) )
      res = obj.literal
    
    return res
  }
  
  /**
   * Get date from CSL
   * 
   * @access private
   * @method getDate
   * 
   * @param {Object} obj - CSL input
   * 
   * @return {String} Full date
   */
  var getDate = function ( obj ) {
    return obj['date-parts'].map( function ( v ) {
      return ( '0' + v ).slice()
    } ).join( '-' )
  }
  
  /**
   * Get value from DOM Elements
   * 
   * @access private
   * @method getDOMValue
   * 
   * @param {Object} v - DOM Element
   * 
   * @return {String} value
   */
  var getDOMValue = function ( v ) { return $( v ).val() }
  
  /**
   * Check to see if value is empty
   * 
   * @access private
   * @method checkEmptyValue
   * 
   * @param {String} v - value
   * 
   * @return {Boolean} value is not empty
   */
  var checkEmptyValue = function ( v ) { return !!v }
  
  /**
   * Get a list of values from a set of jQuery elements
   * 
   * @access private
   * @method getjQueryValList
   * 
   * @param {jQuery} i - jQuery element
   * 
   * @return {String[]} list of values
   */
  var getjQueryValList = function ( i ) { return i.toArray().map( getDOMValue ).filter( checkEmptyValue ) }
  
  /**
   * Parse a set of jQuery name fields
   * 
   * @access private
   * @method parseNameField
   * 
   * @param {jQuery} i - jQuery element
   * 
   * @return {Object[]} list of CSL names
   */
  var parseNameField = function ( i ) { return getjQueryValList( i ).map( parseName ) }
  
  /**
   * Parse a set of jQuery page fields
   * 
   * @access private
   * @method parsePageField
   * 
   * @param {jQuery} i - jQuery element
   * 
   * @return {String[]} list of page numbers
   */
  var parsePageField = function ( i ) { return getjQueryValList( i ).slice( 0, 2 ).join( '-' ) }
  
  /**
   * Parse a jQuery date field
   * 
   * @access private
   * @method parseDateField
   * 
   * @param {jQuery} i - jQuery element
   * 
   * @return {Object} CSL date
   */
  var parseDateField = function ( i ) { return parseDate( i.val() ) }
  
  /**
   * Get a list of names from CSL names
   * 
   * @access private
   * @method getNameField
   * 
   * @param {Object[]} v - list of CSL names
   * 
   * @return {String[]} full names
   */
  var getNameField  = function ( v ) { return v.map( getName ) }
  
  /**
   * Get a date from CSL date
   * 
   * @access private
   * @method getDateField
   * 
   * @param {Object[]} v - CSL dates
   * 
   * @return {String[]} full date
   */
  var getDateField = function ( v ) { return v.map( getDate ) }
  
  /**
   * @access private
   * @method getPageField
   * 
   * @param {String} v - CSL page range
   * 
   * @return {String[]} array with page numbers
   */
  var getPageField = function ( v ) { return v.split( '-' ) }
  
  /**
   * Object containing information on what fields will be extracted, and sometimes if special action should be taken, to get CSl from the input form
   * 
   * @access private
   * @constant varFormFields
   * @default
   */
  var varFormFields = [
    { propName: 'type' }
  
  , { propName: 'title' }
  , { propName: 'container-title' }
  
  , { propName: 'author', prepFunc: parseNameField }
  , { propName: 'container-author', prepFunc: parseNameField }
  , { propName: 'editor', prepFunc: parseNameField }
  
  , { propName: 'edition' }
  , { propName: 'issue' }
  , { propName: 'volume' }
  , { propName: 'page', prepFunc: parsePageField }
  
  , { propName: 'event' }
  , { propName: 'publisher' }
  , { propName: 'publisher-place' }
  
  , { propName: 'URL' }
  , { propName: 'DOI' }
  , { propName: 'ISBN' }
  , { propName: 'ISSN' }
  
  , { propName: 'issued', prepFunc: parseDateField }
  , { propName: 'accessed', prepFunc: parseDateField }
  ]
  
  /**
   * Object containing information for special actions necessary to load CSL in the input form
   * 
   * @access private
   * @constant varReverseFormFields
   * @default
   */
  var varReverseFormFields = {
    author  : { prepFunc: getNameField }
  , 'container-author': { prepFunc: getNameField }
  , editor  : { prepFunc: getNameField }
    
  , page    : { prepFunc: getPageField, pair: true }
  
  , issued  : { prepFunc: getDateField }
  , accessed: { prepFunc: getDateField }
  }
  
  /**
   * Set cookie
   * 
   * @access private
   * @method doSetCookie
   * 
   * @param {String} cookie - cookie string
   */
  var doSetCookie = function ( cookie ) { document.cookie = cookie }
  
  /**
   * Make object from certain cookies
   * 
   * @access private
   * @method fetchCookies
   * 
   * @param {String} prefix - cookie prefix
   * @param {String[]} name - cookies to extract
   * 
   * @return {Object} cookies
   */
  var fetchCookies = function ( prefix, name ) {
    var cookies = document.cookie.split( ';' ).map( parseCookie )
      , expect  = name.slice().map( function ( v ) { return prefix + v } )
      , prefixRgx = new RegExp( '^' + prefix )
      , json    = {}
    
    for ( var i = 0; i < cookies.length; i++ ) {
      var pair = cookies[ i ]
        , key  = pair[ 0 ]
        , val  = pair[ 1 ]
      
      if ( key && expect.indexOf( key ) > -1 )
        json[ key.replace( prefixRgx, '' ) ] = JSON.parse( val )
    }
    
    return json
  }
  
  /**
   * Make key/value pair from cookie string
   * 
   * @access private
   * @method parseCookie
   * 
   * @param {String} v - cookie string
   * 
   * @return {String[]} key/value pair
   */
  var parseCookie = function ( v ) {
    var pair = v.split( '=' )
      , key  = decodeURIComponent( pair[ 0 ].trim() )
      , val  = pair[ 1 ] ? decodeURIComponent( pair[ 1 ].trim() ) : ''
    
    return [ key, val ]
  }
  
  /**
   * Download Blob file
   * 
   * @access private
   * @method doDownloadFile
   * 
   * @param {Blob} blob - file contents
   * @param {String} file - file name
   */
  var doDownloadFile = function ( blob, file ) {
    if ( navigator.msSaveOrOpenBlob )
      navigator.msSaveOrOpenBlob( blob, file )
    else {
      var url  = URL.createObjectURL( blob )
        , link = document.createElement( 'A' )
      
      link.href     = url
      link.download = file
      
      document.body.appendChild( link )
      link.click()
      document.body.removeChild( link )
    }
  }
  
  /**
   * Get file mime
   * 
   * @access private
   * @method getFileMime
   * 
   * @param {Object} opt - original options
   * @param {Object} gopt - new options
   * 
   * @return {String} mime type string
   */
  var getFileMime = function ( opt, gopt ) {
    var mime = 'text/plain'
    
    if ( opt.style.match( /^citation-/ ) ) {
      if ( opt.type === 'html' )
        mime = 'application/msword'
      else
        mime = 'text/plain'
    }
    
    if ( opt.style === 'bibtex' )
      mime = 'application/x-bibtex',
      gopt.type = gopt.format = 'string'
    
    if ( opt.style === 'csl' )
      mime = 'application/json',
      gopt.type = gopt.format = 'string'
    
    return mime
  }
  
  /**
   * Get file extension
   * 
   * @access private
   * @method getFileExtension
   * 
   * @param {String} mime - mime type
   * 
   * @return {String} file extension
   */
  var getFileExtension = function ( mime ) {
    var extensions = {
      'application/msword'  : 'docx'
    , 'text/plain'          : 'txt'
    , 'application/json'    : 'json'
    , 'application/x-bibtex': 'bib'
    }
    
    return extensions[ mime ]
  }
  
  /**
   * Get file name
   * 
   * @access private
   * @method getFileName
   * 
   * @param {String} mime - mime type
   * 
   * @return {String} file name
   */
  var getFileName = function ( mime ) {
    var date = new Date()
      , dstr = [ date.getFullYear(), date.getMonth  (), date.getDate   () ].join( '-' )
      , tstr = [ date.getHours   (), date.getMinutes(), date.getSeconds() ].join( '' )
      , name = [ 'Bibliography', dstr, tstr ].join( '_' )
      , ext  = getFileExtension( mime )
      , file = [ name, ext ].join( '.' )
    
    return file
  }
  
  /**
   * Get Blob file
   * 
   * @access private
   * @method getFile
   * 
   * @param {String} str - file contents
   * @param {String} mime - mime type
   * 
   * @return {Blob} file
   */
  var getFile = function ( str, mime ) {
    var blob = new Blob( [ '\ufeff', str ], { type: mime } )
    return blob
  }
  
  //BEGIN Event listeners
  /**
   * Wrapper for e.preventDefault
   * 
   * @access private
   * @method doPreventDefault
   * 
   * @param {Object} e - jQuery Event
   */
  var doPreventDefault = function ( e ) {
    e.preventDefault()
  }
  
  /**
   * Wrapper for jQueryCite.emptyForm
   * 
   * @access private
   * @method doResetDraftFromFields
   */
  var doResetDraftFromFields = function () {
    this.emptyForm()
  }
  
  /**
   * Wrapper for jQueryCite.updateFields
   * 
   * @access private
   * @method doUpdateFields
   */
  var doUpdateFields = function () {
    this.updateFields()
  }
  
  /**
   * Update draft with data from form
   * 
   * @access private
   * @method doUpdateDraftFromFields
   */
  var doUpdateDraftFromFields = function () {
    this._draft.set( this.getFormData(), true )
    this.updateDraft()
  }
  
  /**
   * Submit current draft to selection
   * 
   * @access private
   * @method doSubmitDraftFromFields
   * 
   * @param {Object} e - jQuery Event
   * @param {jQueryCite~addCallback} addCallback - callback for item submit
   */
  var doSubmitDraftFromFields = function ( e, addCallback ) {
    if ( /^temp_id_\d+$/.test( this._draft.data[ 0 ].id ) )
      delete this._draft.data[ 0 ].id
    
    if ( $( e.target ).is( '[data-cjs-update-data-index]' ) ) {
      var index = parseInt( $( e.target ).attr( 'data-cjs-update-data-index' ) )
      
      this._data.data[ index ] = this._draft.data[ 0 ]
      this._data.sort()
    } else
      this._data
        .add( this._draft.data )
        .sort()
    
    addCallback.call( undefined, this )
    
    this.updateOut()
  }
  
  /**
   * Get import file contents
   * 
   * @access private
   * @method fetchFile
   * 
   * @param {Object} e - jQuery Event
   */
  var fetchFile = function ( e ) {
    var self = this
      , elm  = e.target
      , files = elm.files
      , array = []
      , error = false
    
    $( e.target ).siblings( '.cjs-import-name' ).val(
      Array.prototype.slice.call( files ).map(
        function ( v ) {
          return v.name
        }
      ).join( '; ' )
    )
    
    var nextFile = function ( i ) {
      var file = files[ i ]
        , reader = new FileReader()
      
      reader.onload = function () {
        array.push( this.result )
        if ( files[ ++i ] )
          nextFile( i )
        else {
          self._draft.set( array )
          self.updateDraft()
          return false
        }
      }
      
      reader.readAsText( file )
    }
    
    nextFile( 0 )
  }
  
  /**
   * Download data from outform
   * 
   * @access private
   * @method doDownloadData
   */
  var doDownloadData = function () {
    var self = this
      , opt  = self._data._options
      , gopt = Object.assign( {}, opt )
      
      , mime = getFileMime( opt, gopt )
      , file = getFileName( mime )
      , str  = self._data.get( gopt, true )
      , blob = getFile( str, mime )
    
    doDownloadFile( blob, file )
  }
  
  /**
   * Copy data from outform
   * 
   * @access private
   * @method doCopyData
   */
  var doCopyData = function () {
    var $tmp = $( '<textarea>' )
      , text = this._form.out.find( '.cjs-output .csl-entry' ).CJSShallowText( 'i', 'a', 'b' )
    
    var fb = function () {
      $tmp.remove()
      window.prompt( 'Please copy the following text:', text )
    }
    
    $tmp
      .val( text )
      .appendTo( 'body' )
      .select()
    
    try {
      
      if ( document.execCommand( 'copy' ) )
        $tmp.remove()
      else
        fb()
      
    } catch ( e ) {
      fb()
    }
  }
  //END
  
  /**
   * @callback eventCallback
   */
  
  /**
   * @callback eventCallbackWrapper
   * @param {Object} jQuery event
   */
  
  /**
   * Set event handeler with context
   * 
   * @access private
   * @method fetchEventHandler
   * 
   * @param {eventCallback}
   * @param {jQueryCite} self - context
   * @param {String[]|Number[]|Object[]} args - argument list
   * 
   * @return {eventCallbackWrapper} callback
   */
  var fetchEventHandler = function ( f, self, args ) {
    var args = args
    
    if ( args instanceof Array )
      args.unshift( null )
    else
      args = []
    
    var cb = function ( e ) {
      args[ 0 ] = e
      
      f.apply( self, args )
    }
    
    return cb
  }
  
  /**
   * @callback jQueryCite~addCallback
   * @param {jQueryCite} self
   */
  
  /**
   * 
   * @author Lars Willighagen
   * @version 0.1
   * @license
   * Copyright (c) 2016 Lars Willighagen  
   * 
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:  
   * 
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.  
   * 
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   * 
   * @constructor jQueryCite
   * 
   * @description Create a `jQueryCite` object
   * 
   * @param {Object} options - options for the forms
   * @param {Object} options.defaultOptions - default output options. See [Cite.options()](Cite.html#.options)
   * @param {String} options.inputForm - HTML for the input form (see [input form docs](index.html#jquery.form.input))
   * @param {String} options.outputForm - HTML for the output form (see [output form docs](index.html#jquery.form.output))
   * @param {Boolean} options.saveInCookies
   * @param {jQueryCite~addCallback} options.add - callback for when data is added to output
   */
  function jQueryCite ( options ) {
    
    // Making it Scope-Safe
    if ( !( this instanceof jQueryCite ) )
      return new jQueryCite( options )
    
    /**
     * The options for the form
     * 
     * @type Object
     */
    this._options = Object.assign( {
      inputForm : ''
      //BEGIN FORM
      + '<section class="cjs-piece cjs-input"> <fieldset> <select data-cjs-field="type"> <option value="book">Book</option> <option value="incollection">Chapter</option> <option value="paper-conference">Paper</option> <option value="article-journal">Article</option> <option value="article-magazine">Magazine article</option> <option value="article-newspaper">Newspaper article</option> <option value="webpage">Webpage</option> </select> </fieldset> <fieldset data-cjs-field-type="incollection"> <label> <input data-cjs-field="title" type="text"></input> <legend>Chapter title</legend> </label> </fieldset> <fieldset data-cjs-field-type="incollection"> <label> <input data-cjs-field="container-title" type="text"></input> <legend>Book title</legend> </label> </fieldset> <fieldset data-cjs-field-type="book paper-conference article-journal article-magazine article-newspaper webpage"> <label> <input data-cjs-field="title" type="text"></input> <legend>Title</legend> </label> </fieldset> <fieldset data-cjs-field-type="article-journal"> <label> <input data-cjs-field="container-title" type="text"></input> <legend>Journal</legend> </label> </fieldset> <fieldset data-cjs-field-type="article-magazine"> <label> <input data-cjs-field="container-title" type="text"></input> <legend>Magazine</legend> </label> </fieldset> <fieldset data-cjs-field-type="article-newspaper"> <label> <input data-cjs-field="container-title" type="text"></input> <legend>Newspaper</legend> </label> </fieldset> <fieldset data-cjs-field-type="webpage"> <label> <input data-cjs-field="container-title" type="text"></input> <legend>Website</legend> </label> </fieldset> <fieldset data-cjs-field-type="incollection"> <label> <input data-cjs-field="author" type="text"></input> <legend>Chapter author</legend> </label> </fieldset> '
      + '<fieldset data-cjs-field-type="incollection"> <label> <input data-cjs-field="container-author" type="text"></input> <legend>Author</legend> </label> </fieldset> <fieldset data-cjs-field-type="book paper-conference article-journal article-magazine article-newspaper webpage"> <label> <input data-cjs-field="author" type="text"></input> <legend>Author</legend> </label> </fieldset> <fieldset data-cjs-field-type="book incollection paper-conference article-journal article-magazine article-newspaper"> <label> <input data-cjs-field="editor" type="text"></input> <legend>Editor</legend> </label> </fieldset> <fieldset data-cjs-field-type="book incollection article-newspaper"> <label> <input data-cjs-field="edition" type="number" min="1"></input> <legend>Edition</legend> </label> </fieldset> <fieldset data-cjs-field-type="paper-conference article-journal"> <label> <input data-cjs-field="issue" type="number" min="1"></input> <legend>Issue</legend> </label> </fieldset> <fieldset data-cjs-field-type="book incollection paper-conference article-journal article-magazine"> <label> <input data-cjs-field="volume" type="number" min="1"></input> <legend>Volume</legend> </label> </fieldset> <fieldset data-cjs-field-type="incollection article-journal article-magazine article-newspaper"> <label> <input data-cjs-field="page" type="number" min="1"></input> <input data-cjs-field="page" type="number" min="1"></input> <legend>Pages</legend> </label> </fieldset> <fieldset data-cjs-field-type="paper-conference"> <label> <input data-cjs-field="event" type="text"></input> <legend>Conference</legend> </label> </fieldset> <fieldset data-cjs-field-type="book incollection paper-conference"> <label> <input data-cjs-field="publisher" type="text"></input> <legend>Publisher</legend> </label> </fieldset> '
      + '<fieldset data-cjs-field-type="book incollection article-newspaper"> <label> <input data-cjs-field="publisher-place" type="text"></input> <legend>Place</legend> </label> </fieldset> <fieldset> <label> <input data-cjs-field="URL" type="url"></input> <legend>URL</legend> </label> </fieldset> <fieldset data-cjs-field-type="paper-conference article-journal"> <label> <input data-cjs-field="DOI" type="text"></input> <legend>DOI</legend> </label> </fieldset> <fieldset data-cjs-field-type="book incollection paper-conference"> <label> <input data-cjs-field="ISBN" type="text"></input> <legend>ISBN</legend> </label> </fieldset> <fieldset data-cjs-field-type="article-journal article-magazine article-newspaper"> <label> <input data-cjs-field="ISSN" type="text"></input> <legend>ISSN</legend> </label> </fieldset> <fieldset> <label> <input data-cjs-field="issued" type="date"></input> <legend>Issued</legend> </label> </fieldset> <fieldset> <label> <input data-cjs-field="accessed" type="date"></input> <legend>Accessed</legend> </label> </fieldset> </section>'
      //END
      //BEGIN IMPORT
      + '<section class="cjs-piece cjs-import"> <h2>Import</h2> <fieldset> <label> <input class="cjs-import-name" type="text" readonly required> <legend>File</legend> <i class="material-icons">attach_file</i> <input class="cjs-import-file" type="file" multiple> </label> </fieldset> </section>'
      //END
      //BEGIN PREVIEW
      + '<section class="cjs-piece cjs-preview"> <h2>Preview</h2> <div class="cjs-draft"></div><input class="cjs-add" type="submit" value="Add"/> <input class="cjs-delete" type="reset" value="Delete"/></section>'
      //END
      ,
      outputForm: '<section class="cjs-piece cjs-settings"><form class="cjs-opt"><fieldset><select class="cjs-type"><option value="html">Normal</option><option value="string">Plain text</option></select></fieldset><fieldset><select class="cjs-style"><optgroup label="Formatted"><option value="citation-apa">APA</option><option value="citation-vancouver">Vancouver</option><option value="citation-harvard1">Harvard</option></optgroup><option value="bibtex">BibTeX</option><option value="csl">JSON</option></select></fieldset><fieldset><select class="cjs-lan"><option value="en-US">English</option><option value="es-ES">Spanish</option><option value="du-DU">German</option><option value="fr-FR">French</option><option value="nl-NL">Dutch</option></select></fieldset></form></section><section class="cjs-piece"><div class="cjs-output"></div><form class="cjs-output-edit"></form></section><section class="cjs-piece cjs-export"><h2>Export</h2><form><button type="submit" class="cjs-export-copy">Copy</button> <button type="submit" class="cjs-export-save">Download</button></form></section>',
      add  : function ( self ) {},
      defaultOptions: {
        format: 'string',
        type  : 'html',
        style : 'citation-apa',
        lang  : 'en-US'
      },
      saveInCookies: false
    }, options || {} )
    
    //BEGIN COOKIEDATA
    var ck_draft = []
      , ck_data  = []
    
    if ( this._options.saveInCookies ) {
      var ck = fetchCookies( 'cjs_', [ 'draft', 'data' ] )
      
      if ( ck.hasOwnProperty( 'draft' ) )
        ck_draft = ck.draft
      if ( ck.hasOwnProperty( 'data'  ) )
        ck_data  = ck.data
    }
    //END
    
    /**
     * The object containing the in- and output forms
     * 
     * @property {jQuery} in - The input form
     * @property {jQuery} out - The output form
     * 
     * @type Object
     */
    this._form = {}
    
    /**
     * The Cite object for the draft data
     * 
     * @type Cite
     */
    this._draft = new Cite( ck_draft )
    
    /**
     * The Cite object for the outptu data
     * 
     * @type Cite
     */
    this._data = new Cite( ck_data  )
    
    /**
     * Save data in cookies
     * 
     * @method save
     * @memberof jQueryCite
     * @this jQueryCite
     * 
     * @return {jQueryCite} this
     */
    this.save = function () {
      var draft = JSON.stringify( this._draft.data )
        , data  = JSON.stringify( this._data .data )
        , array = [].concat( draft, data )
        , date  = 'Fri, 31 Dec 9999 23:59:59 GMT'
        
        , mods  = '; expires=' + date + ';'
      
      doSetCookie( 'cjs_draft=' + encodeURIComponent( draft ) + mods )
      doSetCookie( 'cjs_data='  + encodeURIComponent( data  ) + mods )
      
      return this
    }
    
    /**
     * Exit jQueryCite. Saves (if said in options), clears all data, empties forms and says goodbye.
     * 
     * @method terminate
     * @memberof jQueryCite
     * @this jQueryCite
     */
    this.terminate = function () {
      var props = Object.keys( this )
      
      if ( props.length === 1 && props[ 0 ] === 'terminate' )
        return false
      
      if ( this._options.saveInCookies )
        this.save()
      
      this._form.in .empty()
      this._form.out.empty()
      
      for ( var propIndex = 0; propIndex < props.length; propIndex++ ) {
        var prop = props[ propIndex ]
        delete this[ prop ]
      }
      
      console.info( '[terminate]', 'Goodbye!' )
      
      return false
    }
    
    /**
     * Load entry from set in the form
     * 
     * @method loadEntry
     * @memberof jQueryCite
     * @this jQueryCite
     * 
     * @param {CSL[]} set - set
     * @param {Number} index - index of the entry in the set
     * 
     * @return {jQueryCite} this
     */
    this.loadEntry = function ( set, index ) {
      var entry = set[ index ]
        , form  = this._form.in
        , $fields= form.find( 'fieldset' )
                       .filter( ':not([data-cjs-field-type]), ' +
                                '[data-cjs-field-type~="' + entry.type + '"]'
                              )
      
      for ( var prop in entry ) {
        var val    = entry[ prop ]
          , info   = varReverseFormFields[ prop ] || {}
          , $field = $fields.find( '[data-cjs-field="' + prop + '"]' )
        
        if ( info.hasOwnProperty( 'prepFunc' ) )
          val = info.prepFunc( val )
        
        if ( !info.pair ) {
          if ( $field.hasClass( 'cjs-multipleinput' ) )
            $field
              .CJSMultipleInputVal( val )
          else
            $field.val( val )
        } else
          $field
            .first().val( val[ 0 ] ).end()
            .last ().val( val[ 1 ] )
      }
      
      if ( JSON.stringify( this._data.data ) === JSON.stringify( set ) )
        form.find( '.cjs-preview .cjs-add' ).attr( 'data-cjs-update-data-index', index )
      
      this
        .updateFields()
        .updateDraft()
      
      return this
    }
    
    /**
     * Load entry from set in the form, after emptying it
     * 
     * @method emptyAndLoad
     * @memberof jQueryCite
     * @this jQueryCite
     * 
     * @param {CSL[]} set - set
     * @param {Number} index - index of the entry in the set
     * 
     * @return {jQueryCite} this
     */
    this.emptyAndLoad = function ( set, index ) {
      return this.emptyForm().loadEntry( set, index )
    }
    
    /**
     * Update the draft output field
     * 
     * @method updateDraft
     * @memberof jQueryCite
     * @this jQueryCite
     * 
     * @return {jQueryCite} this
     */
    this.updateDraft = function () {
      this._form.in
        .find( '.cjs-draft' )
        .html( this._draft.get( {}, true ) )
      
      return this
    }
    
    /**
     * Update the data output field
     * 
     * @method updateOut
     * @memberof jQueryCite
     * @this jQueryCite
     * 
     * @return {jQueryCite} this
     */
    this.updateOut = function () {
      var self = this
        , items = self._data.getIds( true )
      
      self._form.out
        .find( '.cjs-output' )
        .html( self._data.get( {}, true ) )
        
        .find( '.csl-entry' ).each( function ( i ) {
          var $this = $( this )
            , index = items.indexOf( $this.attr( 'data-csl-entry-id' ) )
            , icons = $( '<div class="csl-entry-controls"></div>' ).appendTo( $this )
          
          $( '<span title="Edit entry" class="material-icons csl-entry-edit">edit</span>' )
            .appendTo( icons )
            .click( function () {
              self.emptyAndLoad( self._data.data, index )
            } )
          
          $( '<span title="Remove entry" class="material-icons csl-entry-remove">clear</span>' )
            .appendTo( icons )
            .click( function () {
              self._data.data.splice( index, 1 )
              self.updateOut()
            } )
        } )
      
      return self
    }
    
    /**
     * Hide and show fields based on what publication type is selected
     * 
     * @method updateFields
     * @memberof jQueryCite
     * @this jQueryCite
     * 
     * @return {jQueryCite} this
     */
    this.updateFields = function () {
      var form = this._form.in
        , val  = form.find( '[data-cjs-field="type"]' ).val()
      
      form.find( 'fieldset[data-cjs-field-type]' ).each( function () {
        var $this = $( this )
        
        if ( $this.is( '[data-cjs-field-type~="' + val + '"]' ) )
          $this.attr( 'data-cjs-field-state', 'visible' )
        else
          $this.attr( 'data-cjs-field-state', 'hidden' )
      } )
      
      return this
    }
    
    /**
     * Empty the input form
     * 
     * @method emptyForm
     * @memberof jQueryCite
     * @this jQueryCite
     * 
     * @return {jQueryCite} this
     */
    this.emptyForm = function () {
      this._draft.set( [] )
      this.updateDraft()
      
      this._form.in.find( '.cjs-input' )
        
        .find( 'input[data-cjs-field]' )
          .val( '' )
        .end()
        
        .find( 'fieldset[data-cjs-field-type]' )
          .each( function () {
            var elm = $( this ).find( 'input' )
            
            if ( elm.hasClass( 'cjs-multipleinput' ) )
              elm.CJSMultipleInputClear()
          } )
        .end()
      
      return this
    }
    
    /**
     * Get form data from input form fields
     * 
     * @method getFormData
     * @memberof jQueryCite
     * @this jQueryCite
     * 
     * @return {Object} data
     */
    this.getFormData = function () {
      var data = {}
        , form = this._form.in
      
      for ( var fieldIndex = 0; fieldIndex < varFormFields.length; fieldIndex++ ) {
        var field = varFormFields[ fieldIndex ]
          
          ,$field = form.find( 'fieldset:not([data-cjs-field-state="hidden"])' )
                        .find( '[data-cjs-field="' + field.propName + '"]' )
          
          , input = getjQueryValList( $field )[ 0 ]
          , value = field.prepFunc ? field.prepFunc( $field ) : input
        
        if ( $field.data( 'cjs-field-state' ) !== 'hidden' && input && value )
          data[ field.propName ] = value
      }
      
      return data
    }
    
    /**
     * @method insertOutputForm
     * @memberof jQueryCite
     * @this jQueryCite
     * 
     * @param {jQuery} form - jQuery element where the form should go
     * @param {Object} options - Object containing options. See [jQueryCite(options)](jQueryCite.html#jQueryCite)
     * 
     * @return {jQueryCite} this
     */
    this.insertOutputForm = function ( form, options ) {
      var self = this
        , options = Object.assign( options || {}, self._options )
      
      self._form.out = form
      
      form
        .attr( 'class', 'cjs cjs-out' )
        .html( options.outputForm )
        .find( '*' ).addClass( 'cjs' )
      
      //BEGIN Event listeners
      form.find( '.cjs-opt select' ).change( function () {
        var siblings = $( this ).closest( 'fieldset' ).siblings( 'fieldset' ).andSelf().find( 'select' )
        
        var newOptions = {
          format: 'string'
        , type:   siblings.filter( '.cjs-type' ).val()
        , style:  siblings.filter( '.cjs-style' ).val()
        , lang:   siblings.filter( '.cjs-lan' ).val()
        }
        
        self._data.options( newOptions, true )
        self.updateOut()
      } )
      
      form.find( '.cjs-export, .cjs-output-edit' )
        .find( 'button' )
          
        .click( doPreventDefault )
          
          .filter( '.cjs-export-copy' )
            .click( fetchEventHandler( doCopyData, self ) )
          .end()
          
          .filter( '.cjs-export-save' )
            .click( fetchEventHandler( doDownloadData, self ) )
          
          .end()
      //END
      
      form.find( '.cjs-opt select' ).first().trigger( 'change' )
      
    }
    
    /**
     * @method insertInputForm
     * @memberof jQueryCite
     * @this jQueryCite
     * 
     * @param {jQuery} form - jQuery element where the form should go
     * @param {Object} options - Object containing options. See [jQueryCite(options)](jQueryCite.html#jQueryCite)
     * 
     * @return {jQueryCite} this
     */
    this.insertInputForm = function ( form, options ) {
      var self = this
      
      if ( self._form.hasOwnProperty( 'in' ) ) {
        form.html( $( '.cjs-in' ) )
        return self
      }
      
      self._form.in = form
      
      var options = Object.assign( options || {}, self._options )
      
      form
        .attr( 'class', 'cjs cjs-in' )
        .html( options.inputForm )
        .find( '*' )
          .addClass( 'cjs' )
        .end()
      
      //BEGIN Event listeners
      form
        
        .find( '.cjs-input input' )
          .attr( 'required', '' )
          .change( fetchEventHandler( doUpdateDraftFromFields, self ) )
          
          .filter( '[data-cjs-field="author"], [data-cjs-field="container-author"], [data-cjs-field="editor"]' )
            .CJSMultipleInput()
          .end()
        .end()
        
        .find( '.cjs-preview input' )
          .filter( '[type="reset"], [type="submit"]' )
            .click( doPreventDefault )
            .filter( '[type="reset"]' )
              .click( fetchEventHandler( doResetDraftFromFields, self ) )
            .end()
            .filter( '[type="submit"]' )
              .click( fetchEventHandler( doSubmitDraftFromFields, self, [ options.add ] ) )
              .click( fetchEventHandler( doResetDraftFromFields, self ) )
            .end()
          .end()
        .end()
        
        .find( '.cjs-import input' )
          .filter( '[type="file"]' )
            .change( fetchEventHandler( fetchFile, self ) )
          .end()
        .end()
        
        .find( 'select[data-cjs-field="type"]' )
          .change( fetchEventHandler( doUpdateFields, self) )
        .end()
      //END
      
      //BEGIN Setup
      self.updateFields()
      
      self._draft.options( options.defaultOptions, true )
      
      if ( self._draft.data.length > 0 )
        self.loadEntry( self._draft.data, 0 )
      else
        self.updateDraft()
      //END
      
      return self
    }
  }
  
  return jQueryCite
})()