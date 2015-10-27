define('service-markdown-fetcher', [
  'jquery',
  'localStorage-cache'
], function(
  $,
  cacheService
){

  return {

    fetch: function (owner, repo, options, cb) {
      var key = 'gh-markdown-' + owner + '-' + repo;
      var cache = cacheService.get(key);
      if (cache) {
        return cb(JSON.parse(cache));
      }
      $.getJSON('https://api.github.com/repos/' + owner + '/' + repo + '/readme', function (data) {
        cacheService.set(key, JSON.stringify(data), 60 * (options.cache_duration_minutes || 10));
        cb(data);
      });
    }
  };
});