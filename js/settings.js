define('settings', function(){

  var DEV = true;

  var SETTINGS = {
    max_gh_projects: 7,
    min_window_width: 900, //extra content will be shown for bigger sizes
    CND_IMG_PREFIX: DEV ? 'images/' : 'http://d13ry56xmap4ax.cloudfront.net/'
  };

  return SETTINGS;

});