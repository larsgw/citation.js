/** 
 * @file jquery.Citation-0.2.js
 * 
 * @description
 * # Description
 * 
 * This plugin builds a form for input for the `Cite` object. Uses the templates in `html/` (but minified).
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
  return $(this).each( function () {
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
   * @param {Object} options - The options for the forms
   * @param {Object} options.defaultOptions - Default output options. See [Cite.options()](Cite.html#.options)
   * @param {String} options.inputForm - HTML for the input form
   * @param {String} options.outputForm - HTML for the output form
   * @param {jQueryCite~addCallback} options.add - Callback for when data is added to output
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
      inputForm : '<section class="cjs-piece cjs-input"><ul><li><a class="cjs" href="#cjs-in-form">Input</a></li><li><a class="cjs" href="#cjs-in-json">JSON</a></li><li><a class="cjs" href="#cjs-in-bibtex">BibTeX</a></li></ul><section id="cjs-in-form" class="cjs-inputform"><fieldset><select data-cjs-field="type"><option value="book">Book</option><option value="incollection">Chapter</option><option value="paper-conference">Paper</option><option value="article-journal">Article</option><option value="article-magazine">Magazine article</option><option value="article-newspaper">Newspaper article</option><option value="webpage">Webpage</option></select></fieldset><!--BEGIN FORM--><fieldset data-cjs-field-type="incollection"><label><input data-cjs-field="title" type="text"><legend>Chapter title</legend></label></fieldset><fieldset data-cjs-field-type="incollection"><label><input data-cjs-field="container-title" type="text"><legend>Book title</legend></label></fieldset><fieldset data-cjs-field-type="book paper-conference article-journal article-magazine article-newspaper webpage"><label><input data-cjs-field="title" type="text"><legend>Title</legend></label></fieldset><fieldset data-cjs-field-type="article-journal"><label><input data-cjs-field="container-title" type="text"><legend>Journal</legend></label></fieldset><fieldset data-cjs-field-type="article-magazine"><label><input data-cjs-field="container-title" type="text"><legend>Magazine</legend></label></fieldset><fieldset data-cjs-field-type="article-newspaper"><label><input data-cjs-field="container-title" type="text"><legend>Newspaper</legend></label></fieldset><fieldset data-cjs-field-type="webpage"><label><input data-cjs-field="container-title" type="text"><legend>Website</legend></label></fieldset><fieldset data-cjs-field-type="incollection"><label><input data-cjs-field="author" type="text"><legend>Chapter author</legend></label></fieldset><fieldset data-cjs-field-type="incollection"><label><input data-cjs-field="container-author" type="text"><legend>Author</legend></label></fieldset><fieldset data-cjs-field-type="book paper-conference article-journal article-magazine article-newspaper webpage"><label><input data-cjs-field="author" type="text"><legend>Author</legend></label></fieldset><fieldset data-cjs-field-type="book incollection paper-conference article-journal article-magazine article-newspaper"><label><input data-cjs-field="editor" type="text"><legend>Editor</legend></label></fieldset><fieldset data-cjs-field-type="book incollection article-newspaper"><label><input data-cjs-field="edition" type="number" min="1"><legend>Edition</legend></label></fieldset><fieldset data-cjs-field-type="paper-conference article-journal"><label><input data-cjs-field="issue" type="number" min="1"><legend>Issue</legend></label></fieldset><fieldset data-cjs-field-type="book incollection paper-conference article-journal article-magazine"><label><input data-cjs-field="volume" type="number" min="1"><legend>Volume</legend></label></fieldset><fieldset data-cjs-field-type="incollection article-journal article-magazine article-newspaper"><label><input data-cjs-field="page" type="number" min="1"><input data-cjs-field="page" type="number" min="1"><legend>Pages</legend></label></fieldset><fieldset data-cjs-field-type="paper-conference"><label><input data-cjs-field="event" type="text"><legend>Conference</legend></label></fieldset><fieldset data-cjs-field-type="book incollection paper-conference"><label><input data-cjs-field="publisher" type="text"><legend>Publisher</legend></label></fieldset><fieldset data-cjs-field-type="book incollection article-newspaper"><label><input data-cjs-field="publisher-place" type="text"><legend>Place</legend></label></fieldset><fieldset><label><input data-cjs-field="URL" type="url"><legend>URL</legend></label></fieldset><fieldset data-cjs-field-type="paper-conference article-journal"><label><input data-cjs-field="DOI" type="text"><legend>DOI</legend></label></fieldset>\
                   <fieldset data-cjs-field-type="book incollection paper-conference"><label><input data-cjs-field="ISBN" type="text"><legend>ISBN</legend></label></fieldset><fieldset data-cjs-field-type="article-journal article-magazine article-newspaper"><label><input data-cjs-field="ISSN" type="text"><legend>ISSN</legend></label></fieldset><fieldset><label><input data-cjs-field="issued" type="date"><legend>Issued</legend></label></fieldset><fieldset><label><input data-cjs-field="accessed" type="date"><legend>Accessed</legend></label></fieldset><!--END--></section><section id="cjs-in-json" class="cjs-inputform"><fieldset class="cjs"><textarea class="cjs-JSON" placeholder="e.g. \'{ &#10;author:\'Jan van der Linden\' &#10;}\'"></textarea></fieldset></section><section id="cjs-in-bibtex" class="cjs-inputform"><fieldset class="cjs"><textarea class="cjs-BibTeX" placeholder="e.g. \'@book{aarts2001titel,&#10;title={{Titel}},&#10;author={Aarts, J.},&#10;year={2001},&#10;publisher={Uitgever},&#10;}\'"></textarea></fieldset></section></section><section class="cjs-piece cjs-preview"><div class="cjs-draft"></div><input class="cjs-add" type="submit" value="Add"> <input class="cjs-delete" type="reset" value="Delete"></section>',
      outputForm: '<section class="cjs-piece cjs-settings"><h2>Output</h2><form id="cjs-opt"><fieldset><select class="cjs-type"><option value="html">Normal</option><option value="string">Plain text</option></select></fieldset><fieldset><select class="cjs-style"><optgroup label="Formatted"><option value="citation-apa">APA</option><option value="citation-vancouver">Vancouver</option><option value="citation-harvard1">Harvard</option></optgroup><option value="bibtex">BibTeX</option><option value="csl">JSON</option></select></fieldset><fieldset><select class="cjs-lan"><option value="en-US">English</option><option value="es-ES">Spanish</option><option value="du-DU">German</option><option value="fr-FR">French</option><option value="nl-NL">Dutch</option></select></fieldset></form></section><section class="cjs-piece"><div class="cjs-output"></div><form class="cjs-output-edit"><button type="submit" class="cjs-output-edit-sort">Sort</button></form></section><section class="cjs-piece cjs-export"><h2>Export</h2><form><button type="submit" class="cjs-export-copy">Copy</button> <button type="submit" class="cjs-export-save">Download</button></form></section>',
      add  : function ( self ) {},
      defaultOptions: {
	format: 'string',
	type  : 'html',
	style : 'citation-apa',
	lang  : 'en-US'
      }
    }, options || {} )
    
    /**
     * The object containing the in- and output forms
     * 
     * @property in {jQuery} The input form
     * @property out {jQuery} The output form
     * 
     * @type Object
     */
    this._form = {}
    
    /**
     * The Cite object for the draft data
     * 
     * @type Cite
     */
    this._draft = new Cite()
    
    /**
     * The Cite object for the outptu data
     * 
     * @type Cite
     */
    this._data = new Cite()
    
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
     * Empty the input form
     * 
     * @method emptyForm
     * @memberof jQueryCite
     * @this jQueryCite
     * 
     * @return {jQueryCite} this
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
     * Get form data from input form fields
     * 
     * @method getFormData
     * @memberof jQueryCite
     * @this jQueryCite
     * 
     * @return {Object} data
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
        .attr( {
          id: '',
          class: 'cjs cjs-out'
        } )
        .html( options.outputForm )
	.find( '*' ).addClass( 'cjs' )
      
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
        .addClass( 'cjs cjs-in' )
        .html( options.inputForm )
	.find( '*' ).addClass( 'cjs' )
      
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
      
      return self
    }
    
  }
  
  return jQueryCite
})()
