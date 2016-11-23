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
  var elm = $( this ).selector
  
  $( elm ).each( function () {
    $(this).addClass( 'cjs-multipleinput' )
    
    $(this).change( function () {
           if (  $(this).val() &&  $(elm).last().val() )
	$(this).after( $(this).clone( true ).val( '' ) )
      
      else if (  $(this).val() && !$(elm).next().val() )
	$(this).next().remove()
      
      else if ( !$(this).val() &&  $(elm).next().val() )
	$(this).remove()
    } )
  } )
}

var jQueryCite = (function(){
  
  var emptyForm = function () {
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
      add  : function ( self ) {
	console.log(self._form.out,self._data.get())
	self._form.out.html( self._data.get() )
      },
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
	  var options = {
	    format: 'string'
	  , type:   form.find('#cjs-opt .cjs-type').val()
	  , style:  form.find('#cjs-opt .cjs-style').val()
	  , lang:   form.find('#cjs-opt .cjs-lan').val()
	  }
	  
	  self._data.options( options, true )
	  
	  self.updateOut()
	} )
	//END
	
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
      
      form.empty = function () { emptyForm.call( self ) }
      
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
	  
	  form.empty()
	} )
	
	form.find( 'input[type="reset"]' ).click( function ( e ) {
	  e.preventDefault()
	  
	  form.empty()
	} )
	
	form.find( '#cjs-in-json, #cjs-in-bibtex' ).find( 'textarea' ).change( function () {
	  self._draft.set( $( this ).val() )
	  
	  self.updateDraft()
	} )
	
	form.find( '#cjs-in-form' ).find( 'input' ).change( function () {
	  var data = {
	    //TODO
	  }
	  
	  for ( var i in data ) {
	    if ( !data[ i ] || data[ i ] === '' )
	      delete data[ i ]
	  }
	  
	  self._draft.set( data )
	  
	  self.updateDraft()
	} )
	//END
	
	//BEGIN Triggering stuff
	form.find( '.cjs-input' ).tabs( {
	  hide: { effect: 'slide', direction: 'left', duration: 50 },
	  show: { effect: 'slide', direction: 'right', duration: 150 }
	} )
	
        self._draft.set( [
          {
            id: "Q23571040",
            type: "article-journal",
            title: "Correlation of the Base Strengths of Amines 1",
            DOI: "10.1021/ja01577a030",
            author: [
              {
                given: "H. K.",
                family: "Hall"
              }
            ],
            issued: [
              {
                'date-parts': [ "1957", "1", "1" ]
              }
            ],
            'container-title': "Journal of the American Chemical Society",
            volume: "79",
            issue: "20",
            page: "5441-5444"
          },
	  {
	    "type": "article-journal",
	    "author": [
	      {
		"given": "Christoph",
		"family": "Steinbeck"
	      },
	      {
		"given": "Yongquan",
		"family": "Han"
	      },
	      {
		"given": "Stefan",
		"family": "Kuhn"
	      },
	      {
		"given": "Oliver",
		"family": "Horlacher"
	      },
	      {
		"given": "Edgar",
		"family": "Luttmann"
	      },
	      {
		"given": "Egon",
		"family": "Willighagen"
	      }
	    ],
	    "year": "2003",
	    "title": "The Chemistry Development Kit (CDK): an open-source Java library for Chemo- and Bioinformatics",
	    "container-title": "Journal of chemical information and computer sciences",
	    "volume": "43",
	    "issue": "2",
	    "page": "493-500",
	    "DOI": "10.1021/ci025584y",
	    "ISBN": "0095-2338",
	    "id": "Steinbeck2003"
	  }
        ] )
        
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
