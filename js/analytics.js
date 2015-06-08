define('analytics', function () {

  return {
    track: function (cat, action, label, val) {
      if (window.ga) {
        window.ga('send', 'event', cat, action, label, val);
      }
    }
  }
});