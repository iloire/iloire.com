(function($){

  var content = {

    'filosofia': '<div><img class="dropshadow" src="images/filosofia_big_by_javier_agustin_rounded.jpg"><span>:)</span></div>',

    'map' : '<div><img class="dropshadow" src="images/zaragoza.jpg"><span>Zaragoza (Spain)</span></div>',
    'map_sydney' : '<div><img class="dropshadow" src="images/sydney.jpg"><span>Sydney (Australia)</span></div>',
    'express' : '<div><img src="images/express_js.png"></div>',
    'math_race' : '<div><img src="images/math_race02.png"></div>',
    'fatri' : '<div><img class="dropshadow" src="images/triatlonaragon.jpg"><span>Triatlhon regional association. I created and support the website</span></div>',
    '2earth' : '<div><img src="images/2earth_01.png"></div>',
    'watchmen' : '<div><img class="dropshadow" src="images/watchmen.jpg"><span>A node.js service monitor. Source code available on GitHub</span></div>',
    'codemotion_node': '<div><img class="dropshadow" src="images/building-with-node.jpg"></div>',
    'directorio_cachirulo': '<div><img class="dropshadow" src="images/directorio.jpg"><span>Local freelance directory. Software created with node.js and redis. Available on GitHub</span></div>',
    'math_race_video':'<div><img src="images/math_race_video01.png"></div>',
    'letsnode':'<div><img class="dropshadow" src="images/letsnode.jpg"></div>',
    'backbone_google_maps': '<div><img class="dropshadow" src="images/backbone-googlemaps.jpg"><span>Playing with Backbone.js and Google Maps..</span></div>',
    'atlasboard':'<div><img class="dropshadow" src="images/atlasboard-01.jpg"><span>Atlasboard, simple and beautiful dashboards for everyone</span></div>',

  };

  var preload = function (arrayOfImages) {
    $(arrayOfImages).each(function(){
      $('<img/>')[0].src = this;
    });
  };

  var settings = {
    min_window_width : 900, //extra content will be shown for bigger sizes
    left_margin_extra_content : 600,
    offset_top : 20,
    cache_duration_minutes: 10
  };

  //------------------------------------
  // Throttle api calls by caching them
  //------------------------------------
  var cache_service = {
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

  //------------------------------------
  // Github service. Fetch gh project feed
  //------------------------------------
  var github_service = {

    getGitHubProjects : function (user, where){
      var cache = cache_service.get('gh-feed');
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
        cache_service.set('gh-feed', output, 60 * settings.cache_duration_minutes);
      });
    }
  };

  function size_compatible_with_extra_content(){
    var windowWidth = $(window).width();
    return (windowWidth > settings.min_window_width);
  }

  function move_and_resize_if_exists(){
      var windowWidth = $(window).width();
      var rightMargin = 50;
      var max_width_extra_content = windowWidth - settings.left_margin_extra_content - rightMargin;

      $(extra_content).css({
        top: $(window).scrollTop() + settings.offset_top, 
        left: settings.left_margin_extra_content,
        position: 'absolute', 
        width: max_width_extra_content + 'px'
      });

      //resize images
      $('img', extra_content).css({'max-width': max_width_extra_content + 'px'});
  }

  function show_extra_content (content) {
    $(extra_content).html(content);
    move_and_resize_if_exists();
  }

  var extra_content = $('#extrainfo'); //cache element
  var timeout_fade = null;

  //------------------------------------------
  // Initialization  when DOM is ready
  //------------------------------------------
  $(function() {

    $(window).resize(function(){
      move_and_resize_if_exists();
    });

    //bind static links to extra content
    $('a.extra_content').mouseover(function(ev){
      clearTimeout(timeout_fade);
      if (size_compatible_with_extra_content()){
        extra_content.fadeIn();
        show_extra_content(content[$(this).attr('data-contentid')]);
      }
    });

    $('a.extra_content').mouseout(function(ev){
      timeout_fade = setTimeout(function(){
        $(extra_content).fadeOut(800, function(){
          $(extra_content).empty();
        });
      }, 1500);
    });

    //show initial element
    extra_content.fadeIn();
    show_extra_content(content[0]);

    $('#extrainfo').on('mouseover', function(){
      clearTimeout(timeout_fade);
    });

    //load github projects
    github_service.getGitHubProjects('iloire', '#ghcontainer');

    if ($(window).width() > settings.min_window_width){
      //preload if we show extra content
      preload([
          'images/zaragoza.jpg',
          'images/sydney.jpg',
          'images/backbone-googlemaps.jpg',
          'images/letsnode.jpg',
          'images/atlasboard-01.jpg',
          'images/math_race01.png',
          'images/triatlonaragon.jpg',
          'images/watchmen.jpg',
          'images/building-with-node.jpg',
          'images/directorio.jpg',
          'images/math_race_video01.png'
      ]);
    }
  });

})($);