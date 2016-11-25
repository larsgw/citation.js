/** 
 * @file jquery.Citation-0.2.js
 * 
 * @description
 * # Description
 * 
 * This plugin builds a form for input for the `Cite` object. Uses the templates in `html/`.
 * 
 * # Dependencies
 * 
 * * jQuery
 * * jQuery UI
 * * Citeproc
 * * Citation.js
 * 
 * @projectname Citationjs
 * 
 * @author Lars Willighagen [lars.willighagen@gmail.com]
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
 * 
 */
jQuery.fn.CJSMultipleInput = function () {
  var change = function () {
    var elm = $( this )
    
	  if (  elm.val() &&  $(elm).last().val() )
      elm.after( elm.clone( true ).val( '' ) )
    
    else if (  elm.val() && !$(elm).next().val() )
      elm.next().remove()
    
    else if ( !elm.val() &&  $(elm).next().val() )
      elm.remove()
  }
  $(this).each( function () {
    var elm = $(this)
    
    elm.addClass( 'cjs-multipleinput' )
    
    elm.keydown( function ( e ) { if ( e.keyCode === 9 ) change.call( this ) } )
    elm.change( change )
  } )
}

var jQueryCite = (function(){
  
  var parseName = function ( str ) {
    if ( str.indexOf( ', ' ) > -1 )
      var arr = str.split( ', ' ).reverse()
    else
      var arr = str.match( /^(?:((?:[A-Z][a-z]*[ -])*[A-Z][a-z]*) )?(?:((?:[a-z]+ )[a-z]+) )?((?:[A-Z][a-z]*[ -])*[A-Z][a-z]*)$/ ) || []
    
    var obj = {}
    
    if ( arr.length ) {
      if ( arr[ 1 ] )
	obj.given = arr[ 1 ]
      if ( arr[ 2 ] )
	obj[ 'non-dropping-particles' ] = arr[ 2 ]
      if ( arr[ 3 ])
	obj.family = arr[ 3 ]
    }
    else
      obj.family = str
    
    return obj
  }
  
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
  
  var DOMToValue = function ( v ) { return $( v ).val() }
    , emptyValue = function ( v ) { return !!v }
    , getName    = function ( i ) { return i.toArray().map( DOMToValue ).filter( emptyValue ).map( parseName ) }
  
  var formFields = [
    { propName: 'author', selector: '.cjs-author', prepFunc: getName }
  , { propName: 'editor', selector: '.cjs-editor', prepFunc: getName }
  , { propName: 'page', selector: '.cjs-pages'/*TODO*/ }
  
    //BEGIN Static
  , { propName: 'type', selector: '.cjs-type' }
  
  , { propName: 'title', selector: '.cjs-title' }
  , { propName: 'container-title', selector: '.cjs-inputform[aria-hidden="false"] .cjs-journal, .cjs-inputform[aria-hidden="false"] .cjs-publisher' }
  
  , { propName: 'year', selector: '.cjs-year' }
  , { propName: 'issue', selector: '.cjs-number' }
  , { propName: 'volume', selector: '.cjs-volume' }
  , { propName: 'edition', selector: '.cjs-print' }
  
  , { propName: 'DOI', selector: '.cjs-doi' }
  , { propName: 'ISBN', selector: '.cjs-isbn' }
    //END
  ]
  
  /**
   * 
   */
  function jQueryCite ( options ) {
    
    // Making it Scope-Safe
    if ( !( this instanceof jQueryCite ) )
      return new jQueryCite( options )
    
    /**
     * 
     */
    this._options = Object.assign( {
      lang : 'en',
      inputForm: '../docs/src/html/form-en.html',
      outputForm: '../docs/src/html/form-out-en.html',
      add  : function ( self ) {},
      defaultOptions: {
	format: 'string',
	type  : 'html',
	style : 'citation-apa',
	lang  : 'en-US'
      }
    }, options || {} )
    
    /**
     * 
     */
    this._form = {}
    
    /**
     * 
     */
    this._draft = new Cite()
    
    /**
     * 
     */
    this._data = new Cite()
    
    /**
     * 
     */
    this.updateDraft = function () {
      this._form.in
        .find( '.cjs-draft' )
        .html( this._draft.get( {}, true ) )
      
      return this
    }
    
    /**
     * 
     */
    this.updateOut = function () {
      this._form.out
        .find( '.cjs-output' )
        .html( this._data.get( this._data._options, true ) )
      
      console.log(this._data._options)
      
      return this
    }
    
    /**
     * 
     */
    this.updateFields = function () {
      var form = this._form.in
        , val = form.find('select.cjs-type').val()
      
      form.find( '#cjs-in-form fieldset' ).each( function () {
	if ( $( this ).hasClass( 'cjs-' + val ) )
	  $( this ).show()
	else
	  $( this ).hide()
      } )
      
      return this
    }
    
    /**
     * 
     */
    this.emptyForm = function () {
      this._draft.reset()
      this.updateDraft()
      
      var section = this._form.in.find( 'section.cjs-active' )
      
      section.find( 'input, textarea').val('')
      section.find('.cjs-chapterauthor').slice(1).remove()
      section.find('.cjs-author').slice(1).remove()
      section.find('.cjs-editor').slice(1).remove()
      section.find('.cjs-place').slice(1).remove()
    }
    
    /**
     * 
     */
    this.getFormData = function () {
      var data
        , form = this._form.in.find( '.cjs-inputform[aria-hidden="false"]' )
        , fType= form.attr( 'id' ).replace( /^cjs-in-/, '' )
      
      switch ( fType ) {
	case 'form':
	  
	  data = {}
	  
	  for ( var fieldIndex = 0; fieldIndex < formFields.length; fieldIndex++ ) {
	    var field = formFields[ fieldIndex ]
	      ,$field = $( field.selector )
	      , input = $field.toArray().map( DOMToValue ).filter( emptyValue )[ 0 ]
	      , value = field.prepFunc ? field.prepFunc( $field ) : input
	    
	    if ( input && value )
	      data[ field.propName ] = value
	  }
	  
	  break;
	
	case 'json':
	case 'bibtex':
	default:
	  data = form.find( 'textarea' ).val()
	  break;
      }
      
      console.log( data )
      
      return data
    }
    
    /**
     * 
     */
    this.insertOutputForm = function ( form, options ) {
      var self = this
        , options = Object.assign( options || {}, self._options )
      
      self._form.out = form
      
      form.attr( {
	id: '',
	class: 'cjs cjs-out'
      } ).load( options.outputForm, function () {
	
	//BEGIN Event listeners
	form.find( '#cjs-opt select.cjs' ).change( function () {
	  var newOptions = {
	    format: 'string'
	  , type:   form.find('#cjs-opt .cjs-type').val()
	  , style:  form.find('#cjs-opt .cjs-style').val()
	  , lang:   form.find('#cjs-opt .cjs-lan').val()
	  }
	  
	  self._data.options( newOptions, true )
	  self.updateOut()
	} )
	//END
	
        self._data.options( self._options.defaultOptions, true )
        
      } )
    }
    
    /**
     * 
     */
    this.insertInputForm = function ( form, options ) {
      var self = this
      
      if ( self._form.hasOwnProperty( 'in' ) ) {
	form.html( $( '.cjs-in' ) )
	return self
      }
      
      self._form.in = form
      
      var options = Object.assign( options || {}, self._options )
      
      form.addClass( 'cjs cjs-in' ).load( options.inputForm, function () {
	
	//BEGIN Event listeners
	form.find( '.cjs-chapterauthor, .cjs-author, .cjs-editor, .cjs-place' ).CJSMultipleInput()
	
	form.find( '#cjs-in-form select.cjs-type' ).change( function () {
          self.updateFields.call( self )
        } )
	
	form.find( 'input[type="submit"]' ).click( function ( e ) {
	  e.preventDefault()
	  
	  self._data.add( self._draft.data )
	  
	  options.add( self )
	  
          self.updateOut()
	  self.emptyForm()
	} )
	
	form.find( 'input[type="reset"]' ).click( function ( e ) {
	  e.preventDefault()
	  
	  self.emptyForm()
	} )
	
	form.find( '#cjs-in-json, #cjs-in-bibtex' ).find( 'textarea' ).change( function () {
	  self._draft.set( $( this ).val() )
	  
	  self.updateDraft()
	} )
	
	form.find( '#cjs-in-form' ).find( 'input' ).each( function () {
	  $( this ).attr( 'required', '' )
	} ).change( function () {
	  var data = self.getFormData()
	  
	  for ( var i in data ) {
	    if ( !data[ i ] || data[ i ] === '' )
	      delete data[ i ]
	  }
	  
	  self._draft.set( data )
	  
	  self.updateDraft()
	} )
	//END
	
	//BEGIN Setup
	form.find( '.cjs-input' ).tabs( {
	  hide: { effect: 'slide', direction: 'left', duration: 50 },
	  show: { effect: 'slide', direction: 'right', duration: 150 }
	} )
        
	self.updateFields()
	
	self._draft.options( options.defaultOptions, true )
        self.updateDraft()
	//END
	
      } )
      
      return self
    }
    
  }
  
  return jQueryCite
})()
