define('service-markdown-fetcher', ['jquery', 'localStorage-cache'], function($, cacheService){

  return {

    fetch : function (owner, repo, options, cb){
      var key = 'markdown-for-' + owner + '-' + repo;
      var cache = cacheService.get(key);
      if (cache){
        return cb(cache);
      }

      $.getJSON('https://api.github.com/repos/' + owner + '/' + repo + '/readme', function(data){
        cb(data);
        cacheService.set(key, data, 60 * (options.cache_duration_minutes || 10));
      });
    }
  };
});