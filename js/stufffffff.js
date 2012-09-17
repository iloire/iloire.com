var app = {};

app.content = {
  'map' : '<div><img src="images/zaragoza_spain.png"></div>',
  'express' : '<div><img src="images/express_js.png"></div>',
  'math_race' : '<div><img src="images/math_race02.png"></div>',
  'fatri' : '<div><img src="images/fatri_01.png"></div>',
  '2earth' : '<div><img src="images/2earth_01.png"></div>',
  'node' : '<div><img src="images/node_01.png"></div>',
  'watchmen' : '<div><img src="images/watchmen_01.png"></div>',
  'codemotion_node': '<div><img src="images/codemotion_node_01.png"></div>',
  'directorio_cachirulo': '<div><img src="images/directorio_cachirulo02.png"></div>',
  'mvc3invoice':'<div><img src="images/mvc2invoice_01.png"></div>',
  'math_race_video':'<div><img src="images/math_race_video01.png"></div>',
  'letsnode':'<div><img src="images/letsnode01.png"></div>',
  'real_time_apps_slides':'<div><img src="images/real_time_apps_slides01.png"></div>'
};

app.preload = function (arrayOfImages) {
    $(arrayOfImages).each(function(){
        $('<img/>')[0].src = this;
    });
};

app.settings = {
  min_window_width : 767, //extra content will be shown for bigger sizes
  left_margin_extra_content : 600,
  offset_top : 20
};

app.github_service = {
  getGitHubProjects : function (user, where){

    if(typeof(Storage)!=="undefined"){
      if (localStorage.ghprojects){ //get from localStorage
        $(where).html(localStorage.ghprojects);
        return;
      }
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

      if(typeof(Storage)!=="undefined"){ //cache in localStorage
        localStorage.ghprojects = output;
      }
    });
  }
};

app.set_extra_content = function(extra_content, caller_element){
  var windowWidth = $(window).width();

  if (windowWidth > app.settings.min_window_width){ //apply extra content

    var top = $(window).scrollTop() + app.settings.offset_top;

    if (caller_element){
      var id = $(caller_element).attr('data-contentid');
      $(extra_content).css({top: top, left: app.settings.left_margin_extra_content,
        position: 'absolute' }).html(app.content[id]).fadeIn();

      $(caller_element).addClass('active');
    }

    //resize images
    var max_width_images = windowWidth - app.settings.left_margin_extra_content - 40;
    $('img', extra_content).css({'max-width': max_width_images + 'px'});

  }
  else{
    $(extra_content).hide();
  }
};

$(document).ready(function() {

  var extra_content = $('#extrainfo'); //cache element

  $(window).resize(function(){
    app.set_extra_content(extra_content);
  });

  $('a.extra_content').mouseover(function(ev){
    clearTimeout(app.timeout_fade);
    app.set_extra_content(extra_content, this);
  });

  $('a.extra_content').mouseout(function(ev){
    $(this).removeClass('active');
    app.timeout_fade = setTimeout(function(){
      $(extra_content).fadeOut('800');
    }, 1000);
  });

  $('a.extra_content').first().mouseover(); //show initial element

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
