define('markdown-fetcher', [
  'jquery',
  'service-markdown-fetcher',
  'content-hover',
  'marked',
  'analytics'
],

function (
  $,
  markdownService,
  contentHover,
  marked,
  analytics
) {

  var MIN_WIDTH = 1200; // px

  function isSupported() {
    return !!window.atob;
  }

  function b64_to_utf8(str) {
    return decodeURIComponent(escape(window.atob(str)));
  }

  return {

    init: function (options) {

      var options = options || {};

      if (!isSupported()) {
        return;
      }

      function render(html) {
        var container = $('<div/>').addClass('gh-preview');
        container.append('<span class="header">github\'s readme preview</span>');
        container.append('<span class="help">fetched from github. click on the link to go to the repo</span>');
        container.append($('<div />').addClass('gh-readme').html(html));
        contentHover.showExtraContent(container);
      }

      function setHelpVisibility (){
        if (window.innerWidth < MIN_WIDTH) {
          $('.gh-details-help').fadeOut();
        } else {
          $('.gh-details-help').fadeIn();
        }
      }

      function fetch(username, repo, options) {
        markdownService.fetch(username, repo, options, function (data) {
          try {
            analytics.track('mouse-over', 'gh-project', repo);
            render(marked(b64_to_utf8(data.content)));
          }
          catch (err) {
            analytics.track('error', 'gh-project-markdown', repo);
            render('unavailable');
            console.error('Error parsing markdown from github', err);
          }
        });
      }

      function prefetch(delay) {
        setTimeout(function(){
          $('a.gh-project').each(function(index, link) {
              fetch('iloire', $(link).data('repo'), {cache_duration_minutes: 60});
          });
        }, delay);
      }

      window.addEventListener("resize", function(e){
        setHelpVisibility()
      });

      setHelpVisibility();

      $('a.gh-project').mouseover(function () {
        if (window.innerWidth < MIN_WIDTH) {
          return;
        }

        fetch('iloire', $(this).data('repo'), {cache_duration_minutes: 60});
      });

      if (options.prefetch) {
        prefetch(2000);
      }
    }
  };
});
