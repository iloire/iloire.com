define('markdown-fetcher', ['jquery', 'service-markdown-fetcher', 'content-hover'],
    function ($,
              service,
              contentHover) {

  function isSupported() {
    return !!window.atob;
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
        service.fetch('iloire', $(this).data('repo'), {cache_duration_minutes: 60}, function (data) {
          var html;
          try {
            html = markdown.toHTML(window.atob(data.content));
          }
          catch (err) {
            console.error('Error parsing markdown');
            console.error(err);
            return;
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