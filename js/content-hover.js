define('content-hover', ['settings'], function(
    SETTINGS
){

  var extraContent = $('#extrainfo');

  function hideExtraContent () {
    extraContent.fadeOut(800, function(){
      $(this).empty();
    });
  }

  function shouldEnableExtraContent(){
    return (window.innerWidth > SETTINGS.min_window_width);
  }

  function moveAndResizeExtraContent(){
    if (shouldEnableExtraContent()){
      var width = window.innerWidth - SETTINGS.left_margin_extra_content;
      extraContent.css({
        top: $(window).scrollTop(),
        right: 0,
        width: width + 'px'
      });
    }
    else {
      hideExtraContent();
    }
  }

  return {

    init : function (content) {

      var timeoutFade = null;

      window.addEventListener("resize", moveAndResizeExtraContent);
      window.onscroll = moveAndResizeExtraContent;

      $('a.extra_content').mouseover(function(ev){
        clearTimeout(timeoutFade);
        if (shouldEnableExtraContent()){
          var id = $(this).attr('data-contentid');
          extraContent.html(content[id]).fadeIn();
          moveAndResizeExtraContent();
        }
      }).mouseout(function(){
        timeoutFade = setTimeout(hideExtraContent, 1500);
      });

      extraContent.on('mouseover', function(){
        clearTimeout(timeoutFade);
      });
    }
  };

});