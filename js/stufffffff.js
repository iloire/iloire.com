var content = {
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

function preload(arrayOfImages) {
    $(arrayOfImages).each(function(){
        $('<img/>')[0].src = this;
    });
}

$(document).ready(function() {

  var min_window_width = 767; //extra content will be shown for bigger sizes
  var left_margin_extra_content = 600;
  var timeout_fade = null;
  var offset_top = 20;

  var element_extra_content = $('#extrainfo'); //cache element

  function set_extra_content(element){
    var windowWidth = $(window).width();
    if (element && (windowWidth > min_window_width)){
      var id = $(element).attr('data-contentid');
      var top = $(window).scrollTop() + offset_top;
      $(element_extra_content).css({top: top, left: left_margin_extra_content,
          position: 'absolute' }).html(content[id]).fadeIn();
      $(element).addClass('active');
    }
    else{
      $(element_extra_content).hide();
    }
  }

  $(window).resize(function(){
    set_extra_content();
  });

  $('a.extra_content').mouseover(function(ev){
    clearTimeout(timeout_fade);
    set_extra_content(this);
  });

  $('a.extra_content').mouseout(function(ev){
    $(this).removeClass('active');
    timeout_fade = setTimeout(function(){
      $(element_extra_content).fadeOut('800');
    }, 1000);
  });

  $('a.extra_content').first().mouseover(); //show initial element

  /*
  $('#twitter_update_list a').on('mouseover', function(){
    var url = "http://twitter.com/status/user_timeline/adamloving.json?count=10&callback=?";
    $.getJSON( url, function( data ){ console.log(data) });
  });
  */

  github_service.getGitHubProjects('iloire', '#ghcontainer');

  if ($(window).width()>min_window_width){
    //preload if we show extra content
    preload([
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

var github_service = {

  getGitHubProjects : function (user, where){
    var cachekey = 'github ' + user;
    if ($('body').data(cachekey)) { //save in dom via data() jquery attribute
      $(where).html($('body').data(cachekey));
    }
    else{
      $(where).html('loading');
      $.getJSON('https://api.github.com/users/' + user + '/repos?callback=?', function(data){
        var own_projects = [];
        for(var i=0;i<data.data.length;i++){
          if (!data.data[i].fork)
            own_projects.push (data.data[i]);
        }

        //sort
        function sorter(a,b) { return b.watchers - a.watchers; }

        own_projects.sort(sorter);

        var output = '';
        if (own_projects.length){
          output="<ul>";
          for (var i=0, c=0 ;(c<5 && i<own_projects.length);i++){
              output = output + '<li><span class="label label-warning"><a title="watchers" target=_blank href="'+ own_projects[i].html_url + '/watchers">' + own_projects[i].watchers + '</a></span>' + ' / <span class="label label-info"><a title="forks" target=_blank href="'+ own_projects[i].html_url + '/network">' + own_projects[i].forks + '</a></span>' + ' - <a target=_blank href="'+ own_projects[i].html_url + '">' + own_projects[i].name + '</a>: ' + own_projects[i].description + '</li>'; //todo
              c++;
          }
          output = output + "</ul>";
        }
        else{
          output = '<p>No projects to show.</p>';
        }

        $(where).html(output);
        $('body').data(cachekey, output);
      });
    }
  }
};