/* Code highlighting. Feel free to use, but note it isn't that solid */
jQuery.fn.highlight = function() {
  $(this).each(function(){
    var elm = $(this);
    elm.html(elm.text()
      .replace(/([^\"]*)([\"][^\"]*[\"])([^\"]*)/gi,'$1<span class="string">$2</span>$3')
      .replace(/([^\']*)([\'][^\']*[\'])([^\']*)/gi,'$1<span class="string">$2</span>$3')
      .replace(/(\w+)(?=\.)/gi, '<span class="object">$1</span>')
      .replace(/(cite)([(<])/gi, '<span class="important">$1</span>$2')
      .replace(/(cite)([^\(<])/gi, '<span class="important">$1</span>$2')
      .replace(/(\w+)(\s*\:)/gi,'<span class="key">$1</span>$2')
      .replace(/([\s\.{};(])([\w$]+)(?=\s*\()/gi,'$1<span class="function">$2</span>')
      .replace(/^(.*)(\/\/.*)$/gim,'$1<span class="comment">$2</span>')
      .replace(/(\/\*[\s\S]*?\*\/)/gi,'<span class="comment">$1</span>')
      .replace(/(-?(?:\d+\.\d+|\d+\.|\.\d+|\d+)(?:e\d+)?)/gi,'<span class="digit">$1</span>')
      .replace(/(@(?:file|author|version|class|param|return))(\W)(\{[\w\|]+\})?/g, '<span class="jsdoc">$1</span>$2<span class="jsdoc-object">$3</span>')
      .replace(/(@\w+)(\W)/g, '<span class="jsdoc-unknown">$1</span>$2')
      .replace(/(function|this|document|for|if|else|var|true|false|throw|return|while|break|typeof|catch|new|undefined|null|class|yield|let|const|switch|break|case|continue|try|delete|in|of)([\s()]+)/g,
        '<span class="native">$1</span>$2')
    );
  });
}