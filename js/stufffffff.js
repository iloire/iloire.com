var app = {};

app.content = {
  'map' : '<div><img src="images/zaragoza_spain.png"><span>Zaragoza (Spain)</span></div>',
  'map_sydney' : '<div><img src="images/sydney_map.png"><span>Sydney (Australia)</span></div>',
  'express' : '<div><img src="images/express_js.png"></div>',
  'math_race' : '<div><img src="images/math_race02.png"></div>',
  'fatri' : '<div><img src="images/fatri_01.png"><span>Triatlhon regional association. I created and support the website</span></div>',
  '2earth' : '<div><img src="images/2earth_01.png"></div>',
  'watchmen' : '<div><img src="images/watchmen_01.png"><span>A node.js service monitor. Source code available on GitHub</span></div>',
  'codemotion_node': '<div><img src="images/codemotion_node_01.png"></div>',
  'directorio_cachirulo': '<div><img src="images/directorio_cachirulo02.png"><span>Local freelance directory. Software created with node.js and redis. Available on GitHub</span></div>',
  'mvc3invoice':'<div><img src="images/mvc2invoice_01.png"></div>',
  'math_race_video':'<div><img src="images/math_race_video01.png"></div>',
  'letsnode':'<div><img src="images/letsnode01.png"></div>',
  'real_time_apps_slides':'<div><img src="images/real_time_apps_slides01.png"></div>',
  'backbone_google_maps': '<div><img src="images/backbone_google_maps01.png"><span>Playing with Backbone.js and Google Maps..</span></div>',
  'atlasboard':'<div><img src="images/atlasboard-02.jpg"><span>Atlasboard, simple and beautiful dashboards for everyone</span></div>',
};

app.preload = function (arrayOfImages) {
  $(arrayOfImages).each(function(){
    $('<img/>')[0].src = this;
  });
};

app.settings = {
  min_window_width : 767, //extra content will be shown for bigger sizes
  left_margin_extra_content : 600,
  offset_top : 20,
  cache_duration_minutes: 10
};

//------------------------------------
// Throttle api calls by caching them
//------------------------------------
app.cache_service = {
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
},

//------------------------------------
// Github service. Fetch gh project feed
//------------------------------------
app.github_service = {

  getGitHubProjects : function (user, where){
    var cache = app.cache_service.get('gh-feed');
    if (cache){
      $(where).html(cache);
      return;
    }

    $(where).html('loading...');
    $.getJSON('https://api.github.com/users/' + user + '/repos?callback=?', function(data){

      //sort by watchers desc
      data.data.sort(function sorter(a,b) { return b.watchers - a.watchers; });

      var output = '';
      if (data.data.length){
        output="<ul>";
        for (var i=0, c=0 ;(c<5 && i<data.data.length);i++){
          var project = data.data[i];
          if (!project.fork){ //show only own projects
            output = output + '<li><span class="label label-warning"><a title="watchers" target=_blank href="'+
              project.html_url + '/watchers">' + project.watchers + '</a></span>' +
              ' / <span class="label label-info"><a title="forks" target=_blank href="' + project.html_url +
              '/network">' + project.forks + '</a></span>' + ' - <a target=_blank href="' +
              project.html_url + '">' + project.name + '</a>: ' + project.description + '</li>';
            c++;
          }
        }
        output = output + "</ul>";
      }
      else{
        output = '<p>No projects to show.</p>';
      }

      $(where).html(output);
      app.cache_service.set('gh-feed', output, 60 * app.settings.cache_duration_minutes);
    });
  }
};

app.set_extra_content = function(extra_content, caller_element){
  var windowWidth = $(window).width();

  if (windowWidth > app.settings.min_window_width){ //apply extra content

    if (caller_element){
      var id = $(caller_element).attr('data-contentid');

      $(extra_content).html(app.content[id]);
      $(caller_element).addClass('active');
    }

    //set size acording to current window size
    var top = $(window).scrollTop() + app.settings.offset_top;
    var max_width_extra_content = windowWidth - app.settings.left_margin_extra_content - 40;

    $(extra_content).css({top: top, left: app.settings.left_margin_extra_content,
      position: 'absolute', 'width': max_width_extra_content + 'px'}).fadeIn();

    //resize images
    $('img', extra_content).css({'max-width': max_width_extra_content + 'px'});
  }
  else{
    $(extra_content).hide();
  }
};

//------------------------------------------
// Initialization  when DOM is ready
//------------------------------------------
$(document).ready(function() {

  var extra_content = $('#extrainfo'); //cache element

  $(window).resize(function(){
    app.set_extra_content(extra_content);
  });

  //bind static links to extra content
  $('a.extra_content').mouseover(function(ev){
    clearTimeout(app.timeout_fade);
    app.set_extra_content(extra_content, this);
  });

  $('a.extra_content').mouseout(function(ev){
    $(this).removeClass('active');
    clearTimeout(app.timeout_fade);
    app.timeout_fade = setTimeout(function(){
      $(extra_content).fadeOut(800);
    }, 1000);
  });

  //show initial element
  $('a.extra_content').first().mouseover();

  $('#extrainfo').on('mouseover', function(){
    clearTimeout(app.timeout_fade);
  });

  //load github projects
  app.github_service.getGitHubProjects('iloire', '#ghcontainer');

  if ($(window).width()>app.settings.min_window_width){
    //preload if we show extra content
    app.preload([
        'images/zaragoza_spain.png',
        'images/express_js.png',
        'images/math_race01.png',
        'images/fatri_01.png',
        'images/2earth_01.png',
        'images/node_01.png',
        'images/watchmen_01.png',
        'images/codemotion_node_01.png',
        'images/directorio_cachirulo02.png',
        'images/mvc2invoice_01.png',
        'images/math_race_video01.png'
    ]);
  }
});
