define('markdown-fetcher', ['jquery', 'service-markdown-fetcher', 'content-hover', 'marked', 'localStorage-cache'],
    function ($,
              service,
              contentHover,
              marked,
              cache) {

  function isSupported() {
    return !!window.atob;
  }

  function b64_to_utf8( str ) {
    return decodeURIComponent(escape(window.atob( str )));
  }

  return {

    init: function () {

      if (!isSupported()) {
        return;
      }

      $('a.gh-project').mouseover(function () {
        if (window.innerWidth < 1200) {
          return;
        }
        var key = $(this).data('repo');
        service.fetch('iloire', key, {cache_duration_minutes: 60}, function (data) {

          var html;
          var cacheMarkdown = cache.get(key);
          if (cacheMarkdown) {
            html = cacheMarkdown;
          }
          else {
            try {
              html = b64_to_utf8(data.content);
              html = marked(html);
              cache.set(key, html, 60 * 30); // 30 min
            }
            catch (err) {
              html = 'unavailable';
              console.error('Error parsing markdown from github');
              console.error(err);
            }
          }
          var container = $('<div/>').addClass('gh-preview');
          container.append('<span class="header">github\'s readme preview</span>');
          container.append('<span class="help">this is just a partial preview fetched from gh. click on the link to go to the project repo</span>');
          container.append($('<div />').addClass('gh-readme').html(html));
          contentHover.showExtraContent(container);
        });
      });
    }
  };
});