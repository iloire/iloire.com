define('service-markdown-fetcher', ['jquery', 'localStorage-cache'], function($, cacheService){

  return {

    fetch : function (owner, repo, options, cb){
      $.getJSON('https://api.github.com/repos/' + owner + '/' + repo + '/readme', function(data){
        cb(data);
      });
    }
  };
});