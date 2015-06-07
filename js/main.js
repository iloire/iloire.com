require(['jquery', 'gh', 'image-preloader', 'background-effect'], function($, gh, preloader, backgroundEffect){

  var DEBUG = true;
  var CND_IMG_PREFIX = 'http://d13ry56xmap4ax.cloudfront.net';

  if (DEBUG){
    CND_IMG_PREFIX = 'images';
  }

  var PRELOAD_IMAGES = [
    CND_IMG_PREFIX + '/dgallery1.png',
    CND_IMG_PREFIX + '/shipit24.jpg',
    CND_IMG_PREFIX + '/linkedin.jpg',
    CND_IMG_PREFIX + '/bitbucket.jpg',
    CND_IMG_PREFIX + '/github.jpg',
    CND_IMG_PREFIX + '/zaragoza.jpg',
    CND_IMG_PREFIX + '/sydney.jpg',
    CND_IMG_PREFIX + '/backbone-googlemaps.jpg',
    CND_IMG_PREFIX + '/letsnode.jpg',
    CND_IMG_PREFIX + '/atlasboard-01.jpg',
    CND_IMG_PREFIX + '/math_race01.png',
    CND_IMG_PREFIX + '/triatlonaragon.jpg',
    CND_IMG_PREFIX + '/watchmen.png',
    CND_IMG_PREFIX + '/directorio.jpg',
    CND_IMG_PREFIX + '/2earth_01.png'
  ];

  var SETTINGS = {
    max_gh_projects: 7,
    min_window_width : 900, //extra content will be shown for bigger sizes
    left_margin_extra_content : 610,
    cache_duration_minutes: 10
  };

  var content = {
    'dgallery' : '<div><img class="dropshadow" src="' + CND_IMG_PREFIX + '/dgallery1.png"><span>dGallery, a sexy asp.net mvc photo gallery</span></div>',
    'atlassian' : '<div><img class="dropshadow" src="' + CND_IMG_PREFIX + '/shipit24.jpg"></div>',
    'linkedin' : '<div><img class="dropshadow" src="' + CND_IMG_PREFIX + '/linkedin.jpg"><span>Linkedin</span></div>',
    'github' : '<div><img class="dropshadow" src="' + CND_IMG_PREFIX + '/github.jpg"><span>Github (@loire)</span></div>',
    'map' : '<div class="map-europe"><div class=pulse></div><div class=img-wrapper><img src="' + CND_IMG_PREFIX + '/europe.svg"></div></div>',
    'express' : '<div><img src="' + CND_IMG_PREFIX + '/express_js.png"></div>',
    'math_race' : '<div><img src="' + CND_IMG_PREFIX + '/math_race02.png"></div>',
    'fatri' : '<div><img class="dropshadow" src="' + CND_IMG_PREFIX + '/triatlonaragon.jpg"><span>Triatlhon regional association. I created and maintain the website</span></div>',
    '2earth' : '<div><img src="' + CND_IMG_PREFIX + '/2earth_01.png"></div>',
    'watchmen' : '<div><img class="dropshadow" src="' + CND_IMG_PREFIX + '/watchmen.png"><span>A node.js service monitor. Source code available on GitHub</span></div>',
    'directorio_cachirulo': '<div><img class="dropshadow" src="' + CND_IMG_PREFIX + '/directorio.jpg"><span>Local freelance directory. Software created with node.js and redis. Available on GitHub</span></div>',
    'letsnode' : '<div><img class="dropshadow" src="' + CND_IMG_PREFIX + '/letsnode.jpg"></div>',
    'backbone_google_maps' : '<div><img class="dropshadow" src="' + CND_IMG_PREFIX + '/backbone-googlemaps.jpg"><span>Playing with Backbone.js and Google Maps..</span></div>',
    'atlasboard' : '<div><img class="dropshadow" src="' + CND_IMG_PREFIX + '/atlasboard-01.jpg"><span>Atlasboard, simple and beautiful dashboards for everyone</span></div>',
  };

  function log(o) {
    if (DEBUG) {
      console.log(o);
    }
  }

  function size_compatible_with_extra_content(){
    var windowWidth = window.innerWidth;
    return (windowWidth > SETTINGS.min_window_width);
  }

  function move_and_resize_if_exists(){
    if (size_compatible_with_extra_content()){
      var windowWidth = window.innerWidth;
      var rightMargin = 0;
      var max_width_extra_content = windowWidth - SETTINGS.left_margin_extra_content - rightMargin;

      extra_content.css({
        top: $(window).scrollTop(),
        right: rightMargin,
        width: max_width_extra_content + 'px'
      });
    }
    else {
      if (extra_content.is(":visible")){
        hide_extra_content();
      }
    }
  }

  function hide_extra_content () {
    extra_content.fadeOut(800, function(){
      extra_content.empty();
    });
  }

  function show_extra_content (content) {
    extra_content.html(content);
    move_and_resize_if_exists();
  }

  function track(cat, action, label, val){
    ga('send', 'event', cat, action, label, val);
  }

  var extra_content = $('#extrainfo');
  var timeout_fade = null;


  var init = function() {

    window.addEventListener("resize", move_and_resize_if_exists);
    window.onscroll = move_and_resize_if_exists;

    //bind static links to extra content
    $('a.extra_content').mouseover(function(ev){
      clearTimeout(timeout_fade);
      if (size_compatible_with_extra_content()){
        extra_content.fadeIn();
        var id = $(this).attr('data-contentid');
        show_extra_content(content[id]);
        track('general', 'mouseover', id);
      }
    });

    $('a.extra_content').mouseout(function(ev){
      timeout_fade = setTimeout(hide_extra_content, 1500);
    });

    $('#extrainfo').on('mouseover', function(){
      clearTimeout(timeout_fade);
    });

    //show initial element
    extra_content.fadeIn();
    show_extra_content(content[0]);

    backgroundEffect.init();

    var where = document.getElementById('ghcontainer');
    where.innerHTML = 'loading...';
    gh.getGitHubProjects('iloire', SETTINGS, function(data){
        data.data.sort(function sorter(a,b) { return b.watchers - a.watchers; });
        var output = '';
        if (data.data.length){
          output="<ul>";
          for (var i=0, c=0 ;(c < SETTINGS.max_gh_projects && i < data.data.length);i++){
            var project = data.data[i];
            if (!project.fork){ //show only own projects
              output = output + '<li><span class="label label-warning watchers"><a title="watchers" target=_blank href="'+
                project.html_url + '/watchers">' + project.watchers + '</a></span>' +
                ' <span class="label label-info forks"><a title="forks" target=_blank href="' + project.html_url +
                '/network">' + project.forks + '</a></span>' + '  <a class="gh-project" target=_blank href="' +
                project.html_url + '">' + project.name + '</a>: <span class="gh-project-description">' + project.description + '</span></li>';
              c++;
            }
          }
          output = output + "</ul>";
        }
        else{
          output = '<p>No projects to show.</p>';
        }
        where.innerHTML = output;
    });

    if (size_compatible_with_extra_content()){
      preloader.preload(PRELOAD_IMAGES);
    }
  };

  init();

});

