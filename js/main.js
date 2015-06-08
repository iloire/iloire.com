require(['jquery', 'gh', 'image-preloader', 'background-effect', 'content-hover', 'settings'],
    function ($,
              gh,
              preloader,
              backgroundEffect,
              contentHover,
              SETTINGS) {

      var DEBUG = true;
      var CND_IMG_PREFIX = 'http://d13ry56xmap4ax.cloudfront.net/';

      if (DEBUG) {
        CND_IMG_PREFIX = 'images/';
      }

      var PRELOAD_IMAGES = [
        'europe.svg', 'dgallery1.png', 'shipit24.jpg', 'backbone-googlemaps.jpg', 'letsnode.jpg',
        'atlasboard-01.jpg', 'math_race01.png', 'triatlonaragon.jpg', 'watchmen.png', 'directorio.jpg',
        '2earth_01.png'
      ].map(function(i){return CND_IMG_PREFIX + '' + i});

      var content = {
        'dgallery': '<div><img class="dropshadow" src="' + CND_IMG_PREFIX + 'dgallery1.png"><span>dGallery, a sexy asp.net mvc photo gallery</span></div>',
        'atlassian': '<div><img class="dropshadow" src="' + CND_IMG_PREFIX + 'shipit24.jpg"></div>',
        'map': '<div class="map-europe"><div class=pulse></div><div class=img-wrapper><img src="' + CND_IMG_PREFIX + 'europe.svg"></div></div>',
        'express': '<div><img src="' + CND_IMG_PREFIX + 'express_js.png"></div>',
        'math_race': '<div><img src="' + CND_IMG_PREFIX + 'math_race02.png"></div>',
        'fatri': '<div><img class="dropshadow" src="' + CND_IMG_PREFIX + 'triatlonaragon.jpg"><span>Triatlhon regional association. I created and maintain the website</span></div>',
        '2earth': '<div><img src="' + CND_IMG_PREFIX + '2earth_01.png"></div>',
        'watchmen': '<div><img class="dropshadow" src="' + CND_IMG_PREFIX + 'watchmen.png"><span>A node.js service monitor. Source code available on GitHub</span></div>',
        'directorio_cachirulo': '<div><img class="dropshadow" src="' + CND_IMG_PREFIX + 'directorio.jpg"><span>Local freelance directory. Software created with node.js and redis. Available on GitHub</span></div>',
        'letsnode': '<div><img class="dropshadow" src="' + CND_IMG_PREFIX + 'letsnode.jpg"></div>',
        'backbone_google_maps': '<div><img class="dropshadow" src="' + CND_IMG_PREFIX + 'backbone-googlemaps.jpg"><span>Playing with Backbone.js and Google Maps..</span></div>',
        'atlasboard': '<div><img class="dropshadow" src="' + CND_IMG_PREFIX + 'atlasboard-01.jpg"><span>Atlasboard, simple and beautiful dashboards for everyone</span></div>',
      };

      function log(o) {
        if (DEBUG) {
          console.log(o);
        }
      }

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
              '/network">' + project.forks + '</a></span>' + '  <a class="gh-project" target=_blank href="' +
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

        contentHover.init(content);

        var where = document.getElementById('ghcontainer');
        where.innerHTML = 'loading...';
        gh.getGitHubProjects('iloire', SETTINGS, function (data) {
          where.innerHTML = massageGhData(data);
        });

        if (window.innerWidth > SETTINGS.min_window_width) {
          preloader.preload(PRELOAD_IMAGES);
        }
      };

      init();

    });

