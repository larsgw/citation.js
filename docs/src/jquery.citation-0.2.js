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
  $(this).each( function () {
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
      
      if ( $this.is( $last ) || ( $this.is( $last.prev() ) && $this.val() !== '' ) )
        return undefined
      
      $last.remove()
      
    } )
    
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
    , $ToValList = function ( i ) { return i.toArray().map( DOMToValue ).filter( emptyValue ) }
    
    , getName    = function ( i ) { return $ToValList( i ).map( parseName ) }
    , getPages   = function ( i ) { return $ToValList( i ).slice( 0, 2 ).join( '-' ) }
    , getDate    = function ( i ) { return parseDate( i.val() ) }
  
  var formFields = [
    { propName: 'title' }
  , { propName: 'container-title' }
  
  , { propName: 'author', prepFunc: getName }
  , { propName: 'container-author', prepFunc: getName }
  , { propName: 'editor', prepFunc: getName }
  
  , { propName: 'edition' }
  , { propName: 'issue' }
  , { propName: 'volume' }
  , { propName: 'page', prepFunc: getPages }
  
  , { propName: 'event' }
  , { propName: 'publisher' }
  , { propName: 'publisher-place' }
  
  , { propName: 'URL' }
  , { propName: 'DOI' }
  , { propName: 'ISBN' }
  , { propName: 'ISSN' }
  
  , { propName: 'issued', prepFunc: getDate }
  , { propName: 'accessed', prepFunc: getDate }
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
        .html( this._data.get( {}, true ) )
        
        /*.find( '.csl-entry' ).each( function () {
          var $this = $( this )
          
          $( '<div title="Remove entry" class="csl-entry-remove">x</div>' )
            .appendTo( $this )
            .click( function () {
              
            } )
        } )*/
      
      return this
    }
    
    /**
     * 
     */
    this.updateFields = function () {
      var form = this._form.in
        , val  = form.find('[data-cjs-field="type"]').val()
      
      form.find( '#cjs-in-form fieldset[data-cjs-field-type]' ).each( function () {
	var $this = $( this )
	
	if ( $this.is( '[data-cjs-field-type~="' + val + '"]' ) )
	  $this.attr( 'data-cjs-field-state', 'visible' )
	else
	  $this.attr( 'data-cjs-field-state', 'hidden' )
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
      
      section.find( 'input, textarea' ).val( '' )
      section.find( 'fieldset' ).each( function () {
	$( this ).find( '.cjs-multipleinput' ).slice( 1 ).remove()
      } )
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
	      
	      ,$field = form.find( 'fieldset[data-cjs-field-state="visible"]' )
			    .find( '[data-cjs-field="' + field.propName + '"]' )
	      
	      , input = $ToValList( $field )[ 0 ]
	      , value = field.prepFunc ? field.prepFunc( $field ) : input
	    
	    if ( $field.data( 'cjs-field-state' ) !== 'hidden' && input && value )
	      data[ field.propName ] = value
	  }
	  
	  break;
	
	case 'json':
	case 'bibtex':
	default:
	  data = form.find( 'textarea' ).val()
	  break;
      }
      
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
	form.find( '#cjs-opt select' ).change( function () {
	  var newOptions = {
	    format: 'string'
	  , type:   form.find('#cjs-opt .cjs-type').val()
	  , style:  form.find('#cjs-opt .cjs-style').val()
	  , lang:   form.find('#cjs-opt .cjs-lan').val()
	  }
	  
	  var button = form.find( '.cjs-output-edit-sort' )
          
	  if ( newOptions.style.match( /^citation-/ ) )
            button.attr( 'disabled', '' )
          else
            button.removeAttr( 'disabled' )
	  
	  self._data.options( newOptions, true )
	  self.updateOut()
	} )
        
        form.find( '.cjs-export, .cjs-output-edit' ).find( 'button' )
          .click( function ( e ) { e.preventDefault() })
          .filter( '.cjs-output-edit-sort' )
            .click( function () {
              self._data.sort( true )
              
              self.updateOut()
            } )
          .end()
          .filter( '.cjs-export-copy' )
            .click( function () {
              
              var text = self._form.out.find( '.cjs-output' ).text()
                , $tmp = $( '<textarea>' )
              
              var fb = function () {
                $tmp.remove()
                
                if ( window.prompt( 'Please copy the following text:', text ) !== null )
                  return true
                else
                  return false
              }
              
              $tmp
                .val( text )
                .appendTo( 'body' )
                .select()
              
              try {
                
                if ( document.execCommand( 'copy' ) ) {
                  $tmp.remove()
                  return true
                } else
                  fb()
                
              } catch (e) {
                
                fb()
                
              }
              
            } )
          .end()
          .filter( '.cjs-export-save' )
            .click( function () {
              
              var extensions = {
                'application/msword'  : 'docx'
              , 'text/plain'          : 'txt'
              , 'application/json'    : 'json'
              , 'application/x-bibtex': 'bib'
              }
              
              var opt  = self._data._options
                , gopt = Object.assign( {}, opt )
                , mime = 'text/plain'
              
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
              
              var date = new Date()
                , dstr = [ date.getDate (), date.getMonth  (), date.getFullYear() ].join( '/' )
                , tstr = [ date.getHours(), date.getMinutes(), date.getSeconds () ].join( '-' )
                , name = [ 'Bibliography', dstr, tstr ].join( '_' )
                , ext  = extensions[ mime ]
                , file = [ name, ext ].join( '.' )
                
                , str  = self._data.get( gopt, true )
                , blob = new Blob( [ '\ufeff', str ], { type: mime } )
                
                , url  = URL.createObjectURL( blob )
                , link = document.createElement( 'A' )
              
              link.href     = url
              link.download = file
              
              document.body.appendChild( link )
              
              if ( navigator.msSaveOrOpenBlob )
                navigator.msSaveOrOpenBlob( blob, file )
              else
                link.click()
              
              document.body.removeChild( link )
              
            } )
          .end()
	//END
	
        form.find( '#cjs-opt select' ).first().trigger( 'change' )
        
        //self._data.options( self._options.defaultOptions, true )
        
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
	form.find( '[data-cjs-field="author"], [data-cjs-field="container-author"], [data-cjs-field="editor"]' )
	  .CJSMultipleInput()
	
	form.find( '#cjs-in-form select[data-cjs-field="type"]' ).change( function () {
          self.updateFields()
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
