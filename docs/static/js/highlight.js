/* Code highlighting. Feel free to use, but note it isn't that solid */
jQuery.fn.highlight = function() {
  $(this).each(function(){
    var elm = $(this);
    switch(elm.data('type')){
      case 'json':case 'js':
        elm.html(elm.text()
          .replace(/([^\"]*)([\"][^\"]*[\"])([^\"]*)/gi,'$1<span class="string">$2</span>$3')
          .replace(/([^\']*)([\'][^\']*[\'])([^\']*)/gi,'$1<span class="string">$2</span>$3')
          .replace(/(function|this|document|for|if|else|var|true|false|throw|return|while|break|typeof|catch|new|undefined|null|class|yield|let|const|switch|break|case|continue|try|delete|in|of)([\s()]+)/g,
            '<span class="native">$1</span>$2')
          .replace(/(\w+)(?=\.)/gi, '<span class="object">$1</span>')
          .replace(/(cite)([(<])/gi, '<span class="important">$1</span>$2')
          .replace(/(cite)([^\(<])/gi, '<span class="important">$1</span>$2')
          .replace(/(\w+)(\s*\:)/gi,'<span class="key">$1</span>$2')
          .replace(/([\s\.{};(])([\w$]+)(?=\s*\()/gi,'$1<span class="function">$2</span>')
          .replace(/^(.*)(\/\/.*)$/gim,'$1<span class="comment">$2</span>')
          .replace(/(\/\*[\s\S]*?\*\/)/gi,'<span class="comment">$1</span>')
          .replace(/(-?(?:\d+\.\d+|\d+\.|\.\d+|\d+)(?:e\d+)?)/gi,'<span class="digit">$1</span>')
        );
        break;
      case 'bib':
        elm.html(elm.text()
          .replace(/(=\s*)(?:("{)(.*?)(}")|(")(.*?)(")|({{)(.*?)(}})|({)(.*?)(})|(.*?))(?=\s*[,}])/g,
                  function (m,p1,p2,p3,p4,p5,p6,p7,p8,p9,p10,p11,p12,p13,p14) {
                    p1=p1||'',p2=p2||'',p3=p3||'',p4=p4||'',p5=p5||'',p6=p6||'',p7=p7||'',p8=p8||'',
                    p9=p9||'',p10=p10||'',p11=p11||'',p12=p12||'',p13=p13||'',p14=p14||'';
                    var rgx = /^\d+$/, string = (
                      p3 .match( rgx ) ||
                      p6 .match( rgx ) ||
                      p9 .match( rgx ) ||
                      p12.match( rgx ) ||
                      p14.match( rgx )
                    ) ?
                      'digit'
                    :
                      'string';
                    
                    return `${p1+p2+p5+p8+p11}<span class="${string}">${p3+p6+p9+p12+p14}</span>${p4+p7+p10+p13}`//
                  })
          .replace(/(\@)([^\@\{]+)(\{)(\w+)(\,)/gi,'$1<span class="entrytype">$2</span>$3<span class="label">$4</span><span class="default">$5</span>')
          .replace(/(\w+)\s*(\=)(\s|[^\'\"\w]+)/gi,'<span class="property">$1</span> $2 ')
        );
        break;
      case 'url':
        elm.html(elm.text()
          .replace(/(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?((\/[-a-z\d%_.~+:]*)*)(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?/gi,
            '<span class="protocol">$1</span>'+
            '<span class="domain">$2$8</span>'+
            '<span class="path">$9$12</span>'+
            '<span class="parameters">$11</span>'
          )
        )
        break;
      default:return;break;
    }
  });
}