define('content-hover', [
  'settings',
  'image-preloader'
], function (
    SETTINGS,
    preloader
) {

  var PRELOAD_IMAGES = [
    'europe.svg', 'dgallery1.png', 'shipit24.jpg', 'backbone-googlemaps.jpg', 'letsnode.jpg',
    'atlasboard-01.jpg', 'math_race01.png', 'triatlonaragon.jpg', 'watchmen.png', 'directorio.jpg',
    '2earth_01.png'
  ].map(function (i) {
        return SETTINGS.CND_IMG_PREFIX + i;
      });

  var CONTENT = {
    'dgallery': '<div class="centered"><img class="full dropshadow" src="' + SETTINGS.CND_IMG_PREFIX + 'dgallery1.png"><span class="description">dGallery, a sexy asp.net mvc photo gallery</span></div>',
    'atlassian': '<div class="centered"><img class="full dropshadow" src="' + SETTINGS.CND_IMG_PREFIX + 'shipit24.jpg"></div>',
    'map': '<div class="map-europe"><div class=pulse></div><div class="img-wrapper"><img class="full" src="' + SETTINGS.CND_IMG_PREFIX + 'europe.svg"></div></div>',
    '2earth': '<div class="centered"><img class="full" src="' + SETTINGS.CND_IMG_PREFIX + '2earth_01.png"></div>',
    'watchmen': '<div class="centered"><img class="full dropshadow" src="' + SETTINGS.CND_IMG_PREFIX + 'watchmen.png"><span class="description">A node.js service monitor</span></div>',
    'directorio_cachirulo': '<div class="centered"><img class="full dropshadow" src="' + SETTINGS.CND_IMG_PREFIX + 'directorio.jpg"><span class="description">Local freelance directory app created with node.js and redis</span></div>',
    'letsnode': '<div class="centered"><img class="full dropshadow" src="' + SETTINGS.CND_IMG_PREFIX + 'letsnode.jpg"></div>',
    'backbone_google_maps': '<div class="centered"><img class="full dropshadow" src="' + SETTINGS.CND_IMG_PREFIX + 'backbone-googlemaps.jpg"><span class="description">Playing with Backbone.js and Google Maps</span></div>',
    'atlasboard': '<div class="centered"><img class="full dropshadow" src="' + SETTINGS.CND_IMG_PREFIX + 'atlasboard-02.jpg"><span class="description">Atlasboard, a simple dashboard tool</span></div>'
  };

  var extraContent = $('#extrainfo');

  function getBodyContainerWidth(){
    return $('body').width();
  }

  function hideExtraContent() {
    extraContent.fadeOut(800, function () {
      $(this).empty();
    });
  }

  function shouldEnableExtraContent() {
    return (getBodyContainerWidth() > SETTINGS.min_window_width);
  }

  function moveAndResizeExtraContent() {
    if (shouldEnableExtraContent()) {
      var extraContentWidth = getBodyContainerWidth() - $('.wrapper').width();
      extraContent.css({
        top: $(window).scrollTop(),
        right: 0,
        width: extraContentWidth + 'px'
      });
    }
    else {
      hideExtraContent();
    }
  }

  function showExtraContent(content) {
    extraContent.html(content).fadeIn();
    moveAndResizeExtraContent();
  }

  return {

    showExtraContent: showExtraContent,

    init: function () {

      if (getBodyContainerWidth() > SETTINGS.min_window_width) {
        preloader.preload(PRELOAD_IMAGES);
      }

      var timeoutFade = null;

      window.addEventListener("resize", moveAndResizeExtraContent);

      $('a.extra_content').mouseover(function (ev) {
        clearTimeout(timeoutFade);
        if (shouldEnableExtraContent()) {
          var id = $(this).attr('data-contentid');
          showExtraContent(CONTENT[id]);
        }
      }).mouseout(function () {
        timeoutFade = setTimeout(hideExtraContent, 1500);
      });

      extraContent.on('mouseover', function () {
        clearTimeout(timeoutFade);
      });
    }
  };

});