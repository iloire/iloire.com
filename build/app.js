define('analytics', function () {

  return {
    track: function (cat, action, label, val) {
      if (window.ga) {
        window.ga('send', 'event', cat, action, label, val);
      }
    }
  }
});
define('background-effect', function(){

  var SWARM_COLORS = ['#fff9e6','#FBFBFB', '#FAFAFA', '#F7F7F7', "F8F8F8", "#f5f5f5", "F9F9F9"];
  var BG_COLORS = SWARM_COLORS;

  var SEPARATOR_SIZE = 1;
  var SQUARE_SIZE = 6;
  var SWARM_PADDING = 200;
  var ITERATIONS_PER_TICK = 50;

  var cursorX = 0;
  var cursorY = 0;

  var canvas = document.getElementById('c');
  var ctx = canvas.getContext('2d');

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function getRandomColor(colors) {
    return colors[getRandomInt(0, colors.length)];
  }

  function createSquare(x, y, w, h, c){
    ctx.beginPath();
    ctx.fillStyle = c;
    ctx.fillRect(x, y, w, h);
  }

  function writeRow(y, rowWidth, w, h, color) {
    var x = 0;
    while (x < rowWidth) {
      createSquare(x, y, w, h, color || getRandomColor(BG_COLORS));
      x+=w;
      // write a separator square into the right
      createSquare(x, y, SEPARATOR_SIZE, h, '#fff');
      x+=SEPARATOR_SIZE;
    }
  }

  function tick(){
    for (var i = 0; i < ITERATIONS_PER_TICK; i++) {
      var angle = Math.random()*Math.PI*2;
      var radius = getRandomInt(0, SWARM_PADDING);
      var x = cursorX + Math.cos(angle)*radius;
      var y = cursorY + Math.sin(angle)*radius;

      // from pixels back to columns and rows
      var colX = parseInt(x / (SQUARE_SIZE + SEPARATOR_SIZE));
      var colY = parseInt(y / (SQUARE_SIZE + SEPARATOR_SIZE));

      paintSquareIn(colX, colY, SWARM_COLORS);
    }
  }

  function paintSquareIn(colX, colY, colors) {
    var x = colX * (SQUARE_SIZE + SEPARATOR_SIZE);
    var y = colY * (SQUARE_SIZE + SEPARATOR_SIZE);
    createSquare(x, y, SQUARE_SIZE, SQUARE_SIZE, getRandomColor(colors || BG_COLORS));
  }

  function paintBg(width, height) {
    var y = 0;
    while (y < height) {
      writeRow (y, width, SQUARE_SIZE, SQUARE_SIZE);
      y+=SQUARE_SIZE;
      writeRow (y, width, SQUARE_SIZE, SEPARATOR_SIZE, '#fff');
      y+=SEPARATOR_SIZE;
    }
  }

  function resizeCanvas(canvas){
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  return {

    canvasSupported: function(){
      var elem = document.createElement('canvas');
      return !!(elem.getContext && elem.getContext('2d'));
    },

    init: function(){

      document.addEventListener('mousemove', function(e){
        cursorX = e.pageX;
        cursorY = e.pageY;
      });

      window.addEventListener("resize", function(e){
        resizeCanvas(canvas);
      });

      resizeCanvas(canvas);

      paintBg(canvas.width, canvas.height);

      setInterval(tick, 20);
    }
  };

});
define('content-hover', ['settings', 'image-preloader'], function (SETTINGS,
                                                                   preloader) {

  var PRELOAD_IMAGES = [
    'europe.svg', 'dgallery1.png', 'shipit24.jpg', 'backbone-googlemaps.jpg', 'letsnode.jpg',
    'atlasboard-01.jpg', 'math_race01.png', 'triatlonaragon.jpg', 'watchmen.png', 'directorio.jpg',
    '2earth_01.png'
  ].map(function (i) {
        return SETTINGS.CND_IMG_PREFIX + i
      });

  var CONTENT = {
    'dgallery': '<div><img class="full dropshadow" src="' + SETTINGS.CND_IMG_PREFIX + 'dgallery1.png"><span class="description">dGallery, a sexy asp.net mvc photo gallery</span></div>',
    'atlassian': '<div><img class="full dropshadow" src="' + SETTINGS.CND_IMG_PREFIX + 'shipit24.jpg"></div>',
    'map': '<div class="map-europe"><div class=pulse></div><div class="img-wrapper"><img class="full" src="' + SETTINGS.CND_IMG_PREFIX + 'europe.svg"></div></div>',
    'math_race': '<div><img class="full" src="' + SETTINGS.CND_IMG_PREFIX + 'math_race02.png"></div>',
    'fatri': '<div><img class="full dropshadow" src="' + SETTINGS.CND_IMG_PREFIX + 'triatlonaragon.jpg"><span class="description">Triatlhon regional association. I created and maintain the website</span></div>',
    '2earth': '<div><img class="full" src="' + SETTINGS.CND_IMG_PREFIX + '2earth_01.png"></div>',
    'watchmen': '<div><img class="full dropshadow" src="' + SETTINGS.CND_IMG_PREFIX + 'watchmen.png"><span class="description">A node.js service monitor. Source code available on GitHub</span></div>',
    'directorio_cachirulo': '<div><img class="full dropshadow" src="' + SETTINGS.CND_IMG_PREFIX + 'directorio.jpg"><span class="description">Local freelance directory. Software created with node.js and redis. Available on GitHub</span></div>',
    'letsnode': '<div><img class="full dropshadow" src="' + SETTINGS.CND_IMG_PREFIX + 'letsnode.jpg"></div>',
    'backbone_google_maps': '<div><img class="full dropshadow" src="' + SETTINGS.CND_IMG_PREFIX + 'backbone-googlemaps.jpg"><span class="description">Playing with Backbone.js and Google Maps..</span></div>',
    'atlasboard': '<div><img class="full dropshadow" src="' + SETTINGS.CND_IMG_PREFIX + 'atlasboard-01.jpg"><span class="description">Atlasboard, simple and beautiful dashboards for everyone</span></div>',
  };

  var extraContent = $('#extrainfo');

  function hideExtraContent() {
    extraContent.fadeOut(800, function () {
      $(this).empty();
    });
  }

  function shouldEnableExtraContent() {
    return (window.innerWidth > SETTINGS.min_window_width);
  }

  function moveAndResizeExtraContent() {
    if (shouldEnableExtraContent()) {
      var width = window.innerWidth - SETTINGS.left_margin_extra_content;
      extraContent.css({
        top: $(window).scrollTop(),
        right: 0,
        width: width + 'px'
      });
    }
    else {
      hideExtraContent();
    }
  }

  function showExtraContent(content) {
    extraContent.html(content).fadeIn();
    moveAndResizeExtraContent();
  }

  return {

    showExtraContent: showExtraContent,

    init: function () {

      if (window.innerWidth > SETTINGS.min_window_width) {
        preloader.preload(PRELOAD_IMAGES);
      }

      var timeoutFade = null;

      window.addEventListener("resize", moveAndResizeExtraContent);
      window.onscroll = moveAndResizeExtraContent;

      $('a.extra_content').mouseover(function (ev) {
        clearTimeout(timeoutFade);
        if (shouldEnableExtraContent()) {
          var id = $(this).attr('data-contentid');
          showExtraContent(CONTENT[id]);
        }
      }).mouseout(function () {
        timeoutFade = setTimeout(hideExtraContent, 1500);
      });

      extraContent.on('mouseover', function () {
        clearTimeout(timeoutFade);
      });
    }
  };

});
define('image-preloader', function(){

  return {
    preload : function (arrayOfImages) {
      for (var i = 0; i < arrayOfImages.length; i++) {
        var url = arrayOfImages[i];
        var image = new Image();
        image.src = url;
      }
    }
  };

});
define('localStorage-cache', function(){

  return  {

    get : function (key) {
      if(typeof(Storage)!=="undefined"){
        if (localStorage.getItem(key)){ //get from HTML5 localStorage
          if (JSON.parse(localStorage.getItem(key)).expires < +new Date()){
            localStorage.removeItem(key);
          }
          else{
            return JSON.parse(localStorage.getItem(key)).data;
          }
        }
      }
      return null;
    },

    set : function (key, obj, expiration_seconds){
      if(typeof(Storage)!=="undefined"){
        localStorage.setItem(key, JSON.stringify({data: obj, expires: +new Date() + expiration_seconds * 1000}));
      }
    }

  };

});
require([
      'jquery',
      'gh',
      'background-effect',
      'content-hover',
      'settings',
      'markdown-fetcher'
    ],

    function ($,
              gh,
              backgroundEffect,
              contentHover,
              SETTINGS,
              markdownFetcher) {

      function massageGhData(data) {
        data.data.sort(function sorter(a, b) {
          return b.watchers - a.watchers;
        });
        var output = '';
        if (data.data.length) {
          output = "<ul>";
          for (var i = 0, c = 0; (c < SETTINGS.max_gh_projects && i < data.data.length); i++) {
            var project = data.data[i];
            if (!project.fork) { //show only own projects
              output = output + '<li><span class="label label-warning watchers"><a title="watchers" target=_blank href="' +
              project.html_url + '/watchers">' + project.watchers + '</a></span>' +
              ' <span class="label label-info forks"><a title="forks" target=_blank href="' + project.html_url +
              '/network">' + project.forks + '</a></span>' + '  <a data-repo="' + project.name + '" class="gh-project" target=_blank href="' +
              project.html_url + '">' + project.name + '</a>: <span class="gh-project-description">' + project.description + '</span></li>';
              c++;
            }
          }
          output = output + "</ul>";
        }
        else {
          output = '<p>No projects to show.</p>';
        }
        return output;
      }

      var init = function () {

        if (backgroundEffect.canvasSupported()) {
          backgroundEffect.init();
        }

        contentHover.init();

        var where = document.getElementById('ghcontainer');
        where.innerHTML = 'loading...';
        gh.getGitHubProjects('iloire', {cache_duration_minutes: 30}, function (data) {
          where.innerHTML = massageGhData(data);
          markdownFetcher.init();
        });

      };

      init();

    });


define('markdown-fetcher', ['jquery', 'service-markdown-fetcher', 'content-hover'],
    function ($,
              service,
              contentHover) {

  function isSupported() {
    return !!window.atob;
  }

  return {

    init: function () {

      if (!isSupported()) {
        return;
      }

      $('a.gh-project').mouseover(function () {
        if (window.innerWidth < 1200) {
          return;
        }
        service.fetch('iloire', $(this).data('repo'), {cache_duration_minutes: 60}, function (data) {
          var container = $('<div/>').addClass('gh-preview');
          container.append('<span class="header">github\'s readme preview</span>');
          container.append('<span class="help">this is just a partial preview. click on the link to go to the project repo</span>');
          var html = markdown.toHTML(window.atob(data.content));
          container.append($('<div />').addClass('gh-readme').html(html));
          contentHover.showExtraContent(container);
        })
      });
    }
  };
});
/*!
 * Markdown
 * Released under MIT license
 * Copyright (c) 2009-2010 Dominic Baggott
 * Copyright (c) 2009-2010 Ash Berlin
 * Copyright (c) 2011 Christoph Dorn <christoph@christophdorn.com> (http://www.christophdorn.com)
 * Version: 0.6.0-beta1
 * Date: 2014-07-28T16:38Z
 */
!function(a){function b(){return"Markdown.mk_block( "+uneval(this.toString())+", "+uneval(this.trailing)+", "+uneval(this.lineNumber)+" )"}function c(){var a=require("util");return"Markdown.mk_block( "+a.inspect(this.toString())+", "+a.inspect(this.trailing)+", "+a.inspect(this.lineNumber)+" )"}function d(a){return a.split("\n").length-1}function e(a){return a&&a.length>0?a.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"):""}function f(a){if("string"==typeof a)return e(a);var b=a.shift(),c={},d=[];for(!a.length||"object"!=typeof a[0]||a[0]instanceof Array||(c=a.shift());a.length;)d.push(f(a.shift()));var g="";"undefined"!=typeof c.src&&(g+=' src="'+e(c.src)+'"',delete c.src);for(var h in c){var i=e(c[h]);i&&i.length&&(g+=" "+h+'="'+i+'"')}return"img"===b||"br"===b||"hr"===b?"<"+b+g+"/>":"<"+b+g+">"+d.join("")+"</"+b+">"}function g(a,b,c){var d;c=c||{};var e=a.slice(0);"function"==typeof c.preprocessTreeNode&&(e=c.preprocessTreeNode(e,b));var f=q(e);if(f){e[1]={};for(d in f)e[1][d]=f[d];f=e[1]}if("string"==typeof e)return e;switch(e[0]){case"header":e[0]="h"+e[1].level,delete e[1].level;break;case"bulletlist":e[0]="ul";break;case"numberlist":e[0]="ol";break;case"listitem":e[0]="li";break;case"para":e[0]="p";break;case"markdown":e[0]="html",f&&delete f.references;break;case"code_block":e[0]="pre",d=f?2:1;var h=["code"];h.push.apply(h,e.splice(d,e.length-d)),e[d]=h;break;case"inlinecode":e[0]="code";break;case"img":e[1].src=e[1].href,delete e[1].href;break;case"linebreak":e[0]="br";break;case"link":e[0]="a";break;case"link_ref":e[0]="a";var i=b[f.ref];if(!i)return f.original;delete f.ref,f.href=i.href,i.title&&(f.title=i.title),delete f.original;break;case"img_ref":e[0]="img";var i=b[f.ref];if(!i)return f.original;delete f.ref,f.src=i.href,i.title&&(f.title=i.title),delete f.original}if(d=1,f){for(var j in e[1]){d=2;break}1===d&&e.splice(d,1)}for(;d<e.length;++d)e[d]=g(e[d],b,c);return e}function h(a){for(var b=q(a)?2:1;b<a.length;)"string"==typeof a[b]?b+1<a.length&&"string"==typeof a[b+1]?a[b]+=a.splice(b+1,1)[0]:++b:(h(a[b]),++b)}function i(a,b){function c(a){this.len_after=a,this.name="close_"+b}var d=a+"_state",e="strong"===a?"em_state":"strong_state";return function(f){if(this[d][0]===b)return this[d].shift(),[f.length,new c(f.length-b.length)];var g=this[e].slice(),h=this[d].slice();this[d].unshift(b);{var i=this.processInline(f.substr(b.length)),j=i[i.length-1];this[d].shift()}if(j instanceof c){i.pop();var k=f.length-j.len_after;return[k,[a].concat(i)]}return this[e]=g,this[d]=h,[b.length,b]}}function j(){q(this.tree)||this.tree.splice(1,0,{});var a=q(this.tree);return void 0===a.references&&(a.references={}),a}function k(a,b){b[2]&&"<"===b[2][0]&&">"===b[2][b[2].length-1]&&(b[2]=b[2].substring(1,b[2].length-1));var c=a.references[b[1].toLowerCase()]={href:b[2]};void 0!==b[4]?c.title=b[4]:void 0!==b[5]&&(c.title=b[5])}function l(a){for(var b=a.split(""),c=[""],d=!1;b.length;){var e=b.shift();switch(e){case" ":d?c[c.length-1]+=e:c.push("");break;case"'":case'"':d=!d;break;case"\\":e=b.shift();default:c[c.length-1]+=e}}return c}var m={};m.mk_block=function(a,d,e){1===arguments.length&&(d="\n\n");var f=new String(a);return f.trailing=d,f.inspect=c,f.toSource=b,void 0!==e&&(f.lineNumber=e),f};var n=m.isArray=Array.isArray||function(a){return"[object Array]"===Object.prototype.toString.call(a)};m.forEach=Array.prototype.forEach?function(a,b,c){return a.forEach(b,c)}:function(a,b,c){for(var d=0;d<a.length;d++)b.call(c||a,a[d],d,a)},m.isEmpty=function(a){for(var b in a)if(hasOwnProperty.call(a,b))return!1;return!0},m.extract_attr=function(a){return n(a)&&a.length>1&&"object"==typeof a[1]&&!n(a[1])?a[1]:void 0};var o=function(a){switch(typeof a){case"undefined":this.dialect=o.dialects.Gruber;break;case"object":this.dialect=a;break;default:if(!(a in o.dialects))throw new Error("Unknown Markdown dialect '"+String(a)+"'");this.dialect=o.dialects[a]}this.em_state=[],this.strong_state=[],this.debug_indent=""};o.dialects={};var p=o.mk_block=m.mk_block,n=m.isArray;o.parse=function(a,b){var c=new o(b);return c.toTree(a)},o.prototype.split_blocks=function(a){a=a.replace(/\r\n?/g,"\n");var b,c=/([\s\S]+?)($|\n#|\n(?:\s*\n|$)+)/g,e=[],f=1;for(null!==(b=/^(\s*\n)/.exec(a))&&(f+=d(b[0]),c.lastIndex=b[0].length);null!==(b=c.exec(a));)"\n#"===b[2]&&(b[2]="\n",c.lastIndex--),e.push(p(b[1],b[2],f)),f+=d(b[0]);return e},o.prototype.processBlock=function(a,b){var c=this.dialect.block,d=c.__order__;if("__call__"in c)return c.__call__.call(this,a,b);for(var e=0;e<d.length;e++){var f=c[d[e]].call(this,a,b);if(f)return(!n(f)||f.length>0&&!n(f[0])&&"string"!=typeof f[0])&&this.debug(d[e],"didn't return proper JsonML"),f}return[]},o.prototype.processInline=function(a){return this.dialect.inline.__call__.call(this,String(a))},o.prototype.toTree=function(a,b){var c=a instanceof Array?a:this.split_blocks(a),d=this.tree;try{for(this.tree=b||this.tree||["markdown"];c.length;){var e=this.processBlock(c.shift(),c);e.length&&this.tree.push.apply(this.tree,e)}return this.tree}finally{b&&(this.tree=d)}},o.prototype.debug=function(){var a=Array.prototype.slice.call(arguments);a.unshift(this.debug_indent),"undefined"!=typeof print&&print.apply(print,a),"undefined"!=typeof console&&"undefined"!=typeof console.log&&console.log.apply(null,a)},o.prototype.loop_re_over_block=function(a,b,c){for(var d,e=b.valueOf();e.length&&null!==(d=a.exec(e));)e=e.substr(d[0].length),c.call(this,d);return e},o.buildBlockOrder=function(a){var b=[];for(var c in a)"__order__"!==c&&"__call__"!==c&&b.push(c);a.__order__=b},o.buildInlinePatterns=function(a){var b=[];for(var c in a)if(!c.match(/^__.*__$/)){var d=c.replace(/([\\.*+?^$|()\[\]{}])/g,"\\$1").replace(/\n/,"\\n");b.push(1===c.length?d:"(?:"+d+")")}b=b.join("|"),a.__patterns__=b;var e=a.__call__;a.__call__=function(a,c){return void 0!==c?e.call(this,a,c):e.call(this,a,b)}};var q=m.extract_attr;o.renderJsonML=function(a,b){b=b||{},b.root=b.root||!1;var c=[];if(b.root)c.push(f(a));else for(a.shift(),!a.length||"object"!=typeof a[0]||a[0]instanceof Array||a.shift();a.length;)c.push(f(a.shift()));return c.join("\n\n")},o.toHTMLTree=function(a,b,c){"string"==typeof a&&(a=this.parse(a,b));var d=q(a),e={};d&&d.references&&(e=d.references);var f=g(a,e,c);return h(f),f},o.toHTML=function(a,b,c){var d=this.toHTMLTree(a,b,c);return this.renderJsonML(d)};var r={};r.inline_until_char=function(a,b){for(var c=0,d=[];;){if(a.charAt(c)===b)return c++,[c,d];if(c>=a.length)return[c,null,d];var e=this.dialect.inline.__oneElement__.call(this,a.substr(c));c+=e[0],d.push.apply(d,e.slice(1))}},r.subclassDialect=function(a){function b(){}function c(){}return b.prototype=a.block,c.prototype=a.inline,{block:new b,inline:new c}};var s=m.forEach,q=m.extract_attr,p=m.mk_block,t=m.isEmpty,u=r.inline_until_char,v=/(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?/i.source,w={block:{atxHeader:function(a,b){var c=a.match(/^(#{1,6})\s*(.*?)\s*#*\s*(?:\n|$)/);if(!c)return void 0;var d=["header",{level:c[1].length}];return Array.prototype.push.apply(d,this.processInline(c[2])),c[0].length<a.length&&b.unshift(p(a.substr(c[0].length),a.trailing,a.lineNumber+2)),[d]},setextHeader:function(a,b){var c=a.match(/^(.*)\n([-=])\2\2+(?:\n|$)/);if(!c)return void 0;var d="="===c[2]?1:2,e=["header",{level:d}].concat(this.processInline(c[1]));return c[0].length<a.length&&b.unshift(p(a.substr(c[0].length),a.trailing,a.lineNumber+2)),[e]},code:function(a,b){var c=[],d=/^(?: {0,3}\t| {4})(.*)\n?/;if(!a.match(d))return void 0;a:for(;;){var e=this.loop_re_over_block(d,a.valueOf(),function(a){c.push(a[1])});if(e.length){b.unshift(p(e,a.trailing));break a}if(!b.length)break a;if(!b[0].match(d))break a;c.push(a.trailing.replace(/[^\n]/g,"").substring(2)),a=b.shift()}return[["code_block",c.join("\n")]]},horizRule:function(a,b){var c=a.match(/^(?:([\s\S]*?)\n)?[ \t]*([-_*])(?:[ \t]*\2){2,}[ \t]*(?:\n([\s\S]*))?$/);if(!c)return void 0;var d=[["hr"]];if(c[1]){var e=p(c[1],"",a.lineNumber);d.unshift.apply(d,this.toTree(e,[]))}return c[3]&&b.unshift(p(c[3],a.trailing,a.lineNumber+1)),d},lists:function(){function a(a){return new RegExp("(?:^("+i+"{0,"+a+"} {0,3})("+f+")\\s+)|(^"+i+"{0,"+(a-1)+"}[ ]{0,4})")}function b(a){return a.replace(/ {0,3}\t/g,"    ")}function c(a,b,c,d){if(b)return void a.push(["para"].concat(c));var e=a[a.length-1]instanceof Array&&"para"===a[a.length-1][0]?a[a.length-1]:a;d&&a.length>1&&c.unshift(d);for(var f=0;f<c.length;f++){var g=c[f],h="string"==typeof g;h&&e.length>1&&"string"==typeof e[e.length-1]?e[e.length-1]+=g:e.push(g)}}function d(a,b){for(var c=new RegExp("^("+i+"{"+a+"}.*?\\n?)*$"),d=new RegExp("^"+i+"{"+a+"}","gm"),e=[];b.length>0&&c.exec(b[0]);){var f=b.shift(),g=f.replace(d,"");e.push(p(g,f.trailing,f.lineNumber))}return e}function e(a,b,c){var d=a.list,e=d[d.length-1];if(!(e[1]instanceof Array&&"para"===e[1][0]))if(b+1===c.length)e.push(["para"].concat(e.splice(1,e.length-1)));else{var f=e.pop();e.push(["para"].concat(e.splice(1,e.length-1)),f)}}var f="[*+-]|\\d+\\.",g=/[*+-]/,h=new RegExp("^( {0,3})("+f+")[ 	]+"),i="(?: {0,3}\\t| {4})";return function(f,i){function j(a){var b=g.exec(a[2])?["bulletlist"]:["numberlist"];return n.push({list:b,indent:a[1]}),b}var k=f.match(h);if(!k)return void 0;for(var l,m,n=[],o=j(k),p=!1,q=[n[0].list];;){for(var r=f.split(/(?=\n)/),t="",u="",v=0;v<r.length;v++){u="";var w=r[v].replace(/^\n/,function(a){return u=a,""}),x=a(n.length);if(k=w.match(x),void 0!==k[1]){t.length&&(c(l,p,this.processInline(t),u),p=!1,t=""),k[1]=b(k[1]);var y=Math.floor(k[1].length/4)+1;if(y>n.length)o=j(k),l.push(o),l=o[1]=["listitem"];else{var z=!1;for(m=0;m<n.length;m++)if(n[m].indent===k[1]){o=n[m].list,n.splice(m+1,n.length-(m+1)),z=!0;break}z||(y++,y<=n.length?(n.splice(y,n.length-y),o=n[y-1].list):(o=j(k),l.push(o))),l=["listitem"],o.push(l)}u=""}w.length>k[0].length&&(t+=u+w.substr(k[0].length))}if(t.length){var A=this.processBlock(t,[]),B=A[0];B&&(B.shift(),A.splice.apply(A,[0,1].concat(B)),c(l,p,A,u),"\n"===l[l.length-1]&&l.pop(),p=!1,t="")}var C=d(n.length,i);C.length>0&&(s(n,e,this),l.push.apply(l,this.toTree(C,[])));var D=i[0]&&i[0].valueOf()||"";if(!D.match(h)&&!D.match(/^ /))break;f=i.shift();var E=this.dialect.block.horizRule.call(this,f,i);if(E){q.push.apply(q,E);break}n[n.length-1].indent===f.match(/^\s*/)[0]&&s(n,e,this),p=!0}return q}}(),blockquote:function(a,b){var c=/(^|\n) +(\>[\s\S]*)/.exec(a);if(c&&c[2]&&c[2].length){var d=a.replace(/(^|\n) +\>/,"$1>");return b.unshift(d),[]}if(!a.match(/^>/m))return void 0;var e=[];if(">"!==a[0]){for(var f=a.split(/\n/),g=[],h=a.lineNumber;f.length&&">"!==f[0][0];)g.push(f.shift()),h++;var i=p(g.join("\n"),"\n",a.lineNumber);e.push.apply(e,this.processBlock(i,[])),a=p(f.join("\n"),a.trailing,h)}for(;b.length&&">"===b[0][0];){var j=b.shift();a=p(a+a.trailing+j,j.trailing,a.lineNumber)}var k=a.replace(/^> ?/gm,""),l=(this.tree,this.toTree(k,["blockquote"])),m=q(l);return m&&m.references&&(delete m.references,t(m)&&l.splice(1,1)),e.push(l),e},referenceDefn:function(a,b){var c=/^\s*\[(.*?)\]:\s*(\S+)(?:\s+(?:(['"])(.*)\3|\((.*?)\)))?\n?/;if(!a.match(c))return void 0;var d=j.call(this),e=this.loop_re_over_block(c,a,function(a){k(d,a)});return e.length&&b.unshift(p(e,a.trailing)),[]},para:function(a){return[["para"].concat(this.processInline(a))]}},inline:{__oneElement__:function(a,b,c){var d,e;b=b||this.dialect.inline.__patterns__;var f=new RegExp("([\\s\\S]*?)("+(b.source||b)+")");if(d=f.exec(a),!d)return[a.length,a];if(d[1])return[d[1].length,d[1]];var e;return d[2]in this.dialect.inline&&(e=this.dialect.inline[d[2]].call(this,a.substr(d.index),d,c||[])),e=e||[d[2].length,d[2]]},__call__:function(a,b){function c(a){"string"==typeof a&&"string"==typeof e[e.length-1]?e[e.length-1]+=a:e.push(a)}for(var d,e=[];a.length>0;)d=this.dialect.inline.__oneElement__.call(this,a,b,e),a=a.substr(d.shift()),s(d,c);return e},"]":function(){},"}":function(){},__escape__:/^\\[\\`\*_{}<>\[\]()#\+.!\-]/,"\\":function(a){return this.dialect.inline.__escape__.exec(a)?[2,a.charAt(1)]:[1,"\\"]},"![":function(a){if(!(a.indexOf("(")>=0&&-1===a.indexOf(")"))){var b=a.match(new RegExp("^!\\[(.*?)][ \\t]*\\(("+v+")\\)([ \\t])*([\"'].*[\"'])?"))||a.match(/^!\[(.*?)\][ \t]*\([ \t]*([^")]*?)(?:[ \t]+(["'])(.*?)\3)?[ \t]*\)/);if(b){b[2]&&"<"===b[2][0]&&">"===b[2][b[2].length-1]&&(b[2]=b[2].substring(1,b[2].length-1)),b[2]=this.dialect.inline.__call__.call(this,b[2],/\\/)[0];var c={alt:b[1],href:b[2]||""};return void 0!==b[4]&&(c.title=b[4]),[b[0].length,["img",c]]}return b=a.match(/^!\[(.*?)\][ \t]*\[(.*?)\]/),b?[b[0].length,["img_ref",{alt:b[1],ref:b[2].toLowerCase(),original:b[0]}]]:[2,"!["]}},"[":function y(a){for(var b=1,c=0;c<a.length;c++){var d=a.charAt(c);if("["===d&&b++,"]"===d&&b--,b>3)return[1,"["]}var e=String(a),f=u.call(this,a.substr(1),"]");if(!f[1])return[f[0]+1,a.charAt(0)].concat(f[2]);var y,g,h=1+f[0],i=f[1];a=a.substr(h);var l=a.match(/^\s*\([ \t]*([^"']*)(?:[ \t]+(["'])(.*?)\2)?[ \t]*\)/);if(l){var m=l[1].replace(/\s+$/,"");if(h+=l[0].length,m&&"<"===m[0]&&">"===m[m.length-1]&&(m=m.substring(1,m.length-1)),!l[3])for(var n=1,o=0;o<m.length;o++)switch(m[o]){case"(":n++;break;case")":0===--n&&(h-=m.length-o,m=m.substring(0,o))}return m=this.dialect.inline.__call__.call(this,m,/\\/)[0],g={href:m||""},void 0!==l[3]&&(g.title=l[3]),y=["link",g].concat(i),[h,y]}if(l=a.match(new RegExp("^\\(("+v+")\\)")),l&&l[1])return h+=l[0].length,y=["link",{href:l[1]}].concat(i),[h,y];if(l=a.match(/^\s*\[(.*?)\]/),l&&(h+=l[0].length,g={ref:(l[1]||String(i)).toLowerCase(),original:e.substr(0,h)},i&&i.length>0))return y=["link_ref",g].concat(i),[h,y];if(l=e.match(/^\s*\[(.*?)\]:\s*(\S+)(?:\s+(?:(['"])(.*?)\3|\((.*?)\)))?\n?/)){var g=j.call(this);return k(g,l),[l[0].length]}if(1===i.length&&"string"==typeof i[0]){var p=i[0].toLowerCase().replace(/\s+/," ");return g={ref:p,original:e.substr(0,h)},y=["link_ref",g,i[0]],[h,y]}return[1,"["]},"<":function(a){var b;return null!==(b=a.match(/^<(?:((https?|ftp|mailto):[^>]+)|(.*?@.*?\.[a-zA-Z]+))>/))?b[3]?[b[0].length,["link",{href:"mailto:"+b[3]},b[3]]]:"mailto"===b[2]?[b[0].length,["link",{href:b[1]},b[1].substr("mailto:".length)]]:[b[0].length,["link",{href:b[1]},b[1]]]:[1,"<"]},"`":function(a){var b=a.match(/(`+)(([\s\S]*?)\1)/);return b&&b[2]?[b[1].length+b[2].length,["inlinecode",b[3]]]:[1,"`"]},"  \n":function(){return[3,["linebreak"]]}}};w.inline["**"]=i("strong","**"),w.inline.__=i("strong","__"),w.inline["*"]=i("em","*"),w.inline._=i("em","_"),o.dialects.Gruber=w,o.buildBlockOrder(o.dialects.Gruber.block),o.buildInlinePatterns(o.dialects.Gruber.inline);var x=r.subclassDialect(w),q=m.extract_attr,s=m.forEach;x.processMetaHash=function(a){for(var b=l(a),c={},d=0;d<b.length;++d)if(/^#/.test(b[d]))c.id=b[d].substring(1);else if(/^\./.test(b[d]))c["class"]=c["class"]?c["class"]+b[d].replace(/./," "):b[d].substring(1);else if(/\=/.test(b[d])){var e=b[d].split(/\=/);c[e[0]]=e[1]}return c},x.block.document_meta=function(a){if(a.lineNumber>1)return void 0;if(!a.match(/^(?:\w+:.*\n)*\w+:.*$/))return void 0;q(this.tree)||this.tree.splice(1,0,{});var b=a.split(/\n/);for(var c in b){var d=b[c].match(/(\w+):\s*(.*)$/),e=d[1].toLowerCase(),f=d[2];this.tree[1][e]=f}return[]},x.block.block_meta=function(a){var b=a.match(/(^|\n) {0,3}\{:\s*((?:\\\}|[^\}])*)\s*\}$/);if(!b)return void 0;var c,d=this.dialect.processMetaHash(b[2]);if(""===b[1]){var e=this.tree[this.tree.length-1];if(c=q(e),"string"==typeof e)return void 0;c||(c={},e.splice(1,0,c));for(var f in d)c[f]=d[f];return[]}var g=a.replace(/\n.*$/,""),h=this.processBlock(g,[]);c=q(h[0]),c||(c={},h[0].splice(1,0,c));for(var f in d)c[f]=d[f];return h},x.block.definition_list=function(a,b){var c,d,e=/^((?:[^\s:].*\n)+):\s+([\s\S]+)$/,f=["dl"];if(!(d=a.match(e)))return void 0;for(var g=[a];b.length&&e.exec(b[0]);)g.push(b.shift());for(var h=0;h<g.length;++h){var d=g[h].match(e),i=d[1].replace(/\n$/,"").split(/\n/),j=d[2].split(/\n:\s+/);for(c=0;c<i.length;++c)f.push(["dt",i[c]]);for(c=0;c<j.length;++c)f.push(["dd"].concat(this.processInline(j[c].replace(/(\n)\s+/,"$1"))))}return[f]},x.block.table=function z(a){var b,c,d=function(a,b){b=b||"\\s",b.match(/^[\\|\[\]{}?*.+^$]$/)&&(b="\\"+b);for(var c,d=[],e=new RegExp("^((?:\\\\.|[^\\\\"+b+"])*)"+b+"(.*)");c=a.match(e);)d.push(c[1]),a=c[2];return d.push(a),d},e=/^ {0,3}\|(.+)\n {0,3}\|\s*([\-:]+[\-| :]*)\n((?:\s*\|.*(?:\n|$))*)(?=\n|$)/,f=/^ {0,3}(\S(?:\\.|[^\\|])*\|.*)\n {0,3}([\-:]+\s*\|[\-| :]*)\n((?:(?:\\.|[^\\|])*\|.*(?:\n|$))*)(?=\n|$)/;if(c=a.match(e))c[3]=c[3].replace(/^\s*\|/gm,"");else if(!(c=a.match(f)))return void 0;var z=["table",["thead",["tr"]],["tbody"]];c[2]=c[2].replace(/\|\s*$/,"").split("|");var g=[];for(s(c[2],function(a){g.push(a.match(/^\s*-+:\s*$/)?{align:"right"}:a.match(/^\s*:-+\s*$/)?{align:"left"}:a.match(/^\s*:-+:\s*$/)?{align:"center"}:{})}),c[1]=d(c[1].replace(/\|\s*$/,""),"|"),b=0;b<c[1].length;b++)z[1][1].push(["th",g[b]||{}].concat(this.processInline(c[1][b].trim())));return s(c[3].replace(/\|\s*$/gm,"").split("\n"),function(a){var c=["tr"];for(a=d(a,"|"),b=0;b<a.length;b++)c.push(["td",g[b]||{}].concat(this.processInline(a[b].trim())));z[2].push(c)},this),[z]},x.inline["{:"]=function(a,b,c){if(!c.length)return[2,"{:"];var d=c[c.length-1];if("string"==typeof d)return[2,"{:"];var e=a.match(/^\{:\s*((?:\\\}|[^\}])*)\s*\}/);if(!e)return[2,"{:"];var f=this.dialect.processMetaHash(e[1]),g=q(d);g||(g={},d.splice(1,0,g));for(var h in f)g[h]=f[h];return[e[0].length,""]},o.dialects.Maruku=x,o.dialects.Maruku.inline.__escape__=/^\\[\\`\*_{}\[\]()#\+.!\-|:]/,o.buildBlockOrder(o.dialects.Maruku.block),o.buildInlinePatterns(o.dialects.Maruku.inline),a.Markdown=o,a.parse=o.parse,a.toHTML=o.toHTML,a.toHTMLTree=o.toHTMLTree,a.renderJsonML=o.renderJsonML,a.DialectHelpers=r}(function(){return window.markdown={},window.markdown}());
define('gh', ['jquery', 'localStorage-cache'], function($, cacheService){

  return {

    getGitHubProjects : function (user, options, cb){
      var cache = cacheService.get('gh-feed');
      if (cache){
        return cb(JSON.parse(cache));
      }

      $.getJSON('https://api.github.com/users/' + user + '/repos?per_page=50&callback=?', function(data){
        cb(data);
        cacheService.set('gh-feed', JSON.stringify(data), 60 * (options.cache_duration_minutes || 10));
      });
    }
  };

});
define('service-markdown-fetcher', ['jquery', 'localStorage-cache'], function($, cacheService){

  return {

    fetch : function (owner, repo, options, cb){
      var key = 'markdown-for-' + owner + '-' + repo;
      var cache = cacheService.get(key);
      if (cache){
        return cb(cache);
      }

      $.getJSON('https://api.github.com/repos/' + owner + '/' + repo + '/readme', function(data){
        cb(data);
        cacheService.set(key, data, 60 * (options.cache_duration_minutes || 10));
      });
    }
  };
});
define('settings', function(){

  var DEV = true;

  var SETTINGS = {
    max_gh_projects: 7,
    min_window_width: 900, //extra content will be shown for bigger sizes
    left_margin_extra_content: 610,
    CND_IMG_PREFIX: DEV ? 'images/' : 'http://d13ry56xmap4ax.cloudfront.net/'
  };

  return SETTINGS;

});