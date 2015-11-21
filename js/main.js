require([
  'jquery',
  'gh',
  'background-effect',
  'content-hover',
  'settings',
  'markdown-fetcher'
], function (
  $,
  gh,
  backgroundEffect,
  contentHover,
  SETTINGS,
  markdownFetcher
) {

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
      backgroundEffect.init();
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

