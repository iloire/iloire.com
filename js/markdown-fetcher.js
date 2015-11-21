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

    init: function () {

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

      window.addEventListener("resize", function(e){
        setHelpVisibility()
      });

      setHelpVisibility();

      $('a.gh-project').mouseover(function () {
        if (window.innerWidth < MIN_WIDTH) {
          return;
        }

        var html;
        var repo = $(this).data('repo');
        markdownService.fetch('iloire', repo, {cache_duration_minutes: 60}, function (data) {
          try {
            analytics.track('mouse-over', 'gh-project', repo);
            html = marked(b64_to_utf8(data.content));
            render(html);
          }
          catch (err) {
            analytics.track('error', 'gh-project-markdown', repo);
            render('unavailable');
            console.error('Error parsing markdown from github');
            console.error(err);
          }
        });
      });
    }
  };
});