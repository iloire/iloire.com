define('gh', ['jquery', 'localStorage-cache'], function($, cacheService){

  var github_service = {

    getGitHubProjects : function (user, options, cb){
      var cache = cacheService.get('gh-feed');
      if (cache){
        //where.innerHTML = cache;
        //track('general', 'cache-hit', 'gh-feed');
        return cb(JSON.parse(cache));
      }

      $.getJSON('https://api.github.com/users/' + user + '/repos?per_page=50&callback=?', function(data){
        cb(data);
        cacheService.set('gh-feed', JSON.stringify(data), 60 * options.cache_duration_minutes);
      });
    }
  };

  return github_service;

});