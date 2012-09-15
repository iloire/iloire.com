var content = {
  'map' : '<div><img src="images/zaragoza_spain.png"></div>',
  'express' : '<div><img src="images/express_js.png"></div>',
  'math_race' : '<div><img src="images/math_race01.png"></div>',
  'fatri' : '<div><img src="images/fatri_01.png"></div>',
  '2earth' : '<div><img src="images/2earth_01.png"></div>',
  'node' : '<div><img src="images/node_01.png"></div>',
  'watchmen' : '<div><img src="images/watchmen_01.png"></div>',
  'codemotion_node': '<div><img src="images/codemotion_node_01.png"></div>',
  'directorio_cachirulo': '<div><img src="images/directorio_cachirulo02.png"></div>',
  'mvc3invoice':'<div><img src="images/mvc2invoice_01.png"></div>',
  'math_race_video':'<div><img src="images/math_race_video01.png"></div>'
};

$(document).ready(function() {

  var min_window_width = 800;
  var left_margin_extra_content = 600;
  var timeout_fade = null;
  var offset_top = -20;

  $(window).resize(function(){
    var windowWidth = $(window).width();
    var max_width_images = windowWidth - left_margin_extra_content - 100;
    $('#extrainfo img').css({'max-width': max_width_images + 'px'});
  });

  $('a.extra_content').mouseover(function(ev){
    clearTimeout(timeout_fade);

    var windowWidth = $(window).width();
    var max_width_images = windowWidth - left_margin_extra_content - 100;
    var id = $(this).attr('data-contentid');
    if (windowWidth > min_window_width){
      var top = ($(this).offset().top > 200) ? ($(this).offset().top - 190) : $(this).offset().top + offset_top;
      $('#extrainfo').css({top: top, left: left_margin_extra_content,
          position: 'absolute' }).html(content[id]).fadeIn();
      $('#extrainfo img').css({'max-width': max_width_images + 'px'});

      $(this).addClass('active');
    }
  });

  $('a.extra_content').mouseout(function(ev){
    $(this).removeClass('active');
    timeout_fade = setTimeout(function(){
      $('#extrainfo').html('').fadeOut('800');
    }, 1000);
  });

  $('a.extra_content').first().mouseover();
  github_service.getGitHubProjects('iloire', '#ghcontainer');
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