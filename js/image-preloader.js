define('image-preloader', function(){

  return {
    preload : function (arrayOfImages) {
      for (var i = 0; i < arrayOfImages.length; i++) {
        var url = arrayOfImages[i];
        var image = new Image();
        image.src = url;
      }
    }
  };

});